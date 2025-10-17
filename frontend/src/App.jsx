import { Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserLoggedIn from "./components/UserLoggedIn";
import UserNotLoggedIn from "./components/UserNotLoggedIn";
import VerificationPage from "./pages/VerificationPage";

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<UserLoggedIn />} >
            <Route path="/" element={<HomePage />} />
          </Route>

          <Route element={<UserNotLoggedIn />}>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify/:token" element={<VerificationPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App;