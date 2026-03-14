
function startScanning() {
    // Hide the radar and button, show wallet input
    document.querySelector('.radar-container').style.display = 'none';
    document.querySelector('.start-button').style.display = 'none';
    document.querySelector('.wallet-input').style.display = 'block';
}

function scanWallet() {
    const walletAddress = document.getElementById('walletAddress').value;
    
    // Hide the wallet input, show result
    document.querySelector('.wallet-input').style.display = 'none';
    document.querySelector('.result').style.display = 'block';

    // Randomly decide whether to find copy traders or not
    const randomOutcome = Math.random();
    const resultText = randomOutcome < 0.5 ? 
        "No copy traders found." : 
        `You have ${Math.floor(Math.random() * 10) + 1} copy traders!`;

    document.getElementById('resultText').textContent = resultText;
}

function showTokenPrompt() {
    // Hide result, show token prompt
    document.querySelector('.result').style.display = 'none';
    document.querySelector('.token-prompt').style.display = 'block';
}

function showCopyTraders() {
    const token = document.getElementById('tokenInput').value;

    if (token) {
        // Hide token prompt, show copy traders
        document.querySelector('.token-prompt').style.display = 'none';
        document.querySelector('.copy-traders').style.display = 'block';
    } else {
        alert("Please enter a valid token.");
    }
}
