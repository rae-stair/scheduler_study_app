let flashcardSets = JSON.parse(localStorage.getItem('flashcardSets') || '{}');
let setName = "";

function addSet() {  
  const userInput = prompt("Enter your text:");
  if (userInput !== null) {
    document.getElementById("setBtn").style.display = "none";
    document.getElementById("iconGrid").style.display = "none";
    alert("You typed: " + userInput);
    setName = userInput;
    document.getElementById("note-card").style.display = "block";
  }
}

function addMessage() {

    const text = document.getElementById('message').value.trim();
    if (text === "") {
        alert("Cannot save an empty flashcard!");
        return;
    }
      
    if (setName === "" || text === "") {
    alert("Set name and flashcard text cannot be empty!");
    return;
    }

    if (!flashcardSets[setName]) {
    flashcardSets[setName] = [];
    }

    // Add flashcard
    flashcardSets[setName].push({ text });
    localStorage.setItem('flashcardSets', JSON.stringify(flashcardSets));

    // Clear textarea and reload set selector
    document.getElementById('message').value = "";
    alert(`Flashcard saved to "${setName}"!`);

}

function saveSet() {
    document.getElementById("setBtn").style.display = "block"; 
    document.getElementById("note-card").style.display = "none"; 
    document.getElementById("iconGrid").style.display = "grid";
    populateIconGrid();
}

function openSet(id) {
    setName = id;
    const textarea = document.getElementById('message');
    document.getElementById("setBtn").style.display = "none";
    document.getElementById("iconGrid").style.display = "none";
    document.getElementById("note-card").style.display = "block";

}

function populateIconGrid() {
    const iconGrid = document.getElementById('iconGrid');
    iconGrid.innerHTML = ''; // Clear existing cards

    // Loop through all sets in flashcardSets
    for (const set in flashcardSets) {
        if (flashcardSets.hasOwnProperty(set)) {
            const card = document.createElement('div');
            card.className = 'iconCard';
            card.id = set;
            card.onclick = () => openSet(card.id);

            // Create the emoji icon
            const icon = document.createElement('div');
            icon.className = 'icon';
            icon.textContent = "📒";

            // Create the label
            const label = document.createElement('div');
            label.className = 'iconLabel';
            label.textContent = set;

            // Add icon and label to card
            card.appendChild(icon);
            card.appendChild(label);

            // Add card to the grid
            iconGrid.appendChild(card);
        }
    }
}



