import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const NavigateToSection = ({ onOpenLoginDialog }) => {
  const navigate = useNavigate();

  const navigateToSection = (sectionId) => {
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  };

  return (
    <Footer
      navigateToSection={navigateToSection}
      onOpenLoginDialog={onOpenLoginDialog}
    />
  );
};

export default NavigateToSection;
