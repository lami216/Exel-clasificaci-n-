import { Link } from 'react-router-dom';

const AdminDashboardPage = () => (
  <div className="container">
    <h2>Admin Dashboard</h2>
    <div className="admin-links">
      <Link to="/admin/import">Import Excel</Link>
      <Link to="/admin/products">Manage Products</Link>
      <Link to="/admin/batches">Import Batches</Link>
    </div>
  </div>
);

export default AdminDashboardPage;
