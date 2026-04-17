import { useEffect, useState } from 'react';
import api from '../services/api';

const AdminBatchesPage = () => {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    api.get('/import/batches').then((res) => setBatches(res.data));
  }, []);

  return (
    <div className="container">
      <h2>Import History</h2>
      <table>
        <thead><tr><th>File</th><th>Status</th><th>Rows</th><th>Imported</th></tr></thead>
        <tbody>
          {batches.map((b) => (
            <tr key={b._id}>
              <td>{b.originalFileName}</td>
              <td>{b.status}</td>
              <td>{b.totalRowsScanned || '-'}</td>
              <td>{b.totalProductsImported || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBatchesPage;
