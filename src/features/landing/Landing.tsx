'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';
import { Hero } from '@/features/landing/hero';
import { Services } from '@/features/landing/services';
import { About } from '@/features/landing/about';
import { Faq } from '@/features/landing/faq';
import { Contact } from '@/features/landing/contact';

export const Landing = () => (
  <ThemeProvider>
    <Nav />
    <main>
      <Hero />
      <Services />
      <About />
      <Faq />
      <Contact />
    </main>
    <Footer />
  </ThemeProvider>
);
