import { useEffect, useState } from "react";
import "./admin.css";
import axios from "axios";
import api from "./api";
import AttenCard from "./components/Atted";

function Attd() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSector, setCurrentSector] = useState(0);
    const sectors = ["Alpha", "Beta", "Gamma", "Delta", "Sigma","Omega"];

    useEffect(() => {
        async function data() {
            try {
                let res = await axios.get(`${api}/event/students`);
                res = await res.data;
                setTeams(res);
            } catch (error) {
                console.error("Error fetching teams:", error);
            } finally {
                setLoading(false);
            }
        }
        data();
    }, []);

    const getSectorTeams = (sectorIndex) => {
        const start = sectorIndex * 15;
        const end = start + 15;
        console.log(teams.slice(start, end))
        return teams.slice(start, end);
    };
    return (
        <div className="bg-gray-900 flex flex-col min-h-screen p-4">
            <h1 className="text-3xl text-white text-center mt-4 mb-6">Attendance Dashboard</h1>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loading-spinner text-white text-xl">Loading...</div>
                </div>
            ) : (
                <>
                    <div className="flex flex-wrap justify-center mb-6">
                        {sectors.map((sector, index) => (
                            <button
                                key={sector}
                                className={`mx-2 px-4 m-2 py-2 rounded ${currentSector === index ? 'bg-blue-700' : 'bg-gray-700'} text-white`}
                                onClick={() => setCurrentSector(index)}
                            >
                                {sector}
                            </button>
                        ))}
                    </div>
                    <div className="mb-8">
                        <h2 className="text-2xl text-white mb-4">{sectors[currentSector]} Sector</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {getSectorTeams(currentSector).map((team, i) => (
                                <details key={team._id} className="col-span-1 bg-gray-800 rounded-xl overflow-hidden">
                                    <summary className="text-white cursor-pointer p-4 hover:bg-gray-700 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <span>{currentSector * 15 + i + 1}. {team.teamname}</span>
                                            <span className={`text-sm ${team.lead?.FirstAttd ? 'text-green-500' : 'text-gray-400'}`}>
                                                {team.lead?.FirstAttd ? 'Submitted' : 'Pending'}
                                            </span>
                                        </div>
                                    </summary>
                                    <div className="p-2">
                                        <AttenCard team={team} />
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Attd;