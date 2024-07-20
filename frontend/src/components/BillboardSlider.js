import React, { useState, useEffect, useRef } from "react";
import BannerPNG1 from "./images/banner1.png";
import BannerPNG2 from "./images/banner2.png";
import BannerPNG3 from "./images/banner3.png";
import ButtonSVG from "./images/Button.svg";
import { Link } from "react-router-dom";
import "./css/slider.css";

const slides = [
  {
    id: 1,
    component: (
      <img src={BannerPNG1} alt="Banner 1" className="full-width-img no-zoom" />
    ),
  },
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
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 900);
  const slideInterval = useRef(null);

  const handleResize = () => {
    setIsMobileView(window.innerWidth < 900);
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    slideInterval.current = setInterval(nextSlide, 5000); // Change slide every 5 seconds

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(slideInterval.current);
    };
  }, []);

  useEffect(() => {
    clearInterval(slideInterval.current);
    slideInterval.current = setInterval(nextSlide, 5000); // Reset interval on slide change

    return () => clearInterval(slideInterval.current);
  }, [currentSlide]);

  const handleBulletClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="sliders">
      <div className="slide-container">
        {isMobileView ? (
          <div className="slide active fixed-size-img-container">
            <img
              src={BannerPNG1}
              alt="Banner 1"
              className="fixed-size-img no-zoom"
            />
          </div>
        ) : (
          slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${index === currentSlide ? "active" : ""}`}
            >
              {slide.component}
            </div>
          ))
        )}
      </div>
      {!isMobileView && (
        <div className="bullet-container">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`bullet ${index === currentSlide ? "active" : ""}`}
              onClick={() => handleBulletClick(index)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillboardSlider;
