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

  // parameter data
  const query = searchParams.get("query");
  const year = searchParams.get("year");
  const rating = searchParams.get("ratings");
  const genre = searchParams.get("genre");
  const page = searchParams.get("page");
  const sort = searchParams.get("sortBy");

  // movie data listing from the api calls
  const [discoveryData, setDiscoveryData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [trendingData, setTrendingData] = useState([]);
  const [total_pages, setTotalPages] = useState(0);

  //number of pages in results per request
  const [discoveryPages, setDiscoveryPages] = useState(0);
  const [searchPages, setSearchPages] = useState(0);
  const [trendingPages, setTrendingPages] = useState(0);

  // options for the request to be sent to the api
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
          // check if we are in the main(discovery page) page and make the request if true
          location.pathname == "/" ? 
          fetch(
            `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${
              page || 1
            }${year ? `&primary_release_year=${year}` : ""}${
              sort ? `&sort_by=${sort}` : ""
            }${rating ? `&vote_average.gte=${rating}` : ""}${
              genre ? `&with_genres=${genre}` : ""
            }`,
            options
          ) : Promise.resolve(new Response("{}")),

          // check if we are in the search page and make the request if it is true
          location.pathname.includes("search")
            ? fetch(
                `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US${
                  year ? `&primary_release_year=${year}` : ""
                }&page=${page || 1}`,
                options
              )
            : Promise.resolve(new Response("{}")),

          // check if we are in the trending page and make the request if it is true
          location.pathname.includes("trending")
            ? fetch(
                `https://api.themoviedb.org/3/trending/movie/${
                  location.pathname.includes("today") ? "day" : "week"
                }?language=en-US&page=${page || 1}`,
                options
              )
            : Promise.resolve(new Response("{}")),
        ]);

        const discoveryData = (await discoveryDataResponse.json()) || [];
        const searchData = query ? (await searchDataResponse.json()) || [] : [];
        const trendingData = location.pathname.includes("trending")
          ? (await trendingDataResponse.json()) || []
          : [];

        // collect movie listings
        setDiscoveryData(discoveryData.results);
        setSearchData(searchData.results);
        setTrendingData(trendingData.results);

        // collect the total number of pages per request
        setDiscoveryPages(discoveryData.total_pages);
        setSearchPages(searchData.total_pages);
        setTrendingPages(trendingData.total_pages);

      } catch (err) {
        console.error("An error occurred while fetching movie data: ", err);
      }
    };

    fetchMovieData();
  }, [page, year, rating, genre, sort, query, location.pathname, timeFrame]);

  // values to be exported to children of context
  const contextValues = {
    discoveryData,
    searchData,
    trendingData,
    discoveryPages,
    searchPages,
    trendingPages,
    page,
    timeFrame
  };

  // Further improvements to be made to the code for efficiency

  return (
    <MyContext.Provider value={contextValues}>{children}</MyContext.Provider>
  );
};
