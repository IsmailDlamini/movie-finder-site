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
import { useMyContext } from "../context/MyContext";

const Search = () => {

  const {page, searchPages, searchData, total_results, loadingData} = useMyContext();

  const location = useLocation();
  const { query } = useParams();

  const searchParams = new URLSearchParams(location.search);

  const year = searchParams.get("year");

  const [filterReleaseYear, setFilterReleaseYear] = useState(year);

  const [chatBotState, setChatBotState] = useState(false);

  const changeChatBotState = (newState) => {
    setChatBotState(newState);
  };

  const Loading_skeleton = [...Array(15)].map((_, index) => {
    return <div className="loading-skeleton" key={index}></div>;
  });

  return (
    <>
      <Header />
      <div className="home-page-container">
       
      <SearchFilter currentPage="Search"/>

        <div className="info-pagination-movie-container">
          <PageInfo page="Search" pageNumber={page} isTrendingPage={false} numberOfResults={total_results}/>

          <div className="movie-container">
            {!loadingData ? (
              total_results > 0 ? (
                  
              searchData.map((movie, index) => {
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

          {total_results > 0 ? (
            <Pagination
              page={page}
              total_pages={searchPages}
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
