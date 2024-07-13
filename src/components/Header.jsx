import SiteLogo from "../assets/site-logo.png";
import "./Header.css";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = () => {
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
          <li onClick={() => (window.location.href = "/trending/today")}>Trending</li>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>

        <div className="mobile-nav">
        <GiHamburgerMenu id="mobile-burger-menu"/>
        </div>

        <div className="slogan">Find Your Next Favorite Flick</div>

        <div className="beta-tag">beta</div>
      </header>
    </>
  );
};

export default Header;
