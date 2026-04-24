// --- TRUE DRAG AND DROP BUILDER ---

const bodyCanvas = document.getElementById('body-canvas');
const ctx = bodyCanvas.getContext('2d');

let draggedTool = null;

// 1. Setup Dragging from Sidebar
document.querySelectorAll('.drag-item').forEach(item => {
    item.addEventListener('dragstart', (e) => {
        draggedTool = e.target.id; // e.g., 'drag-joint'
    });
});

// 2. Allow Dropping on Canvas
bodyCanvas.addEventListener('dragover', (e) => {
    e.preventDefault(); // Necessary to allow dropping
});

// 3. Handle the Drop
bodyCanvas.addEventListener('drop', (e) => {
    e.preventDefault();
    
    const rect = bodyCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggedTool === 'drag-joint') {
        currentBody.joints.push({ x: x, y: y });
        drawBody();
    } else {
        // Just a helper alert if they try to drop a connection line into empty space
        alert("Drop a Joint Node first! To make bones/muscles, select them in the menu, then click and drag from one joint to another on the canvas.");
    }
});

// --- CONNECTION LOGIC (Click and Drag between nodes) ---
let activeTool = 'bone'; 
document.getElementById('drag-bone').addEventListener('click', () => activeTool = 'bone');
document.getElementById('drag-muscle').addEventListener('click', () => activeTool = 'muscle');

let isDraggingLine = false;
let startJointIndex = null;
let mouseX = 0, mouseY = 0;

function getJointAt(x, y) {
    for (let i = 0; i < currentBody.joints.length; i++) {
        const j = currentBody.joints[i];
        if (Math.hypot(x - j.x, y - j.y) < 15) return i;
    }
    return null;
}

bodyCanvas.addEventListener('mousedown', (e) => {
    const rect = bodyCanvas.getBoundingClientRect();
    startJointIndex = getJointAt(e.clientX - rect.left, e.clientY - rect.top);
    if (startJointIndex !== null) isDraggingLine = true;
});

bodyCanvas.addEventListener('mousemove', (e) => {
    const rect = bodyCanvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    if (isDraggingLine) drawBody();
});

bodyCanvas.addEventListener('mouseup', (e) => {
    if (isDraggingLine && startJointIndex !== null) {
        const endJointIndex = getJointAt(mouseX, mouseY);
        if (endJointIndex !== null && endJointIndex !== startJointIndex) {
            if (activeTool === 'bone') currentBody.bones.push({ a: startJointIndex, b: endJointIndex });
            if (activeTool === 'muscle') currentBody.muscles.push({ a: startJointIndex, b: endJointIndex });
        }
    }
    isDraggingLine = false;
    startJointIndex = null;
    drawBody();
});

function drawBody() {
    ctx.clearRect(0, 0, bodyCanvas.width, bodyCanvas.height);

    // Draw Bones
    ctx.lineWidth = 6; ctx.strokeStyle = '#ffffff';
    currentBody.bones.forEach(b => {
        ctx.beginPath(); ctx.moveTo(currentBody.joints[b.a].x, currentBody.joints[b.a].y);
        ctx.lineTo(currentBody.joints[b.b].x, currentBody.joints[b.b].y); ctx.stroke();
    });

    // Draw Muscles
    ctx.lineWidth = 4; ctx.strokeStyle = '#ff4444';
    currentBody.muscles.forEach(m => {
        ctx.beginPath(); ctx.moveTo(currentBody.joints[m.a].x, currentBody.joints[m.a].y);
        ctx.lineTo(currentBody.joints[m.b].x, currentBody.joints[m.b].y); ctx.stroke();
    });

    // Draw preview line
    if (isDraggingLine && startJointIndex !== null) {
        ctx.lineWidth = 4; ctx.strokeStyle = activeTool === 'bone' ? 'rgba(255,255,255,0.5)' : 'rgba(255,68,68,0.5)';
        ctx.beginPath(); ctx.moveTo(currentBody.joints[startJointIndex].x, currentBody.joints[startJointIndex].y);
        ctx.lineTo(mouseX, mouseY); ctx.stroke();
    }

    // Draw Joints
    currentBody.joints.forEach(j => {
        ctx.fillStyle = '#00ffcc';
        ctx.beginPath(); ctx.arc(j.x, j.y, 10, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#111'; ctx.lineWidth = 2; ctx.stroke();
    });
}
drawBody();
