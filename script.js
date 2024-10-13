let apiKey = ''; // Initialize the API key variable

// Toggle the visibility of the settings overlay
function toggleSettings() {
    const overlay = document.getElementById('settingsOverlay');
    overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex'; // Show or hide the overlay
}

// Save the entered API key and provide feedback
function saveApiKey() {
    const inputKey = document.getElementById('apiKey').value;
    if (inputKey.trim() === '') {
        addMessage("Please enter a valid API key.", true); // Notify user to enter a valid key
    } else {
        apiKey = inputKey; // Save the API key
        addMessage("API key saved successfully!", true); // Confirm successful save
        toggleSettings(); // Close the settings overlay
    }
}

// Respond to user input by fetching a response from the API
async function respondToUser(inputText) {
    const formattedInput = `Please provide a code example for: ${inputText}`;
    const success = await fetchChatGPTResponse(formattedInput);
    if (!success) {
        addMessage("I'm not sure how to respond to that."); // Notify if response fetching failed
    }
}

function escapeHtml(html) {
    const text = document.createElement("textarea");
    text.innerText = html; // Set the text
    return text.innerHTML; // Get the escaped HTML
}


// Fetch response from the Groq API using the provided input text
async function fetchChatGPTResponse(inputText) {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', { 
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`, // Use the saved API key
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // Specify the Llama3 model
                messages: [{ role: "user", content: inputText }], // Format input as required by API
                max_tokens: 256, // Adjust max tokens for response
                temperature: 0.7, // Control response variability
            }),
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            const botResponse = data.choices[0].message.content; // Extract the bot's response
            addMessage(botResponse); // Display the bot's response
            return true; // Indicate success
        } else {
            addMessage("I couldn't retrieve a response from the API.", false); // Notify if no response
            return false; // Indicate failure
        }
    } catch (error) {
        addMessage("Error fetching response from Groq API.", false); // Handle API fetch errors
        console.error('Error:', error); // Log the error for debugging
        return false; // Indicate failure
    }
}

// Add a message to the chat display
function addMessage(text, fromUser = false) {
    const messagesDiv = document.getElementById('messages');
    const newMessage = document.createElement('div');

    // Escape HTML to prevent rendering
    const escapedText = escapeHtml(text); // Escape HTML characters

    // Check for code formatting and wrap it in <pre><code> tags
    const formattedText = escapedText.includes('```') 
        ? escapedText.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>') // Wrap code in <pre><code> tags
        : escapedText; // If no code, keep the original text

    newMessage.innerHTML = formattedText; // Use innerHTML to render HTML content
    newMessage.className = fromUser ? 'user' : 'bot'; // Apply appropriate class for styling
    messagesDiv.appendChild(newMessage);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom of the chat
}

// Send user input message to the chat and respond
function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() === '') return; // Ignore empty inputs

    addMessage(userInput, true); // Display the user's message
    respondToUser(userInput); // Fetch response from the bot
    document.getElementById('userInput').value = ''; // Clear the input field
}

// Clear the chat messages
function clearChat() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = ''; // Clear all messages
    addMessage("Chat cleared.", false); // Notify user that chat has been cleared
}
