import React from "react";
import "./Home.css"



const TvShows = () => {



    
    const Loading_skeleton = [...Array(15)].map((_, index) => {
        return <div className="loading-skeleton" key={index}></div>;
      });

  return <>

    <Header />
      <div className="shows-page-container">
      
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
        </div>

        <ChatBotIcon
          changeChatBotState={changeChatBotState}
          chatBotState={chatBotState}
          showHint={true}
        />
        {chatBotState && <Ai changeChatBotState={changeChatBotState} />}
      </div>

      <Footer />
  </>;
};

export default TvShows;
