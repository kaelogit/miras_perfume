import React from 'react';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Features from '../components/Features';
import Categories from '../components/Categories';
import BrandShowcase from '../components/BrandShowcase';
import FeaturedProduct from '../components/FeaturedProduct';
import Reviews from '../components/Reviews';
import Journal from '../components/Journal';

const Home = () => {
  return (
    <>
      <Hero />
      <Marquee />
      <Features />
      <Categories />
      <BrandShowcase />
      <FeaturedProduct />
      <Reviews />
      <Journal />
    </>
  );
};

export default Home;