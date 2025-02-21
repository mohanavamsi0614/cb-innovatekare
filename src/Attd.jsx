import { useEffect, useState } from "react";
import "./admin.css";
import axios from "axios";
import api from "./api";
import AttenCard from "./components/Atted";

function Attd() {
    const [teams, setTeams] = useState([]);
    const [present, setPre] = useState(0);
    const [absent, setAbs] = useState(0);
    const [pop,setpop]=useState(0)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function data() {
            try {
                let res = await axios.get(`${api}/event/students`);
                res = await res.data;
                setpop(res.length*5)
                setTeams(res);
                
            } catch (error) {
                console.error("Error fetching teams:", error);
            } finally {
                setLoading(false);
            }
        }
        data();
    }, []);

    return (
        <div className="bg-gray-900 flex flex-col min-h-screen p-4">
            <h1 className="text-3xl text-white text-center mt-4 mb-6">Attendance Dashboard</h1>
            

            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="loading-spinner">Loading...</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team, i) => (
                        <details key={team._id} className="col-span-1 bg-gray-600 rounded-2xl font-bold">
                            <summary className="text-white cursor-pointer p-2 hover:bg-gray-800 rounded">
                                {i + 1}. {team.teamname}
                            </summary>
                            <AttenCard team={team} />
                        </details>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Attd;