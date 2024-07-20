import React from "react";
import BillboardSlider from "./BillboardSlider";
import FeaturedBooks from "./FeaturedBooks";
import ProductListing from "./ProductListing";
import PromiseSlider from "./PromiseSlider";
import PromiseSection from "./images/Promise.svg";
import Popular from "./images/Popular.svg";
import "./css/styles.css";
import "./css/promise.css";

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
          <PromiseSlider />
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
