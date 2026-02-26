import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

function AdminApp() {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}

export default AdminApp;