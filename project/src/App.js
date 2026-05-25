import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import LessenOverzicht from './pages/LessenOverzicht';
import OefeningenOverzicht from './pages/OefeningenOverzicht';
import CvMakenLes from './pages/lessen/CvMakenLes';
import SollicitatiebriefLes from './pages/lessen/SollicitatiebriefLes';
import KledingGedragLes from './pages/lessen/KledingGedragLes';
import CvMaken from './pages/exercises/CvMaken';
import Sollicitatiebrief from './pages/exercises/Sollicitatiebrief';
import KledingGedrag from './pages/exercises/KledingGedrag';
import VideoLessen from './pages/VideoLessen';
import Hulp from './pages/Hulp';
import './App.css';

export default function App() {
  return (
    <LanguageProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/"                               element={<Home />} />
        <Route path="/lessen"                         element={<LessenOverzicht />} />
        <Route path="/lessen/cv-maken"                element={<CvMakenLes />} />
        <Route path="/lessen/sollicitatiebrief"       element={<SollicitatiebriefLes />} />
        <Route path="/lessen/kleding-gedrag"          element={<KledingGedragLes />} />
        <Route path="/oefeningen"                     element={<OefeningenOverzicht />} />
        <Route path="/oefeningen/cv-maken"            element={<CvMaken />} />
        <Route path="/oefeningen/sollicitatiebrief"   element={<Sollicitatiebrief />} />
        <Route path="/oefeningen/kleding-gedrag"      element={<KledingGedrag />} />
        <Route path="/video"                          element={<VideoLessen />} />
        <Route path="/hulp"                           element={<Hulp />} />
      </Routes>
    </BrowserRouter>
    </LanguageProvider>
  );
}
