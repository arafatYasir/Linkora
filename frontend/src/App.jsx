import { Outlet, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";

const App = () => {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<div><Outlet /></div>}>
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;