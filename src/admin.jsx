import { useEffect, useState } from "react";
import "./admin.css";
import axios from "axios";
import api from "./api";
import { io } from "socket.io-client";
import SquidGame from "./SquidGame";
const socket=io(api)

function Admin() {
    const [teams, setTeams] = useState([]);
    const [verifiedCount, setVerifiedCount] = useState(0);
    const [notVerifiedCount, setNotVerifiedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sectors, setSectors] = useState(["456", "067", "101", "001", "218", "199"]);
    const [currentSectorIndex, setCurrentSectorIndex] = useState(0);
    
    useEffect(() => {
        async function data() {
            try {
                let res = await axios.get(`${api}/event/students`);
                res = await res.data;
                setTeams(res);
                setVerifiedCount(res.filter(team => team.verified).length);
                setNotVerifiedCount(res.filter(team => !team.verified).length);
            } catch (error) {
                console.error("Error fetching teams:", error);
            } finally {
                setLoading(false);
            }
        }
        data();
    }, []);

    // Get teams in current sector
    const getTeamsInCurrentSector = () => {
        const currentSector = sectors[currentSectorIndex];
        return teams.filter(team => team.Sector === currentSector);
    };

    const handlePrevSector = () => {
        if (currentSectorIndex > 0) {
            setCurrentSectorIndex(currentSectorIndex - 1);
        }
    };

    const handleNextSector = () => {
        if (currentSectorIndex < sectors.length - 1) {
            setCurrentSectorIndex(currentSectorIndex + 1);
        }
    };

    const handleSelectSector = (index) => {
        if (index >= 0 && index < sectors.length) {
            setCurrentSectorIndex(index);
        }
    };

    return (
        <div className="bg-gray-900 flex flex-col min-h-screen p-4">
            <h1 className="text-3xl text-white text-center mt-4 mb-6">Admin Dashboard</h1>
            <div className="flex flex-col md:flex-row justify-around mb-8 space-y-4 md:space-y-0">
                <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg flex-1 mx-2">
                    <h2 className="text-2xl font-semibold">Verified Teams</h2>
                    <p className="text-4xl mt-2">{verifiedCount}</p>
                </div>
                <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg flex-1 mx-2">
                    <h2 className="text-2xl font-semibold">Not Verified Teams</h2>
                    <p className="text-4xl mt-2">{notVerifiedCount}</p>
                </div>
                <div className="bg-orange-300 text-white p-6 rounded-lg shadow-lg flex-1 mx-2">
                    <h2 className="text-2xl font-semibold">Total Teams</h2>
                    <p className="text-4xl mt-2">{teams.length}</p>
                </div>
                <button className="p-4 bg-green-300 text-white rounded-2xl" onClick={() => {
                    const futureTime = new Date(Date.now() + 10 * 60 * 1000).toISOString();
                    socket.emit("domainOpen", { open: futureTime });
                }}>Open</button>
            </div>
            {/* Quick sector navigation */}
            <div className="flex justify-center flex-wrap gap-2 mb-6">
                {sectors.map((sector, index) => (
                    <button 
                        key={sector}
                        onClick={() => handleSelectSector(index)}
                        className={`px-4 py-2 rounded-lg ${
                            currentSectorIndex === index 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                    >
                        {sector}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="loading-spinner">Loading...</div>
                </div>
            ) : (
                <>
                    <h2 className="text-2xl text-white mb-4">Sector {sectors[currentSectorIndex]} Teams</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {getTeamsInCurrentSector().map((team, i) => (
                            <div key={team._id} className="col-span-1">
                                <p className="text-white">
                                    #{i + 1} - Team {team.teamname}
                                </p>
                                <SquidGame team={team}/>
                            </div>
                        ))}
                    </div>

                    {getTeamsInCurrentSector().length === 0 && (
                        <div className="bg-gray-800 p-8 text-center rounded-lg">
                            <p className="text-gray-400">No teams found in Sector {sectors[currentSectorIndex]}</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Admin;