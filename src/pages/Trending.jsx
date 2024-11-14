import { useState, useEffect } from "react";
import "./Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import ChatBotIcon from "../components/ChatBotIcon";
import Ai from "../integration/Ai";
import MovieObject from "../components/MovieObject";
import PageInfo from "../components/PageInfo";
import SearchFilter from "../components/SearchFilter";
import { useMyContext } from "../context/MyContext";

const Trending = () => {
  const { trendingPages, trendingData, page, timeFrame } = useMyContext();

  const [chatBotState, setChatBotState] = useState(false);

  const changeChatBotState = (newState) => {
    setChatBotState(newState);
  };

  const Loading_skeleton = [...Array(15)].map((_, index) => {
    return <div className="loading-skeleton" key={index}></div>;
  });

  return (
    <>
      <Header tab={"trending"}/>
      <div className="home-page-container">
        <SearchFilter currentPage="Trending" />

        <div className="info-pagination-movie-container">
          <PageInfo page="Discover" isTrendingPage={true} pageNumber={page} />

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
            total_pages={trendingPages}
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
