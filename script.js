// script.js
function addMessage(text, fromUser = false) {
    const messagesDiv = document.getElementById('messages');
    const newMessage = document.createElement('div');
    newMessage.classList.add(fromUser ? 'user' : 'bot');
    newMessage.textContent = text;
    messagesDiv.appendChild(newMessage);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to bottom
}

function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() === '') return;

    addMessage(`You: ${userInput}`, true);
    respondToUser(userInput);
    document.getElementById('userInput').value = '';
}

function respondToUser(inputText) {
    const queries = inputText.split(','); // Split multiple queries by commas
    queries.forEach(query => processQuery(query.trim()));
}

function processQuery(inputText) {
    const greetingPattern = /\b(hi|hello|hey)\b/i;
    const mathPattern = /^[\d+\-*/().\s]+$/; // Matches basic math expressions without needing "calculate"
    const complexMathPattern = /\b(square root of|squared|power of|cosine of|sine of|tangent of)\b\s*(\d+)/i;
    const randomNumberPattern = /\brandom number\b/i;
    const helpPattern = /\b(help|what can you do|what can you do\?)\b/i;

    if (greetingPattern.test(inputText)) {
        addMessage("Hello! How can I assist you today?");
    } else if (mathPattern.test(inputText.trim())) {
        calculate(inputText);
    } else if (complexMathPattern.test(inputText)) {
        performComplexMath(inputText);
    } else if (randomNumberPattern.test(inputText)) {
        generateRandomNumber();
    } else if (helpPattern.test(inputText)) {
        showHelp();
    } else {
        addMessage("I'm not sure how to respond to that.");
    }
}

function calculate(expression) {
    try {
        const result = eval(expression); // Use eval for basic math expressions
        addMessage(`The result of ${expression} is ${result}.`);
    } catch (error) {
        addMessage("I couldn't understand the math expression.");
    }
}

function performComplexMath(inputText) {
    const complexMathPattern = /\b(square root of|squared|power of|cosine of|sine of|tangent of)\b\s*(\d+)/i;
    const match = inputText.match(complexMathPattern);

    if (!match) {
        addMessage("I couldn't understand the math expression.");
        return;
    }

    const operation = match[1].toLowerCase();
    const number = parseFloat(match[2]);
    let result;

    switch (operation) {
        case 'square root of':
            result = Math.sqrt(number);
            break;
        case 'squared':
            result = Math.pow(number, 2);
            break;
        case 'cosine of':
            result = Math.cos(number);
            break;
        case 'sine of':
            result = Math.sin(number);
            break;
        case 'tangent of':
            result = Math.tan(number);
            break;
        default:
            addMessage("I couldn't perform the calculation.");
            return;
    }

    addMessage(`The result of ${operation} ${number} is ${result}.`);
}

function generateRandomNumber() {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    addMessage(`Here is a random number: ${randomNumber}`);
}

function showHelp() {
    const helpText = `
        I can help you with the following:
        - Basic greetings like "hello" or "hi".
        - Math calculations. Try typing a math expression like "5 + 3 - 2 * 4".
        - Generating a random number with "random number".
        - Type "help" or "what can you do" to see this message again.
    `;
    addMessage(helpText);
}
