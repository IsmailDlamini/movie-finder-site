import { useState, useEffect } from "react";
import "./Home.css";
import ismail_bot from "../assets/ismail-bot.png";
import Header from "../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import Genres from "../data/Genres";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import noImage from "../assets/no-image.jpg";
import { useParams } from "react-router-dom";

const Trending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const {timeFrame} = useParams();

  const page = searchParams.get("page");

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [total_pages, setTotal_pages] = useState(0);

  const [_timeFrame, setTimeFrame] = useState();

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
      `https://api.themoviedb.org/3/trending/movie/${timeFrame == "today" ? 'day' : 'week'}?language=en-US&page=${
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
      `/search/${searchTerm}?page=${1}`
    );
  };

  const applyFilters = () => {
    navigate(
      `/trending/${_timeFrame}`
    );
    window.location.reload();
  };


  const viewMovieDetails = (movieId) => {
    window.location.href = `/movie/${movieId}`
  }

  const Movie_list = movies.map((movie, index) => {
    return (
      <div className="movie-object" key={index}  onClick={() => viewMovieDetails(movie.id)}>
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
                <label htmlFor="time-frame">Time frame: </label>
                <div>
                  <select
                    name="time-frame"
                    id="time-frame"
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value)}
                  >
                    <option value="today">Today</option>
                    <option value="this-week">This week</option>
                  </select>
                </div>
              </li>

              <li>
                <label htmlFor="apply">.</label>
                <div className="exception">
                  <button onClick={applyFilters}>Apply Filters</button>
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
