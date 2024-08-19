import "./Pagination.css";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";


const Pagination = (prop) => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const year = searchParams.get("year");
  const rating = searchParams.get("ratings");
  const genre = searchParams.get("genre");
  const page = searchParams.get("page");
  const sort = searchParams.get("sortBy");

  const { timeFrame } = useParams();


  const changePage = (pageNumber) => {
    if (prop.pageToPaginate == "Discover") {
      window.location.href = `/?page=${pageNumber}${
        prop.filterVoteAverage != null
          ? `&ratings=${prop.filterVoteAverage}`
          : ""
      }${
        prop.filterReleaseYear != null ? `&year=${prop.filterReleaseYear}` : ""
      }${prop.filterGenre != null ? `&genre=${prop.filterGenre}` : ""}${
        prop.filterSortBy != null ? `&sortBy=${prop.filterSortBy}` : ""
      }`;
    } else if (prop.pageToPaginate == "Search") {
      window.location.href = `/search/${prop.query}?${
        prop.filterReleaseYear != null ? `year=${prop.filterReleaseYear}` : ""
      }&page=${pageNumber}`;
    } else if (prop.pageToPaginate == "Trending") {
      window.location.href = `/trending/${prop.timeframe}?page=${pageNumber}`;
    }
  };

  const generatePaginationNumbers = [...Array(7)].map((_, index) => {
    return (
      <div
        className={`page_button ${
          +prop.page > 6
            ? +prop.page == +prop.page - (4 - (index + 1))
              ? "nav"
              : ""
            : +prop.page == index + 4
            ? "nav"
            : ""
        }`}
        style={{
          color:
            +prop.page > 6
              ? +prop.page - (4 - (index + 1)) > prop.total_pages
                ? "#292F36"
                : ""
              : index + 4 > prop.total_pages
              ? "#292F36"
              : "",
          backgroundColor:
            +prop.page > 6
              ? +prop.page - (4 - (index + 1)) > prop.total_pages
                ? "#292F36"
                : ""
              : +index + 4 > prop.total_pages
              ? "#292F36"
              : "",
        }}
        key={index}
        onClick={() => {
          if (+prop.page > 6) {
            prop.total_pages >= +prop.page - (4 - (index + 1))
              ? changePage(+prop.page - (4 - (index + 1)))
              : "";
          } else {
            prop.total_pages >= index + 4 ? changePage(index + 4) : "";
          }
        }}
      >
        {prop.page > 6 ? +prop.page - (4 - (index + 1)) : index + 4}
      </div>
    );
  });

  return (
    <>
      <div className="pagination">
        <div
          className="previous-page nav"
          onClick={() => changePage(+prop.page - 1)}
        >
          {"<<"} Previous
        </div>

        {+prop.page > 1 ? (
          <div className="first-page nav" onClick={() => changePage(1)}>
            First Page
          </div>
        ) : (
          ""
        )}

        <div
          className={`page_button ${
            prop.page ? (prop.page == 1 ? "nav" : "") : "nav"
          }`}
          onClick={() => {
            prop.total_pages >= 1 ? changePage(1) : "";
          }}
          style={{
            color: prop.total_pages >= 1 ? "" : "#292F36",
            backgroundColor: prop.total_pages >= 1 ? "" : "#292F36",
          }}
        >
          {1}
        </div>
        <div
          className={`page_button ${prop.page == 2 ? "nav" : ""}`}
          onClick={() => (prop.total_pages >= 2 ? changePage(2) : "")}
          style={{
            color: prop.total_pages >= 2 ? "" : "#292F36",
            backgroundColor: prop.total_pages >= 2 ? "" : "#292F36",
          }}
        >
          {2}
        </div>
        <div
          className={`page_button ${prop.page == 3 ? "nav" : ""}`}
          onClick={() =>
            prop.page < 7 ? (prop.total_pages >= 3 ? changePage(3) : "") : ""
          }
          style={{
            color: prop.total_pages >= 3 ? "" : "#292F36",
            backgroundColor: prop.total_pages >= 3 ? "" : "#292F36",
          }}
        >
          {prop.page > 6 ? "***" : 3}
        </div>

        {generatePaginationNumbers}
        <div className={`page_button`}>{"***"}</div>
        <div
          className="next-page nav"
          onClick={() => changePage(+prop.page + 1)}
        >
          Next {">>"}
        </div>
      </div>

      <div className="pagination-mobile">
        <div
          className={`previous-button ${
            prop.page ? (prop.page < 2 ? "disable" : "") : "disable"
          }`}
          onClick={() =>
            prop.page ? (prop.page > 1 ? changePage(+prop.page - 1) : "") : ""
          }
        >
          {"<<"} Prev
        </div>
        <div
          className={`first-page ${
            prop.page ? (prop.page < 2 ? "hide" : "") : "hide"
          }`}
        >
          1
        </div>
        <div
          className={`spacing ${
            prop.page ? (prop.page < 2 ? "hide" : "") : "hide"
          }`}
        >
          {"***"}
        </div>
        <div className="current-page">{prop.page ? prop.page : 1}</div>
        <div
          className={`next-button ${
            prop.page
              ? prop.page === prop.total_pages
                ? "disable"
                : ""
              : prop.total_pages == 1
              ? "disable"
              : ""
          }`}
          onClick={() =>
            prop.page
              ? +prop.page !== prop.total_pages
                ? changePage(+prop.page + 1)
                : ""
              : changePage(+prop.total_pages > 1 ? 2 : 1)
          }
        >
          Next {">>"}
        </div>
      </div>
    </>
  );
};

export default Pagination;
