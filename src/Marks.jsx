import axios from "axios";
import { useEffect, useState } from "react";
import api from "./api";

function Marks() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSector, setCurrentSector] = useState(0);
    const [current, setCurrent] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const sectors = ["456", "067", "101", "001", "218","199"];
    const [scores, setScores] = useState({
        problemUnderstanding: { criteria: "Understanding & Clarity", marks: 0,max:10 },
        feasibilityRelevance: { criteria: "Feasibility & Relevance of Solution", marks: 0,max:10 },
        technicalApproach: { criteria: "Technical Approach & Feasibility", marks: 0,max:10 },
        prototypeProgress: { criteria: "Prototype / Early Development Progress", marks: 0,max:10 }
    });

    useEffect(() => {
        async function fetchData() {
            try {
                let res = await axios.get(`${api}/event/students`);
                setTeams(res.data);
            } catch (error) {
                console.error("Error fetching teams:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const getSectorTeams = (sectorIndex) => teams.slice(sectorIndex * 15, (sectorIndex + 1) * 15);

    const handleScoreChange = (key, value) => {
        value = Math.min(10, Math.max(0, parseInt(value) || 0));
        setScores(prev => ({ ...prev, [key]: { ...prev[key], marks: value } }));
    };

    // Calculate total marks
    const calculateTotalMarks = () => {
        return Object.values(scores).reduce((total, item) => total + item.marks, 0);
    };

    const handleSubmitScores = async () => {
        const sectorTeams = getSectorTeams(currentSector);
        if (!sectorTeams[current]?._id) {
            setSubmitStatus({ type: 'error', message: 'Cannot identify team ID' });
            return;
        }
        setSubmitting(true);
        setSubmitStatus(null);
        console.log(scores)
        try {
            await axios.post(`${api}/event//team/score/${teams[current]._id}`, {
                score: calculateTotalMarks(),
                FirstReview: scores
            });
            setSubmitStatus({ type: 'success', message: 'Scores submitted successfully!' });
            setCurrent(prev => Math.min(prev + 1, sectorTeams.length - 1));
        } catch (error) {
            setSubmitStatus({ type: 'error', message: 'Failed to submit scores. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-900 text-white text-2xl">Loading...</div>;

    const sectorTeams = getSectorTeams(currentSector);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-5">
            <div className="flex justify-between mb-5">
              
                <div className="flex justify-center flex-wrap">
                    {sectors.map((sector, index) => (
                        <button
                            key={sector}
                            className={`mx-2 m-2 px-4 py-2 rounded ${currentSector === index ? 'bg-blue-700' : 'bg-gray-700'} text-white`}
                            onClick={() => {
                                setCurrentSector(index);
                                setCurrent(0);
                            }}
                        >
                            {sector}
                        </button>
                    ))}
                </div>
             
            </div>
            <div className="flex justify-center mb-5">
                <select
                    className="px-4 py-2 rounded-lg bg-gray-700 text-white"
                    value={current}
                    onChange={(e) => setCurrent(parseInt(e.target.value))}
                >
                    {sectorTeams.map((team, index) => (
                        <option key={team._id} value={index}>
                            {currentSector * 15 + index + 1}. {team.teamname}
                        </option>
                    ))}
                </select>
            </div>
            <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <h1 className="text-3xl font-bold mb-4">{sectorTeams[current]?.teamname || 'No Team'}</h1>
                <div className="text-lg mb-3">Current Team: {current + 1 + currentSector * 15} / {teams.length}</div>
                <div className="text-left">
                    <p><strong>Domain:</strong> {sectorTeams[current]?.Domain}</p>
                    <p><strong>Problem Statement:</strong> {sectorTeams[current]?.ProblemStatement}</p>
                </div>
          
            </div>
            <div className=" flex justify-between m-5">
            <button
                    className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    onClick={() => setCurrent(prev => Math.max(prev - 1, 0))}
                    disabled={current === 0}
                >
                    Previous
                </button>
                <button
                    className="px-5 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    onClick={() => setCurrent(prev => Math.min(prev + 1, sectorTeams.length - 1))}
                    disabled={current === sectorTeams.length - 1}
                >
                    Next
                </button>
                </div>
            <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg mt-5">
                <h2 className="text-2xl font-semibold mb-3">Scores</h2>
                {Object.keys(scores).map((key) => (
                    <div key={key} className="flex justify-between items-center mb-4">
                        <span className="font-medium">{scores[key].criteria}:</span>
                        <div className=" flex justify-center items-center">
                        <input
                            type="number"
                            min="0"
                            max="10"
                            value={scores[key].marks}
                            onChange={(e) => handleScoreChange(key, e.target.value)}
                            className="w-16 px-2 py-1 rounded bg-gray-700 text-white border border-gray-500 text-center"
                        /> 
                        <p className=" ml-3">/ {scores[key].max}</p>
                        </div>
                    </div>
                ))}
                <div className="flex justify-between items-center mb-4 border-t border-gray-600 pt-3 mt-2">
                    <span className="font-bold text-xl">Total:</span>
                    {teams[current].FirstReviewScore ?<span className="font-bold text-xl">{teams[current].FirstReviewScore} / 40</span>:
                    <span className="font-bold text-xl">{calculateTotalMarks()} / 40</span>

                }
                </div>
                {submitStatus && (
                    <div className={`mt-4 p-3 rounded-lg text-center ${submitStatus.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{submitStatus.message}</div>
                )}
                {!teams[current].FirstReview && (                <button
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-semibold disabled:bg-gray-500"
                    onClick={handleSubmitScores}
                    disabled={submitting}
                >
                    {submitting ? "Submitting..." : "Submit Scores"}
                </button>)}

            </div>
        </div>
    );
}

export default Marks;
