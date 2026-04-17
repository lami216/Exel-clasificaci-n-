import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');

  const load = () => api.get('/products', { params: { q } }).then((res) => setProducts(res.data));
  useEffect(() => { load(); }, [q]);

  const save = async (id, name) => {
    await api.patch(`/products/${id}`, { name });
    load();
  };

  const upload = async (id, file) => {
    const fd = new FormData();
    fd.append('image', file);
    await api.post(`/products/${id}/upload-image`, fd);
    load();
  };

  return (
    <div className="container">
      <h2>Manage Products</h2>
      <input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
      {products.map((p) => (
        <div key={p._id} className="admin-product-row">
          <input defaultValue={p.name} onBlur={(e) => save(p._id, e.target.value)} />
          <input type="file" accept="image/*" onChange={(e) => upload(p._id, e.target.files?.[0])} />
        </div>
      ))}
    </div>
  );
};

export default AdminProductsPage;
