import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx'; 
import Layout from './components/Layout'; // Import the Layout component
import LoginPage from './pages/Login';
import BookListPage from './pages/BookList'; // Import the new page
import MyCheckoutsPage from './pages/MyCheckoutsPage.jsx'; 

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<BookListPage />} />
          <Route path="/my-borrowed-books" element={<MyCheckoutsPage />} /> {/* 2. Yeni rotayı ekle */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
