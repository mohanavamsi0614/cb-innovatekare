import { useEffect, useState } from "react";
import axios from "axios";
import api from "./api";

function AttdDetail() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {       
        async function fetchData() {
            try {
                let res = await axios.get(`${api}/event/students`);
                setTeams(res.data);
            } catch (error) {
                console.error("Error fetching teams:", error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchData();
    }, []);

    const getAllMembers = () => {
        const allMembers = [];
        
        teams.forEach(team => {
            if (team.lead) {
                allMembers.push({
                    ...team.lead,
                    teamName: team.teamname,
                    teamId: team._id,
                    role: "Team Lead",
                    hasAttended: team.lead.FirstAttd =="Present" ? true : false
                });
            }
            
            if (team.teamMembers && team.teamMembers.length > 0) {
                team.teamMembers.forEach(member => {
                    allMembers.push({
                        ...member,
                        teamName: team.teamname,
                        teamId: team._id,
                        role: "Member",
                        hasAttended: member.FirstAttd=="Present" ? true : false
                    });
                });
            }
        });
        
        return allMembers;
    };


    const getAttendanceStats = () => {
        const allMembers = getAllMembers();
        const total = allMembers.length;
        const present = allMembers.filter(m => m.hasAttended).length;
        const absent = total - present;
        const presentPercent = total > 0 ? Math.round((present / total) * 100) : 0;
        
        return { total, present, absent, presentPercent };
    };    

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl font-semibold">Loading attendance data...</div>
            </div>
        );
    }
    
    const stats = getAttendanceStats();
    const allMembers = getAllMembers();

    return (
        <div className="min-h-screen bg-gray-900 text-white p-5">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Detailed Attendance</h1>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                        <h3 className="text-lg text-gray-400">Total Participants</h3>
                        <p className="text-3xl font-bold">{stats.total}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                        <h3 className="text-lg text-gray-400">Present</h3>
                        <p className="text-3xl font-bold text-green-500">{stats.present}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                        <h3 className="text-lg text-gray-400">Absent</h3>
                        <p className="text-3xl font-bold text-red-500">{stats.absent}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
                        <h3 className="text-lg text-gray-400">Attendance Rate</h3>
                        <p className="text-3xl font-bold text-blue-500">{stats.presentPercent}%</p>
                    </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Team</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">First Round</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-600">
                                {allMembers.map((member, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{member.name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{member.teamName || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${member.role === "Team Lead" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${member.hasAttended ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                {member.hasAttended ? "Present" : "Absent"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                
                                {allMembers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-400">
                                            No participants found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-400">
                    Showing {allMembers.length} participants
                </div>
            </div>
        </div>
    );
}

export default AttdDetail;
