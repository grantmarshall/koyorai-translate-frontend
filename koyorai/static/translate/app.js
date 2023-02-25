// Helper function for generating UUIDs
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// Object for controlling the actual recording of audio chunks
var audioRecorder = {
    audioStream: null,
    mediaRecorder: null,
    chunks: [],
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
            audioRecorder.audioStream = stream;

            // Create a MediaRecorder instance that will trigger the data
            // callback every 100ms.
            audioRecorder.mediaRecorder = new MediaRecorder(stream);
            audioRecorder.mediaRecorder.ondataavailable = function(event) {
                console.log('Audio chunk recorded');
                callback(event.data);
                audioRecorder.chunks.push(event.data);
            };
            audioRecorder.mediaRecorder.start(500);
        });
    },
    // Pause recording audio from the user's mic
    stop: function () {
        audioRecorder.mediaRecorder.stop();
        chunks = [];
        return new Promise((resolve) => {
            console.log('Stopping audio api');
            resolve(1);
        });
    },
    // Reset the audio being sent from the user and create a new session
    cancel: function () {
        return new Promise((resolve) => {
            console.log('Cancelling audio api');
            resolve(1);
        });
    }
};

// Node whose innertext will contain the translations
var outputField = document.querySelector('.output-field');

// Logic for session management
var sessionId;
var sessionStartTs;
var startSession = function() {
    sessionId = uuidv4();
    sessionStartTs = (new Date()).getTime();
    console.log(
        'Session with id %s started at timestamp %s',
        sessionId,
        sessionStartTs);
    outputField.innerHTML = 'Awaiting translation...';
};
var endSession = function() {
    sessionId = null;
    sessionStartTs = null;
}

// Logic for record button
var recordButton = document.querySelector('.record-button');
var recordButtonState = {
    recording: false
}
recordButton.onclick = function () {
    if (recordButtonState.recording) {
        audioRecorder.stop().then(() => {
            console.log('Pausing audio recording');
            recordButton.innerHTML = 'Start';
        });
    } else {
        audioRecorder.start(data => {
            data.text().then(dataString => {
                // Callback to send data to the server with each chunk
                fetch('http://127.0.0.1:5000/translate/update', {
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
                        timestamp: (new Date()).getTime(),
                        data: dataString
                    })
                }).then(response => console.log(response));
            });
        }).then(() => {
            // Ran when the audio stream successfully starts
            console.log('Starting audio recording');

            // If we don't have an active session start a new one
            if (sessionId == null) {
                startSession();
            }

            recordButton.innerHTML = 'Stop';
        })
        .catch(error => {
            // No Browser Support Error
            if (error.message.includes("mediaDevices API or getUserMedia method is not supported in this browser.")) {       
                console.log("To record audio, use browsers like Chrome and Firefox.");
                return;
            }
        });
    }
    recordButtonState.recording = !recordButtonState.recording;
}

// Logic for reset button
var resetButton = document.querySelector('.reset-button');
resetButton.onclick = function () {
    // Make sure we're not going to send any more chunks
    if (recordButtonState.recording) {
        recordButton.click();
    }
    // End the current session
    endSession();
}
