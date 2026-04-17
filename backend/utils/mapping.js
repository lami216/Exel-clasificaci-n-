import { INTERNAL_SCHEMA } from './schema.js';

const rules = [
  { key: 'NAME', words: ['name', 'item', 'product', 'اسم'] },
  { key: 'PRICE', words: ['price', 'unit'] },
  { key: 'PCS', words: ['pcs', 'qty', 'quantity', 'ctn'] },
  { key: 'CARTON_QTY', words: ['carton', 'inner', 'pack'] },
  { key: 'TOTAL_PRICE', words: ['total', 'amount'] },
  { key: 'PICTURE', words: ['picture', 'image', 'photo'] },
  { key: 'NO', words: ['no', 'serial', 'row'] },
  { key: 'cbm', words: ['cbm'] },
  { key: 'cbms', words: ['cbms'] },
  { key: 'kg', words: ['kg'] },
  { key: 'kgs', words: ['kgs'] },
  { key: 'السعر بالاوقية', words: ['الاوقية'] },
  { key: 'نسبة المكتب', words: ['المكتب'] },
  { key: 'الشحن', words: ['الشحن'] },
  { key: 'سعر الطياح', words: ['الطياح'] },
];

export const suggestMapping = (headers) => {
  const map = {};
  INTERNAL_SCHEMA.forEach((schemaCol) => {
    map[schemaCol] = null;
  });

  headers.forEach((header) => {
    const val = String(header || '').toLowerCase();
    const rule = rules.find((r) => r.words.some((w) => val.includes(w)));
    if (rule && !map[rule.key]) map[rule.key] = header;
  });

  return map;
};
