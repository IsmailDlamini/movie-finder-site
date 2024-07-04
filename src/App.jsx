import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import './App.css';
import Search from './pages/Search';
import Trending from './pages/Trending';
import Movie from './pages/Movie';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/movie/:id" element={<Movie />}/>
      </Routes>
    </Router>
  );
}

export default App;
