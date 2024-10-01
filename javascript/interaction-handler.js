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
    statusIcon.classList.add('hidden');

    // Construct the initial message
    const initialMessage = `Company: ${companyName}, Task: ${taskType}, Date: ${scheduleDate}`;

    // Send the initial message to the server
    sendApiRequest(initialMessage, true);
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
    messageInput.classList.add('hidden');
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
    statusIcon.textContent = 'Loading...';
    statusIcon.classList.remove('hidden');

    try {
        // Construct the API URL with the message
        const apiUrl = `https://aipointment-3cb9cb51d408.herokuapp.com/gpt?text=${encodeURIComponent(message)}`;

        // Send the request to the API
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Failed to get API response');
        }

        // Parse the API response
        const apiResponse = await response.json();
        console.log("API Response:", apiResponse);

        // Access the correct key in the API response
        const answer = apiResponse["answer gpt "] || apiResponse["answer gpt "] || 'No answer found';

        // Display the API response in the chatbox
        displayApiResponse(answer);

    } catch (error) {
        console.error('Error fetching API response:', error);
        statusIcon.textContent = 'Error occurred while waiting for response';
        displayApiResponse('Sorry, an error occurred. Please try again later.');
    } finally {
        // Hide the loading status
        statusIcon.textContent = '';
        statusIcon.classList.add('hidden');

        if (isInitialRequest) {
            // After initial request, display the input controls
            interactionControls.classList.remove('hidden');
        } else {
            // After user's message, hide the input controls and show final section
            interactionControls.classList.add('hidden');
            finalSection.classList.remove('hidden');
        }
    }
}

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
