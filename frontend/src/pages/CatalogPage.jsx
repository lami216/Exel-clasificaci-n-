import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/products', { params: { q: search } }).then((res) => setProducts(res.data));
  }, [search]);

  return (
    <div className="container">
      <h2>Product Catalog</h2>
      <input placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="grid">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
    </div>
  );
};

export default CatalogPage;
