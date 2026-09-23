/**
 * Utility to download tabular data as a clean CSV file.
 * Includes UTF-8 BOM (\uFEFF) so Microsoft Excel on Windows parses it correctly.
 */
export function downloadCSV(filename: string, rows: (string | number | null | undefined)[][]) {
  const processRow = (row: (string | number | null | undefined)[]) => {
    return row
      .map((val) => {
        if (val === null || val === undefined) return '""';
        let stringVal = String(val);
        // Escape existing quotes
        stringVal = stringVal.replace(/"/g, '""');
        // Wrap in quotes if it contains comma, quote, or newline
        if (stringVal.search(/("|,|\n)/g) >= 0 || stringVal.includes('\r')) {
          stringVal = `"${stringVal}"`;
        }
        return stringVal;
      })
      .join(',');
  };

  const csvContent = '\uFEFF' + rows.map(processRow).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
