import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';

export const UserTableRow = ({ user, onView, onEdit, onDelete }) => {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 text-sm text-gray-800">{user.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
            <td className="px-6 py-4 text-sm text-gray-500 font-mono text-xs">{user.id}</td>
            <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => onView(user.email)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View"
                        aria-label={`View ${user.name}`}
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onEdit(user)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit"
                        aria-label={`Edit ${user.name}`}
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onDelete(user.email)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                        aria-label={`Delete ${user.name}`}
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
};