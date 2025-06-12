import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Import the Layout component
import LoginPage from './pages/Login';
import BookListPage from './pages/BookList'; // Import the new page

function App() {
  return (
    <Routes>
      {/* Route that does NOT use the layout */}
      <Route path="/login" element={<LoginPage />} />

      {/* Routes that USE the layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<BookListPage />} />
        {/* Add other pages that should have the navbar here */}
        {/* <Route path="/students" element={<StudentsPage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
