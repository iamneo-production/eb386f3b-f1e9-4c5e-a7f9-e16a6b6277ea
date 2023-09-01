import { configureStore } from "@reduxjs/toolkit";
import applicationReducer from '../components/applicationTracker/appTrackerSlice';
import userReducer from '../redux/UserReducer';

const store = configureStore({
    reducer: {
        application: applicationReducer,
        user: userReducer
    }
});

export default store;