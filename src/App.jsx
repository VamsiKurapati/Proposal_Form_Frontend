import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import EditProposalPage from './pages/EditProposalPage';
import CreateProposalPage from './pages/CreateProposalPage';

import { lazy } from "react";

const Home = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));

{/*
  Inter font is used for the entire website.
  Font weights used:
  100: thin
  200: extra-light
  300: light
  400: regular
  500: medium
  600: semi-bold
  700: bold
  800: extra-bold
*/}

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home /> } />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/proposal/new" element={<CreateProposalPage />} />
      <Route path="/proposal/:id/edit" element={<EditProposalPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign_up" element={<SignUpPage />} />
      <Route path="*" element={<Home />} />
    </Routes>
  </Router>
);

export default App;
