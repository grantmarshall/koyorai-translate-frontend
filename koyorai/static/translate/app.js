// Object for controlling the actual recording of audio chunks
var audioRecorder = {
    mediaRecorder: null,
    // Start recording audio from the user's mic and execute the provided
    // callback on each data chunk recorded by the MediaRecorder.
    start: function (callback) {
        if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
            // Feature is not supported in browser
            return Promise.reject(
                new Error(
                    'mediaDevices API or getUserMedia method is not supported in this browser.'));
        }
        return navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            // Create a MediaRecorder instance that will trigger the data
            // callback every 100ms.
            audioRecorder.mediaRecorder = new MediaRecorder(stream);
            audioRecorder.mediaRecorder.ondataavailable = function(event) {
                callback(event.data);
            };
            audioRecorder.mediaRecorder.start(500);
        });
    },
    // Pause recording audio from the user's mic
    stop: function () {
        audioRecorder.mediaRecorder.stop();
    },
};

// Node whose innertext will contain the translations
var outputField = document.querySelector('.output-field');

// Logic for session management
var startSession = function() {
    return fetch('http://127.0.0.1:5000/translate/session?timestamp=' + (new Date()).getTime(), {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
};

// Logic for record button
var recordButton = document.querySelector('.record-button');
var recordButtonState = {
    recording: false
}
recordButton.onclick = function () {
    if (audioRecorder.mediaRecorder && audioRecorder.mediaRecorder.state == 'recording') {
        audioRecorder.stop();
        recordButton.innerHTML = 'Start';
    } else {
        startSession().then((response) => { return response.json(); }).then((response) => {
            var sessionId = response.sessionId;
            var sessionStartTs = response.sessionStartTs;
            audioRecorder.start(data => {
                data.text().then(dataString => {
                    // Callback to send data to the server with each chunk
                    fetch('http://127.0.0.1:5000/translate/translation', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        // Set the post data
                        body: JSON.stringify({
                            id: sessionId,
                            type: data.type,
                            size: data.size,
                            timestamp: (new Date()).getTime() - sessionStartTs,
                            data: dataString
                        })
                    }).then(response => console.log(response));
                });
            }).then(() => {
                // Ran when the audio stream successfully starts
                console.log('Starting audio recording');
                recordButton.innerHTML = 'Stop';
            })
        }).catch((error) => {
            // No Browser Support Error
            if (error.message.includes("mediaDevices API or getUserMedia method is not supported in this browser.")) {       
                console.log("To record audio, use browsers like Chrome and Firefox.");
                return;
            } else {
                console.log(error);
                return;
            }
        });
    }
    recordButtonState.recording = !recordButtonState.recording;
}
