import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "./Movie.css";
import { useParams } from "react-router-dom";
import { FaDownload } from "react-icons/fa";
import { BiSolidMoviePlay } from "react-icons/bi";
import { FaStar } from "react-icons/fa6";
import { FaImdb } from "react-icons/fa";
import no_avatar from "../assets/no-avatar.jpg";

const Movie = () => {
  const { id } = useParams();

  const [movieDetails, setMovieDetails] = useState({});
  const [movieImages, setMovieImages] = useState();
  const [similarMovies, setSimilarMovies] = useState();
  const [movieReviews, setMovieReviews] = useState();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YWRiMDI3ODdhYzMwMGVmMTQzODMyNDI2OWM1ZDA0MSIsIm5iZiI6MTcxOTI1ODAwMC43MzU5OSwic3ViIjoiNjQ3NzkyYWYxNzQ5NzMwMTE4NmYxMGYxIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.HI3jFL_rC7Oi4erXjj0uIFLL5JUIGrw9iqmRs0k05Xs",
    },
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [
          detailsResponse,
          imagesResponse,
          similarResponse,
          reviewsResponse,
        ] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
            options
          ),
          fetch(`https://api.themoviedb.org/3/movie/${id}/images`, options),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`,
            options
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US&page=1`,
            options
          ),
        ]);

        const detailsData = await detailsResponse.json();
        const imagesData = await imagesResponse.json();
        const similarData = await similarResponse.json();
        const reviewsData = await reviewsResponse.json();

        setMovieDetails(detailsData);
        setMovieImages(imagesData.backdrops);
        setSimilarMovies(similarData.results);
        setMovieReviews(reviewsData.results);

        console.log(detailsData);
        console.log(similarData.results);
        console.log(reviewsData.results);
        console.log(imagesData.backdrops);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovieData();
  }, [id]);

  const viewMovieDetails = (movieId) => {
    window.location.href = `/movie/${movieId}`;
  };

  return (
    <>
      <Header />

      <div className="movie-page-container">
        {movieDetails && movieImages && movieReviews ? (
          <>
            <div
              className="page-background-image"
              style={{
                backgroundImage: `${
                  movieImages
                    ? movieImages.length !== 0
                      ? `url(https://image.tmdb.org/t/p/original${movieImages[0].file_path})`
                      : ""
                    : ""
                }`,
              }}
            ></div>
            <div className="first-half">
              <div className="movie-info-container">
                <div className="movie-image">
                  <img
                    src={`https://image.tmdb.org/t/p/original${movieDetails.poster_path}`}
                    alt={movieDetails.poster_path}
                  />
                  <div className="download-button">
                    <div>Download</div> <FaDownload id="download-icon" />
                  </div>
                  <div className="stream-button">
                    <div>Stream</div> <BiSolidMoviePlay id="stream-icon" />
                  </div>
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
                              {index + 1 != movieDetails.genres.length
                                ? " ,"
                                : ""}
                            </div>
                          );
                        })
                      : ""}
                  </div>

                  <div className="ratings">
                    <div>
                      <FaStar id="rating-star" />
                    </div>
                    {Object.keys(movieDetails).length > 0
                      ? movieDetails.vote_average.toString().length > 3
                        ? movieDetails.vote_average.toString().substring(0, 3)
                        : movieDetails.vote_average
                      : 0}{" "}
                    / 10
                  </div>

                  <div className="keywords">
                    <div className="keyword"></div>
                  </div>

                  <div className="language">
                    Language: <span>{movieDetails.original_language}</span>
                  </div>

                  <div className="imdb">
                    <FaImdb id="imdb" />
                  </div>
                </div>
              </div>
              <div className="similar-movies-container">
                <div className="title">Similar Movies</div>

                <div className="movies">
                  {similarMovies.length !== 0 ? (
                    <>
                      <div
                        className="movie"
                        onClick={() => {
                          viewMovieDetails(similarMovies[0].id);
                        }}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/original${similarMovies[0].poster_path}`}
                          alt="movie-image"
                        />
                      </div>

                      <div
                        className="movie"
                        onClick={() => {
                          viewMovieDetails(similarMovies[5].id);
                        }}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/original${similarMovies[5].poster_path}`}
                          alt="movie-image"
                        />
                      </div>
                    </>
                  ) : (
                    "No Similar Movies found"
                  )}
                </div>
              </div>
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
                {movieImages.length !== 0
                  ? movieImages.slice(0, 3).map((image, index) => {
                      return (
                        <div className="image" key={index}>
                          <img
                            src={`https://image.tmdb.org/t/p/original${movieImages[index].file_path}`}
                            alt="test"
                          />
                        </div>
                      );
                    })
                  : ""}
              </div>

              <div className="reviews">
                <div className="review-header"> Movie Reviews</div>

                <div className="review-container">
                  {movieReviews ? (
                    movieReviews.length > 0 ? (
                      movieReviews.map((review, index) => {
                        return (
                          <div className="review" key={index}>
                            <div className="avatar-name-date">
                              <div className="avatar">
                                {review.author_details.avatar_path ? (
                                  <img
                                    src={`https://image.tmdb.org/t/p/original${review.author_details.avatar_path}`}
                                    alt="avatar"
                                  />
                                ) : (
                                  <img src={no_avatar} alt="no-avatar" />
                                )}
                              </div>
                              <div className="name-date">
                                <div className="name">
                                  {review.author_details.username}
                                </div>
                                <div className="date">
                                  {review.updated_at.substring(0, 10)}
                                </div>
                              </div>
                            </div>

                            <div className="rating">
                              Rating: {review.author_details.rating} / 10
                            </div>

                            <div className="comment">{review.content}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div id="no-reviews">
                        No Reviews Available for this movie
                      </div>
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="loading-screen">
              <div className="loader"></div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Movie;
