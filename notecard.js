//--------------------------- Globals ---------------------------
let flashcardSets = JSON.parse(localStorage.getItem('flashcardSets') || '{}');
let setName = "";
let currentIdx = 0;

//--------------------------- Add / Create Set ---------------------------
function addSet() {
    const userInput = prompt("Enter your set name:");
    if (!userInput) return;
    if (flashcardSets[userInput]) {
        alert("Set already exist");
        return;
    }

    setName = userInput;
    document.getElementById("setBtn").style.display = "none";
    document.getElementById("message").value = "";
    document.getElementById("iconGrid").style.display = "none";
    document.getElementById("note-card").style.display = "block";
    document.getElementById("edBtn").style.display = "block";
    document.getElementById("cdBtn").style.display = "none";
}

//--------------------------- Add Flashcard ---------------------------
function addMessage() {
    const textarea = document.getElementById('message');
    const answerarea = document.getElementById('answer');
    const text = textarea.value.trim();
    const answer = answerarea.value.trim();

    if (!setName || !text || !answer) {
        alert("Set name and flashcard text cannot be empty!");
        return;
    }

    if (!flashcardSets[setName]) flashcardSets[setName] = [];
    flashcardSets[setName].push({ text },{ answer });
    localStorage.setItem('flashcardSets', JSON.stringify(flashcardSets));

    textarea.value = "";
    answerarea.value = "";
    alert(`Flashcard saved to "${setName}"!`);
}

//--------------------------- Save / Return to Grid ---------------------------
function saveSet() {
    const textarea = document.getElementById('message');
    document.getElementById("setBtn").style.display = "block"; 
    document.getElementById("titletext").style.display = "none"; 
    document.getElementById("note-card").style.display = "none"; 
    document.getElementById("iconGrid").style.display = "grid";
    textarea.readOnly = false;
    textarea.style.outline = "";
    populateIconGrid();
}

//--------------------------- Open Set for Editing ---------------------------
function openSet(id) {
    setName = id;
    const textarea = document.getElementById('message');
    document.getElementById("setBtn").style.display = "none";
    document.getElementById("iconGrid").style.display = "none";
    document.getElementById("note-card").style.display = "block";

    textarea.readOnly = false;
    textarea.style.outline = "";
}

//--------------------------- Open Set for Viewing Flashcards ---------------------------
function openFlash(id) {
    setName = id;
    currentIdx = 0;
    const textarea = document.getElementById('message');
    document.getElementById("titletext").style.display = "block";

    document.getElementById("setBtn").style.display = "none";
    document.getElementById("iconGrid").style.display = "none";
    document.getElementById("note-card").style.display = "block";
    document.getElementById("edBtn").style.display = "none";
    document.getElementById("cdBtn").style.display = "block";

    textarea.readOnly = true;
    textarea.style.outline = "none";

    showFlashcard();
}

//--------------------------- Show Flashcard ---------------------------
function showFlashcard() {
    const flashcards = flashcardSets[setName];
    const textarea = document.getElementById('message');
    const titletext = document.getElementById('titletext');

    if (!flashcards || flashcards.length === 0) {
        textarea.value = "(No flashcards in this set)";
        return;
    }

    if (currentIdx < 0) currentIdx = flashcards.length - 1;
    if (currentIdx >= flashcards.length) currentIdx = 0;
    if(currentIdx %2 == 1) {
        titletext.textContent = `Answer ${(1+currentIdx)/2}`;
        textarea.value = flashcards[currentIdx].answer;
    }
    else {
        titletext.textContent = `Question ${1+currentIdx/2}`;
        textarea.value = flashcards[currentIdx].text;
    }
}

//--------------------------- Navigate Flashcards ---------------------------
function prevCard() {
    if(currentIdx %2 == 1) currentIdx--;
    else currentIdx -= 2;
    showFlashcard();
}

function nextCard() {
    if(currentIdx %2 == 1) currentIdx++;
    else currentIdx += 2;
    showFlashcard();
}

function showAnswer() {
    if(currentIdx %2 == 1) currentIdx--;
    else currentIdx++;
    showFlashcard();
}
//--------------------------- Populate Icon Grid ---------------------------
function populateIconGrid() {
    const iconGrid = document.getElementById('iconGrid');
    iconGrid.innerHTML = '';

    Object.keys(flashcardSets).forEach(set => {
        const card = document.createElement('div');
        card.className = 'iconCard';
        card.id = set;
        card.onclick = () => openFlash(set);

        const icon = document.createElement('div');
        icon.className = 'icon';
        icon.textContent = "📒";

        const label = document.createElement('div');
        label.className = 'iconLabel';
        label.textContent = set;

        card.append(icon, label);
        iconGrid.appendChild(card);
    });
}
