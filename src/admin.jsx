import { useEffect, useState } from "react";
import "./admin.css";
import PaymentCard from "./components/PaymentVeriy";
import axios from "axios";
import api from "./api";
import { io } from "socket.io-client";
const socket=io(api)
function Admin() {
    const [teams, setTeams] = useState([]);
    const [verifiedCount, setVerifiedCount] = useState(0);
    const [notVerifiedCount, setNotVerifiedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        socket.on("check",(res)=>{
            console.log(res)
            if(res=="ok"){
                data()
            }
        })
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
                <div className=" bg-orange-300 text-white p-6 rounded-lg shadow-lg flex-1 mx-2">
                    <h2 className="text-2xl font-semibold">Total Teams</h2>
                    <p className="text-4xl mt-2">{teams.length}</p>
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
                            <PaymentCard team={team} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Admin;