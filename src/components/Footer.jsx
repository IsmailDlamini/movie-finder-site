import SiteLogo from "../assets/site-logo.png";
import linkedin from "../assets/linkedin.png";
import github from "../assets/github.png";
import "./Footer.css"

const Footer = () => {
  return (
  <>
    <footer>
        <div className="logo">
          <img src={SiteLogo} alt="logo" />
        </div>

        <div className="copyright">
          © 2024 Ismail. All rights reserved. <br />
          <br />
          <span>
            Movie Finder aggregates movie info from various sources including
            [TMDB, IMDB, etc.]. Content is for informational purposes only. We
            do not host or upload any video, films, or media files. All content
            is sourced from publicly available third-party services.
          </span>
        </div>

        <div className="icons">
          <img src={linkedin} alt="linkedin-icon" />
          <img src={github} alt="github-icon" />
        </div>
      </footer>
  </>
  )
}

export default Footer