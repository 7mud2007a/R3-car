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
      {!siteReady && <div className="site-loader"><div className="site-loader-content"><span className="site-loader-brand">VELTRIX</span><div className="site-loader-line"><span style={{ width: loadingProgress + '%' }} /></div><span className="site-loader-percent">{loadingProgress}%</span><span className="site-loader-label">PREPARING EXPERIENCE</span></div></div>}
      <Navbar />
      <main>
        <Hero />
        <CarShowcase onLoadingProgress={setLoadingProgress} onReady={() => { setLoadingProgress(100); setSiteReady(true); }} />
        <About />
        <SocialMedia />
        <InquiryForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;
