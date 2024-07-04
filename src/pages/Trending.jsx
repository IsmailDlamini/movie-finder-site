import { useState, useEffect } from "react";
import "./Home.css";
import ismail_bot from "../assets/ismail-bot.png";
import Header from "../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import Genres from "../data/Genres";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import noImage from "../assets/no-image.jpg";

const Trending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  let allGenres =
    "12%7C16%7C28%7C35%7C80%7C99%7C18%7C10751%7C14%7C36%7C27%7C10402%7C9648%7C10749%7C878%7C10770%7C53%7C10752%7C37";

  const year = searchParams.get("year");
  const rating = searchParams.get("ratings");
  const genre = searchParams.get("genre");
  const page = searchParams.get("page");
  const sort = searchParams.get("sortBy");

  const filterPopular = "popularity.desc";
  const filterOldest = "primary_release_date.asc";
  const filterUpcoming = "primary_release_date.desc";

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterReleaseYear, setFilterReleaseYear] = useState(year);
  const [filterSortBy, setFilterSortBy] = useState(sort);
  const [filterVoteAverage, setFilterVoteAverage] = useState(rating);
  const [filterGenre, setFilterGenre] = useState(genre);
  const [total_pages, setTotal_pages] = useState(0);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YWRiMDI3ODdhYzMwMGVmMTQzODMyNDI2OWM1ZDA0MSIsIm5iZiI6MTcxOTI1ODAwMC43MzU5OSwic3ViIjoiNjQ3NzkyYWYxNzQ5NzMwMTE4NmYxMGYxIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.HI3jFL_rC7Oi4erXjj0uIFLL5JUIGrw9iqmRs0k05Xs",
    },
  };

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/trending/movie/day?language=en-US&page=${
        page ? page : 1
      }`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results);
        setTotal_pages(data.total_pages);
      })
      .catch((err) => console.error(err));
  }, []);

  const search = () => {
    navigate(
      `/search/${searchTerm}?${
        filterReleaseYear != null ? `year=${filterReleaseYear}` : ""
      }&page=${1}`
    );
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

  const Movie_list = movies.map((movie, index) => {
    return (
      <div className="movie-object" key={index}>
        <div className="image">
        {movie.poster_path != null ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt={movie.title}
            />
          ) : movie.backdrop_path != null ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
            />
          ) : (
            <img src={noImage} alt={movie.title} />
          )}
        </div>
        <div className="movie-info">
          <div className="movie-name">{movie.title}</div>
          <div className="genres">
            {Genres[movie.genre_ids[0]]}
            {movie.genre_ids.length > 1 ? "," : ""} {Genres[movie.genre_ids[1]]}
          </div>
          <div className="rating">
            {movie.vote_average.toString().length > 3
              ? movie.vote_average.toString().substring(0, 3)
              : movie.vote_average}{" "}
            / 10
          </div>

          <div className="year">{movie.release_date.substring(0, 4)}</div>
        </div>
      </div>
    );
  });

  const Loading_skeleton = [...Array(15)].map((_, index) => {
    return <div className="loading-skeleton" key={index}></div>;
  });

  return (
    <>
      <Header />
      <div className="home-page-container">
        <div className="search-component">
          <div className="creator">
            Created with love by <span>Ismail</span> &hearts;
          </div>

          <div className="search-bar">
            <label htmlFor="search-term">Search Term:</label>
            <div>
              <input
                type="text"
                id="search-term"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />{" "}
              <button
                onClick={() => search()}
                disabled={searchTerm.length > 0 ? false : true}
              >
                Search
              </button>
            </div>
          </div>

          <div className="filters">
            <ul>
              <li>
                <label htmlFor="ratings">Ratings:</label>
                <div>
                  <select
                    name="ratings"
                    id="ratings"
                    value={filterVoteAverage}
                    onChange={(e) => setFilterVoteAverage(e.target.value)}
                    disabled={searchTerm.length > 0 ? true : false}
                  >
                    <option value="All">All</option>
                    {[...Array(9)].map((_, index) => {
                      return (
                        <option value={9 - index} key={index}>
                          {9 - index}+
                        </option>
                      );
                    })}
                  </select>
                </div>
              </li>

              <li>
                <label htmlFor="year">Year:</label>
                <div>
                  <select
                    name="year"
                    id="year"
                    value={filterReleaseYear}
                    onChange={(e) => setFilterReleaseYear(e.target.value)}
                  >
                    <option value={0}>All</option>
                    {[...Array(15)].map((_, index) => {
                      return (
                        <option value={`20${24 - index}`} key={index}>
                          20{24 - index}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </li>

              <li>
                <label htmlFor="genre">Genre:</label>
                <div>
                  <select
                    name="genre"
                    id="genre"
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                    disabled={searchTerm.length > 0 ? true : false}
                  >
                    <option value={allGenres}>All</option>
                    {Object.entries(Genres).map(([id, name], index) => {
                      return (
                        <option value={id} key={index}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </li>

              <li>
                <label htmlFor="sort-by">Sort By:</label>
                <div>
                  <select
                    name="sort-by"
                    id="sort-by"
                    value={filterSortBy}
                    onChange={(e) => setFilterSortBy(e.target.value)}
                    disabled={searchTerm.length > 0 ? true : false}
                  >
                    <option value={filterPopular}>Most Popular</option>
                    <option value={filterUpcoming}>Upcoming</option>
                    <option value={filterOldest}>Oldest</option>
                  </select>
                </div>
              </li>

              <li>
                <label htmlFor="apply">.</label>
                <div className="exception">
                  <button onClick={() => applyFilters()}>Apply Filters</button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="info-pagination-movie-container">
          <div className="list-page-info">
            <div className="list-type">Trending Movies</div>

            <div className="page-number">Page {page ? page : 1}</div>
          </div>

          <div className="movie-container">
            {movies.length > 0 ? Movie_list : Loading_skeleton}
          </div>

          <Pagination
            page={page}
            total_pages={total_pages}
            filterVoteAverage={filterVoteAverage}
            filterReleaseYear={filterReleaseYear}
            filterGenre={filterGenre}
            filterSortBy={filterSortBy}
            pageToPaginate="Trending"
          />
        </div>

        <div className="chat-bot-icon">
          <img src={ismail_bot} alt="ismail-bot-icon" />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Trending;
