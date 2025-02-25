import { useEffect, useRef, useState } from "react";
import logo from "/public/squid-game-2-smile.jpg";
import axios from "axios";
import api from "./api";
import { io } from "socket.io-client";
import kalasalingam from "/public/kalasalingam.png"
import cb from "/public/KARE(latest).png"
import lod from "/image_processing20210907-13511-1juj33d.gif"
import title from "/public/group-84.png"
import square from "/public/square-svgrepo-com.svg"
import circle from "/public/circle-svgrepo-com.svg"
import triangle from "/public/triangle-svgrepo-com.svg"
import squido from "/public/squido.png"
import umbr from "/public/umbrella-svgrepo-com.svg"
import attendance from "/public/Attdance.png"
import Scoreboard from  "/public/Score.png"
import YourDomain from "/public/Your Domain.png"
import ProblemStatement from "/public/Problem Statement.png"
import Eventup from "/public/EventUp.png"
import PLAYERSPROFILE from "/public/prof.png"
const socket = io(api);

function TeamPanel() {
    const [pass, setPass] = useState(localStorage.getItem("token") || "");
    const [team, setTeam] = useState(null);
    const [DomainLoading,setDomainLoading]=useState(false)
    const [link, setLink] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [leaderboard, setLeaderboard] = useState([]);
    const [ProblemID,setProblemID]=useState()
    const sym=[square,circle,umbr,triangle]
    const [selectedDomain, setSelectedDomain] = useState();
    const [DomainData,setDomainData]=useState([]);
    
    const handleDomainSelect = (domainId) => {
        setSelectedDomain(domainId)
    };
    const handleDomain=()=>{
        setDomainLoading(true);
        socket.emit("domainSelected", { teamId: team._id, domain: selectedDomain });
    }
          
const [showCamera, setShowCamera] = useState(false);
const [capturedImage, setCapturedImage] = useState(null);
const videoRef = useRef(null);
const photoRef = useRef(null);

const startCamera = async () => {
    setShowCamera(true);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" }, 
            audio: false 
        });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (err) {
        console.error("Error accessing camera:", err);
    }
};

const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    setShowCamera(false);
};

const capturePhoto = () => {
    const video = videoRef.current;
    const photo = photoRef.current;
    const ctx = photo.getContext('2d');
    
    photo.width = video.videoWidth;
    photo.height = video.videoHeight;
    
    ctx.drawImage(video, 0, 0, photo.width, photo.height);
    
    const imageData = photo.toDataURL('image/jpeg');
    setCapturedImage(imageData);
    stopCamera();
};

