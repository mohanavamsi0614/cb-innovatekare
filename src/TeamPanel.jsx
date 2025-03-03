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
import expra from "/public/expra.png"
import scorecraft from "/public/scorecraft.jpg"
import card from "/public/card.png"
import card1 from "/public/card1.png"
import Modal from 'react-modal';
import one from "/public/Chars/001.png"
import sixtyseven from "/public/Chars/067.png"
import onezeroone from "/public/Chars/101.png"
import oneninenine from "/public/Chars/101.png"
import twooneeight from "/public/Chars/218.png"
import fourfivesix from "/public/Chars/456.png"
import attd from "/public/download-removebg-preview (8).png"
import king from "/public/king.png"
import prob from "/public/prob.png"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const socket = io(api);

function TeamPanel() {
    const [pass, setPass] = useState(localStorage.getItem("token") || "");
    const [EventUp,setEventUp]=useState("")
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
    const [domain,setDomain]=useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ProblemStatement,setProblemStatement]=useState("")
    const [photoLoading, setPhotoLoading] = useState(false);
    const [problemSubmitting, setProblemSubmitting] = useState(false);
    const [photoError, setPhotoError] = useState("");
    const [problemError, setProblemError] = useState("");
    const [hasNewUpdate, setHasNewUpdate] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    
    const handleDomainSelect = (domainId) => {
        setSelectedDomain(domainId)
    };
    const handleDomain = async () => {
        setDomainLoading(true);
        try {
            socket.emit("domainSelected", { teamId: team._id, domain: selectedDomain });
        } catch (error) {
            setDomainLoading(false);
            console.log(error)
        }
    };
          
const [showCamera, setShowCamera] = useState(false);
const [capturedImage, setCapturedImage] = useState(null);
const videoRef = useRef(null);
const photoRef = useRef(null);

const startCamera = async () => {
    setShowCamera(true);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                facingMode: "user",
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }, 
            audio: false 
        });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (err) {
        console.error("Error accessing camera:", err);
        setPhotoError("Failed to access camera. Please check permissions.");
    }
};

const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
    }
    setShowCamera(false);
};

