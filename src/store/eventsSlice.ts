import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit";

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  color: string;
  description: string;
}

const initialState: CalendarEvent[] = []

const eventsSlice = createSlice({
    name:'events',
    initialState,
    reducers: {
        addEvent:(event, {payload}: PayloadAction<CalendarEvent>) => [...event, payload],
        removeEvent:(event, {payload}: PayloadAction<string>) => event.filter(e => e.id !== payload),
    }
})

export const { addEvent, removeEvent } = eventsSlice.actions;
export default eventsSlice.reducer;