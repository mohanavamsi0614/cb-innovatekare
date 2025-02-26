import { useState } from "react";
import { io } from "socket.io-client";
import api from "./api";
const socket = io(api);

function EventUp() {
    const [event, setEvent] = useState("");

    const handleEvent = () => {
        socket.emit("eventupdates", event);
        setEvent("");
    };

    return (
        <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full space-y-4 bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4">Create Event Update</h2>
                <textarea
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    className="w-full h-40 p-3 bg-gray-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter event details..."
                />
                <button
                    onClick={handleEvent}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                >
                    Submit Update
                </button>
            </div>
        </div>
    );
}

export default EventUp;