// Helper function for generating UUIDs
function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

// Object for controlling the actual recording of audio chunks
var audioRecorder = {
    // Start recording audio from the user's mic
    start: function () {
        //...
    },
    // Pause recording audio from the user's mic
    stop: function () {
        //...
    },
    // Reset the audio being sent from the user and create a new session
    cancel: function () {
        //...
    }
};

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
        console.log('Pausing!');
        audioRecorder.stop();
    } else {
        console.log('Recording!');
        // If we don't have an active session start a new one
        if (sessionId == null) {
            startSession();
        }
        audioRecorder.start();
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
