import React from 'react';
import '../index.css';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
function App() {
  return (
    <div>
      <Nav/> 
        <Hero/>
        <Features/>
       <Footer/>
    </div>
  );
}

export default App;