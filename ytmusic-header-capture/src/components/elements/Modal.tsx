import React, { ReactNode } from "react";
import ReactDOM from "react-dom";
import { MODAL_Z_INDEX } from "../../helpers/constants"
import { IconClose } from "../../icons/IconClose"

interface ModalProps {
    isOpen: boolean;
    onClose: () => void
    children: ReactNode
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null

    return ReactDOM.createPortal(
        <div className={`fixed inset-0 ${MODAL_Z_INDEX} flex items-center justify-center bg-opacity-50`}>
            <div
                className="relative bg-dark text-white rounded-lg shadow-lg max-w-md w-1/2 h-1/2 p-6"
                role="dialog"
                aria-modal="true"
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white hover:text-gray-300"
                    aria-label="Close modal"
                >
                    <IconClose/>
                </button>
                <div className="overflow-y-auto h-full">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    )
}