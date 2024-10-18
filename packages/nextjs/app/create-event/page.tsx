// app/create-event/page.tsx
"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

// app/create-event/page.tsx

// app/create-event/page.tsx

// app/create-event/page.tsx

// app/create-event/page.tsx

// app/create-event/page.tsx

// app/create-event/page.tsx

// app/create-event/page.tsx

// app/create-event/page.tsx

// app/create-event/page.tsx

// app/create-event/page.tsx

const CreateEventPage = () => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");

  const { writeContract, isMining } = useScaffoldWriteContract("YourContractName");

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventName || !eventDescription || !eventDate) {
      notification.error("Please fill in all fields.");
      return;
    }

    try {
      await writeContract({
        functionName: "createEvent",
        args: [eventName, eventDescription, BigInt(new Date(eventDate).getTime())],
      });
      notification.success("Event created successfully!");
      // Optionally, reset form fields
      setEventName("");
      setEventDescription("");
      setEventDate("");
    } catch (error) {
      notification.error("Failed to create event.");
      console.error(error);
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
          <label className="block text-sm font-medium">Event Description</label>
          <textarea
            value={eventDescription}
            onChange={e => setEventDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium">Event Date</label>
          <input
            type="datetime-local"
            value={eventDate}
            onChange={e => setEventDate(e.target.value)}
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
