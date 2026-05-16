// const intervalID = setInterval(myCallback, 1000, 'Hello');

// function myCallback(a) {
//   console.log(a, Date.now());
// }

let intervalID;

function startChange() {
  if (!intervalID) {
    intervalID = setInterval(changeRandomColor, 1000);
  }
}

// function changeColor() {
//   if (document.body.style.backgroundColor !== 'black') {
//     document.body.style.backgroundColor = 'black';
//     document.body.style.color = 'white';
//   } else {
//     document.body.style.backgroundColor = 'white';
//     document.body.style.color = 'black';
//   }
// }

let colors = ['black', 'white', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink'];
let inedx = 0;
let intervalID = null;

function renderColor() {
  document.body.style.backgroundColor = `${colors[index]}`;
}

function startChange() {
  ++index;
  if (index === colors.length) {
    index = 0;
  }
  renderColor();
}

function changeRandomColor() {

}

function stopChange() {
  clearInterval(intervalID);
}

document.getElementById('start').addEventListener('click', startChange);
document.getElementById('stop').addEventListener('click', stopChange);
