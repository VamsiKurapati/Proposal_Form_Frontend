import { Routes, Route, Navigate } from 'react-router-dom';

import { lazy, Suspense, useEffect } from "react";
import CanvaApp from './pages/CanvaApp';
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

const SuperAdmin = lazy(() => import("./Super_Admin/SuperAdmin"));

const App = () => {
  const { role } = useUser();

  useEffect(() => {
    console.log("Role in App: ", role);
  }, [role]);

  return (
    <>
    
      <Suspense fallback={<></>}>
        <Routes>
          <Route path="/" element={role === null ? <Home /> : <Navigate to="/dashboard" replace />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign_up" element={<SignUpPage />} />
          <Route path="/create-profile" element={<ProfileForm />} />

          <Route path="/rfp_discovery" element={<ProtectedRoutes allowedRoles={["company", "Editor", "Viewer"]}>
            <RFPDiscovery />
          </ProtectedRoutes>} />

          {/* <Route path="/rfp_discovery" element={<RFPDiscovery />} /> */}

          <Route path="/proposals" element={<ProtectedRoutes allowedRoles={["company", "Editor", "Viewer"]}>
            <Proposals />
          </ProtectedRoutes>} />

          <Route path="/proposal_page" element={
            <ProtectedRoutes allowedRoles={["company", "Editor", "Viewer"]}>
              <GenerateProposalPage />
            </ProtectedRoutes>
          } />
          <Route path="/basic-compliance-check" element={<ProtectedRoutes allowedRoles={["company", "Editor", "Viewer"]}>
            <BasicComplianceCheck />
          </ProtectedRoutes>} />
          <Route path="/advanced-compliance-check" element={<ProtectedRoutes allowedRoles={["company", "Editor", "Viewer"]}>
            <AdvancedComplianceCheck />
          </ProtectedRoutes>} />

          <Route path="/dashboard" element={
            <ProtectedRoutes allowedRoles={["company", "Editor", "Viewer"]}>
              <Dashboard />
            </ProtectedRoutes>
          } />
          {/* <Route path="/dashboard" element={ Dashboard } /> */}

          <Route path="/company_profile_dashboard" element={
            <ProtectedRoutes allowedRoles={["company"]}>
              <CompanyProfileDashboard />
            </ProtectedRoutes>
          } />
          <Route path="/company-profile-update" element={
            <ProtectedRoutes allowedRoles={["company"]}>
              <CompanyProfileUpdate />
            </ProtectedRoutes>
          } />

          <Route path="/employee_profile_dashboard" element={
            <ProtectedRoutes allowedRoles={["Editor", "Viewer"]}>
              <EmployeeProfileDashboard />
            </ProtectedRoutes>
          } />
          <Route path="/employee-profile-update" element={
            <ProtectedRoutes allowedRoles={["Editor", "Viewer"]}>
              <EmployeeProfileUpdate />
            </ProtectedRoutes>
          } />

          <Route path="/canva" element={<CanvaApp />} />

          <Route path="/super-admin" element={<SuperAdmin />} />

          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
