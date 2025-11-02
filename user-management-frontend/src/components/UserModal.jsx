import React, { useState } from 'react';
import { X } from 'lucide-react';
import { UserDetailsView } from './UserDetailsView';
import { UserForm } from './UserForm';
import { validation } from '../utils/validation';

export const UserModal = ({ mode, user, onClose, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validation.validateForm(formData, mode);

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {mode === 'create' && 'Create New User'}
                            {mode === 'edit' && 'Edit User'}
                            {mode === 'view' && 'User Details'}
                        </h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close modal">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {mode === 'view' && user ? (
                        <UserDetailsView user={user} />
                    ) : (
                        <UserForm
                            formData={formData}
                            formErrors={formErrors}
                            mode={mode}
                            loading={loading}
                            onInputChange={handleInputChange}
                            onSubmit={handleSubmit}
                            onCancel={onClose}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};