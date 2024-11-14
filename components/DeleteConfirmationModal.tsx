import React from "react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps>  = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#343434] w-80 p-5 shadow-lg">
                <h2 className="text-xl font-semibold text-white">Delete Confirmation</h2>
                <div className="h-0.5 bg-gray-400 my-5" />
                <p className="text-white mt-2">Are you sure you want to delete this item?</p>

                <div className="mt-4 flex justify-end space-x-3">
                    <button
                        className="bg-[] text-white px-4 py-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-red-500 text-white px-4 py-2"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
