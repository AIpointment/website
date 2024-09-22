// Handle form submission and redirect to interaction.html
document.getElementById('companyDataForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission behavior

    // You can collect the data from the form here if needed
    const companyName = document.getElementById('companyName').value;
    const taskType = document.getElementById('taskType').value;
    const scheduleDate = document.getElementById('scheduleDate').value;

    // Here you can handle the form data if you want to send it somewhere (like an API)

    // Redirect to the interaction page
    // Redirect to the interaction page with company name as a URL parameter
    window.location.href = `interaction.html?companyName=${encodeURIComponent(companyName)}`;
});
