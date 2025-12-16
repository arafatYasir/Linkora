import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserLoggedIn from "./components/UserLoggedIn";
import UserNotLoggedIn from "./components/UserNotLoggedIn";
import VerificationPage from "./pages/VerificationPage";
import ForgotPassword from "./pages/ForgotPassword";
import RootLayout from "./components/layouts/RootLayout";
import UserProfilePage from "./pages/UserProfilePage";
import ProfileLayout from "./components/layouts/ProfileLayout";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify"

const App = () => {
  const { theme } = useSelector(state => state.auth);

  useEffect(() => {
    const body = document.querySelector("body");

    if (theme === "dark") {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }, [theme]);

  return (
    <>
      <Routes>
        <Route element={<UserLoggedIn />}>
          <Route path="/" element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:postId" element={<HomePage />} />
          </Route>
          <Route path="/profile" element={<ProfileLayout />}>
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/profile/:username" element={<UserProfilePage />} />
          </Route>
        </Route>

        <Route element={<UserNotLoggedIn />}>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify/:token" element={<VerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
    </>
  )
}

export default App;