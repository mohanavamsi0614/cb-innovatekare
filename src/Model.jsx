// Modal.js
import React from 'react';

function Modal({ isLoading, children }) {
    return (
        <div className="modal-overlay ">
            <div className="modal-content flex justify-center">
                {isLoading ? (
                    <div className="loading-spinner"></div> 
                ) : (
                    children
                )}
            </div>
        </div>
    );
}

export default Modal;
