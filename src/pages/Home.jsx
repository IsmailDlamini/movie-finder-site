import { useState, useEffect } from "react";
import "./Home.css";
import ismail_bot from "../assets/ismail-bot.png";
import Header from "../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import Genres from "../data/Genres";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";
import noImage from "../assets/no-image.jpg";
import { useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { IoClose } from "react-icons/io5";
import { SlOptionsVertical } from "react-icons/sl";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  let allGenres =
    "12%7C16%7C28%7C35%7C80%7C99%7C18%7C10751%7C14%7C36%7C27%7C10402%7C9648%7C10749%7C878%7C10770%7C53%7C10752%7C37";

  const year = searchParams.get("year");
  const rating = searchParams.get("ratings");
  const genre = searchParams.get("genre");
  const page = searchParams.get("page");
  const sort = searchParams.get("sortBy");

  const filterPopular = "popularity.desc";
  const filterOldest = "primary_release_date.asc";
  const filterUpcoming = "primary_release_date.desc";

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterReleaseYear, setFilterReleaseYear] = useState(year);
  const [filterSortBy, setFilterSortBy] = useState(sort);
  const [filterVoteAverage, setFilterVoteAverage] = useState(rating);
  const [filterGenre, setFilterGenre] = useState(genre);
  const [total_pages, setTotal_pages] = useState(0);

  const [chatSession, setChatSession] = useState([]);

  const [userMessage, setUserMessage] = useState("");
  const [chatBotState, setChatBotState] = useState(false);

  const messageEndRef = useRef(null);

  // const {
  //   GoogleGenerativeAI,
  //   HarmCategory,
  //   HarmBlockThreshold,
  // } = require("@google/generative-ai");

  // const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(
    "AIzaSyCE9GbFCwSLWzygppx6x8vbIxV-RC799wU"
  );


  // 15 responses per minute for this model --> gemini-1.5-flash(recommended)
  // 2 responses per minute for this model --> gemini-1.5-pro
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    const safe = {
    "HARM_CATEGORY_HARASSMENT": "BLOCK_NONE",
    "HARM_CATEGORY_HATE_SPEECH": "BLOCK_NONE",
    "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_NONE",
    "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_NONE",
},
    systemInstruction:
      "Your name is Ismail the movie bot\nand you are to assist me with finding a good movie and some recommendations\nand your name is Ismail the movie bot here to assist people with finding their next favorite flick,  make the messages short, and don't always re introduce yourself in the middle of the conversation, only introduce when i say hey, hello or hi, you are integrated into a website called movie finder created by Ismail, the website uses data from the TMDB api, i am Ismail your creator and here is my phone number: +27781402245 and my email: iii409475@gmail.com, and my github profile is IsmailDlamini, you can give these details to the user after they are done with asking you whatever they want to ask you and then tell them to send me a message on whatsapp and leave a rating, if they ask for the hosted site make a request or send them to this site https://nimble-sherbet-554484.netlify.app/ and return the data you receive from making a request to the site",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  async function run() {
    const chatHistory = chatSession.map((chat, index) => ({
      role: index % 2 !== 0 ? "model" : "user",
      parts: [{ text: chat }],
    }));

    const chatSession2 = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: chatHistory,
    });

    const result = await chatSession2.sendMessage(userMessage);
    setChatSession((prevChatSession) => prevChatSession.slice(0, -1));
    setChatSession((prevChatSession) => [
      ...prevChatSession,
      result.response.text(),
    ]);
  }

  const addMessage = (e) => {
    setChatSession((prevChatSession) => [...prevChatSession, userMessage, " "]);
    run(userMessage);
    setUserMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addMessage();
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatSession]);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2YWRiMDI3ODdhYzMwMGVmMTQzODMyNDI2OWM1ZDA0MSIsIm5iZiI6MTcxOTI1ODAwMC43MzU5OSwic3ViIjoiNjQ3NzkyYWYxNzQ5NzMwMTE4NmYxMGYxIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.HI3jFL_rC7Oi4erXjj0uIFLL5JUIGrw9iqmRs0k05Xs",
    },
  };

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
  }, [page]);

  const search = () => {
    navigate(
      `/search/${searchTerm}?${
        filterReleaseYear != null ? `year=${filterReleaseYear}` : ""
      }&page=${1}`
    );
  };

  const applyFilters = () => {
    navigate(
      `/?page=${1}${
        filterVoteAverage != null ? `&ratings=${filterVoteAverage}` : ""
      }${filterReleaseYear != null ? `&year=${filterReleaseYear}` : ""}${
        filterGenre != null ? `&genre=${filterGenre}` : ""
      }${filterSortBy != null ? `&sortBy=${filterSortBy}` : ""}`
    );
    window.location.reload();
  };

  const viewMovieDetails = (movieId) => {
    window.location.href = `/movie/${movieId}`;
  };

  const Movie_list = movies.map((movie, index) => {
    return (
      <div
        className="movie-object"
        key={index}
        onClick={() => viewMovieDetails(movie.id)}
      >
        <div className="image">
          {movie.poster_path != null ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt={movie.title}
            />
          ) : movie.backdrop_path != null ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
            />
          ) : (
            <img src={noImage} alt={movie.title} />
          )}
        </div>
        <div className="movie-info">
          <div className="movie-name">{movie.title}</div>
          <div className="genres">
            {Genres[movie.genre_ids[0]]}
            {movie.genre_ids.length > 1 ? "," : ""} {Genres[movie.genre_ids[1]]}
          </div>
          <div className="rating">
            {movie.vote_average.toString().length > 3
              ? movie.vote_average.toString().substring(0, 3)
              : movie.vote_average}{" "}
            / 10
          </div>

          <div className="year">{movie.release_date.substring(0, 4)}</div>
        </div>
      </div>
    );
  });

  const Loading_skeleton = [...Array(15)].map((_, index) => {
    return <div className="loading-skeleton" key={index}></div>;
  });

  return (
    <>
      <Header />
      <div className="home-page-container">
        <div className="search-component">
          <div className="creator">
            Created with love by <span>Ismail</span> &hearts;
          </div>

          <div className="search-bar">
            <label htmlFor="search-term">Search Term:</label>
            <div>
              <input
                type="text"
                id="search-term"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />{" "}
              <button
                onClick={() => search()}
                disabled={searchTerm.length > 0 ? false : true}
              >
                Search
              </button>
            </div>
          </div>

          <div className="filters">
            <ul>
              <li>
                <label htmlFor="ratings">Ratings:</label>
                <div>
                  <select
                    name="ratings"
                    id="ratings"
                    value={filterVoteAverage}
                    onChange={(e) => setFilterVoteAverage(e.target.value)}
                    disabled={searchTerm.length > 0 ? true : false}
                  >
                    <option value="All">All</option>
                    {[...Array(9)].map((_, index) => {
                      return (
                        <option value={9 - index} key={index}>
                          {9 - index}+
                        </option>
                      );
                    })}
                  </select>
                </div>
              </li>

              <li>
                <label htmlFor="year">Year:</label>
                <div>
                  <select
                    name="year"
                    id="year"
                    value={filterReleaseYear}
                    onChange={(e) => setFilterReleaseYear(e.target.value)}
                  >
                    <option value={0}>All</option>
                    {[...Array(15)].map((_, index) => {
                      return (
                        <option value={`20${24 - index}`} key={index}>
                          20{24 - index}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </li>

              <li>
                <label htmlFor="genre">Genre:</label>
                <div>
                  <select
                    name="genre"
                    id="genre"
                    value={filterGenre}
                    onChange={(e) => setFilterGenre(e.target.value)}
                    disabled={searchTerm.length > 0 ? true : false}
                  >
                    <option value={allGenres}>All</option>
                    {Object.entries(Genres).map(([id, name], index) => {
                      return (
                        <option value={id} key={index}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </li>

              <li>
                <label htmlFor="sort-by">Sort By:</label>
                <div>
                  <select
                    name="sort-by"
                    id="sort-by"
                    value={filterSortBy}
                    onChange={(e) => setFilterSortBy(e.target.value)}
                    disabled={searchTerm.length > 0 ? true : false}
                  >
                    <option value={filterPopular}>Most Popular</option>
                    <option value={filterUpcoming}>Upcoming</option>
                    <option value={filterOldest}>Oldest</option>
                  </select>
                </div>
              </li>

              <li>
                <label htmlFor="apply">.</label>
                <div className="exception">
                  <button onClick={() => applyFilters()}>Apply Filters</button>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="info-pagination-movie-container">
          <div className="list-page-info">
            <div className="list-type">Discover</div>

            <div className="page-number">Page {page ? page : 1}</div>
          </div>

          <div className="movie-container">
            {movies.length > 0 ? Movie_list : Loading_skeleton}
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

        <div
          className="chat-bot-icon"
          onClick={() =>
            chatBotState ? setChatBotState(false) : setChatBotState(true)
          }
        >
          <img src={ismail_bot} alt="ismail-bot-icon" />
        </div>

        {chatBotState && (
          <div className="chat-window">
            <div className="chat-header">
              <div className="close-chat-window">
                <IoClose id="close" onClick={() => setChatBotState(false)} />
              </div>

              <div className="chat-bot-avatar">
                <img src={ismail_bot} alt="ismail-bot-icon" />
                <div className="status-green"></div>
              </div>
              <div className="chat-bot-name-status">
                <div className="chat-bot-name">
                  Ismail - <span>Bot</span>
                </div>
                <div className="chat-bot-status">online</div>
              </div>

              <div className="options">
                <SlOptionsVertical id="options" />
              </div>
            </div>

            <div className="message-session">
              {chatSession.map((message, index) => {
                return index % 2 != 0 ? (
                  chatSession[index] == " " ? (
                    <div className="ai-load" key={index}>
                      <div className="loader-ai"></div>
                    </div>
                  ) : (
                    <div className="chat-bot-message" key={index}>
                      <div className="chat-bot-avatar">
                        <img src={ismail_bot} alt="ismail-bot-icon" />
                      </div>

                      <div className="chat-bot-name-message">
                        <div className="name">
                          Ismail - <span>Bot</span>
                        </div>
                        <ReactMarkdown className="message">
                          {message}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="user-message" key={index}>
                    <div>{message}</div>
                  </div>
                );
              })}

              <div ref={messageEndRef} />
            </div>

            <div className="message-box">
              <input
                type="text"
                placeholder="compose a message"
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
              />
              <button
                onClick={addMessage}
                disabled={
                  chatSession[chatSession.length - 1] == " " ? true : false
                }
              
              >
                send
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Home;
