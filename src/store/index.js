import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from './userSlice';
const store = configureStore({
    reducer: {user:userSlice.reducer} // Pass the reducer function of the userSlice
    
});

export default store;