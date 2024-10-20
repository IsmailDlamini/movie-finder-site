import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";

const MyContext = createContext();

export const useMyContext = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};

export const MyContextProvider = ({ children }) => {
  const location = useLocation();
  const { timeFrame } = useParams();

  const searchParams = new URLSearchParams(location.search);

  const query = searchParams.get("query");
  const year = searchParams.get("year");
  const rating = searchParams.get("ratings");
  const genre = searchParams.get("genre");
  const page = searchParams.get("page");
  const sort = searchParams.get("sortBy");

  const [discoveryData, setDiscoveryData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [trendingData, setTrendingData] = useState([]);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_AUTHORIZATION_TOKEN}`,
    },
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [
          discoveryDataResponse,
          searchDataResponse,
          trendingDataResponse,
        ] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page || 1}${
              year ? `&primary_release_year=${year}` : ""
            }${sort ? `&sort_by=${sort}` : ""}${
              rating ? `&vote_average.gte=${rating}` : ""
            }${genre ? `&with_genres=${genre}` : ""}`,
            options
          ),

          location.pathname.includes("search")
            ? fetch(
                `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US${
                  year ? `&primary_release_year=${year}` : ""
                }&page=${page || 1}`,
                options
              )
            : Promise.resolve(new Response('{}')),

          location.pathname.includes("trending")
            ? fetch(
                `https://api.themoviedb.org/3/trending/movie/${
                  timeFrame == "today" ? "day" : "week"
                }?language=en-US&page=${page || 1}`,
                options
              )
            : Promise.resolve(new Response('{}')),
        ]);

        const discoveryData = (await discoveryDataResponse.json()).results || [];
        const searchData = query
          ? (await searchDataResponse.json()).results || []
          : [];
        const trendingData = location.pathname.includes("trending")
          ? (await trendingDataResponse.json()).results || []
          : [];

        setDiscoveryData(discoveryData);
        setSearchData(searchData);
        setTrendingData(trendingData);
      } catch (err) {
        console.error("An error occurred: ", err);
      }
    };

    //console.log(timeFrame)

    fetchMovieData();
  }, [page, year, rating, genre, sort, query, location.pathname, timeFrame]);

  const contextValues = {
    discoveryData,
    searchData,
    trendingData,
  };

  return (
    <MyContext.Provider value={contextValues}>{children}</MyContext.Provider>
  );
};
