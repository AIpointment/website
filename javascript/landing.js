function typeText(element, text, speed = 100, callback = null) {
    let index = 0;
    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else if (callback) {
            callback(); // Call the next function after typing is done
        }
    }
    element.innerHTML = ''; // Clear the current text
    type();
}

function handlePlayDemo() {
    // Hide the Play Demo button
    document.getElementById('play-button').style.display = 'none';

    // Type the new message, then type the phone number as a callback
    const newText = 'Our call-assistant explains ';
    const typewriterElement = document.getElementById('typewriter-text');
    typeText(typewriterElement, newText, 80, () => {
        // After the message is complete, show and type the phone number
        const phoneNumber = "+41 62 539 12 76";
        const phoneNumberElement = document.getElementById('phone-number');
        phoneNumberElement.style.display = 'block';
        typeText(phoneNumberElement, phoneNumber, 100);
    });
}

