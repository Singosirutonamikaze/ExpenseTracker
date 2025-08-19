import React from 'react';

const DeleteAlert = ({ message, onClose, onConfirm }) => {
  return (
    <div className="p-4">
      <p className="text-gray-700 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition"
        >
          Annuler
        </button>
        <button 
          onClick={onConfirm}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;