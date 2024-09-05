import { creatContext, useContext } from "react"
import { useLocation } from "react-router-dom";

const MyContext = creatContext();

export const useMyContext = () => {
  const context = useContext(MyContext);
  return context;
}

export const MyContextProvider = () => {

  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const year = searchParams.get("year");
  const rating = searchParams.get("ratings");
  const genre = searchParams.get("genre");
  const page = searchParams.get("page");
  const sort = searchParams.get("sortBy");

  const [discoveryData, setDiscoveryData] = useState();
  const [searchData, setSearchData] = useState();
  const [trendingData, setTrendingData] = useState();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        `Bearer ${import.meta.env.VITE_TMDB_AUTHORIZATION_TOKEN}`,
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
            `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page ? page : 1
            }${year ? `&primary_release_year=${year}` : ""}${sort ? `&sort_by=${sort}` : ""
            }${rating ? `&vote_average.gte=${rating}` : ""}${genre ? `&with_genres=${genre}` : ""
            }`,
            options
          ),

          fetch(
            `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US${year ? `&primary_release_year=${year}` : ""
            }&page=${page}`,
            options
          ),


          fetch(
            `https://api.themoviedb.org/3/trending/movie/${timeFrame == "today" ? "day" : "week"
            }?language=en-US&page=${page ? page : 1}`,
            options
          ),
        ]);

        const discoveryData = await searchDataResponse.json();
        const searchData = await searchDataResponse.json();
        const trendingData = await trendingDataResponse.json();

        setDiscoveryData(discoveryData);
        setSearchData(searchData);
        setTrendingData(trendingData);
      } catch (err) {
        console.error("An erro occured: ", err);
      }
    };

    fetchMovieData();
  }, [page]);


  const contextValues = {
    discoveryData,
    searchData,
    trendingData
  }

  return (<MyContext.Provider values={ }>{chidren}</MyContext.Provider>)
}

export default MyContext











