let isRecording = false;
let mediaRecorder;
let audioChunks = [];

// Get the necessary elements
const recordButton = document.getElementById('recordButton');
const audioPlayback = document.getElementById('audioPlayback');

// Define startRecording function
function startRecording() {
    if (isRecording) return;  // Prevent multiple recordings
    isRecording = true;

    // Access the microphone and start recording
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];  // Reset chunks

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.start();
        recordButton.textContent = 'Recording...';  // Change button text
        recordButton.classList.add('recording');  // Optional: Add style during recording

        // Stop recording when the button is released
        recordButton.addEventListener('mouseup', stopRecording);
        recordButton.addEventListener('mouseleave', stopRecording); // Handle if mouse leaves the button
    });
}

// Define stopRecording function
function stopRecording() {
    if (!isRecording) return;
    isRecording = false;

    mediaRecorder.stop();
    recordButton.textContent = 'Hold to Record';  // Revert button text
    recordButton.classList.remove('recording');  // Remove recording style

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayback.src = audioUrl;
        audioPlayback.controls = true; // Show playback controls after recording
        audioChunks = [];  // Reset chunks 
    };

    const chatbox = document.getElementById('chatbox');
    const audioMessage = document.createElement('div');
    audioMessage.classList.add('chat-message', 'user-message');  // User's message styling
    audioMessage.appendChild(audioElement);  // Append the audio element
    chatbox.appendChild(audioMessage); 
}

// Retrieve the company name, task type, and schedule date from the URL
function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param) || 'Unknown';
}

// Send the API request and wait for the response
async function sendApiRequest(companyName, taskType, scheduleDate) {
    // Show loading indicator (after connection simulation)
    document.getElementById('statusIcon').textContent = 'Loading...';
    
    // Format the data to send to the API
    const textToSend = `Company: ${companyName}, Task: ${taskType}, Date: ${scheduleDate}`;

    try {
        // Send the request to the API
        // const response = await fetch(`https://aipointment-3cb9cb51d408.herokuapp.com/gpt?text=${encodeURIComponent(textToSend)}`);

        // if (!response.ok) {
        //     throw new Error('Failed to get API response');
        // }

        // // Parse the API response
        // const apiResponse = await response.json();
        // console.log("API Response:", apiResponse);

        // Display the API response in the chatbox
        //displayApiResponse(apiResponse["answer gpt "]);
        displayApiResponse("hello hello", companyName)
            // Show the record button after the API response is displayed
        recordButton.classList.remove('hidden');
        recordButton.style.display = 'block'; // Make sure the button is displayed

    } catch (error) {
        console.error('Error fetching API response:', error);
        document.getElementById('statusIcon').textContent = 'Error occurred while waiting for response';
    }
}

// Simulate the API reply after a 5-second ringing delay
function startDemo(companyName, taskType, scheduleDate) {
    // Display "Ringing..."
    document.getElementById('statusIcon').textContent = 'Ringing...';

    setTimeout(() => {
        // After 5 seconds, change "Ringing..." to "Connected"
        document.getElementById('statusIcon').textContent = 'Connected';

        // Start sending the API request after "Connected"
        sendApiRequest(companyName, taskType, scheduleDate);

    }, 2000); // 5-second delay for ringing
}

// Display the API response in the chatbox
function displayApiResponse(apiResponse, companyName) {
    // Hide the loading status
    document.getElementById('statusIcon').textContent = '';

    const chatbox = document.getElementById('chatbox');

    // Add the second message from the company in orange
    const companyMessage = document.createElement('div');
    companyMessage.classList.add('chat-message', 'company-message');  // Applying orange class
    companyMessage.textContent = ` ${apiResponse+ "  :  " + companyName || 'No answer found'}`;  // Replace AIpointment with company name
    chatbox.appendChild(companyMessage);
}

// Initialize interaction when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get the query parameters from the URL
    // Ensure the button supports touch events for mobile
    const companyName = getQueryParam('companyName');
    const taskType = getQueryParam('taskType');
    const scheduleDate = getQueryParam('scheduleDate');

    recordButton.addEventListener('touchstart', startRecording);
    recordButton.addEventListener('touchend', stopRecording);

    // Start the demo, which includes ringing, connecting, and waiting for the API response
    startDemo(companyName, taskType, scheduleDate);
});
