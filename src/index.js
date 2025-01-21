const sectors = [
  { color: "#FFBC03", text: "#333333", label: "Herb & Garlic Rice" },
  { color: "#FF5A10", text: "#333333", label: "Maritozzi" },
  { color: "#FFBC03", text: "#333333", label: "Mezze Platter 2.0" },
  { color: "#FF5A10", text: "#333333", label: "Babah Rum" },
  { color: "#FFBC03", text: "#333333", label: "Nasi Lunch Box" },
  { color: "#FF5A10", text: "#333333", label: "Brûlée Halwa!" },
  { color: "#FFBC03", text: "#333333", label: "⁠Malaysian Fried Rice" },
  { color: "#FF5A10", text: "#333333", label: "Pain Perdu" },
  { color: "#FFBC03", text: "#333333", label: "⁠Pondicherry Macaroni" },
  { color: "#FF5A10", text: "#333333", label: "Gulab Nut" },
];

let dishWins = 0;
let spinCount = 0;
let dishWinTimer = localStorage.getItem("dishWinTimer") || 8;
console.log(dishWinTimer);

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
  ctx.font = "bold 20px 'Lato', sans-serif";
  ctx.fillText(sector.label, rad - 10, 10);

  ctx.restore();
}

function rotate() {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;

  // Show the label only while spinning or stopped, but not ready for the next spin
  if (angVel === 0 && !spinButtonClicked) {
    spinEl.textContent = "SPIN"; // Show "SPIN" when ready for a new spin
  } else {
    spinEl.textContent = sector.label; // Show the current sector label during spinning or stopped
  }

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
  if (
    (angVel < 0.006 && dishWins >= 5) ||
    (angVel < 0.006 && dishWinTimer > 1)
  ) {
    while (spinEl.style.background === "rgb(255, 90, 16)") {
      angVel = 0;
      return;
    }
  } else if (angVel < 0.006) {
    angVel = 0;
    return;
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
    if (!angVel && !spinButtonClicked) {
      angVel = rand(0.25, 0.45); // Set angular velocity
      spinButtonClicked = true; // Mark button as clicked
      spinCount++;
      spinEl.textContent = ""; // Clear text while spinning
    } 

    if (dishWinTimer !== 0) {
      dishWinTimer--;
    }
  });
}

// Show popup
function showPopup() {
  document.getElementById("wrapper").style.display = "flex";
}

// Close popup
function closePopup() {
  document.getElementById("popup").style.display = "none";
}

async function updateUser(dishName) {
  const number = localStorage.getItem("userPhoneNumber");
  console.log(number);

  const data = {
    number,
    dishName,
    isWin: true,
  }
  try {
    const response = await fetch("https://tracker-server-dev-main.vercel.app/update", {
      method: "POST",
      body: JSON.stringify(data), // Make sure formData is defined earlier
      headers: {
        "Content-Type": "application/json",
      },
    });

    const user = await response.json(); // Assuming response is JSON
    return user;
  } catch (error) {
    console.log(error);
  }
}

init();

events.addListener("spinEnd", async(sector) => {
  if (spinEl.style.background === 'rgb(255, 188, 3)') {
  dishWins++;
  dishWinTimer = 10;
  }
  localStorage.setItem("dishWinTimer", dishWinTimer);
  document.getElementById("popup-text").textContent = `Congratulation! You won ${sector.label}`;
  console.log(`Congrats! You won ${sector.label}`);
  showPopup();
  await updateUser(sector.label);
  // if (spinCount > 50) dishWins = 0;
  console.log("Dishes Awarded: ", dishWins);
  console.log("Spin Count: ", spinCount);
});

for(i=0; i<100; i++) {
  // Random rotation
  var randomRotation = Math.floor(Math.random() * 360);
    // Random Scale
  var randomScale = Math.random() * 1;
  // Random width & height between 0 and viewport
  var randomWidth = Math.floor(Math.random() * Math.max(document.documentElement.clientWidth, window.innerWidth || 0));
  var randomHeight =  Math.floor(Math.random() * Math.max(document.documentElement.clientHeight, window.innerHeight || 500));
  
  // Random animation-delay
  var randomAnimationDelay = Math.floor(Math.random() * 15);

  // Random colors
  var colors = ['#0CD977', '#FF1C1C', '#FF93DE', '#5767ED', '#FFC61C', '#8497B0']
  var randomColor = colors[Math.floor(Math.random() * colors.length)];

  // Create confetti piece
  var confetti = document.createElement('div');
  confetti.className = 'confetti';
  confetti.style.top=randomHeight + 'px';
  confetti.style.right=randomWidth + 'px';
  confetti.style.backgroundColor=randomColor;
  // confetti.style.transform='scale(' + randomScale + ')';
  confetti.style.obacity=randomScale;
  confetti.style.transform='skew(15deg) rotate(' + randomRotation + 'deg)';
  confetti.style.animationDelay=randomAnimationDelay + 's';
  document.getElementById("confetti-wrapper").appendChild(confetti);
}
