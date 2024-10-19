"use client";

import { useEffect, useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

interface EventInfo {
  eventAddress: string;
  name: string;
  date: string;
  location: string;
  maxParticipants: number;
  registeredParticipants: number;
}

const hardcodedEvent: EventInfo = {
  eventAddress: "0xa15bb66138824a1c7167f5e85b957d04dd34e468",
  name: "Marathon Event",
  date: "2024",
  location: "Sofia",
  maxParticipants: 100,
  registeredParticipants: 0,
};

const DashboardPage = () => {
  const [events, setEvents] = useState<EventInfo[]>([hardcodedEvent]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);

  const { data: eventsList, error } = useScaffoldReadContract({
    contractName: "EventFactory",
    functionName: "getEvents",
  });

  useEffect(() => {
    console.log("Events List Fetched:", eventsList);
    if (error) {
      console.error("Error fetching events:", error);
    }
  }, [eventsList, error]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        if (eventsList && Array.isArray(eventsList)) {
          setEvents([hardcodedEvent, ...eventsList]);
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
  }, [eventsList]);

  const handleRegister = () => {
    setIsRegistering(true);
    setTimeout(() => {
      setRegistered(true);
      setIsRegistering(false);
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.eventAddress === hardcodedEvent.eventAddress
            ? { ...event, registeredParticipants: event.registeredParticipants + 1 }
            : event
        )
      );
      notification.success("Successfully registered for the event!");
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-5xl fade-in">
      <h1 className="text-3xl font-bold mb-6 text-center">Event Dashboard</h1>
      {isLoadingEvents ? (
        <p>Loading events...</p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Featured Event</h2>
            <div className="card">
              <h3 className="card-title">{hardcodedEvent.name}</h3>
              <p>Date: 2024</p>
              <p>Location: Sofia</p>
              <p>Max Participants: 100</p>
              <p>Registered Participants: 0</p>
              {registered ? (
                <p className="text-green-600 font-semibold">You have registered for this event!</p>
              ) : (
                <button
                  className="btn btn-primary w-full"
                  onClick={handleRegister}
                  disabled={isRegistering}>
                  {isRegistering ? "Registering..." : "Register"}
                </button>
              )}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">All Events</h2>
            {events.length > 1 ? (
              <ul className="space-y-4">
                {events.slice(1).map((event, index) => (
                  <li key={index} className="card">
                    <h3 className="card-title">{event.name}</h3>
                    <p>Date: {new Date(Number(event.date) * 1000).toLocaleDateString()}</p>
                    <p>Location: {event.location}</p>
                    <p>Max Participants: {event.maxParticipants}</p>
                    <p>Registered Participants: {event.registeredParticipants}</p>
                    <button className="btn btn-secondary w-full">Register</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No other events available at the moment.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
