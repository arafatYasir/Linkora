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

const App = () => {

  return (
    <>
      <Routes>
        <Route element={<UserLoggedIn />}>
          <Route path="/" element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/profile/:username" element={<UserProfilePage />} />
        </Route>

        <Route element={<UserNotLoggedIn />}>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify/:token" element={<VerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;