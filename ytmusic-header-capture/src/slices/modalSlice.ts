import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { logout } from "./authSlice"
import { Props as AddToPlaylistModalProps } from "../components/modals/AddToPlaylistModal"

type ModalProps = AddToPlaylistModalProps | Record<string, any>

type ModalState = {
    isOpen: boolean
    modalType: string
    modalProps: ModalProps
}

const initialState: ModalState = {
	isOpen: false,
    modalType: "",
    modalProps: {}
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
      	setIsOpen: (state, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload
        },
        setModalType: (state, action: PayloadAction<string>) => {
            state.modalType = action.payload 
        },
        setModalProps: (state, action: PayloadAction<ModalProps>) => {
            state.modalProps = action.payload
        }
    },
})

export const { setIsOpen, setModalType, setModalProps } = modalSlice.actions

export const modalReducer = modalSlice.reducer
