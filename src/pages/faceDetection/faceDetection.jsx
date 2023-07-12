import React, { useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import pic from './people.jpg';

const FaceDetectionComponent = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    detectFaces();
  }, []);

  const detectFaces = async () => {
    // 加载模型
    await faceapi.nets.faceRecognitionNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
    await faceapi.nets.faceLandmark68Net.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
    await faceapi.nets.faceLandmark68TinyNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
    await faceapi.nets.ssdMobilenetv1.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
    await faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');
    // await faceapi.nets.mtcnn.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights');

    // 获取图像元素
    const img = imageRef.current;

    // 进行人脸检测
    const detections = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors();

    // 创建画布
    const canvas = faceapi.createCanvasFromMedia(img);
    faceapi.matchDimensions(canvas, img);

    // 设置画布样式
    canvas.style.position = 'absolute';
    canvas.style.top = img.offsetTop + 'px';
    canvas.style.left = img.offsetLeft + 'px';

    // 绘制红色框
    const drawCustomDetections = (canvas, detections) => {
      const context = canvas.getContext('2d');
      const boxColor = 'red';
      const lineWidth = 2;
  
      detections.forEach(detection => {
        const box = detection.detection.box;
        context.strokeStyle = boxColor;
        context.lineWidth = lineWidth;
        context.beginPath();
        context.rect(box.x, box.y, box.width, box.height);
        context.closePath();
        context.stroke();
      });
    };

    // 将画布添加到图片的父级容器中
    drawCustomDetections(canvas, detections);
    img.parentNode.appendChild(canvas);
  };

  return (
    <div>
      <h1>人脸标记Demo</h1>
      <img ref={imageRef} src={pic} alt="Your Image" />
    </div>
  );
};

export default FaceDetectionComponent;
