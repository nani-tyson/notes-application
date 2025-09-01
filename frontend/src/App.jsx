import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      {/* default redirect to signin */}
      <Route path="/" element={<Navigate to="/signin" replace />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/notes" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
