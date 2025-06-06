import { useAppSelector, useAppDispatch } from "../hooks/redux-hooks";
import { Modal } from "./elements/Modal";
import { setIsOpen } from "../slices/modalSlice";
import { AddToPlaylistModal, Props as AddToPlaylistModalProps } from "./modals/AddToPlaylistModal"

export const ModalManager = () => {
    const { isOpen, modalProps, modalType } = useAppSelector((state) => state.modal)
    const dispatch = useAppDispatch()

    const renderContent = () => {
        switch (modalType) {
            case "add-to-playlist":
                return <AddToPlaylistModal {...(modalProps as AddToPlaylistModalProps )} />
            default:
                return null
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={() => dispatch(setIsOpen(!isOpen))}>
            {renderContent()}
        </Modal>
    )
}