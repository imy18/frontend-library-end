// Code was written by Muhammad Sindida Hilmy

import React from "react";

import Navbar from "../components/landingPage/Navbar";
import HeaderSection from "../components/landingPage/HeaderSection";
import BukuSection from "../components/landingPage/BukuSection";
import RulesSection from "../components/landingPage/RulesSection";
import RulesTwoSection from "../components/landingPage/RulesTwoSection";
import KritikSection from "../components/landingPage/KritikSection"
import FooterSection from "../components/landingPage/FooterSection";

export default function LandingPage() {
    return (
      <>
        <Navbar />
        <HeaderSection />
        <BukuSection/>
        <RulesSection/>
        <RulesTwoSection/>
        <KritikSection /> 
        <FooterSection />
      </>
    );
  }