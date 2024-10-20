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
import { useMyContext } from "../context/MyContext";

const Trending = () => {

  const {trendingData} = useMyContext();

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const { timeFrame } = useParams();

  const page = searchParams.get("page");

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [total_pages, setTotal_pages] = useState(0);

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

  const Loading_skeleton = [...Array(15)].map((_, index) => {
    return <div className="loading-skeleton" key={index}></div>;
  });

  return (
    <>
      <Header />
      <div className="home-page-container">
        
      <SearchFilter currentPage="Trending"/>

        <div className="info-pagination-movie-container">

        <PageInfo page="Discover" trendingPage={true}/>

          <div className="movie-container">
      
            {trendingData.length > 0
              ? trendingData.map((movie, index) => {
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