function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      const currentDate = new Date();
      setTime(currentDate.toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []); 


  return (
    <div style={{ fontSize: "24px", fontWeight: "bold", textAlign: "center",backgroundColor:"white",color:"black",padding:"5px",borderRadius:"5px" }}>
    {time}
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
            socket.emit("domaindat","")
            socket.on("domainSelected",(res)=>{
                window.location.reload()
                setDomainLoading(false)
            })
            socket.on("domaindata",(res)=>{
                console.log(res)
                setDomainData(res)
            })
        }
    }, []);

    useEffect(() => {
        if (team) {
            socket.emit("join", team.teamname);
        }
    }, [team]);

        socket.on("leaderboard", (leaderboard) => {
            setLeaderboard(leaderboard.slice(0, 10));
            console.log(leaderboard)
        });

    const attendanceClass = (attendance) => {
        switch(attendance) {
            case 'Present':
                return 'bg-green-500 rounded-full w-4 h-4 mx-auto';
            case 'Absent':
                return 'bg-red-500 rounded-full w-4 h-4 mx-auto';
            default:
                return 'bg-gray-300 rounded-full w-4 h-4 mx-auto';
        }
    };

    const Navbar = () => (
        <nav className="bg-gradient-to-r from-[#1a1a1a]/80 to-[#333]/80 backdrop-blur-md p-3 fixed w-full top-0 z-50 border-b border-white/10">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <img src={cb} className="w-12 h-12 sm:w-14 sm:h-14 rounded-full relative hover:scale-105 transition-transform" alt="Logo" />
                        <div className="h-8 w-px bg-white/20 hidden sm:block" />
                    </div>
                    <img src={title} className="h-8 sm:h-10 hover:opacity-80 transition-opacity"/>
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                    {['Event Schedule', 'Leaderboard', 'Resources'].map((item, index) => (
                        <a 
                            key={index}
                            href={`#${item.toLowerCase().replace(' ', '-')}`} 
                            className="relative text-white/90 hover:text-white font-[Poppins] text-[16px] sm:text-[18px] font-bold 
                                     transition-all duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 
                                     after:bg-[#34D4BA] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all 
                                     after:duration-300"
                        >
                            {item}
                        </a>
                    ))}
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
            <div className="pt-24 sm:pt-28 px-2">
                {loading ? (
                    <div className="w-full h-[80vh] flex flex-col justify-center items-center">
                        <div className="animate-pulse"><img src={lod} className="w-32 h-32 sm:w-48 sm:h-48 rounded-full" /></div>
                        <p className="text-center text-xl sm:text-2xl mt-6 font-bold">Loading...</p>
                    </div>
                ) : (
                    team ? (
                        
                        <div className="w-full max-w-7xl p-2 sm:p-6 mx-auto">
                        
                            <div className="bg-gradient-to-r from-[#34D4BA] to-[#20D4B7] rounded-xl p-1 mb-10 mt-10">
                                <div className="bg-gradient-to-r from-[#34D4BA]/10 to-[#20D4B7]/10 backdrop-blur-sm rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl animate-bounce">
                                            👋
                                        </div>
                                        <div className="flex flex-col">
                                            <h1 className="text-2xl sm:text-[36px] font-bold text-black">
                                                Welcome, <span className="text-white">{team.teamname}!</span>
                                            </h1>
                                            <p className="text-black/70 text-sm sm:text-base">Let's build something amazing together</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Clock />
                                        <div className="hidden sm:flex h-12 w-px bg-white/20" />
                                        <div className="hidden sm:block text-black text-sm">
                                            <div>Hackathon</div>
                                            <div className="font-bold">24 Hours</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{
                                width: "100%", 
                                minHeight: "464px",
                                background: 'linear-gradient(98deg, rgba(191.25, 191.25, 191.25, 0.40) 0%, rgba(102, 102, 102, 0.36) 100%)', 
                                borderRadius: 21, 
                                border: '0.5px white solid'
                            }} 
                            className="flex flex-col md:flex-row justify-center items-center p-4">
                                <div className="flex flex-col w-full md:w-1/2">
                                    <div className="w-full md:w-[400px] flex items-center h-[62px] text-center text-[#f73e91] text-[28px] md:text-[34px] font-normal font-['Game Of Squids'] leading-[19px] tracking-widest">
                                        <img src={PLAYERSPROFILE}/>
                                    </div>
                                    <div className=" flex items-center m-2"> <div className="w-[45px] h-[45px] flex justify-center items-center bg-[#ffcc00] rounded-full shadow-[inset_17px_15px_9.100000381469727px_-7px_rgba(189,152,6,0.51)] shadow-[inset_-4px_-5px_4px_0px_rgba(225,180,2,1.00)] border border-black mr-5" >👑</div>{team.name}</div>
                                {team.teamMembers.map((i,j)=>(
                                    <div className=" flex  items-center m-1.5" key={j}>
                                    <div className="w-[45px] mr-4 flex justify-center items-center text-xl h-[45px] bg-[#ffcc00] rounded-full shadow-[inset_17px_15px_9.100000381469727px_-7px_rgba(189,152,6,0.51)] shadow-[inset_-4px_-5px_4px_0px_rgba(225,180,2,1.00)] border border-black" ><img src={sym[j]} className=" w-1/2"/></div>
                                    {i.name}({i.registrationNumber})
</div>
                    ))}
                                </div>
                                <div className="flex flex-col justify-center items-center w-full md:w-1/2 mt-4 md:mt-0">
    {showCamera ? (
        <div className=" flex flex-col">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-40 md:h-56 w-[400px] rounded-2xl"
            />
            <canvas ref={photoRef} style={{ display: 'none' }} />
            <button 
                onClick={capturePhoto}
                className=" 
                         bg-[#34D4BA] px-4 py-2 mt-10 rounded-full text-white
                         hover:bg-[#f73e90] transition-colors"
            >
                 Capture
            </button>
        </div>
    ) : capturedImage ? (
        <div className=" flex flex-col">
            <img 
                src={capturedImage} 
                alt="Captured" 
                className="h-40 md:h-56 rounded-xl w-[400px]"
            />
            <button className=" mt-5 bg-[#34D4BA] px-4 py-2 rounded-full text-white
">Submit</button>
        </div>
    ) : (
        <>
            <img src={logo} className="h-40 md:h-56 rounded-xl"/>
            <button 
                onClick={startCamera}
                className="bg-[#34D4BA] mt-5 border-white border-2 hover:bg-[#f73e90] 
                         rounded-4xl p-2 w-full md:w-[300px] h-[50px] flex items-center 
                         justify-center gap-2"
            >
                <span>📸</span> Take A Photo!
            </button>
        </>
    )}
</div>
                            </div>
                            <div className="overflow-x-auto mb-6 bg-black border border-white mt-10 rounded-lg p-2 md:p-4">
                                <h2 className="text-xl md:text-2xl font-bold mb-4"><img src={attendance} className=" w-96"/></h2>
                                <div className="inline-block min-w-full align-middle">
                                    <table className="min-w-full divide-y divide-gray-700 text-sm md:text-base">
                                        <thead>
                                            <tr className="bg-[#34D4BA] text-black font-bold">
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
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <div className={attendanceClass(team?.FirstAttd)}></div>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <div className={attendanceClass(team?.SecondAttd)}></div>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <div className={attendanceClass(team?.ThirdAttd)}></div>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <div className={attendanceClass(team?.FourthAttd)}></div>
                                                </td>
                                            </tr>
                                            {team.teamMembers.map((member) => (
                                                <tr key={member.id}>
                                                    <td className="border border-gray-300 px-4 py-2">{member.name}</td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <div className={attendanceClass(member?.FirstAttd)}></div>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <div className={attendanceClass(member?.SecondAttd)}></div>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <div className={attendanceClass(member?.ThirdAttd)}></div>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <div className={attendanceClass(member?.FourthAttd)}></div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row justify-evenly gap-6 mt-10">
                                <div className="w-full md:w-1/2 rounded-2xl p-4 md:p-6 bg-gradient-to-br bg-yellow-300/50">
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-center gap-2 mb-6">
                                            <span className="text-3xl">🏆</span>
                                            <h1 className="text-3xl font-bold "><img src={Scoreboard} className=" w-96"/></h1>
                                        </div>
                                        <div className="space-y-3">
                                            {leaderboard.map((item, index) => (
                                                <div key={index} 
                                                style={{background: `linear-gradient(90deg, #FFE684 0%, #E9BA00 100%);`
}}
                                                    className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-102
                                                        ${index === 0 ? 'bg-gradient-to-r from-yellow-300 to-yellow-400 shadow-lg' :
                                                          index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                                                          index === 2 ? 'bg-gradient-to-r from-[#CD7F32] to-orange-600' :
                                                          ' backdrop-blur-md'} bg-gradient-to-r from-[#FFE684] to-[#E9BA00] `}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                                                ${index === 0 ? 'bg-yellow-200 text-black' :
                                                                  index === 1 ? 'bg-gray-200 text-black' :
                                                                  index === 2 ? 'bg-orange-200 text-black' :
                                                                  'bg-white/20 text-black'}`}
                                                            >
                                                                {index + 1}
                                                            </div>
                                                            <span className="font-bold text-black">
                                                                {item.teamname}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-black">Score:</span>
                                                            <span className="font-bold text-black bg-white/30 px-3 py-1 rounded-full">
                                                                {item.score || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-1/2 flex flex-col gap-4">
                                    <div className="rounded-2xl h-1/2">
                                        <img src={squido} className="h-full w-full object-cover rounded-2xl"/>
                                    </div>
                                    <div className="rounded-2xl p-6 bg-gradient-to-r from-[#3BEACE] to-[#20D4B7] h-96 flex flex-col justify-center items-center">
                                        <h2 className="text-2xl font-bold text-black mb-4"><img src={YourDomain}/></h2>
                                        {!team.Domain ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                {DomainData.map((domain) => (
                                                    <button
                                                        key={domain.id}
                                                        onClick={() => handleDomainSelect(domain.id)}
                                                        className={`flex items-center gap-2 p-3 ${domain.id==selectedDomain ? " bg-pink-400 " :"bg-white/20 "} 
                                                                  rounded-xl transition-all duration-300
                                                                 border-2 border-white/50`}
                                                    >
                                                        <span className="text-sm font-medium text-black">
                                                            {domain.name}
                                                        </span>
                                                    </button>
                                                ))}
                                                <button className=" bg-[#3BEACE] p-4 border rounded-2xl " onClick={handleDomain}>Submit</button>
                                            </div>
                                        ) : (
                                            <div className="bg-white/20 p-4 rounded-xl">
                                                <p className="text-black font-bold">
                                                {team.Domain}
                                                </p>
                                         
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col md:flex-row gap-6">
                                {team.Domain && (
                                    <div className="w-full md:w-1/2">
                                        <div className="bg-[#D2003F] h-full rounded-2xl p-4 md:p-6">
                                            <h2 className="text-xl md:text-2xl font-bold mb-4 text-white"><img src={ProblemStatement}/></h2>
                                            <textarea 
                                                placeholder="Your problem statement here..."
                                                className="w-full h-[180px] md:h-[207px] p-4 bg-white/20 border border-white/30 
                                                         rounded-xl text-white placeholder-white/50 resize-none
                                                         focus:outline-none focus:border-white"
                                            />
                                            <button className=" border rounded-2xl p-4">Submit</button>
                                        </div>
                                    </div>
                                )}
                                <div className="w-full md:w-1/2">
                                    <div className="h-full rounded-lg p-4 md:p-6 shadow-lg bg-white/20 backdrop-blur-2xl"
                                        style={{background: 'linear-gradient(109.53deg, rgba(255, 255, 255, 0.23) 3.27%, rgba(145, 145, 145, 0.47) 96.91%)'}}
                                    >
                                        <h2 className="text-xl md:text-2xl font-bold mb-4 text-white"><img src={Eventup}/></h2>
                                        <div className="h-[180px] md:h-[207px] overflow-y-auto rounded-lg p-4">
                                            <div className="animate-pulse text-center text-gray-400">
                                                Live updates will appear here...
                                            </div>
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