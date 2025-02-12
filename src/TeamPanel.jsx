import { useEffect, useState } from "react";
import logo from "/public/cb.png";
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
        <nav className="bg-black p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <img src={logo} className="size-16 rounded-full relative top-1" />
                    <h1 className="text-pink-500 text-2xl font-bold">Cb innovative KARE</h1>
                </div>
                <div>
                    <a href="#schedule" className="text-pink-500 mx-4 hover:text-gray-400">Event Schedule</a>
                    <a href="#leaderboard" className="text-pink-500 mx-4 hover:text-gray-400">Leaderboard</a>
                    <a href="#resources" className="text-pink-500 mx-4 hover:text-gray-400">Resources</a>
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
                <p className="text-3xl font-bold text-center text-pink-500">
                    <span className="text-[#E16254]">Squid Game Kare</span> Presents
                </p>
                <h1 className="text-5xl mt-2 text-pink-500">Build a Bot</h1>
                <p className="text-xl m-2 text-pink-500">A 24-Hours Hackathon</p>
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
                        className="bg-pink-500 py-3 rounded-md text-white font-semibold hover:bg-pink-600 transition duration-200"
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
        <div className="bg-black w-full h-full text-white flex flex-col">
            <Navbar />
            {loading ? (
                <div className="w-full h-screen flex flex-col justify-center items-center">
                    <div><img src={lod} className="size-48 rounded-full" /></div>
                    <p className="text-center text-2xl mt-10 font-bold">Loading...</p>
                </div>
            ) : (
                team ? (
                    <div className="w-full max-w-5xl p-6 mx-auto">
                        <h1 className="text-4xl text-center mb-6 text-pink-500 font-bold">Welcome, {team.teamname}!</h1>
                        <hr className="mb-6 border-gray-600" />
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                            <div className="border border-gray-700 rounded-lg p-6 w-full md:w-[70%]">
                                <h2 className="text-2xl font-bold mb-4">Team Leader</h2>
                                <p className="text-lg mb-6">👑 {team.name} ({team.registrationNumber})</p>
                                <h2 className="text-xl font-bold mb-4">Team Members</h2>
                                <div className="border border-gray-700 rounded-lg h-40 overflow-y-auto p-4">
                                    {team.teamMembers.map((member, index) => (
                                        <p key={index} className="mb-2">{index + 1}. {member.name} ({member.registrationNumber})</p>
                                    ))}
                                </div>
                                <Clock />
                                <div>
                                    <table className="table-auto rounded-lg border-collapse border mt-4 border-gray-300 w-full text-left">
                                        <thead>
                                            <tr className="bg-pink-500 text-white font-bold">
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
                            <div className="bg-gray-700 rounded-lg flex justify-center items-center w-full md:w-1/3 h-72 mt-8 md:mt-0 md:ml-11">
                                <img src={logo} alt="Team Logo" className="max-w-full max-h-full rounded-lg" />
                            </div>
                        </div>
                        <div className="mb-6 p-6 bg-gray-800 rounded-lg shadow-lg">
                            <h2 className="text-4xl text-center font-bold text-pink-500 mb-4">Your Domain</h2>
                            <div>Click Me!</div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-xl mt-10">Failed to load team data. Please try again later.</p>
                )
            )}
            <hr />
            <p className="text-center p-4">Made with 💖 By Coding Blocks KARE</p>
        </div>
    );
}

export default TeamPanel;