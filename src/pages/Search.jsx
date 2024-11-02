import { useState, useEffect } from "react";
import Header from "../components/Header";
import "./Home.css";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import Ai from "../integration/Ai";
import ChatBotIcon from "../components/ChatBotIcon";
import Footer from "../components/Footer";
import MovieObject from "../components/MovieObject";
import SearchFilter from "../components/SearchFilter";
import PageInfo from "../components/PageInfo"

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

  const [chatBotState, setChatBotState] = useState(false);

  const [loadingResults, setLoadingResults] = useState(true);

  const changeChatBotState = (newState) => {
    setChatBotState(newState);
  };

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
      `Bearer ${import.meta.env.VITE_TMDB_AUTHORIZATION_TOKEN}`,
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
      .then(() => {
        setLoadingResults(false)
      }
      
      )
      .catch((err) => console.error(err));
  }, []);

  const search = () => {
    navigate(
      `/search/${searchTerm}?${
        filterReleaseYear != null ? `year=${filterReleaseYear}&` : ""
      }page=${1}`
    );
    window.location.reload();
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchTerm.length > 0) {
        search();
      }
    }
  };

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
       
      <SearchFilter currentPage="Search"/>

        <div className="info-pagination-movie-container">
          <PageInfo page="Search" pageNumber={page} isTrendingPage={false} numberOfResults={numberOfResults}/>

          <div className="movie-container">
            {!loadingResults ? (
              numberOfResults > 0 ? (
                  
                movies.map((movie, index) => {
                  return (
                    <MovieObject index={index} movie_json={movie} key={index} />
                  );
                })

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

        <ChatBotIcon
          changeChatBotState={changeChatBotState}
          chatBotState={chatBotState}
        />
        {chatBotState && <Ai changeChatBotState={changeChatBotState} />}
      </div>

      <Footer />
    </>
  );
};

export default Search;
