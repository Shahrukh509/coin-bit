import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    _id:'',
    email:'',
    username:'',
    auth:false
}
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers :{
        setUser: (state, action) => {
            const {_id,email,username, auth } = action.payload;
            return {
                ...state,
                _id,
                email,
                username,
                auth
            };
            // state._id = _id;
            // state.email = email;
            // state.username = username;
            // state.auth = auth;

        },
        resetUser: (state,action) => initialState,
        
        // {
        //     state._id = '';
        //     state.email = '';
        //     state.username = '';
        //     state.auth = '';
        // },
    }
})

export  const { setUser, resetUser} = userSlice.actions;
export default userSlice.reducer;