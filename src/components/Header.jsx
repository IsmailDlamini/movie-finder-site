import SiteLogo from "../assets/site-logo.png";
import "./Header.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoHome } from "react-icons/io5";
import { RiCompassDiscoverFill } from "react-icons/ri";
import { HiTrendingUp } from "react-icons/hi";
import { IoInformationCircle } from "react-icons/io5";
import { MdContactPhone } from "react-icons/md";
import { useState } from "react";

const Header = () => {

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
          <li onClick={() => (window.location.href = "/")}>Discover</li>
          <li onClick={() => (window.location.href = "/trending/today")}>
            Trending
          </li>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>

        <div className="mobile-nav ">
          <GiHamburgerMenu id="mobile-burger-menu" 
          onClick={() => setMobileNavBarState(mobileNavBarOpen ? false : true)}/>
        </div>

        <div className="slogan">Find Your Next Favorite Flick</div>

        <div className="beta-tag">beta</div>

        <div className={`mobile-navigation ${mobileNavBarOpen ? 'open' : 'closed'}`}>
          <div className="home">
            Home <IoHome className="icon" />
          </div>
          <div className="discover">
            Discover
            <RiCompassDiscoverFill className="icon" />
          </div>
          <div className="trending">
            Trending <HiTrendingUp className="icon" />
          </div>
          <div className="about">
            About <IoInformationCircle className="icon" />
          </div>

          <div className="contact">
            Contact <MdContactPhone className="icon" />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
