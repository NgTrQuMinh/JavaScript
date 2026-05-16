// 1. State Variables
const colors = ['black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink'];
let index = 0;       // Fixed typo (inedx -> index)
let intervalID = null; // Only declare this once

// 2. Helper function to apply the color
function renderColor() {
  document.body.style.backgroundColor = colors[index];
  
  // Optional: Adjust text color for readability against dark/light backgrounds
  if (['black', 'blue', 'purple'].includes(colors[index])) {
    document.body.style.color = 'white';
  } else {
    document.body.style.color = 'black';
  }
}

// 3. Core Logic Functions
function changeColor() {
  index++;
  if (index === colors.length) {
    index = 0; // Reset back to the start of the array
  }
  renderColor();
}

function startChange() {
  // Prevent multiple intervals from stacking up
  if (!intervalID) {
    // Run changeColor immediately on click, then every 1000ms
    changeColor(); 
    intervalID = setInterval(changeColor, 1000);
  }
}

function stopChange() {
  clearInterval(intervalID);
  intervalID = null; // CRITICAL: Reset to null so startChange() can run again
}

// 4. Event Listeners
document.getElementById('start').addEventListener('click', startChange);
document.getElementById('stop').addEventListener('click', stopChange);