import { useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";

function Payment() {
    const data = useLocation().state || JSON.parse(localStorage.getItem('paymentData')) || {};
    const [upiId, setupi] = useState(data.upiId || '');
    const [transactionId, settxn] = useState(data.transactionId || '');
    const [errors, setErrors] = useState({ upiId: '', transactionId: '', link: '' });
    const [link, setlink] = useState(data.link || '');
    const wid = useRef();

    useEffect(() => {
        let myWidget = cloudinary.createUploadWidget(
            {
                cloudName: "dus9hgplo",
                uploadPreset: "vh0llv8b",
            },
            (error, result) => {
                if (!error && result && result.event === "success") {
                    console.log("Done! Here is the image info: ", result.info);
                    setlink(result.info.secure_url);
                } else if (error) {
                    console.error("Error during Cloudinary upload:", error);
                    setErrors({ ...errors, img: "Image upload failed! Please try again." });
                }
            }
        );
        wid.current = myWidget;
    }, []);

    useEffect(() => {
        localStorage.setItem('paymentData', JSON.stringify({ ...data, upiId, transactionId, link }));
    }, [upiId, transactionId, link]);

    const validate = () => {
        let valid = true;
        let errors = { upiId: '', transactionId: '', link: '' };

        if (!upiId) {
            errors.upiId = 'UPI ID is required';
            valid = false;
        }
        if (!transactionId) {
            errors.transactionId = 'Transaction Number is required';
            valid = false;
        }
        if (!link) {
            errors.link = 'Upload your Screenshot';
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("hie", { ...data, upiId, transactionId, link });
        }
    };

    return (
        <div className="home flex flex-col justify-center text-black items-center h-full p-4 bg-gradient-to-r from-gray-100 to-gray-200">
            <form className="border rounded-2xl bg-white p-8 shadow-xl w-full max-w-lg" onSubmit={handleSubmit}>
                <div className="w-full max-w-md space-y-6 p-6 border rounded-lg bg-gray-50 shadow-lg">
                    <h3 className="text-3xl font-bold text-gray-800 text-center">🔒 Payment</h3>
                    <p className="text-black text-lg text-center">
                        <b>Info:</b> Please scan the QR code below to make a payment for:
                    </p>
                    <div className="text-gray-800 border p-6 rounded-lg bg-white shadow-sm">
                        <p className="font-bold text-center text-xl">{data.teamName}</p>
                        <hr className="my-4 border-gray-300" />
                        <p className="m-2 text-xl">
                            <b>Team Lead:</b> {data.name} x 200
                        </p>
                        {data.teamMembers.map((i, j) => (
                            <p className="m-2  text-xl" key={i.name}>
                                <b>Member {j + 1}: </b>
                                {i.name} x 200
                            </p>
                        ))}
                        <b className="m-2 text-xl">
                            Total: <i className="text-[#E16254] text-xl">₹1000 </i>
                        </b>
                    </div>
                    <p className="text-black text-xl">
                        Pay a total of <b className="text-[#E16254] text-2xl">₹1000 </b> using any UPI app. Provide your UPI ID and
                        Transaction Number for our reference.
                    </p>
                    <div className="w-full flex flex-col justify-center p-6 bg-gray-100 rounded-lg shadow-md">
                        <p className="text-black text-lg">Scan Here To Pay:</p>
                        <div className="w-full flex flex-col justify-center items-center mt-4">
                            {/* <img src={qr} alt="QR Code for Payment" className="w-72 object-contain" /> */}
                            <p className="text-[#E16254] font-bold border p-4 rounded-lg shadow-sm">
                                Use Only Gpay
                            </p>
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
                            onChange={(e) => setupi(e.target.value)}
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
                            value={transactionId}
                            onChange={(e) => settxn(e.target.value)}
                            placeholder="Enter transaction number"
                            className="w-full p-4 text-gray-800 bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.transactionId && <p className="text-red-500 text-sm">{errors.transactionId}</p>}

                        <label htmlFor="transactionScreenshot" className="text-black  text-lg">
                            <p>Transaction Screenshot: <span className="text-red-700">*</span></p>
                        </label>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => wid.current.open()}
                                className="w-72 h-12 rounded-lg bg--white border  font-semibold  transition duration-300"
                            >
                                Upload Your Screenshot
                            </button>
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full font-semibold bg-white border rounded-full h-14 mt-6  transition duration-300"
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Payment;
