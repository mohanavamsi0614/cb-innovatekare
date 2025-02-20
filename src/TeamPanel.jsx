import { useEffect, useState } from "react";
import logo from "/public/squid-game-2-smile.jpg";
import axios from "axios";
import api from "./api";
import { io } from "socket.io-client";
import kalasalingam from "/public/kalasalingam.png"
import cb from "/KARE(latest).png"
import lod from "/image_processing20210907-13511-1juj33d.gif"
const socket = io(api);

function TeamPanel() {
    const [pass, setPass] = useState(localStorage.getItem("token") || "");
    const [team, setTeam] = useState(null);

    const [link, setLink] = useState(localStorage.getItem("link") || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [leaderboard, setLeaderboard] = useState([]);
    const [ProblemID,setProblemID]=useState()
    const [feedback,setfeedback]=useState("")
          
    
function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      const currentDate = new Date();
      const currentTime = currentDate.getTime();
      
      

      setTime(currentDate.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []); 


  return (
    <div style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center" }}>
      Current Time: {time}
    </div>
  );
}


    const verify = () => {
        setLoading(true);
        setError("");
        axios.post(`${api}/event/team/${pass}`)
            .then((res) => {
                const data = res.data;
                localStorage.setItem("token", pass);
                setTeam(data);
                setProblemID(data.ProblemID)
                console.log(ProblemID)
                setLeaderboard(data.sort((a, b) => b.score - a.score));
            })
            .catch(() => {
                setError("Invalid password. Please try again.");
            })
            .finally(() => {
                setLoading(false);
            });
            axios.get(`${api}/event/students`).then((res) => {
                const data = res.data;
                setLeaderboard(data.sort((a, b) => b.HuntScore - a.HuntScore).slice(0, 10));
            });
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setLoading(true);
            axios.get(`${api}/event/students`).then((res) => {
                const data = res.data;
                setLeaderboard(data.sort((a, b) => b.HuntScore - a.HuntScore).slice(0, 10));
            });
            axios.post(`${api}/event/team/${pass}`)
                .then((res) => {
                    const data = res.data;
                    console.log(data)
                    setTeam(data);
                    setProblemID(data.ProblemID)
                })
                .catch(() => {
                    setError("Failed to fetch team data.");
                })
                .finally(() => {
                    setLoading(false);
                });
            socket.on("team", (team) => {
                setTeam(team);
                console.log(team)
            });
        }
    }, []);

    useEffect(() => {
        if (team) {
            socket.emit("join", team.teamName);
        }
    }, [team]);

        socket.on("leaderboard", (leaderboard) => {
            setLeaderboard(leaderboard.slice(0, 10));
            console.log(leaderboard)
        });

    const attendanceClass = (attendance) => 
        attendance === "P" ? "text-green-500" : "text-red-500";

    const Navbar = () => (
        <nav className="bg-black p-4 fixed w-full top-0 z-50">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center">
                    <img src={logo} className="w-12 h-12 sm:w-16 sm:h-16 rounded-full relative" alt="Logo" />
                    <h1 className="text-[#f44786] text-xl sm:text-2xl font-bold ml-3">Cb innovative KARE</h1>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <a href="#schedule" className="text-[#f44786] hover:text-gray-400 transition-colors">Event Schedule</a>
                    <a href="#leaderboard" className="text-[#f44786] hover:text-gray-400 transition-colors">Leaderboard</a>
                    <a href="#resources" className="text-[#f44786] hover:text-gray-400 transition-colors">Resources</a>
                </div>
            </div>
        </nav>
    );

    if (!localStorage.getItem("token")) {
        return (
            <div className="bg-black w-full h-screen flex justify-center flex-col items-center font-mono">
                <div className="w-full flex justify-center items-center">
                    <img src={kalasalingam} className="size-20" alt="Kalasalingam Logo" />
                    <img src={cb} className="size-24 relative ml-5 rounded-full" alt="Coding Blocks Logo" />
                </div>
                <p className="text-3xl font-bold text-center text-[#f44786]">
                    <span className="text-[#E16254]">Squid Game Kare</span> Presents
                </p>
                <h1 className="text-5xl mt-2 text-[#f44786]">Build a Bot</h1>
                <p className="text-xl m-2 text-[#f44786]">A 24-Hours Hackathon</p>
                <div className="bg-white rounded-lg shadow-lg p-8 w-96 flex flex-col">
                    <h1 className="text-4xl font-semibold text-center mb-6">Team Access Panel</h1>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="pass" className="text-lg mb-2">Enter Password:</label>
                        <input
                            id="pass"
                            placeholder="Enter passcode"
                            className="border border-gray-400 h-12 px-3 rounded-md"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                        />
                        <p>The Password is on your table</p>
                    </div>
                    <button
                        className="bg-[#f44786] py-3 rounded-md text-white font-semibold hover:bg-pink-600 transition duration-200"
                        onClick={verify}
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Submit"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white flex flex-col">
            <Navbar />
            <div className="pt-24 sm:pt-28 px-4"> {/* Changed mt-20 to pt-24 for better spacing */}
                {loading ? (
                    <div className="w-full h-[80vh] flex flex-col justify-center items-center">
                        <div className="animate-pulse"><img src={lod} className="w-32 h-32 sm:w-48 sm:h-48 rounded-full" /></div>
                        <p className="text-center text-xl sm:text-2xl mt-6 font-bold">Loading...</p>
                    </div>
                ) : (
                    team ? (
                        <div className="w-full max-w-7xl p-4 sm:p-6 mx-auto">
                            <h1 className="text-3xl sm:text-4xl text-center mb-8 text-[#f44786] font-bold mt-4">
                                Welcome, {team.teamname}!
                            </h1>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                                {/* Team Info Section */}
                                <div className="lg:col-span-2 border border-gray-700 rounded-lg p-4 sm:p-6 bg-gray-900">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                        <h2 className="text-2xl font-bold">Team Information</h2>
                                        <Clock />
                                    </div>
                                    
                                    {/* Team Details */}
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Team Leader</h3>
                                            <p className="text-lg">👑 {team.name} ({team.registrationNumber})</p>
                                        </div>
                                        
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Team Members</h3>
                                            <div className="border border-gray-700 rounded-lg max-h-40 overflow-y-auto p-4 bg-gray-800">
                                                {team.teamMembers.map((member, index) => (
                                                    <p key={index} className="mb-2 text-gray-300">
                                                        {index + 1}. {member.name} ({member.registrationNumber})
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Team Logo Section */}
                                <div className="rounded-lg flex justify-center items-center p-4 bg-gray-900">
                                    <img src={logo} alt="Team Logo" className="max-w-full max-h-64 rounded-lg object-cover" />
                                </div>
                            </div>

                            <div className="overflow-x-auto mb-6 bg-gray-900 rounded-lg p-4">
                                <h2 className="text-2xl font-bold mb-4">Attendance Tracker</h2>
                                <div className="inline-block min-w-full align-middle">
                                    <table className="min-w-full divide-y divide-gray-700">
                                        <thead>
                                            <tr className="bg-[#f44786] text-white font-bold">
                                                <th className="border border-gray-300 px-4 py-2">Name</th>
                                                <th className="border border-gray-300 px-4 py-2">1st Attd</th>
                                                <th className="border border-gray-300 px-4 py-2">2nd Attd</th>
                                                <th className="border border-gray-300 px-4 py-2">3rd Attd</th>
                                                <th className="border border-gray-300 px-4 py-2">4th Attd</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">{team.name}</td>
                                                <td className={`border border-gray-300 px-4 py-2 text-center ${attendanceClass(team?.FirstAttd)}`}>{team?.FirstAttd}</td>
                                                <td className={`border border-gray-300 px-4 py-2 text-center ${attendanceClass(team?.SecondAttd)}`}>{team?.SecondAttd}</td>
                                                <td className={`border border-gray-300 px-4 py-2 text-center ${attendanceClass(team?.ThirdAttd)}`}>{team?.ThirdAttd}</td>
                                                <td className={`border border-gray-300 px-4 py-2 text-center ${attendanceClass(team?.FourthAttd)}`}>{team?.FourthAttd}</td>
                                            </tr>
                                            {team.teamMembers.map((member) => (
                                                <tr key={member.id}>
                                                    <td className="border border-gray-300 px-4 py-2">{member.name}</td>
                                                    <td className={`border border-gray-300 px-4 py-2 text-center ${attendanceClass(member?.FirstAttd)}`}>{member?.FirstAttd}</td>
                                                    <td className={`border border-gray-300 px-4 py-2 text-center ${attendanceClass(member?.SecondAttd)}`}>{member.SecondAttd}</td>
                                                    <td className={`border border-gray-300 px-4 py-2 text-center ${attendanceClass(member?.ThirdAttd)}`}>{member.ThirdAttd}</td>
                                                    <td className={`border border-gray-300 px-4 py-2 text-center ${attendanceClass(member?.FourthAttd)}`}>{member.FourthAttd}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
                                    <h2 className="text-2xl sm:text-3xl text-center font-bold text-[#f44786] mb-4">Your Domain</h2>
                                    <div className="text-center p-4 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
                                        Click to View Domain
                                    </div>
                                </div>

                                <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
                                    <h2 className="text-2xl sm:text-3xl text-center font-bold text-[#f44786] mb-4">Problem Statement</h2>
                                    <textarea 
                                        className="w-full h-32 bg-gray-800 text-white rounded-lg p-4 border border-gray-700 focus:border-[#f44786] focus:ring-1 focus:ring-[#f44786] outline-none"
                                        placeholder="Enter your problem statement..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4 text-[#f44786]">Leaderboard</h2>
                                    <div className="h-48 overflow-y-auto bg-gray-800 rounded-lg p-4">
                                        {leaderboard.map((item, index) => (
                                            <div key={index} className="mb-2 p-2 bg-gray-700 rounded-lg flex justify-between items-center">
                                                <span>#{index + 1} {item.teamname}</span>
                                                <span className="font-bold">{item.score || 0}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
                                    <h2 className="text-2xl font-bold mb-4 text-[#f44786]">Event Updates</h2>
                                    <div className="h-48 overflow-y-auto bg-gray-800 rounded-lg p-4">
                                        <div className="animate-pulse text-center text-gray-400">
                                            Live updates will appear here...
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-xl mt-10">Failed to load team data. Please try again later.</p>
                    )
                )}
                <footer className="mt-auto border-t border-gray-800">
                    <p className="text-center p-4 text-gray-400">Made with 💖 By Coding Blocks KARE</p>
                </footer>
            </div>
        </div>
    );
}

export default TeamPanel;