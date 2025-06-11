import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import ProposalForm from './pages/ProposalForm';
import EditProposalPage from './pages/EditProposalPage';
import CreateProposalPage from './pages/CreateProposalPage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/proposal/new" element={<CreateProposalPage />} />
      <Route path="/proposal/:id/edit" element={<EditProposalPage />} />
      <Route path="*" element={<ProfilePage />} />
    </Routes>
  </Router>
);

export default App;
