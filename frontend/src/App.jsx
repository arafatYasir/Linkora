import { Outlet, Route, Routes } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<div>This is common component <Outlet /></div>}>
          <Route path="/registration" element={<RegistrationPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;