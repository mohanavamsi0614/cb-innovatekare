import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import api from "./api";
import Modal from "./Model";
import done from "/public/1cbd3594bb5e8d90924a105d4aae924c.gif";
import "./App.css";
import { io } from "socket.io-client";
import cb from "/public/cb.png"
import qr from "/public/og.jpg"

function Payment() {
    const data = useLocation().state || JSON.parse(localStorage.getItem('paymentData')) || {};
    const [upiId, setUpi] = useState(data.upiId || '');
    const [transtationId, setTxn] = useState(data.transtationId || '');
    const [errors, setErrors] = useState({ upiId: '', transtationId: '', imgUrl: '' });
    const [imgUrl, setImgUrl] = useState(data.imgUrl || '');
    const [loading, setLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);
    const [error, setError] = useState("");
    const [close, setClose] = useState(false);
    const wid = useRef();
    const socketRef = useRef();

    useEffect(() => {
        let myWidget = cloudinary.createUploadWidget(
          {
            cloudName: "dus9hgplo",
            uploadPreset: "vh0llv8b",
          },
          (error, result) => {
            if (!error && result && result.event === "success") {
              console.log("Done! Here is the image info: ", result.info);
              setImgUrl(result.info.secure_url);
            } else if (error) {
              console.error("Error during Cloudinary upload:", error);
              setError("Image upload failed! Please try again.");
              alert("here at image "+ error)
            }
          }
        );

        // Socket connection
        socketRef.current = io(api);
        
        socketRef.current.on("check", (res) => {
            if(res === "stop") {
                setClose(true);
            }
        });

        socketRef.current.emit("check");

        socketRef.current.on("see", (res) => {
            if(res === "stop") {
                setClose(true);
            }
        });

        // Cleanup socket connection
        wid.current = myWidget;
        return () => {
            socketRef.current.disconnect();
        };

      }, []);

    useEffect(() => {
        localStorage.setItem('paymentData', JSON.stringify({ ...data, upiId, transtationId, imgUrl }));
    }, [upiId, transtationId, imgUrl]);

    const validate = () => {
        let valid = true;
        let errors = { upiId: '', transtationId: '', imgUrl: '' };

        if (!upiId) {
            errors.upiId = 'UPI ID is required';
            valid = false;
        }
        if (!transtationId) {
            errors.transtationId = 'Transaction Number is required';
            valid = false;
        }
        if (!imgUrl) {
            errors.imgUrl = 'Upload your Screenshot';
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            axios.post(`${api}/event/register`, { ...data, upiId, transtationId, imgUrl })
                .then((res) => {
                    console.log(res.data);
                    setLoading(false);
                    setIsDone(true);
                })
                .catch((error) => {
                    console.error("Error during registration:", error);
                    setLoading(false);
                    setError("Registration failed! Please try again.");
                    alert("Registration error: " + error.message);
                });
            console.log("hie", { ...data, upiId, transtationId, imgUrl });
        }
    };
    if(close){
        return(
            <div className=" bg-black w-full h-screen text-white text-xl flex flex-col justify-center items-center">
                <h1>Registrations  Got Freezed If you did the  payment Please fill this form. </h1>
                <br/>
                <a href="https://forms.gle/4WoCQPbTNo91zYMR9" className="  text-[#E16254] " target="_blank">Fill</a>
            </div>
        )

    }     
    return (
        <div className="home flex flex-col justify-center text-black items-center h-full p-4 bg-gradient-to-r from-gray-100 to-gray-200">
            <Link to="/registration" className="self-start mb-4">
                <button className="bg-white border px-4 py-2 rounded">Back to Registration</button>
            </Link>
            {loading && <div className="loading-spinner">Loading...</div>}
            <form className="border rounded-2xl bg-white p-8 shadow-xl w-full max-w-lg" onSubmit={handleSubmit}>
                <div className="w-full max-w-md space-y-6 p-4 border rounded-lg bg-gray-50 shadow-lg">
                    <h3 className="text-3xl font-bold text-gray-800 text-center">🔒 Payment</h3>
                    <p className="text-black text-lg text-center">
                        <b>Info:</b> Please scan the QR code below to make a payment for:
                    </p>
                    <div className="text-gray-800 border rounded-lg bg-white shadow-sm">
                        <p className="font-bold text-center text-xl">{data.teamName}</p>
                        <hr className="my-4 border-gray-300" />
                        <p className="m-2 text-xl">
                            <b>Team Lead:</b> {data.name} x 350
                        </p>
                        {data.teamMembers.map((i, j) => (
                            <p className="m-2  text-lg" key={i.name}>
                                <b>Member {j + 1}: </b>
                                {i.name} x 350
                            </p>
                        ))}
                        <b className="m-2 text-xl">
                            Total: <i className="text-[#E16254] text-xl">₹1750 </i>
                        </b>
                    </div>
                    <p className="text-black text-xl">
                        Pay a total of <b className="text-[#E16254] text-2xl">₹1750 </b> using any UPI app. Provide your UPI ID and
                        Transaction Number for our reference.
                    </p>
                    <div className="w-full flex flex-col justify-center p-6 bg-gray-100 rounded-lg shadow-md">
                        <p className="text-black text-lg">Scan Here To Pay:</p>
                        <div className="w-full flex flex-col justify-center items-center mt-4">
                            <img src={qr} alt="QR Code for Payment" className="w-72 object-contain" />
                            <p className="text-[#E16254] font-bold mt-2 border p-4 rounded-lg shadow-sm">
                                Use Only Gpay
                            </p>
                            <a href={qr} download="qr"><div className=" button border mt-2 p-4">Download QR</div></a>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <label htmlFor="upi" className="text-black font-medium text-lg">
                          <p>  Your UPI ID: <span className="text-red-700">*</span></p>
                        </label>
                        <input
                            type="text"
                            id="upi"
                            value={upiId}
                            onChange={(e) => setUpi(e.target.value)}
                            placeholder="Enter your UPI ID"
                            className="w-full p-4 text-gray-800 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.upiId && <p className="text-red-500 text-sm">{errors.upiId}</p>}

                        <label htmlFor="txn" className="text-black  text-lg">
                            <p>Transaction Number: <span className="text-red-700">*</span></p>
                        </label>
                        <input
                            type="text"
                            id="txn"
                            value={transtationId}
                            onChange={(e) => setTxn(e.target.value)}
                            placeholder="Enter transaction number"
                            className="w-full p-4 text-gray-800 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.transtationId && <p className="text-red-500 text-sm">{errors.transtationId}</p>}

                        <label htmlFor="transactionScreenshot" className="text-black  text-lg">
                            <p>Transaction Screenshot: <span className="text-red-700">*</span></p>
                        </label>
                        <div className="flex justify-center mt-4">
                        {!imgUrl ? (
                            <div
                                onClick={() => wid.current.open()}
                                className="  cursor-pointer button p-4 pl-5 pr-5 rounded-lg bg--white border  font-semibold  transition duration-300"
                            >
                                Upload Your Screenshot
                            </div>) :
                            (     
                                <div>                            
                                <img src={imgUrl}/>
                                <p className=" text-center p-2 border rounded-xl mt-1 button cursor-pointer">Re-Upload</p>
                                </div>
                            ) }
                            
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full font-semibold bg-white border rounded-full h-14 mt-6  transition duration-300"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
            {(loading || isDone || error) && (
                <Modal isLoading={loading}>
                    {isDone && (
                        <div className="modal-content">
                            <img src={done} alt="Success" />
                            <p className="text-xl font-bold">Registration successfully!</p>
                            <p className="font-mono w-full">
                                Please check your inbox for the confirmation mail. Thank you!
                            </p>
                            <Link to="/">
                                <button className="bg-[#E16254] w-24 p-4 text-white rounded mt-5">Home</button>
                            </Link>
                        </div>
                    )}
                    {error && (
                        <div className="modal-content">
                            <p className="text-xl font-bold text-red-500">Error</p>
                            <p className=" w-full font-serif">Please Contact 6281605767.</p>
                            <button
                                onClick={() => setError("")}
                                className="bg-[#E16254] w-24 p-4 text-white rounded mt-5"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
}

export default Payment;
