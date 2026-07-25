import React from "react";
import classes from "./Footer.module.css";
// import EvangadiLogo from "../../assets/evangadi-logo-footer.png";
import EvangadiLogo from "../../assets/evangadi-logo-footer.png";

import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { FaYoutubeSquare } from "react-icons/fa";
import { PiCopyrightThin } from "react-icons/pi";
function Footer() {
  return (
    <footer className={classes.footerContainer}>
      <div className={classes.InsideWrapper}>
        {/* Logo */}

        <div className={classes.logo}>
          {/* <img src="EvangadiLogo" alt="EvangadiLogo" /> */}
          <Link to="/">
            <img src={EvangadiLogo} alt="Evangadi Logo" />
          </Link>

          {/* Socail Media */}

          <div className={classes.socialMedia}>
            <Link
              href="https://facebook.com"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </Link>
            <Link
              href="https://instagram.com"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoLogoInstagram />
            </Link>
            <Link
              href="https://youtube.com"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutubeSquare />
            </Link>
          </div>
        </div>
        {/* Useful Links */}
        <nav className={classes.navLinks} aria-label="Useful Links">
          <ul>
            <h4>Useful Links</h4>
            <li>
              <Link to="/HowItWorks">How It Works</Link>
            </li>
            <li>
              <Link to="/TermsofService">Terms of Service</Link>
            </li>
            <li>
              <Link to="/PrivacyPolicy">Privacy Policy</Link>
            </li>
          </ul>
        </nav>
        {/* Contact Info */}
        <div className={classes.contactInfo}>
          <ul>
            <h4>Contact Info </h4>
            <li>
              <strong>Evangadi Networks</strong>
            </li>
            <li>
              Email:
              <Link
                href="mailto:support@evangadi.com"
                className={classes.highlight}
              >
                support@evangadi.com
              </Link>
            </li>
            <li>
              Phone:{" "}
              <Link href="tel:+12023862702" className={classes.highlight}>
                +1-202-386-2702
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className={classes.copyRight}>
        <Link href="" style={{ color: "white", textDecoration: "none" }}>
          <PiCopyrightThin />
          2025 Evangadi Networks All rights reserved.
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