const capturePhoto = async () => {
    setPhotoLoading(true);
    setPhotoError("");
    try {
        const video = videoRef.current;
        const photo = photoRef.current;
        const ctx = photo.getContext('2d');
        
        photo.width = video.videoWidth;
        photo.height = video.videoHeight;
        
        ctx.drawImage(video, 0, 0, photo.width, photo.height);
        
        const imageData = photo.toDataURL('image/jpeg');
        const cloudinaryResponse = await axios.post(
            "https://api.cloudinary.com/v1_1/dus9hgplo/image/upload",
            {file: imageData, upload_preset: "vh0llv8b"}
        );
        
        setCapturedImage(cloudinaryResponse.data.secure_url);
        await axios.post(`${api}/pic`, {
            id: team._id,
            photo: cloudinaryResponse.data.secure_url
        });
        
        stopCamera();
        window.location.reload()
    } catch (err) {
        setPhotoError("Failed to upload image. Please try again.");
        console.error("Photo upload error:", err);
    } finally {
        setPhotoLoading(false);
    }
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
                setLeaderboard(data.sort((a, b) => b.SquidScore - a.SquidScore));
            })
            .catch(() => {
                setError("Invalid password. Please try again.");
            })
            .finally(() => {
                setLoading(false);
            });
            axios.get(`${api}/event/students`).then((res) => {
                const data = res.data;
                setLeaderboard(data.sort((a, b) => b.SquidScore - a.SquidScore).slice(0, 10));
            });
    };
    useEffect(() => {
        if (localStorage.getItem("token")) {
            setLoading(true);
            axios.get(`${api}/event/students`).then((res) => {
                const data = res.data;
                setLeaderboard(data.sort((a, b) => b.SquidScore - a.SquidScore).slice(0, 10));
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
            socket.on("eventupdates",(text)=>{
                document.querySelector(".htmlcon").innerHTML=text
                setEventUp(text)
                setHasNewUpdate(true);
                setNotificationVisible(true);
                setTimeout(() => {
                    setNotificationVisible(false);
                }, 10000);
            })
            socket.on("domainSelected", (data) => {
                if(data=="fulled"){
                    alert("Sorry domain got fulled try again now!")
                    axios.get(`${api}/event/students//${pass}`).then((res) => {
                        const data = res.data;
                        setLoading(true)
                        setTeam(data);
                    });
                }
                setDomainLoading(false);
                console.log(data)
                setIsModalOpen(false);
                setLoading(true)
                axios.get(`${api}/event/students/${pass}`).then((res) => {
                    const data = res.data;
                    setLoading(true)
                    setTeam(data);
                });
    
            });
            socket.on("prevevent",(text)=>{
                setEventUp(text)
            })
            socket.on("team", (team) => {
                setTeam(team);
                console.log(team)
            });
            socket.emit("domaindat","")
            socket.on("domaindata",(res)=>{
                console.log("update",res)
                setDomainData(res)
            })
            socket.on("leaderboard", (leaderboard) => {

                setLeaderboard(leaderboard.slice(0, 10));
                console.log("the",leaderboard)
            });
        }
    }, []);

    useEffect(() => {
        if (team) {
            socket.emit("join", team.teamname);
        }
    }, [team]);

    

    const attendanceClass = (attendance) => {
        switch(attendance) {
            case 'Present':
                return 'bg-green-500 border-3 border-white rounded-full w-8 h-8 mx-auto flex items-center text-white justify-center shadow-[inset_0_0_8px_rgba(34,197,94,0.4)] text-green-500 text-lg font-bold';
            case 'Absent':
                return 'bg-red-500 border-3 border-white rounded-full w-8 h-8 mx-auto flex items-center justify-center shadow-[inset_0_0_8px_rgba(239,68,68,0.4)] text-red-500 text-lg font-bold text-white';
            default:
                return 'bg-gray-500/20 border-2 border-gray-400 rounded-full w-8 h-8 mx-auto flex items-center justify-center shadow-[inset_0_0_8px_rgba(156,163,175,0.4)]';
        }
    };

    const attendanceIcon = (attendance) => {
        switch(attendance) {
            case 'Present':
                return '✓';
            case 'Absent':
                return '✕';
            default:
                return '';
        }
    };
    const handleProblemStatement = async () => {
        if (!ProblemStatement.trim()) {
            setProblemError("Please enter a problem statement");
            return;
        }

        setProblemSubmitting(true);
        setProblemError("");

        try {
            const response = await axios.post(`${api}/problemSta`, {
                id: team._id,
                PS: ProblemStatement.trim()
            });

            if (response.data) {
                setTeam(prev => ({
                    ...prev,
                    ProblemStatement: ProblemStatement.trim()
                }));
            }
        } catch (err) {
            setProblemError("Failed to submit problem statement. Please try again.");
            console.error("Problem statement error:", err);
        } finally {
            setProblemSubmitting(false);
        }
    };

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            if (sectionId === 'event-updates') {
                setHasNewUpdate(false);
                setNotificationVisible(false);
            }
        }
    };

    const Navbar = () => (
        <nav className="bg-gradient-to-r from-[#1a1a1a]/80 to-[#333]/80 backdrop-blur-md p-3 fixed w-full top-0 z-50 border-b border-white/10">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <img src={cb} className="w-16 h-16 sm:w-16 sm:h-16 rounded-full relative hover:scale-105 transition-transform" alt="Logo" />
                        <div className="h-8 w-px bg-white/20 hidden sm:block" />
                    </div>
                    <div>
                <img src={title} className=" w-50"/>
                <img src={expra} className=" relative w-27  bottom-4.5"/>
                </div>                </div>
                <div className="flex flex-wrap justify-center gap-6">
                    {[
                        { name: 'Event Updates', id: 'event-updates' },
                        { name: 'Leaderboard', id: 'leaderboard' },
                        { name: 'Problem Statement', id: 'problem-statement' }
                    ].map((item, index) => (
                        <a 
                            key={index}
                            onClick={() => scrollToSection(item.id)}
                            className="relative text-white/90 hover:text-white font-[Poppins] text-[16px] sm:text-[18px] font-bold 
                                     transition-all duration-300 after:content-[''] after:absolute after:w-0 after:h-0.5 
                                     after:bg-[#34D4BA] after:left-0 after:-bottom-1 hover:after:w-full after:transition-all 
                                     after:duration-300 cursor-pointer"
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );

    if (!localStorage.getItem("token")) {
        return (
            <div className="bg-black w-full h-screen flex justify-center flex-col items-center font-mono">
                <div className="w-full flex justify-center items-center mb-10">
                    <img src={kalasalingam} className="size-20" alt="Kalasalingam Logo" />
                    <img src={cb} className="size-20 relative border border-white ml-5 rounded-full" alt="Coding Blocks Logo" />
                    <img src={scorecraft} className="size-20 relative ml-5 rounded-full" alt="Coding Blocks Logo"/>
                </div>
                <p className="text-3xl font-bold text-center text-white">
                CODING BLOCKS KARE & SCORECRAFT KARE                </p>
                <h1 className=" text-2xl  text-[#D2003F]  m-4">Presents</h1>
                <div>
                <img src={title} className=" w-60"/>
                <img src={expra} className=" relative w-32  bottom-4.5"/>
                </div>
                <h1 className=" text-[#2BAD98] text-xl mb-10">[24hrs Hackathon]</h1>
                <div className=" relative bg-[#73737370] text-white rounded-lg shadow-lg p-8 w-96 flex flex-col">
                    <img src={card} className="  w-15 absolute z-10 right-[-30px] top-[-50px]"/>
                    <img src={card1} className=" w-15  absolute  right-[1px] top-[-20px]"/>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <div className="flex flex-col mb-6">
                        <label htmlFor="pass" className="text-lg mb-2">Enter Password:</label>
                        <input
                            id="pass"
                            placeholder="Enter passcode"
                            className="border border-white h-12 px-3 rounded-md"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                        />
                        <p>The Password is on your table</p>
                    </div>
                    <button
                        className="bg-[#2BAD98] py-3 rounded-3xl border text-white font-semibold hover:bg-pink-600 transition duration-200"
                        onClick={verify}
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Submit"}
                    </button>
                </div>
            </div>
        );
    }

    const customModalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#1a1a1a',
            border: '1px solid #34D4BA',
            borderRadius: '15px',
            padding: '2rem',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000
        }
    };

    const DomainSelectionModal = () => (
        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={customModalStyles}
            contentLabel="Domain Selection"
        >
            <div className="text-white">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#34D4BA]">🌐 Choose Your Domain</h2>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {DomainData.map((domain) => {
                        if(domain.slots==0){
                            return(
                                <div key={domain.id} className={`
                                cursor-pointer p-4 rounded-xl transition-all duration-300
                                     bg-red-600 hover:bg-white/10 border-2 border-white/10
                                
                            `}>
                                <p className=" text-xl">Slots Filled</p>
                                <p>{domain.name}</p>
                                </div>
                            )
                        }
                        return(
                        <div 
                            key={domain.id}
                            onClick={() => handleDomainSelect(domain.id)}
                            className={`
                                cursor-pointer p-4 rounded-xl transition-all duration-300
                                ${domain.id === selectedDomain 
                                    ? 'bg-[#34D4BA] text-black border-2 border-[#34D4BA]' 
                                    : 'bg-white/5 hover:bg-white/10 border-2 border-white/10'}
                                
                            `}
                        >
                            <h3 className="text-xl font-bold mb-2">{domain.name} ({domain.slots}/10)</h3>
                            <p className="text-sm opacity-80 line-clamp-3">{domain.description}</p>
                        </div>
                    )})}
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            handleDomain();
                        }}
                        className="px-6 py-2 rounded-full bg-[#34D4BA] text-black hover:bg-[#2ba898] transition-colors"
                        disabled={!selectedDomain || DomainLoading}
                    >
                        {DomainLoading ? "Submitting..." : "Confirm Selection"}
                    </button>
                </div>
            </div>
        </Modal>
    );

    const CameraSection = () => (
        <div className="flex flex-col justify-center ml-3 items-center w-full md:w-1/2 mt-4 md:mt-0">
            {photoError && (
                <div className="text-red-500 bg-red-100/10 p-3 rounded mb-4">
                    {photoError}
                </div>
            )}
            {showCamera ? (
                <div className="flex flex-col w-full ml-10">
                    <div className="relative w-full aspect-video right-6 top-5">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="absolute top-0 left-0 w-full h-full object-cover rounded-2xl border-2 border-[#34D4BA]"
                        />
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button 
                                onClick={stopCamera}
                                className="bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                    <canvas ref={photoRef} style={{ display: 'none' }} />
                    <div className="flex justify-center mt-4">
                        <button 
                            onClick={capturePhoto}
                            disabled={photoLoading}
                            className={`
                                bg-[#34D4BA] px-6 py-3 rounded-full text-white
                                hover:bg-[#f73e90] transition-colors relative top-5 right-3 flex items-center gap-2
                                ${photoLoading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        >
                            {photoLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    📸 Capture Photo
                                </>
                            )}
                        </button>
                    </div>
                </div>
            ) : capturedImage || team.GroupPic ? (
                <div className="flex flex-col items-center w-full relative top-6">
                    <div className="relative w-full aspect-video">
                        <img 
                            src={capturedImage || team.GroupPic} 
                            alt="Team Photo" 
                            className="w-full h-full object-cover rounded-xl"
                        />
                    </div>
                    <button 
                        className="mt-5 bg-[#34D4BA] px-6 py-3 rounded-full text-white hover:bg-[#f73e90] transition-colors" 
                        onClick={() => {
                            stopCamera(); // Call stopCamera first to ensure any existing streams are closed
                            startCamera();
                        }}
                    >
                        Retake Photo
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center w-full">
                    <div className="relative w-full flex justify-center aspect-video top-12">
                        <img 
                            src={logo} 
                            className="w-full h-full object-cover rounded-xl"
                            alt="Default"
                        />
                    </div>
                    <button 
                        onClick={startCamera}
                        className="bg-[#34D4BA] mt-15 border-white border-2 hover:bg-[#f73e90] 
                                 rounded-full px-6 py-3 flex items-center gap-2 "
                    >
                        📸 Take A Photo!
                    </button>
                </div>
            )}
        </div>
    );

    const scrollToEventUpdates = () => {
        scrollToSection('event-updates');
    };

    const NotificationBell = () => (
        <div 
            className={`fixed bottom-4 right-4 bg-gradient-to-r from-[#34D4BA] to-[#f73e91] text-white 
                      p-4 rounded-lg shadow-lg z-50 flex items-center gap-3 cursor-pointer
                      transform transition-all duration-300 ${notificationVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            onClick={scrollToEventUpdates}
        >
            <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-swing" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                    1
                </span>
            </div>
            <div>
                <p className="font-bold">New Update!</p>
                <p className="text-sm">Click to view</p>
            </div>
        </div>
    );

    return (
        <div className="bg-black min-h-screen text-white flex flex-col">
            <Navbar />
            <NotificationBell />
            <ToastContainer theme="dark" />
            <div className="pt-42 md:pt-30 px-2">
                {loading ? (
                    <div className="w-full h-[80vh] flex flex-col justify-center items-center">
                        <div className="animate-pulse"><img src={lod} className="w-32 h-32 sm:w-48 sm:h-48 rounded-full" /></div>
                        <p className="text-center text-xl sm:text-2xl mt-6 font-bold">Loading...</p>
                    </div>
                ) : (
                    team ? (
                        
                        <div className="w-full max-w-7xl p-2 sm:p-6 mx-auto">
                        
                            <div className="bg-gradient-to-r from-[#34D4BA] to-[#20D4B7] rounded-md p-1 mb-10 mt-3 ">
                                <div className="bg-gradient-to-r from-[#34D4BA]/10 to-[#20D4B7]/10 backdrop-blur-sm rounded p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl animate-bounce">
                                            👋
                                        </div>
                                        <div className="flex flex-col">
                                            <h1 className="text-xl text sm:text-[30px]  text-black">
                                                Welcome, <span className="text-white">{team.teamname}!</span>
                                            </h1>
                                            <p className="text-black/70 text-sm sm:text-base">Let's build something amazing together</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hidden sm:flex h-12 w-px bg-white/20" />
                                        <div className=" p-3  flex flex-col justify-center items-center font-bold text-center border rounded-md sector border-black text-black text-xl w-56">
                                            {
                                                team.Sector==="001" ? <img className=" size-15" src={one} alt="Character 001" /> :
                                                team.Sector==="067" ? <img className=" size-15" src={sixtyseven} alt="Character 067" /> :
                                                team.Sector==="101" ? <img className=" size-15" src={onezeroone} alt="Character 101" /> :
                                                team.Sector==="199" ? <img className=" size-15" src={oneninenine} alt="Character 199" /> :
                                                team.Sector==="218" ? <img className=" size-15" src={twooneeight} alt="Character 218" /> :
                                                team.Sector==="456" ? <img className=" size-15" src={fourfivesix} alt="Character 456" /> :
                                                null
                                            }
                                            <p className=" text-2xl">Sector: {team.Sector}</p>
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
    <div className="w-full text-center md:w-[400px] mb-6">
        <h2 className="text-[#f73e91] text-[32px] font-['Game Of Squids'] tracking-widest text">
            PLAYERS PROFILE
        </h2>
    </div>
    <div className="space-y-4">
        <div className="bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 backdrop-blur-sm 
                        rounded-xl p-4 border border-[#FFD700]">
            <div className="flex items-center gap-4">
                <div className="w-[50px] h-[50px] flex justify-center items-center 
                              bg-[#ffcc00] rounded-full shadow-[0_0_15px_rgba(255,204,0,0.5)] 
                              border-2 border-[#FFD700] text">
                              <img src={king}/>
                </div>
                <div>
                    <p className="font-bold text-[#FFD700] text-lg">{team.name}({team.registrationNumber})</p>
                    <p className="text-white/70 text-sm">Team Leader</p>
                </div>
            </div>
        </div>

        {team.teamMembers.map((member, index) => (
            <div key={index} 
                 className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm 
                           rounded-xl p-2 border border-white/20 hover:border-[#34D4BA]/50 
                           transition-all duration-300">
                <div className="flex items-center gap-4">
                    <div className="w-[50px] h-[50px] flex justify-center items-center 
                                  bg-[#34D4BA]/20 rounded-full border border-[#34D4BA]/50">
                        <img src={sym[index]} className="w-1/2 opacity-70"/>
                    </div>
                    <div>
                        <p className="font-semibold text-white">{member.name}</p>
                        <p className="text-[#34D4BA] text-sm">{member.registrationNumber}</p>
                    </div>
                </div>
            </div>
        ))}
    </div>
</div>

                                <CameraSection />
                            </div>
                            <div className="overflow-x-auto mb-6 bg-black border border-white mt-10 rounded-lg p-2 md:p-4">
                               <div className=" flex justify-center items-center"> <img src={attd} className=" w-10 mr-0.5 relative bottom-2"/><h2 className="text-xl md:text-2xl text-center  mb-4 text">ATTENDANCE TRACKER</h2></div>
                                <div className="inline-block min-w-full align-middle">
                                    <table className="min-w-full divide-y divide-gray-700 text-sm md:text-base">
                                        <thead>
                                            <tr className="bg-[#34D4BA] text-black font-bold">
                                                <th className="border border-gray-300 px-4 py-4 text-2xl">Name</th>
                                                <th className="border border-gray-300 px-4 py-4 text-2xl">1st Attd</th>
                                                <th className="border border-gray-300 px-4 py-4 text-2xl">2nd Attd</th>
                                                <th className="border border-gray-300 px-4 py-4 text-2xl">3rd Attd</th>
                                                <th className="border border-gray-300 px-4 py-4 text-2xl">4th Attd</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2">{team.name}</td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <div className={attendanceClass(team?.lead.FirstAttd)}>
                                                        {attendanceIcon(team?.lead.FirstAttd)}
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <div className={attendanceClass(team?.lead.SecondAttd)}>
                                                        {attendanceIcon(team?.lead.SecondAttd)}
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <div className={attendanceClass(team?.ThirdAttd)}>
                                                        {attendanceIcon(team?.ThirdAttd)}
                                                    </div>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <div className={attendanceClass(team?.lead.FourthAttd)}>
                                                        {attendanceIcon(team?.lead.FourthAttd)}
                                                    </div>
                                                </td>
                                            </tr>
                                            {team.teamMembers.map((member) => (
                                                <tr key={member.id}>
                                                    <td className="border border-gray-300 px-4 py-2">{member.name}</td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <div className={attendanceClass(member?.FirstAttd)}>
                                                            {attendanceIcon(member?.FirstAttd)}
                                                        </div>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <div className={attendanceClass(member?.SecondAttd)}>
                                                            {attendanceIcon(member?.SecondAttd)}
                                                        </div>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <div className={attendanceClass(member?.ThirdAttd)}>
                                                            {attendanceIcon(member?.ThirdAttd)}
                                                        </div>
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-2">
                                                        <div className={attendanceClass(member?.FourthAttd)}>
                                                            {attendanceIcon(member?.FourthAttd)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row justify-evenly gap-6 mt-10">
                                <div id="leaderboard" className="w-full md:w-1/2 rounded-2xl p-4 md:p-6 bg-gradient-to-br bg-yellow-300/50">
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-center gap-2 mb-6">
                                            <span className="text-3xl">🏆</span>
                                            <h1 className="text-3xl text-center  text">GAME SCOREBOARD</h1>
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
                                                                {item.SquidScore || 0}
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
                                        <h2 className="text-2xl  text-black mb-4 text-center text">🌐YOUR DOMAIN</h2>
                                        {!team.Domain  ? (
                                            <div className="text-center">
                                                <button
                                                    onClick={() => setIsModalOpen(true)}
                                                    className="px-8 py-4 bg-white/20 hover:bg-white/30 transition-colors rounded-xl text-black font-bold"
                                                >
                                                    Select Your Domain
                                                </button>
                                                <DomainSelectionModal />
                                            </div>
                                        ) : (
                                            <div className="bg-white/20 p-6 rounded-xl w-full max-w-md">
                                                <h3 className="text-xl font-bold text-black mb-2">{team?.Domain || domain}</h3>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex-col  md:flex gap-6">
                                {team.Domain && (
                                    <div id="problem-statement" className="w-full">
            <div className="bg-[#D2003F] h-full rounded-2xl p-4 md:p-6">
            <div className=" flex justify-center items-center w-full">
            <img src={prob} className=" w-10 relative bottom-2"/>
                <h2 className="text-xl md:text-2xl text-center mb-4 text-white text">
                    PROBLEM STATEMENT
                </h2>
                </div>
                {problemError && (

                    <div className="text-red-500 bg-red-100/10 p-3 rounded mb-4">
                        {problemError}
                    </div>
                )}
                {team.ProblemStatement ? (
                    <div className="bg-white/10 p-4 rounded-xl">
                        <p className="text-white whitespace-pre-wrap">{team.ProblemStatement}</p>
                    </div>
                ) : (
                    <div className="space-y-4"> 
                        <div className="relative">
                            <textarea 
                                placeholder="Describe your problem statement here..."
                                onChange={(e) => setProblemStatement(e.target.value)}
                                value={ProblemStatement}
                                maxLength={200}
                                className="w-full h-[180px] md:h-[207px] p-4 
                                         bg-white/20 border border-white/30 
                                         rounded-xl text-white placeholder-white/50 
                                          focus:outline-none focus:border-white
                                         "
                            />
                            <div className="absolute bottom-2 right-2 text-white/50 text-sm 
                                          bg-black/20 px-2 py-1 rounded-full">
                                {ProblemStatement.length}/200
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                className="flex-1 bg-white/20 hover:bg-white/30 transition-all
                                         px-6 py-3 rounded-xl text-white font-medium
                                         disabled:opacity-50 disabled:cursor-not-allowed
                                         flex items-center justify-center gap-2"
                                onClick={() => setProblemStatement("")}
                                disabled={!ProblemStatement.trim() || problemSubmitting}
                            >
                                Clear
                            </button>
                            <button 
                                className="flex-1 bg-white/20 hover:bg-white/30 transition-all
                                         px-6 py-3 rounded-xl text-white font-medium
                                         disabled:opacity-50 disabled:cursor-not-allowed
                                         flex items-center justify-center gap-2"
                                onClick={handleProblemStatement}
                                disabled={problemSubmitting || !ProblemStatement.trim()}
                            >
                                {problemSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent 
                                                      rounded-full animate-spin" />
                                        Submitting...
                                    </>
                                ) : 'Submit Statement'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>                                )}
                                <div id="event-updates" className="w-full mt-10 event-updates-section">
                                    <div className="h-full rounded-lg p-4 md:p-6 shadow-lg bg-white/20 backdrop-blur-2xl"
                                        style={{background: 'linear-gradient(109.53deg, rgba(255, 255, 255, 0.23) 3.27%, rgba(145, 145, 145, 0.47) 96.91%)'}}
                                    >  
                                    <div className=" flex justify-center items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 relative bottom-2 w-10 animate-swing" fill="yellow" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                                        <h2 className="text-xl md:text-2xl text-center mb-4 text-white text">
                                            EVENT UPDATES 
                                            {hasNewUpdate && (
                                                <span className="inline-block ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                                                    New!
                                                </span>
                                            )}
                                        </h2></div>
                                        <div className="h-full md:h-full overflow-y-auto rounded-lg p-4">
                                            <div className="htmlcon"></div>
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
                    <p className="text-center p-4 text-white text" >Made with 💖 By Coding Blocks KARE</p>
                </footer>
            </div>
        </div>
    );
}

export default TeamPanel;