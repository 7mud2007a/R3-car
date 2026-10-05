import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CarShowcase from './components/CarShowcase';
import About from './components/About';
import SocialMedia from './components/SocialMedia';
import InquiryForm from './components/InquiryForm';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Hero />
        <CarShowcase />
        <About />
        <SocialMedia />
        <InquiryForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;
