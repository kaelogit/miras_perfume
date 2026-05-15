// Supabase Edge Function: verify-paystack-checkout
// Re-validates payable amount on the server before creating an order.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const isFlashSaleActive = (row: Record<string, unknown>) => {
  const basePrice = Number(row.price) || 0;
  const flashPrice = Number(row.flash_sale_price);
  const isFlash = Boolean(row.is_flash_sale);
  if (!(isFlash && Number.isFinite(flashPrice) && flashPrice > 0 && flashPrice < basePrice)) {
    return false;
  }
  if (row.flash_sale_ends_at) {
    const end = new Date(String(row.flash_sale_ends_at)).getTime();
    if (Number.isFinite(end) && Date.now() >= end) return false;
  }
  return true;
};

const getEffectivePrice = (row: Record<string, unknown>) => {
  if (isFlashSaleActive(row)) return Number(row.flash_sale_price);
  return Number(row.price) || 0;
};

const json = (status: number, payload: Record<string, unknown>) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const paystackSecret = Deno.env.get('PAYSTACK_SECRET_KEY');
  if (!supabaseUrl || !serviceRoleKey || !paystackSecret) {
    return json(500, { error: 'Missing function secrets/config' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const body = await req.json();
    const paymentRef = String(body?.paymentRef || '').trim();
    const customer = body?.customer;
    const items = Array.isArray(body?.items) ? body.items : [];

    if (!paymentRef) return json(400, { error: 'paymentRef is required' });
    if (!customer || typeof customer !== 'object') return json(400, { error: 'customer is required' });
    if (!items.length) return json(400, { error: 'items are required' });

    const normalizedItems = items
      .map((item: Record<string, unknown>) => ({
        id: String(item?.id || ''),
        quantity: Number(item?.quantity || 0),
      }))
      .filter((item) => item.id && Number.isInteger(item.quantity) && item.quantity > 0);

    if (!normalizedItems.length) return json(400, { error: 'No valid items in request' });

    // Idempotency: if payment_ref already recorded, return existing order.
    const { data: existingOrder } = await supabase
      .from('orders')
      .select('id, order_id, total, payment_ref, status')
      .eq('payment_ref', paymentRef)
      .maybeSingle();
    if (existingOrder) {
      return json(200, { ok: true, order: existingOrder, alreadyProcessed: true });
    }

    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(paymentRef)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${paystackSecret}` },
    });
    const paystackJson = await paystackRes.json();
    const paystackData = paystackJson?.data || {};

    if (!paystackRes.ok || !paystackJson?.status) {
      return json(400, { error: 'Unable to verify payment with Paystack' });
    }

    if (paystackData?.status !== 'success') {
      return json(400, { error: 'Payment is not successful' });
    }

    const paidAmountKobo = Number(paystackData?.amount || 0);
    const currency = String(paystackData?.currency || '');
    if (!Number.isFinite(paidAmountKobo) || paidAmountKobo <= 0) {
      return json(400, { error: 'Invalid paid amount from Paystack' });
    }
    if (currency && currency !== 'NGN') {
      return json(400, { error: `Unsupported currency: ${currency}` });
    }

    const productIds = [...new Set(normalizedItems.map((item) => item.id))];
    const { data: productRows, error: productErr } = await supabase
      .from('products')
      .select('id, brand, name, price, is_flash_sale, flash_sale_price, flash_sale_ends_at')
      .in('id', productIds);
    if (productErr) throw productErr;

    const productMap = new Map((productRows || []).map((row) => [String(row.id), row]));
    const orderItems = [];
    let expectedTotalKobo = 0;

    for (const item of normalizedItems) {
      const product = productMap.get(item.id);
      if (!product) return json(400, { error: `Product not found: ${item.id}` });
      const unitPrice = getEffectivePrice(product);
      const lineTotalKobo = Math.round(unitPrice * 100) * item.quantity;
      expectedTotalKobo += lineTotalKobo;
      orderItems.push({
        id: product.id,
        brand: product.brand,
        name: product.name,
        quantity: item.quantity,
        unit_price: unitPrice,
        line_total: lineTotalKobo / 100,
      });
    }

    if (paidAmountKobo !== expectedTotalKobo) {
      return json(409, {
        error: 'Paid amount does not match current server-validated total',
        expectedAmountKobo: expectedTotalKobo,
        paidAmountKobo,
      });
    }

    const orderPayload = {
      order_id: `MIRA-${Date.now().toString().slice(-6)}`,
      customer,
      items: orderItems,
      total: expectedTotalKobo / 100,
      payment_ref: paymentRef,
      status: 'Pending',
    };

    const { data: insertedOrder, error: insertErr } = await supabase
      .from('orders')
      .insert(orderPayload)
      .select('id, order_id, total, payment_ref, status')
      .single();

    if (insertErr) throw insertErr;

    return json(200, { ok: true, order: insertedOrder, alreadyProcessed: false });
  } catch (error) {
    console.error('verify-paystack-checkout error:', error);
    return json(500, { error: error instanceof Error ? error.message : 'Unexpected server error' });
  }
});
