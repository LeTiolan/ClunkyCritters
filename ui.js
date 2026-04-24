// Function to handle seamless menu switching
function showScreen(screenId) {
    // 1. Find all HTML elements that have the class 'screen'
    const screens = document.querySelectorAll('.screen');
    
    // 2. Loop through them and hide them all by adding the 'hidden' CSS class
    screens.forEach(screen => {
        screen.classList.add('hidden');
    });
    
    // 3. Find the specific screen the player clicked and unhide it
    document.getElementById(screenId).classList.remove('hidden');
}
