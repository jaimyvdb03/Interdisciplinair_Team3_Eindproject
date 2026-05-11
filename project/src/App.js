import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LessenOverzicht from './pages/LessenOverzicht';
import OefeningenOverzicht from './pages/OefeningenOverzicht';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/lessen"     element={<LessenOverzicht />} />
        <Route path="/oefeningen" element={<OefeningenOverzicht />} />
      </Routes>
    </BrowserRouter>
  );
}
