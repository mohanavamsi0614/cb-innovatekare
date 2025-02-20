import axios from "axios"
import { useEffect, useState } from "react"
import api from "./api"

function Hoste() {
    const [team, setTeam] = useState([])
    const [host, setHost] = useState("")
    
    useEffect(() => {
        axios.get(`${api}/event/students`).then((res) => {setTeam(res.data)})
    }, [])
    
    function sub(id, host) {
        axios.post(`http://localhost:3001/event/host`, {id, host})
            .then((res) => {
                console.log(res.data)
                alert('Host updated successfully!')
            })
            .catch(err => alert('Failed to update host'))
    }
    
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Team Host Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((team) => (
                    <div key={team._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Team: {team.teamname}
                            </h2>
                            <p className="text-gray-600 text-sm">
                                Current Host: {team.type || 'Not assigned'}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <input 
                                type="text"
                                placeholder="Enter host name"
                                onChange={(e) => setHost(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button 
                                onClick={() => sub(team._id, host)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Hoste