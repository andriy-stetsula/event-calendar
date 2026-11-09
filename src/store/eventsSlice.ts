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

const loadEvents = (): CalendarEvent[] => {
    try {
        const saved = localStorage.getItem("events")
        return saved ? JSON.parse(saved) : []
    } catch {
        return []
    }
}

const initialState: CalendarEvent[] = loadEvents()

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