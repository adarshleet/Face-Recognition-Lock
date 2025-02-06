import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

const FaceExpressionCanvas = () => {
  const canvasRef = useRef(null);
  const video = document.createElement("video"); // Hidden video element

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      startVideo();
    };

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();
        detectFace();
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };

    const detectFace = async () => {
      const canvas = canvasRef.current;
      const displaySize = { width: 640, height: 480 };
      faceapi.matchDimensions(canvas, displaySize);

      setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
      }, 100);
    };

    loadModels();
  }, []);

  return (
    <div className="flex items-center justify-center h-44 w-44">
      <canvas ref={canvasRef} className="" />
    </div>
  );
};

export default FaceExpressionCanvas;
