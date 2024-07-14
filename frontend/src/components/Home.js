import React from "react";
import BillboardSlider from "./BillboardSlider";
import FeaturedBooks from "./FeaturedBooks";
import ProductListing from "./ProductListing";
import Prices from "./images/Prices.svg";
import Privacy from "./images/Privacy.svg";
import Fast from "./images/fast.svg";
import Service from "./images/service.svg";
import PromiseSection from "./images/Promise.svg";
import Popular from "./images/Popular.svg";
import "./css/styles.css";
import "./css/promise.css";

const items = [
  { src: Prices, alt: "Prices" },
  { src: Privacy, alt: "Privacy" },
  { src: Fast, alt: "Fast" },
  { src: Service, alt: "Service" },
];

const Home = ({ handleAddToCart, handleImageClick }) => {
  return (
    <div
      className="MuiContainer-root MuiContainer-maxWidthLg content css-loqqzyl-MuiContainer-root"
      style={{ padding: "0 0 0 0" }}
    >
      <section>
        <BillboardSlider />
      </section>
      <FeaturedBooks
        handleAddToCart={handleAddToCart}
        handleImageClick={handleImageClick}
      />
      <section className="promise-section">
        <div className="container">
          <div className="section-header align-center">
            <div className="title">
              <span>commitments</span>
            </div>
            <h2 className="section-title">
              <img
                src={PromiseSection}
                alt="Promise Section"
                className="section-icon"
              />
            </h2>
          </div>
          <div className="slider" style={{ "--imageQuantity": items.length }}>
            <div className="list">
              {items.concat(items).map((item, index) => (
                <div className="item" key={index}>
                  <img
                    src={item.src}
                    alt={item.alt}
                    style={{ width: "250px", height: "250px" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="popular-books" className="bookshelf py-5 my-5">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-header align-center">
                <div className="title">
                  <span>Listings</span>
                </div>
                <h2 className="section-title">
                  <img
                    src={Popular}
                    alt="Popular Books"
                    className="section-icon"
                  />
                </h2>
              </div>
              <ProductListing
                handleAddToCart={handleAddToCart}
                handleImageClick={handleImageClick}
                showFeatured={false}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
