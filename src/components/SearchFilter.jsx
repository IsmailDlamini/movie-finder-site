import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import propTypes from "prop-types";
import Filter from "./Filter";
import Genres from "../data/Genres";
import { useParams } from "react-router-dom";

const SearchFilter = ({ currentPage }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const year = searchParams.get("year");
  const rating = searchParams.get("ratings");
  const genre = searchParams.get("genre");
  const page = searchParams.get("page");
  const sort = searchParams.get("sortBy");

  const { timeFrame } = useParams();

  let allGenres =
    "12%7C16%7C28%7C35%7C80%7C99%7C18%7C10751%7C14%7C36%7C27%7C10402%7C9648%7C10749%7C878%7C10770%7C53%7C10752%7C37";

  const filterPopular = "popularity.desc";
  const filterOldest = "primary_release_date.asc";
  const filterUpcoming = "primary_release_date.desc";

  const [filterReleaseYear, setFilterReleaseYear] = useState(year);
  const [filterSortBy, setFilterSortBy] = useState(sort);
  const [filterVoteAverage, setFilterVoteAverage] = useState(rating);
  const [filterGenre, setFilterGenre] = useState(genre);
  const [_timeFrame, setTimeFrame] = useState();
  const [searchTerm, setSearchTerm] = useState("");

  const search = () => {
    navigate(
      `/search/${searchTerm}?${
        filterReleaseYear != null ? `year=${filterReleaseYear}` : ""
      }&page=${1}`
    );
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchTerm.length > 0) {
        search();
      }
    }
  };

  const applyFilters = () => {
    navigate(
      `/?page=${1}${
        filterVoteAverage != null ? `&ratings=${filterVoteAverage}` : ""
      }${filterReleaseYear != null ? `&year=${filterReleaseYear}` : ""}${
        filterGenre != null ? `&genre=${filterGenre}` : ""
      }${filterSortBy != null ? `&sortBy=${filterSortBy}` : ""}`
    );
    window.location.reload();
  };

  const PageFilters = () => {
    switch (currentPage) {
      case "Discover":
        return (
          <ul>
            <Filter
              filterName="ratings"
              filterId="ratings"
              filterLabel="Ratings:"
              filterValue={filterVoteAverage}
              filterFunction={setFilterVoteAverage}
            >
              <option value="All">All</option>
              {[...Array(9)].map((_, index) => {
                return (
                  <option value={9 - index} key={index}>
                    {9 - index}+
                  </option>
                );
              })}
            </Filter>

            <Filter
              filterName="year"
              filterId="year"
              filterLabel="Year:"
              filterValue={filterReleaseYear}
              filterFunction={setFilterReleaseYear}
            >
              {[...Array(15)].map((_, index) => {
                return (
                  <option value={`20${24 - index}`} key={index}>
                    20{24 - index}
                  </option>
                );
              })}
            </Filter>

            <Filter
              filterName="genre"
              filterId="genre"
              filterLabel="Genre:"
              filterValue={filterGenre}
              filterFunction={setFilterGenre}
            >
              <option value={allGenres}>All</option>
              {Object.entries(Genres).map(([id, name], index) => {
                return (
                  <option value={id} key={index}>
                    {name}
                  </option>
                );
              })}
            </Filter>

            <Filter
              filterName="sort-by"
              filterId="sort-by"
              filterLabel="Sort By:"
              filterValue={filterSortBy}
              filterFunction={setFilterSortBy}
            >
              <option value={filterPopular}>Most Popular</option>
              <option value={filterUpcoming}>Upcoming</option>
              <option value={filterOldest}>Oldest</option>
            </Filter>

            <li>
              <label htmlFor="apply">.</label>
              <div className="exception">
                <button onClick={() => applyFilters()}>Apply Filters</button>
              </div>
            </li>
          </ul>
        );
       

      case "Search":
        return (
          <Filter
            filterName="year"
            filterId="year"
            filterLabel="Year:"
            filterValue={filterReleaseYear}
            filterFunction={setFilterReleaseYear}
          >
            {[...Array(15)].map((_, index) => {
              return (
                <option value={`20${24 - index}`} key={index}>
                  20{24 - index}
                </option>
              );
            })}
          </Filter>
        );

      case "Trending":
        return (
          <Filter
            filterName="time-frame"
            filterId="time-frame"
            filterLabel="Time frame:"
            filterValue={timeFrame}
            filterFunction={setTimeFrame}
          >
            <option value="today">Today</option>
            <option value="this-week">This week</option>
          </Filter>
        );
    }
  };

  return (
    <>
      <div className="search-component">
        <div className="creator">
          Created with love by <span>Ismail</span> &hearts;
        </div>

        <div className="search-bar">
          <label htmlFor="search-term">Search Term:</label>
          <div>
            <input
              type="search"
              id="search-term"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => handleSearchKeyDown(e)}
            />{" "}
            <button
              onClick={() => search()}
              disabled={searchTerm.length > 0 ? false : true}
            >
              Search
            </button>
          </div>
        </div>

        <div className="filters"><PageFilters/></div>
      </div>
    </>
  );
};

SearchFilter.propTypes = {
  currentPage: propTypes.string.isRequired,
};

export default SearchFilter;
