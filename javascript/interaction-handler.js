let isRecording = false;
let isHoldingButton = false;
let recordingStartTime;

// Retrieve the company name from the URL
function getCompanyNameFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('companyName') || 'Unknown Company'; // Default to 'Unknown Company' if not found
}

// Simulate the API reply after a 5-second ringing delay
function startDemo() {
    // Display "Ringing..."
    document.getElementById('statusIcon').textContent = 'Ringing...';

    setTimeout(() => {
        // After 5 seconds, change "Ringing..." to "Connected"
        document.getElementById('statusIcon').textContent = 'Connected';
        
        // Simulate API reply after connection
        simulateApiReply();
    }, 5000);
}

// Simulate the API text and audio reply
function simulateApiReply() {
    const companyName = getCompanyNameFromUrl();  // Get the company name from the URL
    const chatbox = document.getElementById('chatbox');

    // Company message
    const companyMessage = document.createElement('div');
    companyMessage.classList.add('chat-message', 'bot-message');
    companyMessage.textContent = `${companyName}: "Hello, we are contacting you to schedule an appointment."`;
    chatbox.appendChild(companyMessage);

    // Simulate playing audio
    playAudio();
}

// Simulate playing audio
function playAudio() {
    const statusIcon = document.getElementById('statusIcon');
    statusIcon.textContent = 'Playing Audio...';

    setTimeout(() => {
        statusIcon.textContent = ''; // Clear the status after the audio plays
        enableRecording(); // Enable the recording button after audio finishes
    }, 3000); // Assume 3 seconds for audio
}

// Enable the "Record" button
function enableRecording() {
    const recordButton = document.getElementById('recordButton');
    recordButton.disabled = false;
    recordButton.classList.remove('hidden'); // Show the record button
}

// Start recording user's voice input
function startRecording(event) {
    isRecording = true;
    isHoldingButton = true;
    recordingStartTime = new Date();

    document.getElementById('statusIcon').textContent = 'Recording...';

    // Listen for the button release (simulating user holding the button)
    event.target.addEventListener('mouseup', stopRecording);
}

// Stop recording
function stopRecording() {
    isHoldingButton = false;
    document.getElementById('statusIcon').textContent = 'Loading...';
    document.getElementById('recordButton').classList.add('hidden'); // Hide the record button

    // Simulate waiting for the API response
    setTimeout(() => {
        const chatbox = document.getElementById('chatbox');
        const userReply = document.createElement('div');
        userReply.classList.add('chat-message', 'user-message');
        userReply.textContent = 'You: "I confirm the appointment."';
        chatbox.appendChild(userReply);

        // Simulate final API response
        simulateFinalReply();
    }, 3000); // Simulate 3-second delay for the API response
}

// Simulate the final API reply
function simulateFinalReply() {
    setTimeout(() => {
        const chatbox = document.getElementById('chatbox');
        const finalReply = document.createElement('div');
        finalReply.classList.add('chat-message', 'bot-message');
        finalReply.textContent = 'AIpointment: "Your appointment has been confirmed."';
        chatbox.appendChild(finalReply);

        document.getElementById('statusIcon').textContent = ''; // Clear status after final reply
        
        // Finish the chat after 5 seconds
        setTimeout(() => {
            finishChat();
        }, 5000);
    }, 3000); // Mock the final reply time
}

// End the chat sequence and prevent further interactions
function finishChat() {
    const chatbox = document.getElementById('chatbox');
    const finishedMessage = document.createElement('div');
    finishedMessage.classList.add('chat-message', 'finished-message');
    finishedMessage.textContent = 'The chat has finished. Thank you for using AIpointment.';
    chatbox.appendChild(finishedMessage);
    
    // Optionally hide the status icon
    document.getElementById('statusIcon').style.display = 'none';
}

// Start the demo automatically when the page loads
startDemo();
