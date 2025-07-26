import { Routes, Route } from 'react-router-dom';

import { lazy, Suspense } from "react";
import { ProfileProvider } from './context/ProfileContext';
import { useUser } from './context/UserContext';

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

const Dashboard = lazy(() => import("./pages/Dashboard_1"));

const EmployeeProfileDashboard = lazy(() => import("./pages/EmployeeProfileDashboard"));
const EmployeeProfileUpdate = lazy(() => import("./pages/EmployeeProfileUpdate"));
const CompanyProfileDashboard = lazy(() => import("./pages/CompanyProfileDashboard"));
const CompanyProfileUpdate = lazy(() => import("./pages/CompanyProfileUpdate"));

const App = () => {
  const { role } = useUser();
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={role === "" ? <Home /> : <Dashboard />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign_up" element={<SignUpPage />} />
          <Route path="/create-profile" element={<ProfileForm />} />

          <Route path="/rfp_discovery" element={<ProtectedRoutes allowedRoles={["company", "editor", "viewer"]}>
            <RFPDiscovery />
          </ProtectedRoutes>} />

          <Route path="/proposals" element={<ProtectedRoutes allowedRoles={["company", "editor", "viewer"]}>
            <Proposals />
          </ProtectedRoutes>} />

          <Route path="/proposal_page" element={
            <ProtectedRoutes allowedRoles={["company", "editor", "viewer"]}>
              <ProfileProvider>
                <GenerateProposalPage />
              </ProfileProvider>
            </ProtectedRoutes>
          } />
          <Route path="/basic-compliance-check" element={<ProtectedRoutes allowedRoles={["company", "editor", "viewer"]}>
            <BasicComplianceCheck />
          </ProtectedRoutes>} />
          <Route path="/advanced-compliance-check" element={<ProtectedRoutes allowedRoles={["company", "editor", "viewer"]}>
            <AdvancedComplianceCheck />
          </ProtectedRoutes>} />

          <Route path="/dashboard" element={
            <ProtectedRoutes allowedRoles={["company", "editor", "viewer"]}>
              <ProfileProvider>
                <Dashboard />
              </ProfileProvider>
            </ProtectedRoutes>
          } />
          {/* <Route path="/dashboard" element={<ProfileProvider><Dashboard /></ProfileProvider>} /> */}

          <Route path="/company_profile_dashboard" element={
            <ProtectedRoutes allowedRoles={["company"]}>
              <ProfileProvider>
                <CompanyProfileDashboard />
              </ProfileProvider>
            </ProtectedRoutes>
          } />
          {/* <Route path="/company_profile_dashboard" element={
              <ProfileProvider>
                <CompanyProfileDashboard />
              </ProfileProvider>
          } /> */}

          <Route path="/company-profile-update" element={
            <ProtectedRoutes allowedRoles={["company"]}>
              <ProfileProvider>
                <CompanyProfileUpdate />
              </ProfileProvider>
            </ProtectedRoutes>
          } />

          <Route path="/employee_profile_dashboard" element={
            <ProtectedRoutes allowedRoles={["editor", "viewer"]}>
              <ProfileProvider>
                <EmployeeProfileDashboard />
              </ProfileProvider>
            </ProtectedRoutes>
          } />
          <Route path="/employee-profile-update" element={
            <ProtectedRoutes allowedRoles={["editor", "viewer"]}>
              <ProfileProvider>
                <EmployeeProfileUpdate />
              </ProfileProvider>
            </ProtectedRoutes>
          } />

          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
