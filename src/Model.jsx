// Modal.js
import React from 'react';
import Loader from './Loader';

function Modal({ isLoading, children }) {
    return (
        <div className="modal-overlay ">
            <div className="modal-content flex justify-center">
                {isLoading ? (
                    <div className="loading-spinner p-4">
                        <Loader/>
                        <p className=' mt-5'>Loading...</p>
                    </div> 
                ) : (
                    children
                )}
            </div>
        </div>
    );
}

export default Modal;
