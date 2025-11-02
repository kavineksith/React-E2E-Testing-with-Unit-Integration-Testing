import React from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export const Alert = ({ type, message, onClose }) => {
    const isError = type === 'error';
    const bgColor = isError ? 'bg-red-50' : 'bg-green-50';
    const borderColor = isError ? 'border-red-500' : 'border-green-500';
    const textColor = isError ? 'text-red-800' : 'text-green-800';
    const textColorLight = isError ? 'text-red-700' : 'text-green-700';
    const iconColor = isError ? 'text-red-500' : 'text-green-500';
    const Icon = isError ? AlertCircle : CheckCircle;

    return (
        <div className={`${bgColor} border-l-4 ${borderColor} p-4 mb-6 rounded-lg flex items-start gap-3`}>
            <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1">
                <p className={`${textColor} font-medium`}>{isError ? 'Error' : 'Success'}</p>
                <p className={`${textColorLight} text-sm`}>{message}</p>
            </div>
            <button onClick={onClose} className={`${iconColor} hover:opacity-70`}>
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};