// Function to simulate the customer's voice reply in the interaction page
function simulateReply() {
    const apiTextOutput = document.getElementById('apiTextOutput');
    apiTextOutput.textContent = 'Customer: "Sure, I can attend the appointment on that date."';

    const apiSoundOutput = document.getElementById('apiSoundOutput');
    apiSoundOutput.src = 'customer-reply.mp3';  // Simulate playing customer's voice reply
    apiSoundOutput.play();
}

// JavaScript to handle form submission and redirect
document.getElementById('companyDataForm')?.addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission behavior

    // Collect the data from the form (optional for sending to an API or local use)
    const companyName = document.getElementById('companyName').value;
    const taskType = document.getElementById('taskType').value;
    const scheduleDate = document.getElementById('scheduleDate').value;

    // Here you can handle the form data if needed (e.g., send it to an API)
    console.log({ companyName, taskType, scheduleDate }); // Logging collected data (optional)

    // Redirect to interaction page
    window.location.href = 'interaction.html';
});

// navbar.js

// Function to load the navbar
function loadNavbar() {
    fetch('navbar.html')  // Fetch the navbar HTML file
        .then(response => response.text())  // Convert response to text
        .then(data => {
            document.getElementById('navbar').innerHTML = data;  // Insert the navbar into the placeholder div
        })
        .catch(error => console.error('Error loading navbar:', error));  // Handle fetch error
}

// Call the function to load the navbar when the page loads
document.addEventListener('DOMContentLoaded', loadNavbar);
