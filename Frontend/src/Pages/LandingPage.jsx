import React from 'react'
import HeroSection from '../Components/HeroSection'
import Working from '../Components/Working'
import Features from '../Components/Features'
import Preview from '../Components/Preview'
import CallToActionSection from '../Components/CallToActionSection'

function LandingPage() {
  return (
    <div>
      <HeroSection />
      <Working />
      <Features />
      <Preview />
      <CallToActionSection />
    </div>
  )
}

export default LandingPage