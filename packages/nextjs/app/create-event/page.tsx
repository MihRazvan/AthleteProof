"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import to handle redirection
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const CreateEventPage = () => {
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const { writeContract } = useScaffoldWriteContract("EventFactory");
  const router = useRouter(); // Initialize router for redirection

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingEvent(true);

    try {
      if (!eventName || !eventLocation || !eventDate || !maxParticipants) {
        notification.error("Please fill in all fields.");
        return;
      }

      const eventTimestamp = eventDate;
      const participantsCount = parseInt(maxParticipants, 10);

      if (participantsCount <= 0) {
        notification.error("Max participants must be greater than 0.");
        return;
      }

      // Writing event data to blockchain
      const txResponse = await writeContract({
        functionName: "createEvent",
        args: [eventName, BigInt(eventTimestamp), eventLocation, BigInt(participantsCount)],
      });

      console.log("Event created successfully:", txResponse);
      notification.success("Event created successfully!");

      // Redirect to the Email Notification page
      router.push(`/send-emails?eventName=${eventName}&eventDate=${eventDate}&eventLocation=${eventLocation}`);
    } catch (error) {
      console.error("Error creating event:", error);
      notification.error("Failed to create event.");
    }

    setIsCreatingEvent(false);
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
            onChange={(e) => setEventName(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Event Location</label>
          <input
            type="text"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Event Date</label>
          <input
            type="text"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Max Participants</label>
          <input
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isCreatingEvent}>
          {isCreatingEvent ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;
