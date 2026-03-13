import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import AdminCashBook from "./AdminCashBook";
import AdminCarousel from "./AdminCarousel";

function AdminApp() {

  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <AdminLogin />;
  }

  const path = window.location.pathname;

  if (path === "/admin/cashbook") {
    return <AdminCashBook />;
  }

  if (path === "/admin/carousel") {
    return <AdminCarousel />;
  }

  return <AdminDashboard />;
}

export default AdminApp;