const startRecording = document.getElementById("startRecording");
const endRecording = document.getElementById("endRecording");
const downloadRecording = document.getElementById("downloadRecording");
const recordedVideo = document.getElementById("recordedVideo");

let recorder, url;

startRecording.addEventListener("click", async function () {
    try {
        const data = [];
        const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
        });

        recorder = new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                data.push(event.data);
            }
        };

        recorder.onstop = () => {
            const blob = new Blob(data, { type: "video/webm" });
            url = URL.createObjectURL(blob);
            recordedVideo.src = url;

            startRecording.disabled = false;
            endRecording.disabled = true;
            downloadRecording.disabled = data.length === 0 ? true : false;
            recordedVideo.style.display = "block";
        };

        recorder.start();
        startRecording.disabled = true;
        endRecording.disabled = false;
    } catch (error) {
        console.error("Unable to access screen: ", error);
    }
});

endRecording.addEventListener("click", function () {
    recorder.stop();
});

downloadRecording.addEventListener("click", function () {
    const link = document.createElement("a");
    link.href = url;
    link.download = "screenCapture.webm";
    link.click();
});
