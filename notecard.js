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
    document.getElementById("flashcard").style.display = "none";
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
    document.body.classList.remove("study-mode");
    textarea.readOnly = false;
    textarea.style.outline = "";

    populateIconGrid();
}

//--------------------------- Open Set for Editing ---------------------------
function openSet(id) {
    setName = id;
    document.getElementById("setBtn").style.display = "none";
    document.getElementById("iconGrid").style.display = "none";
    document.getElementById("note-card").style.display = "block";

    document.getElementById("message").style.display = "block";
    document.getElementById("answer").style.display = "block";

    document.getElementById("flashcard").style.display = "none";
}

//--------------------------- Open Set for Viewing Flashcards ---------------------------
function openFlash(id) {
    setName = id;
    currentIdx = 0;
    document.getElementById("titletext").style.display = "block";
    document.getElementById("setBtn").style.display = "none";
    document.getElementById("iconGrid").style.display = "none";
    document.getElementById("note-card").style.display = "block";
    document.getElementById("edBtn").style.display = "none";
    document.getElementById("cdBtn").style.display = "block";

    document.getElementById("message").style.display = "none";
    document.getElementById("answer").style.display = "none";
    document.getElementById("flashcard").style.display = "block";

    showFlashcard();
}

//--------------------------- Show Flashcard ---------------------------
function showFlashcard() {
    const flashcards = flashcardSets[setName];
    const textarea = document.getElementById('message');
    const titletext = document.getElementById('titletext');

    const front = document.querySelector(".flashcard-front");
    const back = document.querySelector(".flashcard-back");

    const card = document.getElementById("flashcard");
    card.classList.remove("flipped");

    if (!flashcards || flashcards.length === 0) {
        if (front) front.textContent = "(No flashcards in this set)";
        if (back) back.textContent = "";
        return;
    }


    if (currentIdx < 0) currentIdx = flashcards.length - 1;
    if (currentIdx >= flashcards.length) currentIdx = 0;
    if(currentIdx %2 == 1) {
        titletext.textContent = `Answer ${(1+currentIdx)/2}`;

        back.textContent = flashcards[currentIdx].answer;
        front.textContent = flashcards[currentIdx - 1].text;
    }
    else {
        titletext.textContent = `Question ${1+currentIdx/2}`;

        front.textContent = flashcards[currentIdx].text;
        back.textContent = flashcards[currentIdx + 1]?.answer || "";
    }
}

//--------------------------- Navigate Flashcards ---------------------------
function prevCard() {
    document.getElementById("flashcard").classList.remove("flipped");
    if(currentIdx %2 == 1) currentIdx--;
    else currentIdx -= 2;
    showFlashcard();
}
function nextCard() {
    document.getElementById("flashcard").classList.remove("flipped");
    if(currentIdx %2 == 1) currentIdx++;
    else currentIdx += 2;
    showFlashcard();
}

function showAnswer() {
    document.getElementById("flashcard").classList.toggle("flipped");
}
//--------------------------- Populate Icon Grid ---------------------------
function populateIconGrid() {
    const iconGrid = document.getElementById('iconGrid');
    iconGrid.innerHTML = '';

    Object.keys(flashcardSets).forEach(set => {
       // wrapper
       const wrapper = document.createElement('div');
       wrapper.className = "set-container";

       //existing card
       const card = document.createElement('div');
       card.className = 'iconCard';
       card.onclick = () => openFlash(set);

       const icon = document.createElement('div');
       icon.className = 'icon';
       icon.textContent = "📒";

       const label = document.createElement('div');
       label.className = 'iconLabel';
       label.textContent = set;

       card.append(icon, label);
       
       // ------------ Options Button -----------
       const optionsBtn = document.createElement('button');
       optionsBtn.className = "options-set-btn";
       optionsBtn.textContent = "Options";

       const menu = document.createElement('div');
       menu.className = "options-menu";

       const renameOption = document.createElement('div');
       renameOption.className = "options-item";
       renameOption.textContent = "Rename";

       const deleteOption = document.createElement('div');
       deleteOption.className = "options-item";
       deleteOption.textContent = "Delete";

       const cancelOption = document.createElement('div');
       cancelOption.className = "options-item";
       cancelOption.textContent = "Cancel";

       //---------- Toggle for menu ----------
       optionsBtn.onclick = (event) => {
        event.stopPropagation();
        menu.style.display = (menu.style.display === "block" ? "none" : "block");
       }

       //----------- Rename Section ---------
        renameOption.onclick = () => {
            const newName = prompt("Enter new name:", set);
            
            if (!newName || !newName.trim()) {
                alert("Name cannot be empty.");
                return;
            }
            if (flashcardSets[newName]) {
                alert("A set with that name already exists.");
                return;
            }
            flashcardSets[newName] = flashcardSets[set];
            delete flashcardSets[set];

            localStorage.setItem('flashcardSets', JSON.stringify(flashcardSets));
            populateIconGrid();
        }

        //---- Delete Section -----------
        deleteOption.onclick = () => {
            const confirmed = confirm(`Are you sure you want to delete "${set}"?`);
            if (!confirmed) return;

            delete flashcardSets[set];
            localStorage.setItem('flashcardSets', JSON.stringify(flashcardSets));
            populateIconGrid();
            };
       //----- Cancel Section ----------
       cancelOption.onclick = () => {
            menu.style.display = "none";
       }

       //---------- Menu -------
       menu.append(renameOption, deleteOption, cancelOption);

       wrapper.append(card, optionsBtn, menu);
       iconGrid.appendChild(wrapper);
    
    });
}

document.getElementById("flashcard").onclick = () => {
    document.getElementById("flashcard").classList.toggle("flipped");
}