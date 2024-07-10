import { useState, useEffect } from "react";
import Header from "../components/Header";
import SiteLogo from "../assets/site-logo.png";
import "./Home.css";
import linkedin from "../assets/linkedin.png";
import github from "../assets/github.png";
import ismail_bot from "../assets/ismail-bot.png";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Genres from "../data/Genres";
import Pagination from "../components/Pagination";
import noImage from "../assets/no-image.jpg";

const Search = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { query } = useParams();

  const searchParams = new URLSearchParams(location.search);

  const year = searchParams.get("year");
  const page = searchParams.get("page");

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterReleaseYear, setFilterReleaseYear] = useState(year);
  const [numberOfResults, setNumberOfResults] = useState(0);
  const [total_pages, setTotal_pages] = useState();

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
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US${
        year ? `&primary_release_year=${year}` : ""
      }&page=${page}`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results);
        setTotal_pages(data.total_pages);
        setNumberOfResults(data.total_results);
      })
      .catch((err) => console.error(err));
  }, [page]);

  const search = () => {
    navigate(
      `/search/${searchTerm}?${
        filterReleaseYear != null ? `year=${filterReleaseYear}&` : ""
      }page=${1}`
    );
    window.location.reload();
  };

  const viewMovieDetails = (movieId) => {
    window.location.href = `/movie/${movieId}`
  }


  const Movie_list = movies.map((movie, index) => {
    return (
      <div className="movie-object" key={index} onClick={() => viewMovieDetails(movie.id)} >
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
            {movie.genre_ids.length !== 0 ? Genres[movie.genre_ids[0]] : ""}
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

  const applyFilter = () => {
    navigate(
      `/search/${query}?${
        filterReleaseYear != null ? `year=${filterReleaseYear}&` : ""
      }page=${1}`
    );
    window.location.reload();
  };

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
                <label htmlFor="apply">.</label>
                <div className="exception">
                  <button
                    disabled={filterReleaseYear != year ? false : true}
                    style={{
                      backgroundColor:
                        filterReleaseYear != year ? "" : "#12456B",
                    }}
                    onClick={applyFilter}
                  >
                    Apply Filter
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="info-pagination-movie-container">
          <div className="list-page-info">
            <div className="list-type">Searched for : {query}</div>

            <div className="page-number">Page {page ? page : 1}</div>

            <div className="number-of-results">
              {numberOfResults > 0 ? numberOfResults : ""} results
            </div>
          </div>

          <div className="movie-container">
            {movies.length > 0 ? (
              numberOfResults > 0 ? (
                Movie_list
              ) : (
                <div className="no-results">
                  {" "}
                  Oops No results found for {'"'}
                  {query}
                  {'"'}
                </div>
              )
            ) : (
              Loading_skeleton
            )}
          </div>

          {numberOfResults > 0 ? (
            <Pagination
              page={page}
              total_pages={total_pages}
              filterReleaseYear={filterReleaseYear}
              pageToPaginate="Search"
              query={query}
            />
          ) : (
            ""
          )}
        </div>

        <div className="chat-bot-icon">
          <img src={ismail_bot} alt="ismail-bot-icon" />
        </div>
      </div>

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
  );
};

export default Search;
