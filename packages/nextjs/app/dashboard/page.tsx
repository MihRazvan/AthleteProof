// app/dashboard/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

// Define the type for EventInfo as it is returned from the EventFactory
interface EventInfo {
  eventAddress: string;
  name: string;
  date: string;
  location: string;
  maxParticipants: number;
  registeredParticipants: number;
}

const hardcodedEvent: EventInfo = {
  eventAddress: "0x1234567890abcdef1234567890abcdef12345678", // Fake contract address
  name: "Hardcoded Marathon Event",
  date: "2024", // Current timestamp in seconds (Unix time)
  location: "New York",
  maxParticipants: 100,
  registeredParticipants: 50,
};

const DashboardPage = () => {
  const [events, setEvents] = useState<EventInfo[]>([hardcodedEvent]); // Initialize with the hardcoded event
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false); // State to track registration
  const [registered, setRegistered] = useState(false); // Track if the user has registered for the hardcoded event

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
          setEvents([hardcodedEvent, ...eventsList]); // Set the eventsList with the hardcoded event at the start
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

  const handleRegister = () => {
    setIsRegistering(true);

    // Simulate registration delay and success
    setTimeout(() => {
      setRegistered(true);
      setIsRegistering(false);
      notification.success("Successfully registered for the hardcoded event!");
    }, 2000); // Simulate a 2-second registration process
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Event Dashboard</h1>

      {isLoadingEvents ? (
        <p>Loading events...</p>
      ) : (
        <>
          <section>
            <h2 className="text-xl font-bold mb-2">Featured Event</h2>
            <ul>
              <li className="border p-4 mb-2">
                <h3 className="text-lg font-semibold">{hardcodedEvent.name}</h3>
                <p>Date: {new Date(Number(hardcodedEvent.date) * 1000).toLocaleDateString()}</p>
                <p>Location: {hardcodedEvent.location}</p>
                <p>Max Participants: {hardcodedEvent.maxParticipants.toString()}</p>
                <p>Registered Participants: {hardcodedEvent.registeredParticipants.toString()}</p>

                {registered ? (
                  <p className="text-green-600 font-semibold">You have registered for this event!</p>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={handleRegister}
                    disabled={isRegistering}
                  >
                    {isRegistering ? "Registering..." : "Register"}
                  </button>
                )}
              </li>
            </ul>
          </section>

          {/* Other Events Section */}
          <section>
            <h2 className="text-xl font-bold mb-2">All Events</h2>
            {events.length > 1 ? (
              <ul>
                {events.slice(1).map((event, index) => (
                  <li key={index} className="border p-4 mb-2">
                    <h3 className="text-lg font-semibold">{event.name}</h3>
                    <p>Date: {new Date(Number(event.date) * 1000).toLocaleDateString()}</p>
                    <p>Location: {event.location}</p>
                    <p>Max Participants: {event.maxParticipants.toString()}</p>
                    <p>Registered Participants: {event.registeredParticipants.toString()}</p>

                    {/* Disabled Registration Button for other events */}
                    <button className="btn btn-primary">
                      Register
                    </button>
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
