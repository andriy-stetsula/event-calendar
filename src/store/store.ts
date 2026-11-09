import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "./eventsSlice.ts";

export const store = configureStore({
    reducer:{
        events:eventsReducer,
    }
})

store.subscribe(() => {
    localStorage.setItem("events", JSON.stringify(store.getState().events))
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;