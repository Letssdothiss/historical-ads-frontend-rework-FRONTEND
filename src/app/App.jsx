import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/homePage/HomePage';

function App() {
  return (
    <div className="app-root">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App
