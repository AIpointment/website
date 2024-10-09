// Get necessary elements
const chatbox = document.getElementById('chatbox');
const statusIcon = document.getElementById('statusIcon');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const interactionControls = document.getElementById('interactionControls');
const finalSection = document.getElementById('finalSection');
const backButton = document.getElementById('backButton');


// Retrieve query parameters from URL
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param) || 'Unknown';
}

// Initialize interaction when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const companyName = getQueryParam('companyName');
    const taskType = getQueryParam('taskType');
    const scheduleDate = getQueryParam('scheduleDate');

    // Start the real connection
    startConnection(companyName, taskType, scheduleDate);

    // Event listener for the send button
    if (sendButton) {
        sendButton.addEventListener('click', handleSendMessage);
    }

    // Allow sending message by pressing Enter key
    if (messageInput) {
        messageInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                handleSendMessage();
            }
        });
    }

    // Event listener for the back button
    if (backButton) {
        backButton.addEventListener('click', function() {
            window.location.href = 'index.html'; // Change this to your homepage URL
        });
    }
});

// Function to start the real connection
function startConnection(companyName, taskType, scheduleDate) {
    // Hide the status icon since we are not simulating ringing
    // statusIcon.classList.add('hidden');

    // Construct the initial message
    const initialMessage = `Company: ${companyName}, Task: ${taskType}, Date: ${scheduleDate}`;
    let stringMessage = [companyName, taskType, scheduleDate]

    // Send the initial message to the server
    sendApiRequest(stringMessage, true);
}

// Handle sending the user's message
function handleSendMessage() {
    const message = messageInput.value.trim();
    if (message === '') return;

    // Display user's message in the chatbox
    displayUserMessage(message);

    // Clear the input field
    messageInput.value = '';

    // Disable the input field and send button
    // messageInput.classList.add('hidden');
    interactionControls.classList.add('hidden');

    // Send the message to the API
    sendApiRequest(message);
}

// Function to display user's message
function displayUserMessage(message) {
    const userMessage = document.createElement('div');
    userMessage.classList.add('chat-message', 'user-message');
    userMessage.textContent = `You: ${message}`;
    chatbox.appendChild(userMessage);

    // Scroll to the bottom
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Function to send API request
async function sendApiRequest(message, isInitialRequest = false) {
    // Show loading indicator
    updateStatus('loading', 'Loading...');
    // statusIcon.classList.remove('hidden');

    try {
    let apiUrl;
    if (isInitialRequest){
    // when initial request choose correct url
        apiUrl = `https://aipointment-3cb9cb51d408.herokuapp.com/user_information?string1=${message[0]}&string2=${message[1]}&string3=${message[2]}`;
    }
    else{
        apiUrl = `https://aipointment-3cb9cb51d408.herokuapp.com/gpt?text=${message}`;
    }

        // Send the request to the API
        const response = await fetch(apiUrl);

        updateStatus('Connected', 'Connected');

        if (!response.ok) {
            updateStatus('error', 'Error occurred'); // Error state
        }

        // Parse the API response
        const apiResponse = await response.json();
        console.log("API Response:", apiResponse);

        // Access the correct key in the API response
        const answer = apiResponse["answer gpt "] || apiResponse["answer gpt "] || 'No answer found';

        // Display the API response in the chatbox
        displayApiResponse(answer);


        const audio_response = await fetch("https://aipointment-3cb9cb51d408.herokuapp.com/api/text-to-audio", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: answer })
           });
        const audioBlob = await audio_response.blob();
        const audioObjUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioObjUrl);
        audio.play();


    } catch (error) {
        console.error('Error fetching API response:', error);
        statusIcon.textContent = 'Error occurred while waiting for response';
        displayApiResponse('Sorry, an error occurred. Please try again later.');
    } finally {
        // Hide the loading status
        updateStatus('Connected', 'Connected');
        // statusIcon.classList.add('hidden');
        interactionControls.classList.remove('hidden');
        // if (isInitialRequest) {
        //     // After initial request, display the input controls
        //     interactionControls.classList.remove('hidden');
        // } else {
        //     // After user's message, hide the input controls and show final section
        //     // interactionControls.classList.add('hidden');
        //     finalSection.classList.remove('hidden');
        // }
    }}

// Function to display the API response
function displayApiResponse(apiResponse) {
    const companyName = getQueryParam('companyName');

    const companyMessage = document.createElement('div');
    companyMessage.classList.add('chat-message', 'bot-message');
    companyMessage.textContent = `${companyName}: "${apiResponse}"`;  // Display company name and response
    chatbox.appendChild(companyMessage);

    // Scroll to the bottom
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Function to update the status
function updateStatus(status, message) {
    // Update the text of the status icon
    statusIcon.textContent = message;

    // Remove any previous status classes (ringing, waiting, etc.)
    statusIcon.classList.remove('ringing', 'waiting', 'connected', 'error', 'loading');

    // Add the new status class
    statusIcon.classList.add(status); // e.g., 'connected', 'loading', 'error'
}


let mediaRecorder;
let recordedChunks = [];
let recordingInterval;
let recordingDuration = 0;




async function sendAudio(blob) {
    const formData = new FormData();
    // Update the filename extension based on the format
    const filename = mediaRecorder.mimeType.includes('ogg') ? 'recording.ogg' : 'recording.webm';
    formData.append('audio', blob, filename);

    try {
        const response = await fetch('https://aipointment-3cb9cb51d408.herokuapp.com/audio', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log('Audio successfully sent to the server.');
            const responseText = await response.text();
            return responseText;
        } else {
            console.error('Server error:', response.statusText);
        }
    } catch (err) {
        console.error('Error sending audio:', err);
    }
}

// Initialize the media recorder and assign event handlers
async function initRecorder() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        let options = { mimeType: 'audio/webm; codecs=opus' };
        mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.onstart = () => {
            audioChunks = [];
            document.getElementById('recordButton').style.backgroundColor = '#f44336';
            // document.getElementById('recordButton').textContent = 'Recording';
            // document.getElementById('recordButton').textContent = 'Recording';
            // recordingDuration = 0;
            // recordingInterval = setInterval(() => {
            //     recordingDuration++;
            //     let minutes = Math.floor(recordingDuration / 60);
            //     let seconds = recordingDuration % 60;
            //     document.getElementById('recordButton').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            // }, 1000);
        };

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        // define what happens when the recording stops
        mediaRecorder.onstop = async () => {
            //stop counting the time
            clearInterval(recordingInterval); // Clear the interval here
            const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
            // Send the audio to the api to transcribe it
            let message = await sendAudio(audioBlob);
            // change the recording button to a rotating circle

            // Display the user's message in the chatbox
            displayUserMessage(message);
            sendApiRequest(message);
        };
    } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('Could not access microphone. Please check permissions.');
    }
}

async function startRecording() {
    await initRecorder();
    mediaRecorder.start();
}

// Stop recording
function stopRecording() {
document.getElementById('recordButton').textContent = 'Hold to Record';
document.getElementById('recordButton').style.backgroundColor = '#ff5733';
    mediaRecorder.stop();

}