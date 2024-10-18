// app/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

// app/dashboard/page.tsx

// Define the type for EventInfo as it is returned from the EventFactory
interface EventInfo {
  eventAddress: string;
  name: string;
  date: bigint;
  location: string;
  maxParticipants: number;
  registeredParticipants: number;
}

const DashboardPage = () => {
  const [events, setEvents] = useState<EventInfo[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Fetch all events from the EventFactory contract
  const { data: eventsList, error } = useScaffoldReadContract({
    contractName: "EventFactory",
    functionName: "getEvents",
  });

  // Log the fetched data or errors to help debug
  useEffect(() => {
    console.log("Events List Fetched:", eventsList);
    if (error) {
      console.error("Error fetching events:", error);
    }
  }, [eventsList, error]);

  // Fetch events when the component mounts
  useEffect(() => {
    const loadEvents = async () => {
      try {
        if (eventsList && Array.isArray(eventsList)) {
          console.log("Events data:", eventsList); // Log the eventsList to check if it's populated
          setEvents(eventsList); // Set the eventsList in the state
        } else {
          console.log("No events found or data is not an array.");
        }
      } catch (error) {
        notification.error("Error loading events.");
        console.error("Error fetching events:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };
    loadEvents();
  }, [eventsList]); // Trigger useEffect when eventsList changes

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Event Dashboard</h1>

      {isLoadingEvents ? (
        <p>Loading events...</p>
      ) : (
        <section>
          <h2 className="text-xl font-bold mb-2">All Events</h2>
          {events.length > 0 ? (
            <ul>
              {events.map((event, index) => (
                <li key={index} className="border p-4 mb-2">
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  <p>Date: {new Date(Number(event.date)).toLocaleString()}</p>
                  <p>Location: {event.location}</p>
                  <p>Max Participants: {event.maxParticipants}</p>
                  <p>Registered Participants: {event.registeredParticipants}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No events available at the moment.</p>
          )}
        </section>
      )}
    </div>
  );
};

export default DashboardPage;
