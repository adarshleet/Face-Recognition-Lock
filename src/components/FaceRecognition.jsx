import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FaceUnlock = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

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

    alert(`✅ Face registered successfully for ${name}!`);
  };

  const unlockFace = async () => {
    const storedData = JSON.parse(localStorage.getItem("faces"));

    if (!storedData || Object.keys(storedData).length === 0) {
      alert("No faces registered! Please register first.");
      return;
    }

    const video = videoRef.current;
    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setStatus("❌ No face detected! Try again.");
      return;
    }

    const labeledDescriptors = Object.entries(storedData).map(
      ([storedName, descriptor]) =>
        new faceapi.LabeledFaceDescriptors(
          storedName,
          [new Float32Array(descriptor)]
        )
    );

    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
    const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

    if (bestMatch.label !== "unknown") {
      setStatus(`✅ Access Granted for ${bestMatch.label}`);
    } else {
      setStatus("❌ Access Denied");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <video
        ref={videoRef}
        width="640"
        height="480"
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
          className="border p-2 rounded"
        />
        <button onClick={registerFace} className="bg-blue-500 text-white p-2 rounded">
          Register Face
        </button>
      </div>

      {/* Unlock Section */}
      <button onClick={unlockFace} className="bg-green-500 text-white p-2 rounded">
        Unlock Face
      </button>

      <p className="text-xl font-bold text-white">{status}</p>
    </div>
  );
};

export default FaceUnlock;
