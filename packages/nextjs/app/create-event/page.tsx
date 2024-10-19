// app/create-event/page.tsx

"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const CreateEventPage = () => {
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDateTime, setEventDateTime] = useState(""); // Updated state variable name
  const [maxParticipants, setMaxParticipants] = useState("");

  // Interact with the EventFactory contract
  const { writeContract, isMining } = useScaffoldWriteContract("EventFactory");

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventName || !eventLocation || !eventDateTime || !maxParticipants) {
      notification.error("Please fill in all fields.");
      return;
    }

    try {
      // Convert date and time to Unix timestamp in seconds
      const eventTimestamp = new Date(eventDateTime).getTime() / 1000;

      const participantsCount = parseInt(maxParticipants, 10);

      if (participantsCount === 0) {
        notification.error("Max participants must be greater than 0.");
        return;
      }

      console.log("Attempting to create event with args:", {
        eventName,
        eventTimestamp, // Using timestamp as an integer in seconds
        eventLocation,
        participantsCount,
      });

      // Call the createEvent function from the EventFactory contract
      const txResponse = await writeContract({
        functionName: "createEvent",
        args: [eventName, BigInt(eventTimestamp), eventLocation, BigInt(participantsCount)],
      });

      console.log("Transaction Response:", txResponse);

      notification.success("Event created successfully!");

      // Optionally, reset form fields after successful event creation
      setEventName("");
      setEventLocation("");
      setEventDateTime(""); // Resetting the updated state variable
      setMaxParticipants("");
    } catch (error) {
      notification.error("Failed to create event.");
      console.error("Error during contract call:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      <form onSubmit={handleCreateEvent} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={e => setEventName(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Event Location</label>
          <input
            type="text"
            value={eventLocation}
            onChange={e => setEventLocation(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Event Date & Time</label>
          <input
            type="datetime-local" // Changed input type
            value={eventDateTime} // Updated variable name
            onChange={e => setEventDateTime(e.target.value)} // Updated handler
            className="input input-bordered w-full"
            min="1900-01-01T00:00"
            max="2099-12-31T23:59"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Max Participants</label>
          <input
            type="number"
            value={maxParticipants}
            onChange={e => setMaxParticipants(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isMining}>
          {isMining ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;
