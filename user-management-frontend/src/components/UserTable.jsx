import React from 'react';
import { UserTableRow } from './UserTableRow';

export const UserTable = ({ users, loading, onView, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                            <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading && users.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    Loading users...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    No users found. Click Add User to create one.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <UserTableRow
                                    key={user.id}
                                    user={user}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};