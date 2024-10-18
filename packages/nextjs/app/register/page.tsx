// app/register/page.tsx
"use client";

import { useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

// app/register/page.tsx

// app/register/page.tsx

// app/register/page.tsx

// app/register/page.tsx

// app/register/page.tsx

// app/register/page.tsx

// app/register/page.tsx

// app/register/page.tsx

// app/register/page.tsx

// app/register/page.tsx

const RegisterPage = () => {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const { data: events, isLoading: isEventsLoading } = useScaffoldReadContract({
    contractName: "YourContractName",
    functionName: "getEvents",
  });

  const { writeContract, isMining } = useScaffoldWriteContract("YourContractName");

  const handleRegister = async () => {
    if (selectedEventId === null) {
      notification.error("Please select an event.");
      return;
    }

    try {
      await writeContract({
        functionName: "register",
        args: [selectedEventId],
      });
      notification.success("Registered successfully!");
      // Optionally, reset selected event
      setSelectedEventId(null);
    } catch (error) {
      notification.error("Registration failed.");
      console.error(error);
    }
  };

  if (isEventsLoading) {
    return <div className="container mx-auto p-6">Loading events...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Register for an Event</h1>
      <ul className="space-y-4">
        {events?.map((event: any, index: number) => (
          <li key={index} className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">{event.name}</h2>
            <p>{event.description}</p>
            <p>Date: {new Date(Number(event.date)).toLocaleString()}</p>
            <button
              onClick={() => setSelectedEventId(index)}
              className={`btn mt-2 ${selectedEventId === index ? "btn-secondary" : "btn-primary"}`}
            >
              {selectedEventId === index ? "Selected" : "Select Event"}
            </button>
          </li>
        ))}
      </ul>
      {selectedEventId !== null && (
        <div className="mt-6">
          <button onClick={handleRegister} className="btn btn-success" disabled={isMining}>
            {isMining ? "Registering..." : "Register for Selected Event"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
