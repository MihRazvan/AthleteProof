"use client";

import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { IExecWeb3mail } from "@iexec/web3mail";

const CreateEventPage = () => {
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const { writeContract } = useScaffoldWriteContract("EventFactory");
  const web3mail = new IExecWeb3mail(window.ethereum);

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

      console.log("Creating event with args:", {
        eventName,
        eventTimestamp,
        eventLocation,
        participantsCount,
      });

      const txResponse = await writeContract({
        functionName: "createEvent",
        args: [eventName, BigInt(eventTimestamp), eventLocation, BigInt(participantsCount)],
      });

      console.log("Event created successfully:", txResponse);
      notification.success("Event created successfully!");

      // Send email notification via Web3Mail to all opted-in users
      await sendEmailNotification();

      // Reset form
      setEventName("");
      setEventLocation("");
      setEventDate("");
      setMaxParticipants("");
    } catch (error) {
      console.error("Error creating event:", error);
      notification.error("Failed to create event.");
    }

    setIsCreatingEvent(false);
  };

  // Function to send email notifications via Web3Mail
  const sendEmailNotification = async () => {
    try {
      const emailContent = `
        <h1>New Event Created: ${eventName}</h1>
        <p>Date: ${eventDate}</p>
        <p>Location: ${eventLocation}</p>
        <p>Max Participants: ${maxParticipants}</p>
      `;

      await web3mail.sendEmail({
        protectedData: "razvan.mihailescu1996@gmail.com", // Hardcoded email address for testing
        emailSubject: `New Event: ${eventName}`,
        emailContent,
        contentType: "text/html",
      });

      notification.success("Emails sent to participants!");
    } catch (error) {
      notification.error("Failed to send email notifications.");
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
            type="number"
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
