// frontend/src/pages/LandingPage.js
import React from "react";
import { Link } from "react-router-dom";
import TopNavbar from "../components/Navbar/TopNavbar";
import heroImg from "../assets/hero.png";
import offerSkills from "../assets/offerSkills.png"
import earnCredit from "../assets/earnCredit.png"
import spendCredit from "../assets/spendCredit.png"
import styles from './LandingPage.module.css';

const LandingPage = () => {
  return (
    <div className="page landing-page">
      <TopNavbar />
      <div className="hero">
        <div className="hero-text">
          <h1>Exchange Skills, Not Money</h1>
          <p className="subtitle">Time is the new currency.</p>
          <div className="hero-buttons">
            <Link className="btn-primary" to="/signup">
              Join Now
            </Link>
            <a className="btn-outline" href="#how-it-works">
              Learn More
            </a>
          </div>
        </div>
        <div className={`hero-illustration ${styles['user-hero-container']}`}>
          <img className={`${styles['user-hero-img']}`} src={heroImg} alt='' />
        </div>
      </div>

      <section id="how-it-works" className="how-it-works">
        <h2>How It Works</h2>
        <div className="how-grid">
          <div className={`${styles['user-how-card']} how-card`}>
            
            <h3 className={`${styles['user-heading']}`}>
              <img className={`${styles['user-icon']}`} src={offerSkills} alt='' />
              Offer Skill</h3>
            <p className={`${styles['user-para']}`}>
              Share your skills with the community.
              </p>
          </div>
          <div className={`${styles['user-how-card']} how-card`}>
          
            <h3 className={`${styles['user-heading']}`}>
              <img className={`${styles['user-icon']}`} src={earnCredit} alt='' />
              Earn Credit</h3>
            <p className={`${styles['user-para']}`}>
              Earn time credits for the skills you offer.
              </p>
          </div>
          <div className={`${styles['user-how-card']} how-card`}>
            
            <h3 className={`${styles['user-heading']}`}>
              <img className={`${styles['user-icon']}`} src={spendCredit} alt='' />
              Spend Credit</h3>
            <p className={`${styles['user-para']}`}>
              Use time credits to learn new skills.
              </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
