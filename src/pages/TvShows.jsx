import React, { useContext } from "react";
import "./Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useMyContext } from "../context/MyContext";
import ChatBotIcon from "../components/ChatBotIcon";
import Pagination from "../components/Pagination";
import PageInfo from "../components/PageInfo";
import SearchFilter from "../components/SearchFilter";
import { useState } from "react";
import MovieObject from "../components/MovieObject";

const TvShows = () => {
  const { tvShowData, page, tvShowPages } = useMyContext();

  const [chatBotState, setChatBotState] = useState(false);

  const changeChatBotState = (newState) => {
    setChatBotState(newState);
  };

  const Loading_skeleton = [...Array(15)].map((_, index) => {
    return <div className="loading-skeleton" key={index}></div>;
  });

  return (
    <>
      <Header tab={"tv-shows"} />
      <div className="home-page-container">
        <SearchFilter currentPage="Discover" />

        <div className="info-pagination-movie-container">
          <PageInfo page="Discover" isTrendingPage={false} pageNumber={page} />

          <div className="movie-container">
            {tvShowData.length > 0
              ? tvShowData.map((movie, index) => {
                  return (
                    <MovieObject
                      index={index}
                      movie_json={movie}
                      key={index}
                      page={"tv-shows"}
                    />
                  );
                })
              : Loading_skeleton}
          </div>

          <Pagination
            page={page}
            total_pages={tvShowPages}
            pageToPaginate="Tv-shows"
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

export default TvShows;
