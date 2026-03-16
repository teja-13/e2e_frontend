import { Routes, Route } from "react-router-dom";

// public
import StudentLogin from "./pages/public/StudentLogin";
import StudentSignupRequest from "./pages/public/StudentSignupRequest";

// student
import StudentLayout from "./components/student/StudentLayout";
import Dashboard from "./pages/student/Dashboard";
import BookSearch from "./pages/student/BookSearch";
import MyBooks from "./pages/student/MyBooks";
import Settings from "./pages/student/settings/Settings";

// librarian
import LibrarianLogin from "./pages/librarian/LibrarianLogin";
import LibrarianSignupRequest from "./pages/librarian/LibrarianSignupRequest";
import LibrarianLayout from "./components/librarian/LibrarianLayout";
import LibrarianDashboard from "./pages/librarian/LibrarianDashboard";
import ManageBooks from "./pages/librarian/ManageBooks";
import ManageStudents from "./pages/librarian/ManageStudents";
import Reservations from "./pages/librarian/Reservations";
import Borrowed from "./pages/librarian/Borrowed";

// admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminManageBooks from "./pages/admin/ManageBooks";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentLogin />} />
      <Route path="/request-signup" element={<StudentSignupRequest />} />

      <Route path="/student" element={<StudentLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="books/search" element={<BookSearch />} />
        <Route path="my-books" element={<MyBooks />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="/librarian/login" element={<LibrarianLogin />} />
      <Route path="/librarian/request-signup" element={<LibrarianSignupRequest />} />

      <Route path="/librarian" element={<LibrarianLayout />}>
        <Route path="dashboard" element={<LibrarianDashboard />} />
        <Route path="books" element={<ManageBooks />} />
        <Route path="students" element={<ManageStudents />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="borrowed" element={<Borrowed />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="books" element={<AdminManageBooks />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
    </Routes>
  );
}

export default App;