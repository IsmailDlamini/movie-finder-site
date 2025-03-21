import propTypes from "prop-types";
import "./MovieObject.css";
import Genres from "../data/Genres";
import noImage from "../assets/no-image.jpg";

const MovieObject = ({ movie_json, index, page }) => {
  // redirect to the movie page(path) and show movie information
  const viewMovieDetails = (movieId) => {
    window.location.href = `/movie/${movieId}`;
  };

  // redirect to the tv-show page(path) and show the tv-show details
  const viewTvShowDetails = (tvShowId) => {
    window.location.href = `/tv-show/${tvShowId}`;
  };

  return (
    <>
      <div
        className="movie-object"
        key={index}
        onClick={() => {
          page != "tv-shows"
            ? viewMovieDetails(movie_json.id)
            : viewTvShowDetails(movie_json.id);
        }}
      >
        <div className="image">
          {movie_json.poster_path != null ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movie_json.poster_path}`}
              alt={page == "tv-show" ? movie_json.name : movie_json.title}
            />
          ) : movie_json.backdrop_path != null ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movie_json.backdrop_path}`}
              alt={page == "tv-show" ? movie_json.name : movie_json.title}
            />
          ) : (
            <img
              src={noImage}
              alt={page == "tv-show" ? movie_json.name : movie_json.title}
            />
          )}
        </div>
        <div className="movie-info">
          <div className="movie-name">{page == "tv-show" ? movie_json.name :  movie_json.title}</div>
          <div className="genres">
            {Genres[movie_json.genre_ids[0]]}
            {movie_json.genre_ids.length > 1 ? "," : ""}{" "}
            {Genres[movie_json.genre_ids[1]]}
          </div>
          <div className="rating">
            {movie_json.vote_average.toString().length > 3
              ? movie_json.vote_average.toString().substring(0, 3)
              : movie_json.vote_average}{" "}
            / 10
          </div>

          <div className="year">
            {page == "tv-shows"
              ? movie_json.first_air_date.substring(0, 4)
              : movie_json.release_date.substring(0, 4)}
          </div>
        </div>
      </div>
    </>
  );
};

MovieObject.propTypes = {
  movie_json: propTypes.object.isRequired,
  index: propTypes.number.isRequired,
  page: propTypes.string,
};

export default MovieObject;
