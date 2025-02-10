import { useEffect, useState } from "react";
import "./admin.css";
import PaymentCard from "./components/PaymentVeriy";
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
            <h1 className="text-3xl text-white text-center mt-4 mb-6">Admin Dashboard</h1>
            <div className="flex flex-col md:flex-row justify-around mb-8 space-y-4 md:space-y-0">
                <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg flex-1 mx-2">
                    <h2 className="text-2xl font-semibold">Present</h2>
                    <p className="text-4xl mt-2">{present}</p>
                </div>
                <div className="bg-red-600 text-white p-6 rounded-lg shadow-lg flex-1 mx-2">
                    <h2 className="text-2xl font-semibold">Absent</h2>
                    <p className="text-4xl mt-2">{absent}</p>
                </div>
                <div className=" bg-orange-300 text-white p-6 rounded-lg shadow-lg flex-1 mx-2">
                    <h2 className="text-2xl font-semibold">Total Members</h2>
                    <p className="text-4xl mt-2">{pop}</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="loading-spinner">Loading...</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams.map((team, i) => (
                        <div key={team._id} className="col-span-1">
                            <p className="text-white">{i + 1}</p>
                            <AttenCard team={team} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Attd;