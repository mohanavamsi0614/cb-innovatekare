import axios from "axios";
import api from "../api";
import { useState } from "react";

function PaymentCard({ team }) {
  const [photo, setPhoto] = useState(false);
  const [full, setFull] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(team.verified);
  console.log(team)

  async function handleVerify(id) {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/event/team/${id}`,);
      console.log(response.data);
      setVerified(true);
    } catch (err) {
      console.error("Error verifying:", err);
      alert("Failed to verify the team.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-lg flex justify-between items-start space-x-6 hover:shadow-2xl transition-shadow duration-300">
      <div className="w-2/3">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          {team.teamname || "Team Name"}
        </h3>
        <h3>
            <h3>transtationId: {team.transtationId}</h3>
            <h3>upiId: {team.upiId}</h3>
        </h3>
        
        {full && (
          <div className="mb-4">
            <h3 className=" font-bold text-black">Team Lead:</h3>
            <h3 className=" text-gray-700">{team.name}</h3>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Team Members:
            </h3>
            {team.teamMembers.map((member) => (
              <h3 key={member.name} className="text-gray-600">
                {member.name}
              </h3>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center space-x-4">
          <button
            onClick={() => handleVerify(team._id)}
            disabled={team.verified}
            className={`px-4 py-2 rounded font-semibold text-white flex items-center space-x-2 ${
            !team.verified ?
              "bg-[#E16254] hover:bg-[#E16256] transition duration-300" : " bg-gray-600"
            } ${verified && " bg-gray-600"}`    }
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              <h3>{verified ? "Verified" : "Verify"}</h3>
            )}
          </button>

          {verified && (
            <h3 className="text-green-500 font-bold"> ✅ Verified</h3>
          )}
        </div>

        <button
          onClick={() => setFull(!full)}
          className="mt-4 p-1 border hover:underline transition duration-200"
        >
          {full ? "Hide Members" : "Show Members"}
        </button>
      </div>

      <div className="w-1/3">
        {team.imgUrl && (
          <img
            src={team.imgUrl}
            onClick={() => setPhoto(true)}
            alt={`${team.teamname} Logo`}
            className="w-full h-48 object-cover rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity"
          />
        )}
      </div>

      {photo && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="bg-white rounded-lg p-4 relative shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <p className="text-xl font-semibold text-gray-800 text-center w-full">
                {team.teamName}
              </p>
              <button
                className="absolute top-2 right-4 text-gray-800 text-xl hover:text-red-500"
                onClick={() => setPhoto(false)}
              >
                X
              </button>
            </div>

            <div className="flex justify-center items-center">
              <img
                src={team.imgUrl}
                alt="Team"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentCard;
