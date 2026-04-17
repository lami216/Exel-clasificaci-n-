import { useState } from 'react';
import { useSelection } from '../context/SelectionContext';
import api from '../services/api';

const SelectionPage = () => {
  const { items, setQuantity, clear } = useSelection();
  const [clientName, setClientName] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const submit = async () => {
    const payload = {
      clientName,
      selectedProducts: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
    };
    const { data } = await api.post('/selections', payload);
    const exported = await api.post(`/selections/${data._id}/export`);
    setDownloadUrl(`${api.defaults.baseURL.replace('/api', '')}${exported.data.generatedExcelUrl}`);
    clear();
  };

  return (
    <div className="container">
      <h2>Selection</h2>
      <input placeholder="Client name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
      {items.map((item) => (
        <div key={item.product._id} className="row">
          <span>{item.product.name}</span>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => setQuantity(item.product, Number(e.target.value) || 1)}
          />
        </div>
      ))}
      <button onClick={submit} disabled={!items.length}>Generate Excel</button>
      {downloadUrl && (
        <p>
          Export ready: <a href={downloadUrl}>Download file</a>
        </p>
      )}
    </div>
  );
};

export default SelectionPage;
