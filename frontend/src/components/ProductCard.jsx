import { useState } from 'react';
import { useSelection } from '../context/SelectionContext';

const ProductCard = ({ product }) => {
  const { setQuantity } = useSelection();
  const [qty, setQty] = useState(1);

  return (
    <article className="card">
      <img src={product.picture?.url || 'https://via.placeholder.com/200x140?text=No+Image'} alt={product.name} />
      <h3>{product.name}</h3>
      <p>NO: {product.no || '-'}</p>
      <p>PRICE: {product.price || '-'}</p>
      <p>PCS: {product.pcs || '-'}</p>
      <div className="qty-row">
        <input type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value) || 1)} />
        <button onClick={() => setQuantity(product, qty)}>Select</button>
      </div>
    </article>
  );
};

export default ProductCard;
