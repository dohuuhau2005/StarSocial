import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Layout & Main Components
import MainLayout from './MainLayout';
import Feed from './Components/Feed';
import Explore from './Components/Explore';
import People from './Components/People';
import Saved from './Components/Saved';
import CreatePost from './Components/CreatePost';
import Profile from './Components/Profile';
import Editprofile from './Components/Editprofile';
import Notification from './Components/Notification';
import EditPostPage from './Components/EditPostPage';
import ChatSettings from './Components/ChatModal';

// Auth Components
import Login from './Login/Login';
import Register from './Login/Register';
import SplashScreen from './Login/plashscreen';

// Admin & Report Handling Components
import AdminPage from './Admin/AdminPage';
import ReportProcessorPage from './HandleReport/ReportProcessorDashboard';
import Blockaccount from './HandleReport/Blockaccount';
import SensitiveKeywordStatistics from './HandleReport/Sensitivekey';
import ReportLayout from './HandleReport/ReportLayout';
import { PopupProvider } from './Components/IsPopup';
import VerifyEmail from "./Components/VerrifyEmail"

const App = () => {
  return (<PopupProvider>
    <Routes>
      {/* Auth routes */}
      <Route path="/Login" element={<Login />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/plashscreen" element={<SplashScreen />} />

      {/* Standalone pages */}
      <Route path="/editprofile" element={<Editprofile />} />
      <Route path="/Notification" element={<Notification />} />
      <Route path="/verify" element={<VerifyEmail />} />

      {/* Admin route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* Report handler routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['admin', 'handle report']}>
            <ReportLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/processor" element={<ReportProcessorPage />} />
        <Route path="/blockaccount" element={<Blockaccount />} />
        <Route path="/keyword-statistics" element={<SensitiveKeywordStatistics />} />
      </Route>

      {/* App routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Feed />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/people" element={<People />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/edit-post/:postId" element={<EditPostPage />} />
        <Route path="/messages" element={<ChatSettings />} />
      </Route>
    </Routes></PopupProvider>
  );
};

export default App;
