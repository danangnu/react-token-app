import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import RequireAuth from "./components/RequireAuth";
import ProtectedLayout from "./layouts/ProtectedLayout";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout"; // Optional
import Forbidden403 from "./pages/Forbidden403";
import NotFound404 from "./pages/NotFound404";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import IssueToken from "./pages/IssueToken";
import MyTokens from "./pages/MyTokens";
import TransferToken from "./pages/TransferToken";
import Inbox from "./pages/Inbox";
import RequireAdmin from "./components/RequireAdmin";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./pages/UserManagement";
import TokenMonitor from "./pages/TokenMonitor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected User Pages */}
        <Route
          element={
            <RequireAuth>
              <ProtectedLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/issue" element={<IssueToken />} />
          <Route path="/my-tokens" element={<MyTokens />} />
          <Route path="/transfer" element={<TransferToken />} />
          <Route path="/inbox" element={<Inbox />} />

        </Route>

        {/* Optional Admin-Only Pages */}
        <Route
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route path="/admin" element={<AdminPanel />} />
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="tokens" element={<TokenMonitor />} />
        </Route>
        <Route path="/403" element={<Forbidden403 />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
