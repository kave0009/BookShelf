import React, { useState, useEffect } from "react";
import "./css/promise.css";
import Prices from "./images/Prices.svg";
import Privacy from "./images/Privacy.svg";
import Fast from "./images/fast.svg";
import Service from "./images/service.svg";

const items = [
  { src: Prices, alt: "Prices" },
  { src: Privacy, alt: "Privacy" },
  { src: Fast, alt: "Fast" },
  { src: Service, alt: "Service" },
];

const initialIndex = 4; // Start with the first logo of the second set centered

const PromiseSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [logos, setLogos] = useState([...items, ...items]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (prevIndex === logos.length - 1) {
          return initialIndex; // Reset to the first logo of the second set
        }
        return prevIndex + 1;
      });
    }, 5000); // Change logo every 5 seconds

    return () => clearInterval(intervalId);
  }, [logos.length]);

  const handleItemClick = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (currentIndex === logos.length - 1) {
      setLogos((prevLogos) => [...prevLogos, ...items]);
    }
  }, [currentIndex, logos.length]);

  return (
    <div className="slider">
      <div
        className="list"
        style={{
          transform: `translateX(calc(50% - 100px - ${currentIndex * 200}px))`,
        }}
      >
        {logos.map((item, index) => (
          <div
            className={`item ${index === currentIndex ? "chosen" : ""}`}
            key={index}
            onClick={() => handleItemClick(index)}
          >
            <img src={item.src} alt={item.alt} className="logo" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromiseSlider;
