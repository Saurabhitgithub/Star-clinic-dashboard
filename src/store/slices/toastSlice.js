import { createSlice } from "@reduxjs/toolkit";


let initialState = {
    type: 'success',
    open: false,
    msg: ''
}

export const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        toastaction: (state, action) => {
            return ({
                type: action.payload.type,
                open: true,
                msg: action.payload.msg
            })
        },
        stopToast: (state) => {
            return ({ ...state, open: false })
        }
    }
})
export let { toastaction, stopToast } = toastSlice.actions