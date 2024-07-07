import React, { useState, useEffect } from "react";
import { ReactComponent as BannerSVG1 } from "./images/banner1.svg";
import BannerPNG2 from "./images/banner2.png";
import BannerPNG3 from "./images/banner3.png";
import ButtonSVG from "./images/Button.svg";
import { Link } from "react-router-dom"; // Import Link component
import "./css/slider.css";

const slides = [
  { id: 1, component: <BannerSVG1 className="full-width-svg" /> },
  {
    id: 2,
    component: (
      <img src={BannerPNG2} alt="Banner 2" className="full-width-img" />
    ),
  },
  {
    id: 3,
    component: (
      <div className="full-width-img-container">
        <img src={BannerPNG3} alt="Banner 3" className="full-width-img" />
        <Link to="/signup">
          <img src={ButtonSVG} alt="Button" className="button" />
        </Link>
      </div>
    ),
  },
];

const BillboardSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sliders">
      <div className="slide-container">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? "active" : ""}`}
          >
            {slide.component}
          </div>
        ))}
      </div>
      <div className="bullet-container">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`bullet ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default BillboardSlider;
