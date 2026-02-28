import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../App";
import {
  setEventsForStudents,
  Event,
  setTotalRequests,
  setTotalSuccessRequests,
  setTotalPendingRequests,
} from "../slices/eventSlice";
import type { RootState, AppDispatch } from "../store/store";

const useGetEventsForStudents = () => {
  const dispatch = useDispatch<AppDispatch>();
  const events = useSelector((state: RootState) => state.events.events);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetching both endpoints concurrently
        const [eventRes, issueRes] = await Promise.all([
          fetch(`${baseUrl}/api/student/get-events`, {
            credentials: "include",
          }),
          fetch(`${baseUrl}/api/student/get-issues`, {
            credentials: "include",
          }),
        ]);

        // FIX 1: Check if BOTH requests were successful
        if (!eventRes.ok || !issueRes.ok) {
          throw new Error("Failed to fetch data from one or more endpoints");
        }

        const data1 = await eventRes.json(); // Data from get-events
        const data2 = await issueRes.json(); // Data from get-issues

        // FIX 2: Corrected data access. data1 should contain events, data2 should contain issues.
        // Also added fallbacks ([]) to prevent .length errors if data is missing.
        const eventList = data1.events || [];
        const issueList = data2.issues || [];

        // FIX 3: Dispatching the actual events (data1.events) instead of data1.issues
        dispatch(setEventsForStudents(eventList as Event[]));

        // FIX 4: Corrected variable names and logic for totals
        const total = eventList.length + issueList.length;

        // Filter for Success/Approved
        const totalSuccessEvents = eventList.filter(
          (e: any) => e.status === "Approved"
        );
        const totalSuccessIssues = issueList.filter(
          (e: any) => e.status === "Success"
        );

        // Filter for Pending
        const totalPendingEvents = eventList.filter(
          (e: any) => e.status === "Pending"
        );
        const totalPendingIssues = issueList.filter(
          (e: any) => e.status === "Pending"
        );

        const totalSuccess = totalSuccessEvents.length + totalSuccessIssues.length;
        const totalPending = totalPendingEvents.length + totalPendingIssues.length;

        // Dispatching totals to Redux
        dispatch(setTotalRequests(total));
        dispatch(setTotalSuccessRequests(totalSuccess));
        dispatch(setTotalPendingRequests(totalPending));

      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [dispatch]); // Added dispatch to dependency array for best practices

  return { events, loading, error };
};

export default useGetEventsForStudents;