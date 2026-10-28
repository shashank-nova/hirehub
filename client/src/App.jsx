import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './layouts/Layout';
import PublicLayout from './layouts/PublicLayout';

// Public pages
import LandingPage from './pages/public/LandingPage';
import BrowseJobs from './pages/public/BrowseJobs';
import JobDetails from './pages/public/JobDetails';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import NotFound from './pages/public/NotFound';

// Candidate pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateProfile from './pages/candidate/CandidateProfile';
import MyApplications from './pages/candidate/MyApplications';
import SavedJobs from './pages/candidate/SavedJobs';
import Notifications from './pages/candidate/Notifications';

// Recruiter pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import CompanyProfile from './pages/recruiter/CompanyProfile';
import CreateJob from './pages/recruiter/CreateJob';
import ManageJobs from './pages/recruiter/ManageJobs';
import JobApplications from './pages/recruiter/JobApplications';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import JobModeration from './pages/admin/JobModeration';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="jobs" element={<BrowseJobs />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Protected routes with sidebar layout */}
        <Route path="/" element={<Layout />}>
          {/* Candidate routes */}
          <Route path="candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="candidate/profile" element={<CandidateProfile />} />
          <Route path="candidate/applications" element={<MyApplications />} />
          <Route path="candidate/saved-jobs" element={<SavedJobs />} />
          <Route path="candidate/notifications" element={<Notifications />} />

          {/* Recruiter routes */}
          <Route path="recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="recruiter/company" element={<CompanyProfile />} />
          <Route path="recruiter/jobs/create" element={<CreateJob />} />
          <Route path="recruiter/jobs/manage" element={<ManageJobs />} />
          <Route path="recruiter/jobs/:id/applications" element={<JobApplications />} />

          {/* Admin routes */}
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/users" element={<UserManagement />} />
          <Route path="admin/jobs" element={<JobModeration />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
