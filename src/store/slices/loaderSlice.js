import { createSlice } from "@reduxjs/toolkit"


export const loaderSlice = createSlice({
    name: 'loader',
    initialState: false,
    reducers: {
        startLoader: () => true,
        stopLoader: () => false,
    }
});

export const { startLoader, stopLoader } = loaderSlice.actions