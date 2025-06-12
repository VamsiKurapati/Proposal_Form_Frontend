import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import EditProposalPage from './pages/EditProposalPage';
import CreateProposalPage from './pages/CreateProposalPage';

import { lazy } from "react";

const Home = lazy(() => import("./pages/HomePage"));

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home /> } />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/proposal/new" element={<CreateProposalPage />} />
      <Route path="/proposal/:id/edit" element={<EditProposalPage />} />
      <Route path="*" element={<Home />} />
    </Routes>
  </Router>
);

export default App;
