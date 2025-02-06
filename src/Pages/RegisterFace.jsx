import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const RegisterFace = () => {
    const videoRef = useRef(null);
    // const canvasRef = useRef(null);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [name, setName] = useState("");
    const [scanStatus, setScanStatus] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
            await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
            await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
            setModelsLoaded(true);
        };
        loadModels();
    }, []);

    useEffect(() => {
        if (modelsLoaded) {
            startVideo();
        }
    }, [modelsLoaded]);

    const startVideo = () => {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                videoRef.current.srcObject = stream;
            })
            .catch((err) => console.error("Error accessing webcam:", err));
    };

    const registerFace = async () => {
        if (!name) {
            alert("Please enter a name!");
            return;
        }

        const video = videoRef.current;
        const detection = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            alert("No face detected! Try again.");
            return;
        }

        const descriptorArray = Array.from(detection.descriptor); // Convert to array
        let storedFaces = JSON.parse(localStorage.getItem("faces")) || {}; // Get existing faces

        // Store new face under its name
        storedFaces[name] = descriptorArray;
        localStorage.setItem("faces", JSON.stringify(storedFaces));

        // alert(`✅ Face registered successfully for ${name}!`);
        setScanStatus(true)
        setTimeout(() => {
            setScanStatus(false)
            setName('')
        }, 5000);
    };
    return (
        <div className="flex flex-col items-center space-y-4 p-4 pt-10">
            <h2 className='text-4xl md:text-4xl text-white font-bold'>Scan & Register the face</h2>
            <video
                ref={videoRef}
                width="480"
                height="360"
                autoPlay
                muted
                className="border rounded"
            />
            {/* <canvas ref={canvasRef} className="absolute top-0 left-0" /> */}

            {/* Register Section */}
            <div className="flex space-x-2">
                <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 rounded border-white text-black bg-white"
                />
                <button onClick={registerFace} className="bg-blue-500 cursor-pointer text-xl font-bold text-white p-2 rounded">
                    Register Face
                </button>
            </div>
            {scanStatus && <p className="text-xl font-bold text-white">✅ Face registered successfully for {name}</p>}
        </div>
    )
}

export default RegisterFace
