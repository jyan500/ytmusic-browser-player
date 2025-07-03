import { useAppSelector, useAppDispatch } from "../hooks/redux-hooks";
import { Modal } from "./elements/Modal";
import { setIsOpen, setModalProps, setModalType } from "../slices/modalSlice";
import { AddToPlaylistModal, Props as AddToPlaylistModalProps } from "./modals/AddToPlaylistModal"
import { AddEditPlaylistModal, Props as AddEditPlaylistModalProps } from "./modals/AddEditPlaylistModal"
import { PillButton } from "./elements/PillButton"
import { IconAdd } from "../icons/IconAdd"

export const ModalManager = () => {
    const { isOpen, modalProps, modalType } = useAppSelector((state) => state.modal)
    const dispatch = useAppDispatch()

    const onClickNewPlaylist = () => {
        dispatch(setModalProps(modalProps as AddEditPlaylistModalProps)) 
        dispatch(setModalType("add-edit-playlist"))
    }

    const renderContent = () => {
        switch (modalType) {
            case "add-to-playlist":
                return (
                    <>
                        <AddToPlaylistModal {...(modalProps as AddToPlaylistModalProps )} />
                        <PillButton className = "absolute bottom-0 right-0 mr-2 mb-2" onClick={onClickNewPlaylist} text={"New Playlist"}><IconAdd className = "w-3 h-3 text-dark"/></PillButton>
                    </>
                )
            case "add-edit-playlist":
                return (
                    <AddEditPlaylistModal {...(modalProps as AddEditPlaylistModalProps)}/>
                )
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
