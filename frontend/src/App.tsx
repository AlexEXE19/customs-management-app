import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LogInPage from "./pages/LogInPage";
import RegisterPage from "./pages/RegisterPage";
import RootPage from "./pages/RootPage";
import DashboardPage from "./pages/DashboardPage";
import SuperDashboardPage from "./pages/SuperDashboardPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootPage />}></Route>
        <Route path="/auth/login" element={<LogInPage />}></Route>
        <Route path="/auth/register" element={<RegisterPage />}></Route>
        <Route path="/dashboard" element={<DashboardPage />}></Route>
        <Route path="/super-dashboard" element={<SuperDashboardPage />}></Route>
      </Routes>
    </Router>
  );
}
