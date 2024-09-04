import { creatContext, useContext } from "react"
import { useLocation } from "react-router-dom";


const MyContext = creatContext();


export const useMyContext = () => {
    const context = useContext(MyContext); // assigning context values to the context value
    return context;
}


export const MyContextProvider = () => {

    const searchParams = new URLSearchParams(location.search);

    const page = searchParams.get("page");

    const [discoverMovies, setDiscoverMovies] = useState(); 
    const [searchMovies, setSearchMovies] = useState();
    const [trendingMovies, setTrendingMovies] = useState();

    useEffect(() => {
        
      }, []);



    

    const contextValues = {

    }


    return(<MyContext.Provider values={}>{chidren}</MyContext.Provider>)
}




export default MyContext











