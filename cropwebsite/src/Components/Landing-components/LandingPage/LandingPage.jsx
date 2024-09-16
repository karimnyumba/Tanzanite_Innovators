import React from 'react'
import Navbar from '../LandingSections/Navbar/Navbar'
import Hero from '../LandingSections/Hero/Hero'
import About from '../LandingSections/About/About'
import Features from '../LandingSections/Features/Features'
import Benefits from '../LandingSections/Benefits/Benetifs'
import Title from '../LandingSections/Title/Title'
import Testimonials from '../LandingSections/Testimonials/Testimonials'
import Contact from '../LandingSections/Contact/Contact'
import Footer from '../LandingSections/Footer/Footer'

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <div className="container">
        <About />
        {/* <Title subTitle='Our Services' title='What We Offer'/> */}
        <Features />
        <Title subTitle='' title='Why Should You Choose Us'/>
        <Benefits />
        <Title subTitle='' title='Testimonials'/>
        <Testimonials />
        <Title subTitle='' title='Get in Touch'/>
        <Contact />
        <Footer />
      </div>
    </div>
  )
}

export default LandingPage