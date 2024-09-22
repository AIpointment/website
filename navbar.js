// Function to load the navbar
function loadNavbar() {
    fetch('navbar.html')  // Adjust the path if navbar.html is in a different folder
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();  // Convert response to text
        })
        .then(data => {
            document.getElementById('navbar').innerHTML = data;  // Insert navbar HTML
        })
        .catch(error => console.error('Error loading navbar:', error));  // Handle fetch error
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', loadNavbar);
