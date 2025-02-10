import { useState } from 'react';

function AttenCard({ team }) {
    const [leadAttendance, setLeadAttendance] = useState(null);
    const [memberAttendance, setMemberAttendance] = useState(
        team.teamMembers.reduce((acc, member) => {
            acc[member.name] = null;
            return acc;
        }, {})
    );

    const toggleLeadAttendance = (status) => {
        setLeadAttendance(status);
    };

    const toggleMemberAttendance = (name, status) => {
        setMemberAttendance((prev) => ({
            ...prev,
            [name]: status,
        }));
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 font-sans">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">{team.teamname}</h1>
            <div className="mb-6">
                <p className="text-gray-800 text-lg">Lead Name: {team.name}</p>
                <p className="text-gray-800 text-lg">Registration Number: {team.registrationNumber}</p>
                <div className="flex space-x-4 mt-4">
                    <button
                        className={`px-6 py-2 rounded ${leadAttendance === 'Present' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => toggleLeadAttendance('Present')}
                    >
                        Present
                    </button>
                    <button
                        className={`px-6 py-2 rounded ${leadAttendance === 'Absent' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => toggleLeadAttendance('Absent')}
                    >
                        Absent
                    </button>
                </div>
                {team.teamMembers.map((i) => (
                    <div key={i.name} className="mt-6 p-4 border-t border-gray-300">
                        <p className="text-gray-800 text-lg">Name: {i.name}</p>
                        <p className="text-gray-800 text-lg">Registration Number: {i.registrationNumber}</p>
                        <div className="flex space-x-4 mt-4">
                            <button
                                className={`px-6 py-2 rounded ${memberAttendance[i.name] === 'Present' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                onClick={() => toggleMemberAttendance(i.name, 'Present')}
                            >
                                Present
                            </button>
                            <button
                                className={`px-6 py-2 rounded ${memberAttendance[i.name] === 'Absent' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                                onClick={() => toggleMemberAttendance(i.name, 'Absent')}
                            >
                                Absent
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="border  px-6 py-2 rounded">Submit</button>
        </div>
    );
}
export default AttenCard;