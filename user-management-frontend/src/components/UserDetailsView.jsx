import React from 'react';

export const UserDetailsView = ({ user }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                <p className="text-gray-900 font-mono text-sm break-all">{user.id}</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-900">{user.name}</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <p className="text-gray-500 text-sm">Encrypted (hidden for security)</p>
            </div>
        </div>
    );
};
