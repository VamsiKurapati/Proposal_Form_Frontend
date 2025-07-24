import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { lazy, Suspense } from "react";
import { ProfileProvider } from './context/ProfileContext';
import { UserProvider } from './context/UserContext';

const ProtectedRoutes = lazy(() => import('./pages/ProtectedRoutes'));

const Home = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const ProfileForm = lazy(() => import("./pages/ProfileForm"));

const RFPDiscovery = lazy(() => import("./pages/RFPDiscovery"));

const Proposals = lazy(() => import("./pages/Proposals"));
const GenerateProposalPage = lazy(() => import("./pages/GenerateProposalPage"));
const BasicComplianceCheck = lazy(() => import("./pages/BasicComplianceCheck"));
const AdvancedComplianceCheck = lazy(() => import("./pages/AdvancedComplianceCheck"));

const Dashboard = lazy(() => import("./pages/Dashboard"));

const EmployeeProfileDashboard = lazy(() => import("./pages/EmployeeProfileDashboard"));
const EmployeeProfileUpdate = lazy(() => import("./pages/EmployeeProfileUpdate"));
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

const role = localStorage.getItem("role") ? localStorage.getItem("role") : "";

const App = () => (
  <UserProvider>
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={role === "" ? <Home /> : <Dashboard />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign_up" element={<SignUpPage />} />
          <Route path="/create-profile" element={<ProfileForm />} />

          <Route path="/rfp_discovery" element={<ProtectedRoutes allowedRoles={["admin", "editor", "viewer"]}>
            <RFPDiscovery />
          </ProtectedRoutes>} />

          <Route path="/proposals" element={<ProtectedRoutes allowedRoles={["admin", "editor", "viewer"]}>
            <Proposals />
          </ProtectedRoutes>} />

          <Route path="/proposal_page" element={
            <ProtectedRoutes allowedRoles={["admin", "editor", "viewer"]}>
              <ProfileProvider>
                <GenerateProposalPage />
              </ProfileProvider>
            </ProtectedRoutes>
          } />
          <Route path="/basic-compliance-check" element={<ProtectedRoutes allowedRoles={["admin", "editor", "viewer"]}>
            <BasicComplianceCheck />
          </ProtectedRoutes>} />
          <Route path="/advanced-compliance-check" element={<ProtectedRoutes allowedRoles={["admin", "editor", "viewer"]}>
            <AdvancedComplianceCheck />
          </ProtectedRoutes>} />

          <Route path="/dashboard" element={
            <ProtectedRoutes allowedRoles={["admin", "editor", "viewer"]}>
              <ProfileProvider>
                <Dashboard />
              </ProfileProvider>
            </ProtectedRoutes>
          } />

          <Route path="/company_profile_dashboard" element={
            <ProtectedRoutes allowedRoles={["admin"]}>
              <ProfileProvider>
                <CompanyProfileDashboard />
              </ProfileProvider>
            </ProtectedRoutes>
          } />
          <Route path="/company-profile-update" element={
            <ProtectedRoutes allowedRoles={["admin"]}>
              <ProfileProvider>
                <CompanyProfileUpdate />
              </ProfileProvider>
            </ProtectedRoutes>
          } />

          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </Router>
  </UserProvider>
);

export default App;
