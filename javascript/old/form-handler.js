// Handle form submission
document.getElementById('companyDataForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default form submission behavior

    // Get the company data from the form
    const companyName = document.getElementById('companyName').value;
    const taskType = document.getElementById('taskType').value;
    const scheduleDate = document.getElementById('scheduleDate').value;

    // Ensure all form fields are filled out before proceeding
    if (!companyName || !taskType || !scheduleDate) {
        alert("Please fill in all the fields.");
        return;
    }

    // Redirect to interaction.html with the form data in the URL
    window.location.href = `interaction.html?companyName=${encodeURIComponent(companyName)}&taskType=${encodeURIComponent(taskType)}&scheduleDate=${encodeURIComponent(scheduleDate)}`;
});
