import { useState } from "react";
import RoleSelect from "./components/RoleSelect";
import AdminLogin from "./components/AdminLogin";
import AdminUI from "./components/AdminUI";
import EmployeeUI from "./components/EmployeeUI";
import Preloader from "./components/Preloader";
import SecurityShield from "./components/SecurityShield";
import "./App.css";

function App() {
  const [role, setRole] = useState(null);
  const [adminAuth, setAdminAuth] = useState(true);
  const [loading, setLoading] = useState(true);

  if (loading) {
      return <Preloader onComplete={() => setLoading(false)} />;
  }

  return (
    <>
        <SecurityShield />
        {renderContent()}
    </>
  );

  function renderContent() {
      if (!role) return <RoleSelect setRole={setRole} />;

      if (role === "admin" && !adminAuth)
        return <AdminLogin setAdminAuth={setAdminAuth} />;

      if (role === "admin") return <AdminUI />;

      return <EmployeeUI />;
  }
}

export default App;

