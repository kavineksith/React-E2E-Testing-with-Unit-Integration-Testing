import React from 'react';
import { Users, UserPlus } from 'lucide-react';

export const Header = ({ onAddUser }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-800">User Management System</h1>
        </div>
        <button
          onClick={onAddUser}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>
    </div>
  );
};