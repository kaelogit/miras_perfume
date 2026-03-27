import React from 'react';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Features from '../components/Features';
import Categories from '../components/Categories';
import BrandShowcase from '../components/BrandShowcase';
import FeaturedProduct from '../components/FeaturedProduct';
import FlashDrops from '../components/FlashDrops';
import NewArrivalsCarousel from '../components/NewArrivalsCarousel';
import Reviews from '../components/Reviews';
import Journal from '../components/Journal';
import Seo from '../components/Seo';

const Home = () => {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Mira's Perfume",
    url: window.location.origin,
    logo: `${window.location.origin}/images/categories/logo.jpg`,
    description:
      'Shop authentic designer, niche, and Arabian fragrances in Nigeria with same-day and nationwide delivery.',
    sameAs: [],
  };

  return (
    <>
      <Seo
        title="Mira's Perfume | Luxury Fragrances in Nigeria"
        description="Shop authentic designer, niche, and Arabian perfumes in Nigeria. Fast delivery nationwide with curated premium fragrance collections."
        path="/"
        image="/images/hero-bg.jpg"
        jsonLd={orgSchema}
        jsonLdId="home-organization-schema"
      />
      <Hero />
      <Marquee />
      <Features />
      <Categories />
      <BrandShowcase />
      <FlashDrops />
      <NewArrivalsCarousel />
      <FeaturedProduct />
      <Reviews />
      <Journal />
    </>
  );
};

export default Home;