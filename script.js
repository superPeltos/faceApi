const video = document.getElementById('video');
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models'),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    {video: {}},
    stream => video.srcObject = stream,
    error => console.log(error)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = {width: video.width, height: video.height};
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(
      video,
      new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

    if (detections[0].expressions !== undefined) {
      let expressions = detections[0].expressions;
      let getHighScoreExpression = Object.keys(expressions).map((key) => {
        return expressions[key]
      });
      //console.log(getHighScoreExpression);
      let max = Math.max.apply(null, getHighScoreExpression);
      let getHighScoreExpressionName = Object.keys(expressions).find(key => expressions[key] === max);
      console.log(getHighScoreExpressionName)
      //console.log(max);
    }
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    // faceapi.draw.drawDetections(canvas,resizedDetections);
    // faceapi.draw.drawFaceLandmarks(canvas,resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

  }, 100)
})