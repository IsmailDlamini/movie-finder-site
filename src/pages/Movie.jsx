import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "./Movie.css";
import { useParams } from "react-router-dom";
import Genres from "../data/Genres";

const Movie = () => {
  const { id } = useParams();

  const [movieDetails, setMovieDetails] = useState({});
  const [movieImages, setMovieImages] = useState();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YWRiMDI3ODdhYzMwMGVmMTQzODMyNDI2OWM1ZDA0MSIsIm5iZiI6MTcxOTI1ODAwMC43MzU5OSwic3ViIjoiNjQ3NzkyYWYxNzQ5NzMwMTE4NmYxMGYxIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.HI3jFL_rC7Oi4erXjj0uIFLL5JUIGrw9iqmRs0k05Xs",
    },
  };

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options)
      .then((response) => response.json())
      .then((data) => {
        setMovieDetails(data);
        console.log(data);
        console.log(movieDetails);
      })
      .catch((err) => console.error(err));

    fetch(`https://api.themoviedb.org/3/movie/${id}/images`, options)
      .then((response) => response.json())
      .then((data) => {
        setMovieImages(data.backdrops);
        console.log(data);
        console.log(movieImages);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <Header />
      <div className="movie-page-container">
        <div className="first-half">
          <div className="movie-info-container">
            <div className="movie-image">
              <img
                src={`https://image.tmdb.org/t/p/original${movieDetails.poster_path}`}
                alt={movieDetails.poster_path}
              />
            </div>
            <div className="movie-details">
              <div className="movie-title">{movieDetails.title}</div>

              <div className="release-year">
                {movieDetails.release_date
                  ? movieDetails.release_date.substring(0, 4)
                  : "Null"}
              </div>

              <div className="genres">
                {Object.keys(movieDetails).length > 0 && movieDetails.genres
                  ? movieDetails.genres.map((genre, index) => {
                      return (
                        <div key={index} className="genre">
                          {genre.name}{" "}
                          {index + 1 != movieDetails.genres.length ? " ," : ""}
                        </div>
                      );
                    })
                  : ""}
              </div>

              <div className="ratings">
                <div>★</div>
                {Object.keys(movieDetails).length > 0
                  ? movieDetails.vote_average.toString().length > 3
                    ? movieDetails.vote_average.toString().substring(0, 3)
                    : movieDetails.vote_average
                  : 0}{" "}
                / 10
              </div>
            </div>
          </div>
          <div className="similar-movies-container"></div>
        </div>

        <div className="second-half">
          <div className="plot-summary">
            <div className="title">Plot Summary</div>
            {Object.keys(movieDetails).length > 0 ? (
              <div>{movieDetails.overview}</div>
            ) : (
              ""
            )}
          </div>

          <div className="images-and-trailer">
            <div className="image">
              {movieImages ? (
                <img
                  src={`https://image.tmdb.org/t/p/original${movieImages[0].file_path}`}
                  alt="test"
                />
              ) : (
                ""
              )}
              
            </div>

            <div className="image">
              {movieImages ? (
                <img
                  src={`https://image.tmdb.org/t/p/original${movieImages[1].file_path}`}
                  alt="test"
                />
              ) : (
                ""
              )}
              
            </div>


            <div className="image">
              {movieImages ? (
                <img
                  src={`https://image.tmdb.org/t/p/original${movieImages[2].file_path}`}
                  alt="test"
                />
              ) : (
                ""
              )}
              
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Movie;
