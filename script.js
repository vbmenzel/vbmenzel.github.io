let apiKey = ''; // Initialize API key variable

function toggleSettings() {
    const overlay = document.getElementById('settingsOverlay');
    overlay.style.display = overlay.style.display === 'flex' ? 'none' : 'flex';
}

function saveApiKey() {
    const inputKey = document.getElementById('apiKey').value;
    if (inputKey.trim() === '') {
        addMessage("Please enter a valid API key.", true);
    } else {
        apiKey = inputKey; // Save API key
        addMessage("API key saved successfully!", true);
        toggleSettings(); // Close the settings overlay
    }
}

async function respondToUser(inputText) {
    const success = await fetchChatGPTResponse(inputText);
    if (!success) {
        addMessage("I'm not sure how to respond to that.");
    }
}

async function fetchChatGPTResponse(inputText) {
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', { // Use Groq's OpenAI-compatible URL
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`, // Use the saved Groq API key
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "llama3-8b-8192", // Specify the Llama3 model
                messages: [{ role: "user", content: inputText }], // Use the same format as OpenAI's
                max_tokens: 256, // Optional: adjust the max tokens for the response
                temperature: 0.7, // Optional: control the response variability
            }),
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            const botResponse = data.choices[0].message.content; // Process the response similarly to OpenAI's API
            addMessage(botResponse);
            return true; // Indicate the response was successfully fetched
        } else {
            addMessage("I couldn't retrieve a response from the API.", false);
            return false; // Indicate the response was not successfully fetched
        }
    } catch (error) {
        addMessage("Error fetching response from Groq API.", false);
        console.error('Error:', error);
        return false; // Indicate the response was not successfully fetched
    }
}

function addMessage(text, fromUser = false) {
    const messagesDiv = document.getElementById('messages');
    const newMessage = document.createElement('div');
    newMessage.textContent = (fromUser ? 'You: ' : 'Bot: ') + text;
    newMessage.className = fromUser ? 'user' : 'bot';
    messagesDiv.appendChild(newMessage);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom
}

function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() === '') return;

    addMessage(userInput, true);
    respondToUser(userInput);
    document.getElementById('userInput').value = '';
}

// Function to clear chat
function clearChat() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = ''; // Clear all messages
    addMessage("Chat cleared.", false); // Optional: notify user that chat has been cleared
}
