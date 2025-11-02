import React from 'react';

export const UserForm = ({ formData, formErrors, mode, loading, onInputChange, onSubmit, onCancel }) => {
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={onInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder="Enter full name"
                />
                {formErrors.name && (
                    <p className="text-red-500 text-sm mt-1" role="alert">{formErrors.name}</p>
                )}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={onInputChange}
                    disabled={mode === 'edit'}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${mode === 'edit' ? 'bg-gray-100 cursor-not-allowed' : ''
                        } ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="user@example.com"
                />
                {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1" role="alert">{formErrors.email}</p>
                )}
                {mode === 'edit' && (
                    <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
                )}
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password {mode === 'create' && <span className="text-red-500">*</span>}
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={onInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${formErrors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                    placeholder={mode === 'edit' ? 'Leave blank to keep current password' : 'Enter password'}
                />
                {formErrors.password && (
                    <p className="text-red-500 text-sm mt-1" role="alert">{formErrors.password}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                    Must be 8+ characters with uppercase, lowercase, digit, and special character
                </p>
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing...' : mode === 'create' ? 'Create User' : 'Update User'}
                </button>
            </div>
        </div>
    );
};