import { motion } from 'framer-motion';

function Home() {
    return (
        <motion.div 
            className="home bg-gradient-to-r from-blue-500 to-purple-600 flex-col flex justify-center items-center w-full h-screen p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.div 
                className="p-6 rounded-2xl bg-white border shadow-lg max-w-md w-full text-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.button 
                    className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
                    whileHover={{ scale: 1.1 }}
                >
                    Register Now
                </motion.button>
                <h1 className="text-6xl font-bold mb-4">Innovate Kare</h1>
                <h2 className="text-3xl font-light text-right mb-4">By Coding Blocks Kare</h2>
                <h3 className="text-xl"><span className="font-bold">Date & Time:</span> 8th to 9th Feb 2025</h3>
                <p className="text-lg mt-4">Join us for an exciting hackathon where you can showcase your innovative ideas and coding skills. Collaborate with like-minded individuals and compete for amazing prizes!</p>
                <h4 className="text-2xl font-bold mt-4">Prizes:</h4>
                <ul className="list-disc list-inside text-left">
                    <li>1st Place: $5000</li>
                    <li>2nd Place: $3000</li>
                    <li>3rd Place: $1000</li>
                </ul>
                <h4 className="text-2xl font-bold mt-4">Agenda:</h4>
                <ul className="list-disc list-inside text-left">
                    <li>Day 1: Introduction and Team Formation</li>
                    <li>Day 2: Coding and Submission</li>
                    <li>Day 3: Judging and Awards Ceremony</li>
                </ul>
                <h4 className="text-2xl font-bold mt-4">Contact Us:</h4>
                <p className="text-lg">For any queries, please contact us at <a href="mailto:info@codingblocks.kare" className="text-blue-500">info@codingblocks.kare</a></p>
                <motion.button 
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                    whileHover={{ scale: 1.1 }}
                >
                    Register Now
                </motion.button>
            </motion.div>
        </motion.div>
    )
}
export default Home