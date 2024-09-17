import { useState, useEffect } from "react";
import "./Home.css";
import Header from "../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import { useParams } from "react-router-dom";
import ChatBotIcon from "../components/ChatBotIcon";
import Ai from "../integration/Ai";
import MovieObject from "../components/MovieObject";
import PageInfo from "../components/PageInfo"
import SearchFilter from "../components/SearchFilter";

const Trending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const { timeFrame } = useParams();

  const page = searchParams.get("page");

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [total_pages, setTotal_pages] = useState(0);

  const [_timeFrame, setTimeFrame] = useState();

  const [chatBotState, setChatBotState] = useState(false);

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
      `https://api.themoviedb.org/3/trending/movie/${
        timeFrame == "today" ? "day" : "week"
      }?language=en-US&page=${page ? page : 1}`,
      options
    )
      .then((response) => response.json())
      .then((data) => {
        setMovies(data.results);
        setTotal_pages(data.total_pages);
      })
      .catch((err) => console.error(err));
  }, []);

  // this will cause an inifite re render, because when i load the page at first the first useEffect will
  // load what it wants to load giving all the work to the second

  const search = () => {
    navigate(`/search/${searchTerm}?page=${1}`);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      if (searchTerm.length > 0) {
        search();
      }
    }
  };

  const applyFilters = () => {
    navigate(`/trending/${_timeFrame}`);
    window.location.reload();
  };

  const Loading_skeleton = [...Array(15)].map((_, index) => {
    return <div className="loading-skeleton" key={index}></div>;
  });

  return (
    <>
      <Header />
      <div className="home-page-container">
        
      <SearchFilter currentPage="Trending"/>

        <div className="info-pagination-movie-container">

        <PageInfo page="Discover" trendingData={true}/>

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
            pageToPaginate="Trending"
            timeframe={timeFrame}
          />
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

export default Trending;
