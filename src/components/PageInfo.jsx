import { useLocation, useParams } from "react-router-dom";
import propTypes from "prop-types";

const PageInfo = ({ page, pageNumber, numberOfResults, isTrendingPage }) => {
  const { query } = useParams();

  const location = useLocation();

  switch (page) {
    case "Discover":
      return (
        <div
          className={`list-page-info ${
            isTrendingPage ? "trending-page-info" : ""
          }`}
        >
          <div className="list-type">
            {isTrendingPage == false
              ? "Discover"
              : location.pathname.includes("today")
              ? "Trending Today"
              : "Trending This Week"}
          </div>

          <div className="page-number">Page {pageNumber ? pageNumber : 1}</div>
        </div>
      );

    case "Search":
      return (
        <div className="list-page-info search-page">
          <div className="list-type">Searched for : {query}</div>

          <div className="page-number">Page {pageNumber ? pageNumber : 1}</div>

          <div className="number-of-results">
            {numberOfResults > 0 ? numberOfResults : ""} results
          </div>
        </div>
      );
  }
};

PageInfo.propTypes = {
  page: propTypes.string.isRequired,
  pageNumber: propTypes.string,
  numberOfResults: propTypes.number,
  isTrendingPage: propTypes.boolean,
};

export default PageInfo;
