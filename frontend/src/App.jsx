import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import CatalogPage from './pages/CatalogPage';
import SelectionPage from './pages/SelectionPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminImportPage from './pages/AdminImportPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminBatchesPage from './pages/AdminBatchesPage';

const App = () => (
  <>
    <NavBar />
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/selection" element={<SelectionPage />} />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/import" element={<AdminImportPage />} />
      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/batches" element={<AdminBatchesPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </>
);

export default App;
