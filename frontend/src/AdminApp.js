import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminCashBook from "./AdminCashBook";

function AdminApp() {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <AdminLogin />;
  }

  const path = window.location.pathname;

  if (path === "/admin/cashbook") {
    return <AdminCashBook />;
  }

  return <AdminDashboard />;
}

export default AdminApp;