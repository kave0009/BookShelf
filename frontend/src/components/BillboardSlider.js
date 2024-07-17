import React, { useState, useEffect } from "react";
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
  }, // Added "no-zoom" class here
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

  const handleResize = () => {
    setIsMobileView(window.innerWidth < 900);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="sliders">
      <div className="slide-container">
        {isMobileView ? (
          <div className="slide active fixed-size-img-container">
            <img
              src={BannerPNG1}
              alt="Banner 1"
              className="fixed-size-img no-zoom"
            />{" "}
            {/* Added "no-zoom" class here */}
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
              onClick={() => setCurrentSlide(index)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BillboardSlider;
