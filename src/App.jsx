import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { lazy, Suspense } from "react";
import { ProfileProvider } from './context/ProfileContext';

const Home = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const ProfileForm = lazy(() => import("./pages/ProfileForm"));

const RFPDiscovery = lazy(() => import("./pages/RFPDiscovery"));

const Proposals = lazy(() => import("./pages/Proposals"));
const GenerateProposalPage = lazy(() => import("./pages/GenerateProposalPage"));
const BasicComplianceCheck = lazy(() => import("./pages/BasicComplianceCheck"));
const AdvancedComplianceCheck = lazy(() => import("./pages/AdvancedComplianceCheck"));

const CompanyProfileDashboard = lazy(() => import("./pages/CompanyProfileDashboard"));
const CompanyProfileUpdate = lazy(() => import("./pages/CompanyProfileUpdate"));

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
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/sign_up" element={<SignUpPage />} />
        <Route path="/create-profile" element={<ProfileForm />} />

        <Route path="/rfp_discovery" element={<RFPDiscovery />} />

        <Route path="/proposals" element={<Proposals />} />
        <Route path="/proposal_page" element={
          <ProfileProvider>
            <GenerateProposalPage />
          </ProfileProvider>
        } />
        <Route path="/basic-compliance-check" element={<BasicComplianceCheck />} />
        <Route path="/advanced-compliance-check" element={<AdvancedComplianceCheck />} />

        <Route path="/company_profile_dashboard" element={
          <ProfileProvider>
            <CompanyProfileDashboard />
          </ProfileProvider>
        } />
        <Route path="/company-profile-update" element={
          <ProfileProvider>
            <CompanyProfileUpdate />
          </ProfileProvider>
        } />

        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  </Router>
);

export default App;
