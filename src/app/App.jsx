import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/homePage/HomePage';

function App() {
  return (
    <div className="app-root">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App
