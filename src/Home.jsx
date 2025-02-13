import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import kalasalingam from "/public/kalasalingam.png";
import cb from "/public/KARE(latest).png";
import score from "/public/scorecraft.jpg"
import { useEffect } from 'react';

function Home() {
    const nav = useNavigate();
    useEffect(()=>{
        Notification.requestPermission().then((res)=>{
            console.log(res)
         
        })
    })
    
    return (
        <motion.div 
            className="home bg-gradient-to-r  flex flex-col justify-center items-center w-full h-screen p-8 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.div 
                className="p-4 rounded-2xl bg-white border shadow-2xl max-w-lg w-full text-center text-gray-900"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-full flex justify-center items-center mb-6">
                    <img src={kalasalingam} className="size-20" alt="Kalasalingam Logo" />
                    <img src={cb} className="size-20 ml-4 rounded-full" alt="Coding Blocks Logo" />
                    <img src={score} className="size-20 ml-4 rounded"/>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800   ">Coding Blocks Kare</h1>
              <h1 className=' text-3xl md:text-5xl font-extrabold text-gray-700'>and</h1>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800"> Scorecraft kare</h1>
                <h2 className="text-3xl mt-2 text-gray-700">Presents</h2>
                <h1 className="text-6xl font-extrabold mb-6 ">Innovate Kare</h1>
                <h3 className="text-xl font-semibold"><span className="font-bold">Date:</span> 8th to 9th Mar 2025</h3>
                <motion.button 
                    className="mt-6 bg-white text-black border border-black py-3 px-6 rounded-lg shadow-md text-md font-semibold  transition-transform transform hover:scale-105"
                    whileHover={{ scale: 1 }}
                    onClick={() => nav("/registration")}
                    disabled={true}
                >
                    Registrations Will Open at 6PM🚀
                </motion.button>
            </motion.div>
            
            <motion.div 
                className="mt-10 max-w-3xl p-8 bg-white text-gray-900 rounded-2xl shadow-xl text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
            >
                <h1 className="text-3xl font-extrabold mb-4">About the Event</h1>
                <div className="text-lg text-gray-700 space-y-4 text-left">
                    <div className="flex items-start">
                        <span className="mr-2 font-bold">1.</span>
                        <p>Participants receive a random domain</p>
                    </div>
                    <div className="flex items-start">
                        <span className="mr-2 font-bold">2.</span>
                        <p>Identify a real-world problem in the assigned domain related to KARE</p>
                    </div>
                    <div className="flex items-start">
                        <span className="mr-2 font-bold">3.</span>
                        <p>Develop innovative solutions to address the challenge</p>
                    </div>
                    <div className="flex items-start">
                        <span className="mr-2 font-bold">4.</span>
                        <p>Fosters critical thinking, problem-solving, and creativity</p>
                    </div>
                    <div className="flex items-start">
                        <span className="mr-2 font-bold">5.</span>
                        <p>Empowers contributions toward meaningful advancements in KARE</p>
                    </div>
                    <div className="flex items-start">
                        <span className="mr-2 font-bold">6.</span>
                        <p>Intense, collaborative, and exciting innovation experience</p>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                className="mt-10 max-w-3xl p-8 bg-white text-gray-900 rounded-2xl shadow-xl text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                <h1 className="text-3xl font-extrabold mb-4">Event Structure</h1>
                <div className="text-lg text-gray-700 space-y-4 text-left">
                <div className="flex items-center ">
                        <span className="mr-2  font-bold">1.</span>
                        <p>Register for the event 
                        <motion.button 
                    className="mt-6 bg-white text-black border border-black p-1  rounded-lg shadow-md text-lg font-semibold  transition-transform transform hover:scale-105"
                    whileHover={{ scale: 1 }}
                    onClick={() => nav("/registration")}
                >
                    Register Now
                </motion.button>
                </p>
                    </div>
                    <div className="flex items-start">
                        <span className="mr-2  font-bold">2.</span>
                        <p> participants will receive a random domain to work on.</p>
                    </div>
                    <div className="flex items-start">
                        <span className="mr-2  font-bold">3.</span>
                        <p>They will define a problem statement and work towards building a project that provides an effective solution within the given timeframe.</p>
                    </div>
                    <div className="flex items-start">
                        <span className="mr-2  font-bold">4.</span>
                        <p>Participants will present their projects to a panel of judges.</p>
                    </div>
                    <div className="flex items-start">
                        <span className="mr-2  font-bold">5.</span>
                        <p>The top winners will be announced and awarded prizes.</p>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                className="mt-10 max-w-3xl p-8 bg-white text-gray-900 rounded-2xl shadow-xl text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
            >
                <h1 className="text-3xl font-extrabold mb-4">Prizes & Rewards</h1>
                <p className="text-lg text-gray-700">We value innovation and hard work. The top winners will receive cash prizes along with additional credits, and all participants will get certificates of participation.</p>
                <div className="mt-4 flex flex-col space-y-4">
                    <div className="p-4 bg-gray-200 rounded-lg font-semibold text-gray-800">🏆 1st Prize: Cash reward + 2 credits</div>
                    <div className="p-4 bg-gray-200 rounded-lg font-semibold text-gray-800">🥈 2nd Prize: Cash reward + 2 credits</div>
                    <div className="p-4 bg-gray-200 rounded-lg font-semibold text-gray-800">🥉 3rd Prize: Cash reward + 2 credits</div>
                    <div className="p-4 bg-gray-200 rounded-lg font-semibold text-gray-800">📜 Certificate for all participants + 2 credits</div>
                </div>
            </motion.div>
            <motion.button 
                    className="mt-6 bg-white text-black border border-black py-3 px-6 rounded-lg shadow-md text-md font-semibold  transition-transform transform hover:scale-105"
                    whileHover={{ scale: 1 }}
                    onClick={() => nav("/registration")}
                    disabled={true}
                >
                    Registrations Will Open at 6PM🚀
                </motion.button>

        </motion.div>
    );
}

export default Home;
