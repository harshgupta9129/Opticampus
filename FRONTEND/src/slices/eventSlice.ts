import { createSlice } from "@reduxjs/toolkit";
import { number } from "framer-motion";

// Event type shared across the app
export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  expectedParticipants: number;
  purpose: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
}

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
  totalEvents: number | null;
  totalSuccessRequests: number;
  totalPendingRequests: number;

}

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
  totalEvents: 0,
  totalSuccessRequests : 0,
  totalPendingRequests : 0,

};

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEventsForStudents: (state, action) => {
      state.events = action.payload;
    },
    setTotalRequests: (state, action) => {
      state.totalEvents = action.payload
    },
    setTotalSuccessRequests: (state, action) => {
      state.totalSuccessRequests = action.payload
    },
    setTotalPendingRequests: (state, action) => {
      state.totalPendingRequests = action.payload
    }
  },
});

export const { setEventsForStudents, setTotalRequests, setTotalSuccessRequests, setTotalPendingRequests } = eventSlice.actions;
export default eventSlice.reducer;
