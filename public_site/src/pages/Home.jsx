import React from 'react';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Resume from '../sections/Resume';
import Portfolio from '../sections/Portfolio';
import Services from '../sections/Services';
import Testimonials from '../sections/Testimonials';
import Blog from '../sections/Blog';
import Contact from '../sections/Contact';

const Home = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Resume />
      <Portfolio />
      <Services />
      <Testimonials />
      <Blog />
      <Contact />
    </main>
  );
};

export default Home;