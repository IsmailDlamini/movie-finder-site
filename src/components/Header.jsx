import SiteLogo from "../assets/site-logo.png";
import "./Header.css";

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
          <li onClick={() => (window.location.href = "/trending")}>Trending</li>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>

        <div className="slogan">Find Your Next Favorite Flick</div>

        <div className="beta-tag">beta</div>
      </header>
    </>
  );
};

export default Header;
