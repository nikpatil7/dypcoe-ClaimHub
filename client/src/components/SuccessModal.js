import React, { useEffect } from 'react';
import Modal from './Modal';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const SuccessModal = ({ isOpen, onClose, message, autoClose = true }) => {
  useEffect(() => {
    let timer;
    if (isOpen && autoClose) {
      timer = setTimeout(() => {
        onClose();
      }, 2000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, onClose, autoClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Success" size="sm">
      <div className="flex flex-col items-center justify-center py-4">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
        <p className="text-lg text-center text-gray-800">{message}</p>
      </div>
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          OK
        </button>
      </div>
    </Modal>
  );
};

export default SuccessModal; 