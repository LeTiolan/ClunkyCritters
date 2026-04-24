// --- THE DATA CORE & LIBRARY SYSTEM ---

let currentBody = { joints: [], bones: [], muscles: [] };
let currentBrain = { nodes: [], connections: [] };

let savedCreatures = JSON.parse(localStorage.getItem('clunkyCrittersGarage')) || [];

function saveCreature(creatureName) {
    const newCreature = {
        id: Date.now(),
        name: creatureName || `Critter ${savedCreatures.length + 1}`,
        body: JSON.parse(JSON.stringify(currentBody)),
        brain: JSON.parse(JSON.stringify(currentBrain))
    };
    
    savedCreatures.push(newCreature);
    localStorage.setItem('clunkyCrittersGarage', JSON.stringify(savedCreatures));
    
    alert(`Successfully saved ${newCreature.name}! Added to your Library.`);
    
    updateLibraryUI();
    showScreen('screen-hub'); // Navigate back to the hub after successful save
}

function clearWorkspace() {
    currentBody = { joints: [], bones: [], muscles: [] };
    currentBrain = { nodes: [], connections: [] };
}

function updateLibraryUI() {
    const libraryContainer = document.getElementById('library-list');
    if (!libraryContainer) return; 
    
    libraryContainer.innerHTML = ''; 

    if (savedCreatures.length === 0) {
        libraryContainer.innerHTML = '<p class="hint">Your library is empty. Go to the Forge to build a critter!</p>';
        return;
    }

    savedCreatures.forEach(creature => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'library-item';
        
        const nameSpan = document.createElement('span');
        nameSpan.innerText = creature.name;
        
        const addBtn = document.createElement('button');
        addBtn.className = 'add-btn';
        addBtn.innerText = '+';
        addBtn.onclick = () => {
            console.log(`Added ${creature.name} to the Arena!`);
            // We will inject physics spawning here later
            alert(`Selected ${creature.name} for the Arena!`);
        };

        itemDiv.appendChild(nameSpan);
        itemDiv.appendChild(addBtn);
        libraryContainer.appendChild(itemDiv);
    });
}

// Initial draw of the library when the script loads
updateLibraryUI();
