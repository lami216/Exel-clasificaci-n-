const isNumericLike = (value) => {
  if (value === null || value === undefined) return false;
  const str = String(value).trim();
  if (!str) return false;
  return /^[-+]?\d+(\.\d+)?([*xX]\d+)?$/.test(str);
};

const normalize = (value) => String(value ?? '').trim();

export const scoreHeaderRow = (rowValues) => {
  const values = rowValues.map(normalize);
  const nonEmpty = values.filter(Boolean);
  if (!nonEmpty.length) return -999;

  let textLike = 0;
  let numericLike = 0;
  let keywordHits = 0;
  const keywords = ['name', 'price', 'qty', 'pcs', 'picture', 'photo', 'cbm', 'kg', 'no', 'رقم', 'السعر', 'الشحن'];

  nonEmpty.forEach((cell) => {
    if (isNumericLike(cell)) numericLike += 1;
    else textLike += 1;

    const lower = cell.toLowerCase();
    if (keywords.some((k) => lower.includes(k))) keywordHits += 1;
  });

  if (numericLike >= textLike && numericLike >= 3) return -20;

  return textLike * 2 + keywordHits * 4 - numericLike;
};

export const detectHeaderRow = (rows, scanLimit = 25) => {
  const candidates = rows.slice(0, scanLimit).map((row, idx) => ({
    rowIndex: idx + 1,
    score: scoreHeaderRow(row),
    row,
  }));
  candidates.sort((a, b) => b.score - a.score);
  return {
    detectedHeaderRow: candidates[0]?.rowIndex || 1,
    candidates: candidates.slice(0, 5),
  };
};
