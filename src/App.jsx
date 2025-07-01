import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import EditProposalPage from './pages/EditProposalPage';
import CreateProposalPage from './pages/CreateProposalPage';

import { lazy } from "react";

const Home = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
// const CompanyProfile = lazy(() => import("./pages/CompanyProfile"));
// const UserProfile = lazy(() => import("./pages/UserProfile"));
const CompanyProfileDashboard = lazy(() => import("./pages/CompanyProfileDashboard"));
const RFPDiscovery = lazy(() => import("./pages/RFPDiscovery"));
const GenerateProposalPage = lazy(() => import("./pages/GenerateProposalPage"));
const PDFEditor = lazy(() => import("./pages/PdfEditor"));
// const ProposalPage = lazy(() => import("./pages/ProposalPage"));
const ProfileForm = lazy(() => import("./pages/ProfileForm"));

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
      {/* <Route path="/company_profile" element={<CompanyProfile />} /> */}
      <Route path="/company_profile_dashboard" element={<CompanyProfileDashboard />} />
      <Route path="/rfp_discovery" element={<RFPDiscovery />} />
      <Route path="/proposal_page" element={<GenerateProposalPage />} />
      {/* <Route path="/my_proposals" element={<ProposalPage />} /> */}
      <Route path="/pdf_editor" element={<PDFEditor />} />
      <Route path="*" element={<Home />} />
      <Route path = "/create-profile" element={<ProfileForm />} />
    </Routes>
  </Router>
);

export default App;
