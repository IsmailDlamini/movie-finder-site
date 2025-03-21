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
import PageInfo from "../components/PageInfo"
import { useMyContext } from "../context/MyContext";
import AdSenseAd from "../components/AdSenseAd";

const Home = () => {

  const {discoveryPages ,discoveryData} =  useMyContext();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const page = searchParams.get("page");

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: "/",
      title: "home page",
    });
  }, []);

  const [chatBotState, setChatBotState] = useState(false); // required on every page

  const changeChatBotState = (newState) => {
    setChatBotState(newState);
  };

  const Loading_skeleton = [...Array(15)].map((_, index) => {
    return <div className="loading-skeleton" key={index}></div>;
  });

  return (
    <>
      <Header tab="discover"/>
      <div className="home-page-container">
      
        <SearchFilter currentPage="Discover"/>

        <div className="info-pagination-movie-container">
          
          <PageInfo page="Discover" isTrendingPage={false} pageNumber={page}/>
          
          <div className="movie-container" >
      
            {discoveryData.length > 0
              ? discoveryData.map((movie, index) => {
                  return (
                    <MovieObject index={index} movie_json={movie} key={index} />
                  );
                })
              : Loading_skeleton}
          </div>

          <Pagination
            page={page}
            total_pages={discoveryPages}
            pageToPaginate="Discover"
          />

<AdSenseAd
        client="ca-pub-6737754409287179"
        slot="1691051303"
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
