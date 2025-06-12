import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout'; // Import the Layout component
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register.jsx';
import BookListPage from './pages/BookList'; // Import the new page
import MyCheckoutsPage from './pages/MyCheckoutsPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import AdminBooksPage from './pages/AdminBooksPage.jsx';
import AdminRoute from './components/AdminRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<BookListPage />} />
          <Route path="/my-borrowed-books" element={<MyCheckoutsPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/books" element={<AdminBooksPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
