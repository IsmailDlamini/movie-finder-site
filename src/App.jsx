import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import Search from './pages/Search';
import Trending from './pages/Trending';
import Movie from './pages/Movie';
import About from './pages/About';
import TvShows from './pages/TvShows'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/trending/:timeFrame" element={<Trending />} />
        <Route path="/movie/:id" element={<Movie />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/tv-shows" element={<TvShows/>}/>
      </Routes>
  );
}

export default App;
