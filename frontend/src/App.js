// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ExplorePage from "./pages/ExplorePage";
import WishlistPage from "./pages/WishlistPage";
import SidebarProfile from "./pages/Sidebar/Profile";
import SidebarCourses from "./pages/Sidebar/Courses";
import SidebarWishList from "./pages/Sidebar/WishList";
import SidebarReport from "./pages/Sidebar/Report";
import SidebarGettingStarted from "./pages/Sidebar/GettingStarted";
import SidebarSettings from "./pages/Sidebar/Settings";

import "./style.css";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/login" element={<LoginPage />} />

    <Route
      path="/dashboard"
      element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      }
    />
    <Route
      path="/explore"
      element={
        <PrivateRoute>
          <ExplorePage />
        </PrivateRoute>
      }
    />
    <Route
      path="/wishlist"
      element={
        <PrivateRoute>
          <WishlistPage />
        </PrivateRoute>
      }
    />
    //adding routes for sidebar pages
    <Route
      path="/sidebar/profile"
      element={
        <PrivateRoute>
          <SidebarProfile />
        </PrivateRoute>
      }
    />
    <Route
      path="/sidebar/courses"
      element={
        <PrivateRoute>
          <SidebarCourses />
        </PrivateRoute>
      }
    />
    <Route
      path="/sidebar/wish-list"
      element={
        <PrivateRoute>
          <SidebarWishList />
        </PrivateRoute>
      }
    />
    <Route
      path="/sidebar/report"
      element={
        <PrivateRoute>
          <SidebarReport />
        </PrivateRoute>
      }
    />
    <Route
      path="/sidebar/getting-started"
      element={
        <PrivateRoute>
          <SidebarGettingStarted />
        </PrivateRoute>
      }
    />
    <Route
      path="/sidebar/settings"
      element={
        <PrivateRoute>
          <SidebarSettings />
        </PrivateRoute>
      }
    />

    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;






// import './App.css';
// function App() {
//   return (
//     <>
//     <h1>hello react</h1>
//     </>
//   );
// }

// export default App;
