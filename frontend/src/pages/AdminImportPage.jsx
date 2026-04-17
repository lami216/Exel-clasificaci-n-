import { useState } from 'react';
import api from '../services/api';

const schema = [
  'NO', 'PICTURE', 'NAME', 'CARTON_QTY', 'PCS', 'PRICE', 'TOTAL_PRICE', 'cbm', 'cbms', 'kg', 'kgs', 'السعر بالاوقية', 'نسبة المكتب', 'الشحن', 'سعر الطياح',
];

const AdminImportPage = () => {
  const [file, setFile] = useState(null);
  const [batchId, setBatchId] = useState('');
  const [preview, setPreview] = useState(null);
  const [headerRow, setHeaderRow] = useState(1);
  const [mapping, setMapping] = useState({});
  const [result, setResult] = useState('');

  const upload = async () => {
    const fd = new FormData();
    fd.append('file', file);
    const { data } = await api.post('/import/upload', fd);
    setBatchId(data.batchId);
    const prev = await api.post('/import/preview', { batchId: data.batchId });
    setPreview(prev.data.preview);
    setHeaderRow(prev.data.preview.detectedHeaderRow);
    setMapping(prev.data.preview.mappingSuggestion);
  };

  const confirm = async () => {
    const { data } = await api.post('/import/confirm', { batchId, headerRow: Number(headerRow), mapping });
    setResult(`Imported ${data.importedCount} products`);
  };

  return (
    <div className="container">
      <h2>Excel Import</h2>
      <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0])} />
      <button onClick={upload} disabled={!file}>Upload + Preview</button>
      {preview && (
        <>
          <label>Header row</label>
          <input type="number" value={headerRow} onChange={(e) => setHeaderRow(e.target.value)} />
          <table>
            <thead><tr><th>Fixed Schema</th><th>Uploaded Header</th></tr></thead>
            <tbody>
              {schema.map((col) => (
                <tr key={col}>
                  <td>{col}</td>
                  <td>
                    <select value={mapping[col] || ''} onChange={(e) => setMapping((m) => ({ ...m, [col]: e.target.value || null }))}>
                      <option value="">-- Unmapped --</option>
                      {preview.headers.map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={confirm}>Confirm Import</button>
        </>
      )}
      {result && <p>{result}</p>}
    </div>
  );
};

export default AdminImportPage;
