const sectors = [
  { color: "#FFBC03", text: "#333333", label: "Maritozzi" },
  { color: "#FF5A10", text: "#333333", label: "Extra Luck!" },
  { color: "#FFBC03", text: "#333333", label: "Babah Rum" },
  { color: "#FF5A10", text: "#333333", label: "So Close" },
  { color: "#FFBC03", text: "#333333", label: "Brûlée Halwa" },
  { color: "#FF5A10", text: "#333333", label: "Next Time!" },
  { color: "#FFBC03", text: "#333333", label: "Pain Perdu" },
  { color: "#FF5A10", text: "#333333", label: "Better Luck" },
  { color: "#FFBC03", text: "#333333", label: "Gulab Nut" },
  { color: "#FF5A10", text: "#333333", label: "Keep Spinning!" },
];

let dishWins = 0;
let spinCount = 0;
let dishWinTimer = 8;
let maxSpins = 50;

const events = {
  listeners: {},
  addListener: function (eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);
  },
  fire: function (eventName, ...args) {
    if (this.listeners[eventName]) {
      for (let fn of this.listeners[eventName]) {
        fn(...args);
      }
    }
  },
};

const rand = (m, M) => Math.random() * (M - m) + m;
const tot = sectors.length;
const spinEl = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext("2d");
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / sectors.length;

const friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
let angVel = 0; // Angular velocity
let ang = 0; // Angle in radians

let spinButtonClicked = false;

const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

function drawSector(sector, i) {
  const ang = arc * i;
  ctx.save();

  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();

  // TEXT
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "right";
  ctx.fillStyle = sector.text;
  ctx.font = "bold 30px 'Lato', sans-serif";
  ctx.fillText(sector.label, rad - 10, 10);

  ctx.restore();
}

function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;

  spinEl.textContent = !angVel ? "SPIN" : sector.label;
  spinEl.style.background = sector.color;
  spinEl.style.color = sector.text;
}

function frame() {
  // Fire an event after the wheel has stopped spinning
  if (!angVel && spinButtonClicked) {
    const finalSector = sectors[getIndex()];
    events.fire("spinEnd", finalSector);
    spinButtonClicked = false; // reset the flag
    return;
  }

  angVel *= friction; // Decrement velocity by friction
  if ((angVel < 0.006 && dishWins >= 5) || (angVel < 0.006 && dishWinTimer > 1 )){
    while(spinEl.style.background === 'rgb(255, 90, 16)') {
      angVel = 0;
      return
    }
  } else if(angVel < 0.006) {
    angVel = 0
  }
    // Bring to stop
  ang += angVel; // Update angle
  ang %= TAU; // Normalize angle
  rotate();
}

function engine() {
  frame();
  requestAnimationFrame(engine);
}

function init() {
  sectors.forEach(drawSector);
  rotate(); // Initial rotation
  engine(); // Start engine
  spinEl.addEventListener("click", () => {
    if (!angVel && spinCount < maxSpins) {
      angVel = rand(0.25, 0.45)
      spinButtonClicked = true;
    spinCount++;
    } else if (spinCount >= maxSpins) {
      console.log("Spin limit reached.");
    };
    if (dishWinTimer !== 0){
       dishWinTimer--;
    }
  });
}

init();

events.addListener("spinEnd", (sector) => {
  if (spinEl.style.background === 'rgb(255, 188, 3)') {
    dishWins++;
    dishWinTimer = 10;
    console.log(`Congrats! You won ${sector.label}`);
  };
  if (spinCount > 50) dishWins = 0;
  console.log('Dishes Awarded: ',dishWins);  
  console.log('Spin Count: ',spinCount);  
});
