import React from 'react';

const Table = ({ columns, data, onRowClick }) => {
    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm bg-white">
            <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50/50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-50">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-12 text-center text-slate-400 font-medium"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-3xl opacity-50">📂</span>
                                    <span>No records found in this view</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={`transition-colors ${onRowClick ? 'hover:bg-indigo-50/30 cursor-pointer' : ''}`}
                            >
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-600">
                                        {column.render ? column.render(row) : (
                                            <span className="text-slate-900 font-semibold">{row[column.accessor]}</span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
