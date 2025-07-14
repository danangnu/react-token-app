import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="p-6 text-red-800">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
