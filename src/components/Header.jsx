import SiteLogo from "../assets/site-logo.png";
import "./Header.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoHome } from "react-icons/io5";
import { HiTrendingUp } from "react-icons/hi";
import { IoInformationCircle } from "react-icons/io5";
import { MdContactPhone } from "react-icons/md";
import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import TvShows from "../pages/TvShows";

const Header = ({tab}) => {
  const [mobileNavBarOpen, setMobileNavBarState] = useState(false);

  return (
    <>
      <header>
        <img
          src={SiteLogo}
          alt="site-logo"
          onClick={() => (window.location.href = "/")}
        />
        <ul>
          <li onClick={() => (window.location.href = "/")} className={`${tab == "discover" ? "active" : ""}`}>Discover</li>
          <li onClick={() => (window.location.href = "/trending/today")} className={`${tab == "trending" ? "active" : ""}`}>
            Trending
          </li>
          <li onClick={() => (window.location.href = "/tv-shows")} className={`${tab == "tv-shows" ? "active" : ""}`}>
            Tv Shows
          </li>
          
        </ul>

        <div className="mobile-nav ">
          <GiHamburgerMenu
            id="mobile-burger-menu"
            onClick={() =>
              setMobileNavBarState(mobileNavBarOpen ? false : true)
            }
          />
        </div>

        <div className="slogan">Find Your Next Favorite Flick</div>

        <div className="beta-tag">v.1.0.0</div>

        <div
          className={`mobile-navigation ${
            mobileNavBarOpen ? "open" : "closed"
          }`}
        >
          <div className="discover">
            <Link to={"/"} style={{ textDecoration: "none", color: "#c6d2e0" }}>
              Discover
            </Link>
            <IoHome className="icon" />
          </div>
          <div className="trending">
            <Link
              to={"/trending/today"}
              style={{ textDecoration: "none", color: "#c6d2e0" }}
            >
              Trending
            </Link>
            <HiTrendingUp className="icon" />
          </div>

          <div className="trending">
            <Link
              to={"/tv-shows"}
              style={{ textDecoration: "none", color: "#c6d2e0" }}
            >
              Tv Shows
            </Link>
            <HiTrendingUp className="icon" />
          </div>
         
        </div>
      </header>
    </>
  );
};

TvShows.prototypes = {
  tab: PropTypes.string.isRequired,
}

export default Header;
