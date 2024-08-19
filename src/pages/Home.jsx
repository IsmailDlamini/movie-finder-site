import { useState, useEffect } from "react";
import "./Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import Ai from "../integration/Ai";
import ChatBotIcon from "../components/ChatBotIcon";
import ReactGA from "react-ga4";
import MovieObject from "../components/MovieObject";
import SearchFilter from "../components/SearchFilter";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


const Home = () => {

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

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: "/",
      title: "home page",
    });
  }, []);

  const [movies, setMovies] = useState([]);
  const [total_pages, setTotal_pages] = useState(0);
  const [chatBotState, setChatBotState] = useState(false); // required on every page

  const changeChatBotState = (newState) => {
    setChatBotState(newState);
  };

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_AUTHORIZATION_TOKEN}`,
    },
  };

  //to do and maybe try to be the one that does 

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${
        page ? page : 1
      }${year ? `&primary_release_year=${year}` : ""}${
        sort ? `&sort_by=${filterSortBy}` : ""
      }${rating ? `&vote_average.gte=${rating}` : ""}${
        genre ? `&with_genres=${genre}` : ""
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

  // we meed to set context of the app

  const search = () => {
    navigate(
      `/search/${searchTerm}?${
        filterReleaseYear != null ? `year=${filterReleaseYear}` : ""
      }&page=${1}`
    );
  };


  const Loading_skeleton = [...Array(15)].map((_, index) => {
    return <div className="loading-skeleton" key={index}></div>;
  });

  return (
    <>
      <Header />
      <div className="home-page-container">
      
        <SearchFilter currentPage="Discover"/>

        <div className="info-pagination-movie-container">
          <div className="list-page-info">
            <div className="list-type">Discover</div>

            <div className="page-number">Page {page ? page : 1}</div>
          </div>

          <div className="movie-container">
      
            {movies.length > 0
              ? movies.map((movie, index) => {
                  return (
                    <MovieObject index={index} movie_json={movie} key={index} />
                  );
                })
              : Loading_skeleton}
          </div>

          <Pagination
            page={page}
            total_pages={total_pages}
            filterVoteAverage={filterVoteAverage}
            filterReleaseYear={filterReleaseYear}
            filterGenre={filterGenre}
            filterSortBy={filterSortBy}
            pageToPaginate="Discover"
          />
        </div>

        <ChatBotIcon
          changeChatBotState={changeChatBotState}
          chatBotState={chatBotState}
          showHint={true}
        />
        {chatBotState && <Ai changeChatBotState={changeChatBotState} />}
      </div>

      <Footer />
    </>
  );
};

export default Home;
