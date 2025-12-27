'use client';

interface TableData {
  id: string;
  headers: string[];
  rows: string[][];
}

interface TableEditorProps {
  table: TableData;
  onUpdate: (table: TableData) => void;
  onDelete: () => void;
}

export default function TableEditor({ table, onUpdate, onDelete }: TableEditorProps) {
  const handleHeaderChange = (index: number, value: string) => {
    const newHeaders = [...table.headers];
    newHeaders[index] = value;
    onUpdate({ ...table, headers: newHeaders });
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...table.rows];
    newRows[rowIndex][colIndex] = value;
    onUpdate({ ...table, rows: newRows });
  };

  const handleAddRow = () => {
    const newRow = Array(table.headers.length).fill('');
    onUpdate({ ...table, rows: [...table.rows, newRow] });
  };

  const handleDeleteRow = (rowIndex: number) => {
    onUpdate({ ...table, rows: table.rows.filter((_, i) => i !== rowIndex) });
  };

  const handleAddColumn = () => {
    const newHeaders = [...table.headers, `Kolumn ${table.headers.length + 1}`];
    const newRows = table.rows.map(row => [...row, '']);
    onUpdate({ ...table, headers: newHeaders, rows: newRows });
  };

  const handleDeleteColumn = (colIndex: number) => {
    if (table.headers.length <= 1) return;
    const newHeaders = table.headers.filter((_, i) => i !== colIndex);
    const newRows = table.rows.map(row => row.filter((_, i) => i !== colIndex));
    onUpdate({ ...table, headers: newHeaders, rows: newRows });
  };

  return (
    <div className="border border-gray-300 rounded-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-700">Tabell</h3>
        <div className="space-x-2">
          <button
            onClick={handleAddColumn}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            + Kolumn
          </button>
          <button
            onClick={handleAddRow}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
          >
            + Rad
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
          >
            Ta bort tabell
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {table.headers.map((header, index) => (
                <th key={index} className="border border-gray-300 p-2 bg-gray-100">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => handleHeaderChange(index, e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    {table.headers.length > 1 && (
                      <button
                        onClick={() => handleDeleteColumn(index)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 p-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      {colIndex === row.length - 1 && (
                        <button
                          onClick={() => handleDeleteRow(rowIndex)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
