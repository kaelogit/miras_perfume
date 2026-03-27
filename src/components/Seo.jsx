import { useEffect } from 'react';

const toAbsoluteUrl = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `${window.location.origin}${value.startsWith('/') ? value : `/${value}`}`;
};

const upsertMetaTag = (key, value, attr = 'name') => {
  if (!value) return;
  const selector = `meta[${attr}="${key}"]`;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', value);
};

const upsertCanonical = (href) => {
  if (!href) return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const upsertJsonLd = (id, data) => {
  if (!id || !data) return;
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

const Seo = ({
  title,
  description,
  path = '',
  image = '/images/social-share.jpg',
  type = 'website',
  jsonLd,
  jsonLdId,
}) => {
  useEffect(() => {
    const url = toAbsoluteUrl(path || window.location.pathname);
    const absoluteImage = toAbsoluteUrl(image);

    if (title) {
      document.title = title;
      upsertMetaTag('title', title);
      upsertMetaTag('og:title', title, 'property');
      upsertMetaTag('twitter:title', title, 'property');
    }

    if (description) {
      upsertMetaTag('description', description);
      upsertMetaTag('og:description', description, 'property');
      upsertMetaTag('twitter:description', description, 'property');
    }

    upsertMetaTag('og:type', type, 'property');
    upsertMetaTag('og:url', url, 'property');
    upsertMetaTag('og:image', absoluteImage, 'property');
    upsertMetaTag('twitter:card', 'summary_large_image', 'property');
    upsertMetaTag('twitter:url', url, 'property');
    upsertMetaTag('twitter:image', absoluteImage, 'property');
    upsertCanonical(url);

    if (jsonLd && jsonLdId) {
      upsertJsonLd(jsonLdId, jsonLd);
    }
  }, [title, description, path, image, type, jsonLd, jsonLdId]);

  return null;
};

export default Seo;
