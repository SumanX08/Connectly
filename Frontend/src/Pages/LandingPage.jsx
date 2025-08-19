import React from 'react'
import HeroSection from '../Components/HeroSection'
import Working from '../Components/Working'
import Features from '../Components/Features'
import CallToActionSection from '../Components/CallToActionSection'

function LandingPage() {
  return (
    <div>
      <HeroSection />
      <Working />
      <Features />
      <CallToActionSection />
    </div>
  )
}

export default LandingPage