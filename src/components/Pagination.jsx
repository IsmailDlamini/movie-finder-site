import "./Pagination.css";

const Pagination = (prop) => {
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
          prop.page > 6
            ? prop.page == prop.page - (4 - (index + 1))
              ? "nav"
              : ""
            : prop.page == index + 4
            ? "nav"
            : ""
        }`}
        style={{
          color:
            prop.page > 6
              ? prop.page - (4 - (index + 1)) >= prop.total_pages
                ? "grey"
                : ""
              : index + 4 >= prop.total_pages
              ? "grey"
              : "",
          backgroundColor:
            prop.page > 6
              ? prop.page - (4 - (index + 1)) >= prop.total_pages
                ? "grey"
                : ""
              : index + 4 >= prop.total_pages
              ? "grey"
              : "",
        }}
        key={index}
        onClick={() => {
          if (+prop.page > 6) {
            changePage(+prop.page - (4 - (index + 1)));
          } else {
            changePage(index + 4);
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
          onClick={() => changePage(1)}
          style={{
            color: prop.total_pages >= 1 ? "" : "grey",
            backgroundColor: prop.total_pages >= 1 ? "" : "grey",
          }}
        >
          {1}
        </div>
        <div
          className={`page_button ${prop.page == 2 ? "nav" : ""}`}
          onClick={() => changePage(2)}
          style={{
            color: prop.total_pages >= 2 ? "" : "grey",
            backgroundColor: prop.total_pages >= 2 ? "" : "grey",
          }}
        >
          {2}
        </div>
        <div
          className={`page_button ${prop.page == 3 ? "nav" : ""}`}
          onClick={() => (prop.page < 7 ? changePage(3) : "")}
          style={{
            color: prop.total_pages >= 3 ? "" : "grey",
            backgroundColor: prop.total_pages >= 3 ? "" : "grey",
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
          onClick={() => prop.page ? prop.page > 1 ? changePage((+prop.page - 1)) : "" : ""}
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
               onClick={() => changePage(prop.page ? prop.page !== prop.total_pages ? (+prop.page + 1) : "" : prop.total_pages > 1 ? 2 : "")}
        >
          Next {">>"}
        </div>
      </div>
    </>
  );
};

export default Pagination;
