


const video = document.getElementById('video');
console.log('coucou')
function startVideo() {
    navigator.getUserMedia(
        {video:{}},
        stream => video.srcObject = stream,
        error => console.log(error)
    )
}
startVideo();
