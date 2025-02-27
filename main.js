import './style.css'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

document.querySelector('#app').innerHTML = `
  <div class="paint-app">
    <header class="app-header">
      <h1>Canvas Creator</h1>
      <div class="theme-switcher">
        <button id="theme-light" class="theme-btn active" data-theme="light">Light</button>
        <button id="theme-dark" class="theme-btn" data-theme="dark">Dark</button>
        <button id="theme-colorful" class="theme-btn" data-theme="colorful">Colorful</button>
      </div>
    </header>
    <div class="controls">
      <div class="tools-section">
        <h3>Brush Options</h3>
        <div class="color-palette">
          <div class="color-option active" style="background-color: #FF6B6B;" data-color="#FF6B6B"></div>
          <div class="color-option" style="background-color: #4ECDC4;" data-color="#4ECDC4"></div>
          <div class="color-option" style="background-color: #FFD166;" data-color="#FFD166"></div>
          <div class="color-option" style="background-color: #118AB2;" data-color="#118AB2"></div>
          <div class="color-option" style="background-color: #073B4C;" data-color="#073B4C"></div>
          <div class="color-option" style="background-color: #06D6A0;" data-color="#06D6A0"></div>
          <div class="color-option" style="background-color: #EF476F;" data-color="#EF476F"></div>
        </div>
        <div class="actions">
          <button id="random-color-btn" class="btn primary-btn">
            <span class="btn-icon">🎨</span> Random Colors
          </button>
          <button id="reset-btn" class="btn danger-btn">
            <span class="btn-icon">🧹</span> Reset Canvas
          </button>
          <button id="save-btn" class="btn success-btn">
            <span class="btn-icon">💾</span> Save Image
          </button>
        </div>
      </div>
      <div class="circle-stats">
        <div class="stat-box">
          <span class="stat-icon">⭕</span>
          <span class="circle-count">Circles: 0</span>
        </div>
        <div id="last-action" class="stat-box">
          <span class="stat-icon">🔄</span>
          <span>Last Action: None</span>
        </div>
      </div>
    </div>
    <div class="canvas-container">
      <canvas id="paint-canvas" width="800" height="600"></canvas>
    </div>
    <div class="keyboard-shortcuts">
      <h3>Keyboard Shortcuts</h3>
      <ul>
        <li><kbd>Ctrl</kbd> + <kbd>Z</kbd> - Undo last circle</li>
        <li><kbd>R</kbd> - Toggle random colors</li>
        <li><kbd>C</kbd> - Clear canvas</li>
        <li><kbd>S</kbd> - Save image</li>
        <li><kbd>T</kbd> - Cycle through themes</li>
        <li>Double-click on circle to delete it</li>
      </ul>
    </div>
  </div>
`

const canvas=document.getElementById('paint-canvas');
const ctx=canvas.getContext('2d');
const resetBtn=document.getElementById('reset-btn');
const randomColorBtn=document.getElementById('random-color-btn');
const saveBtn=document.getElementById('save-btn');
const colorOptions=document.querySelectorAll('.color-option');
const themeButtons=document.querySelectorAll('.theme-btn');
const lastActionElement=document.getElementById('last-action');

let circles=[];
let isDrawing=false;
let startX,startY;
let useRandomColors=false;
let currentColor='#FF6B6B';
let circleCount=0;
let currentTheme='light';

function applyTheme(theme) {
  document.body.className='';
  document.body.classList.add(`theme-${theme}`);
  themeButtons.forEach(btn => {
    btn.classList.remove('active');
    if(btn.dataset.theme === theme) {
      btn.classList.add('active');
    }
  });
  updateLastAction(`Theme changed to ${theme}`);
  drawAllCircles();
}

themeButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentTheme=button.dataset.theme;
    applyTheme(currentTheme);
    showToast(`Theme: ${currentTheme}`, 'info');
  });
});

function updateLastAction(action) {
  if(lastActionElement) {
    lastActionElement.innerHTML = `<span class="stat-icon">🔄</span><span>Last Action: ${action}</span>`;
  }
}

colorOptions.forEach(option => {
  option.addEventListener('click',(e) => {
    useRandomColors=false;
    currentColor=e.target.dataset.color;
    colorOptions.forEach(opt => opt.classList.remove('active'));
    e.target.classList.add('active');
    showToast(`Color selected: ${currentColor}`, 'info');
    updateLastAction(`Color selected: ${currentColor}`);
  });
});

randomColorBtn.addEventListener('click',() => {
  useRandomColors=!useRandomColors;
  if(useRandomColors) {
    colorOptions.forEach(opt => opt.classList.remove('active'));
    showToast('Random colors enabled', 'info');
    updateLastAction('Random colors enabled');
  } else {
    showToast('Random colors disabled', 'info');
    updateLastAction('Random colors disabled');
  }
});

saveBtn.addEventListener('click',() => {
  saveCanvasAsImage();
  updateLastAction('Image saved');
});

function showToast(message, type='success') {
  const bgColors = {
    success:'linear-gradient(to right, #28a745, #a8e063)',
    error:'linear-gradient(to right, #d32f2f, #ff6b6b)',
    info:'linear-gradient(to right, #007bff, #00c6ff)',
    warning:'linear-gradient(to right, #f39c12, #f1c40f)',
    hit:'linear-gradient(to right, #1abc9c, #2ecc71)',
    miss:'linear-gradient(to right, #e74c3c, #c0392b)'
  };
  Toastify({
    text:message,
    duration:2000,
    close:true,
    gravity:"top",
    position:"right",
    stopOnFocus:true,
    style:{
      background:bgColors[type] || bgColors.success,
      borderRadius:"4px",
      boxShadow:"0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)",
      fontFamily:"'Poppins', sans-serif"
    },
    onClick:function(){}
  }).showToast();
}

function saveCanvasAsImage() {
  const link=document.createElement('a');
  link.download=`canvas-creation-${new Date().toISOString().slice(0, 10)}.png`;
  link.href=canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Image saved successfully!', 'success');
}

function getRandomColor() {
  const colors = [
    '#FF6B6B','#4ECDC4','#FFD166','#118AB2','#073B4C',
    '#06D6A0','#EF476F','#F78C6B','#8338EC','#3A86FF',
    '#FF9F1C','#2EC4B6','#E71D36','#011627','#8D99AE',
    '#D7263D','#3F88C5','#F4A261','#E63946','#A8DADC',
    '#457B9D','#1D3557','#FFC300','#FF5733','#C70039',
    '#900C3F','#581845','#6A0572','#E0A800','#17A2B8'
  ];
  return colors[Math.floor(Math.random()*colors.length)];
}

function drawCircle(x,y,radius,color) {
  ctx.beginPath();
  ctx.arc(x,y,radius,0,Math.PI*2);
  ctx.fillStyle=color;
  ctx.fill();
  ctx.strokeStyle=currentTheme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
  ctx.lineWidth=2;
  ctx.stroke();
  
  if(radius > 30) {
    ctx.fillStyle=currentTheme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
    ctx.font='bold 14px Poppins';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.fillText(`r: ${Math.round(radius)}`, x, y);
  }
}

function drawAllCircles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGridBackground();
  circles.forEach(circle => {
    drawCircle(circle.x, circle.y, circle.radius, circle.color);
  });
  updateCircleCountDisplay();
}

function updateCircleCountDisplay() {
  const countDisplay=document.querySelector('.circle-count');
  if(countDisplay) {
    countDisplay.textContent=`Circles: ${circles.length}`;
  }
}

function drawGridBackground() {
  const gridSize=20;
  ctx.strokeStyle=currentTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  if(currentTheme === 'colorful') {
    ctx.strokeStyle='rgba(120,120,255,0.1)';
  }
  ctx.lineWidth=1;
  for(let x=0;x<=canvas.width;x+=gridSize) {
    ctx.beginPath();
    ctx.moveTo(x,0);
    ctx.lineTo(x,canvas.height);
    ctx.stroke();
  }
  for(let y=0;y<=canvas.height;y+=gridSize) {
    ctx.beginPath();
    ctx.moveTo(0,y);
    ctx.lineTo(canvas.width,y);
    ctx.stroke();
  }
}

function isPointInCircle(x,y) {
  for(let i=circles.length-1;i>=0;i--) {
    const circle=circles[i];
    const distance=Math.sqrt(Math.pow(x-circle.x,2)+Math.pow(y-circle.y,2));
    if(distance<=circle.radius) {
      return {hit:true,index:i,circle:circle};
    }
  }
  return {hit:false};
}

canvas.addEventListener('mousedown',(e) => {
  const rect=canvas.getBoundingClientRect();
  const x=e.clientX-rect.left;
  const y=e.clientY-rect.top;
  const hitResult=isPointInCircle(x,y);
  
  if(hitResult.hit) {
    showToast(`Circle selected (${hitResult.circle.color})`, 'hit');
    updateLastAction(`Selected circle: ${Math.round(hitResult.circle.radius)}px radius`);
  } else {
    isDrawing=true;
    startX=x;
    startY=y;
  }
});

canvas.addEventListener('mousemove',(e) => {
  if(!isDrawing) return;
  const rect=canvas.getBoundingClientRect();
  const currentX=e.clientX-rect.left;
  const currentY=e.clientY-rect.top;
  
  const radius=Math.sqrt(
    Math.pow(currentX-startX,2)+Math.pow(currentY-startY,2)
  );
  drawAllCircles();
  const previewColor=useRandomColors?getRandomColor():currentColor;
  drawCircle(startX,startY,radius,previewColor);
  
  ctx.fillStyle=currentTheme === 'dark' ? 'white' : 'black';
  ctx.font='14px Poppins';
  ctx.fillText(`Radius: ${Math.round(radius)}px`, currentX+10, currentY-10);
});

canvas.addEventListener('mouseup',(e) => {
  if(!isDrawing) return;
  
  const rect=canvas.getBoundingClientRect();
  const currentX=e.clientX-rect.left;
  const currentY=e.clientY-rect.top;
  
  const radius=Math.sqrt(
    Math.pow(currentX-startX,2)+Math.pow(currentY-startY,2)
  );
  if(radius>5) {
    const circleColor=useRandomColors?getRandomColor():currentColor;
    circles.push({
      x:startX,
      y:startY,
      radius:radius,
      color:circleColor
    });
    showToast(`Circle created! Radius: ${Math.round(radius)}px`, 'success');
    updateLastAction(`Created circle: ${Math.round(radius)}px radius`);
    circleCount++;
  }
  isDrawing=false;
  drawAllCircles();
});

canvas.addEventListener('dblclick',(e) => {
  const rect=canvas.getBoundingClientRect();
  const x=e.clientX-rect.left;
  const y=e.clientY-rect.top;
  
  const hitResult=isPointInCircle(x,y);
  if(hitResult.hit) {
    const deletedCircle=circles[hitResult.index];
    circles.splice(hitResult.index,1);
    drawAllCircles();
    showToast(`Circle deleted! (${deletedCircle.color})`, 'warning');
    updateLastAction(`Deleted circle: ${Math.round(deletedCircle.radius)}px radius`);
    circleCount--;
  }
});

resetBtn.addEventListener('click',() => {
  circles=[];
  drawAllCircles();
  showToast('Canvas cleared!', 'info');
  updateLastAction('Canvas cleared');
  circleCount=0;
});

canvas.addEventListener('contextmenu',(e) => {
  e.preventDefault();
});

document.addEventListener('keydown',(e) => {
  if(e.ctrlKey && e.key==='z') {
    if(circles.length>0) {
      const removedCircle = circles.pop();
      drawAllCircles();
      showToast('Undo: Last circle removed', 'info');
      updateLastAction(`Undo: removed ${Math.round(removedCircle.radius)}px radius circle`);
      circleCount--;
    }
  }
  if(e.key==='r' || e.key==='R') {
    useRandomColors=!useRandomColors;
    if(useRandomColors) {
      colorOptions.forEach(opt => opt.classList.remove('active'));
      showToast('Random colors enabled', 'info');
      updateLastAction('Random colors enabled');
    } else {
      colorOptions.forEach(opt => opt.classList.remove('active'));
      const firstColor = colorOptions[0];
      if(firstColor) {
        firstColor.classList.add('active');
        currentColor = firstColor.dataset.color;
      }
      showToast('Random colors disabled', 'info');
      updateLastAction('Random colors disabled');
    }
  }
  
  if(e.key==='c' || e.key==='C') {
    circles=[];
    drawAllCircles();
    showToast('Canvas cleared!', 'info');
    updateLastAction('Canvas cleared');
    circleCount=0;
  }

  if(e.key==='s' || e.key==='S') {
    saveCanvasAsImage();
    updateLastAction('Image saved');
  }
  
  if(e.key==='t' || e.key==='T') {
    const themes = ['light', 'dark', 'colorful'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    currentTheme = themes[nextIndex];
    applyTheme(currentTheme);
    showToast(`Theme changed to ${currentTheme}`, 'info');
  }
});

let styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', sans-serif;
  transition: background-color 0.3s ease;
}

.theme-light {
  --bg-color: #f8f9fa;
  --text-color: #343a40;
  --header-bg: #e9ecef;
  --card-bg: #ffffff;
  --border-color: #dee2e6;
  --btn-default: #6c757d;
  --btn-primary: #007bff;
  --btn-success: #28a745;
  --btn-danger: #dc3545;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  --canvas-bg: #ffffff;
}

.theme-dark {
  --bg-color: #212529;
  --text-color: #f8f9fa;
  --header-bg: #343a40;
  --card-bg: #343a40;
  --border-color: #495057;
  --btn-default: #6c757d;
  --btn-primary: #0d6efd;
  --btn-success: #198754;
  --btn-danger: #dc3545;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  --canvas-bg: #2b3035;
}

.theme-colorful {
  --bg-color: #4158D0;
  --text-color: #ffffff;
  --header-bg: #48a9fe;
  --card-bg: rgba(255, 255, 255, 0.2);
  --border-color: rgba(255, 255, 255, 0.3);
  --btn-default: #6c757d;
  --btn-primary: #8f94fb;
  --btn-success: #06d6a0;
  --btn-danger: #ff6b6b;
  --shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  --canvas-bg: #ffffff;
  background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}

.paint-app {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.app-header {
  background-color: var(--header-bg);
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow);
}

.app-header h1 {
  margin: 0;
  font-weight: 600;
  font-size: 24px;
  letter-spacing: 0.5px;
}

.theme-switcher {
  display: flex;
  gap: 5px;
}

.theme-btn {
  background-color: var(--btn-default);
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.theme-btn.active {
  background-color: var(--btn-primary);
  transform: scale(1.05);
}

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tools-section {
  flex: 1;
  background-color: var(--card-bg);
  padding: 15px;
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.tools-section h3 {
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 500;
}

.color-palette {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid var(--border-color);
  transition: transform 0.2s, box-shadow 0.2s;
}

.color-option:hover {
  transform: scale(1.15);
}

.color-option.active {
  transform: scale(1.2);
  box-shadow: 0 0 0 2px var(--text-color);
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.primary-btn {
  background-color: var(--btn-primary);
}

.success-btn {
  background-color: var(--btn-success);
}

.danger-btn {
  background-color: var(--btn-danger);
}

.btn-icon {
  font-size: 16px;
}

.circle-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: var(--card-bg);
  padding: 15px;
  border-radius: 8px;
  min-width: 200px;
  box-shadow: var(--shadow);
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
}

.stat-icon {
  font-size: 18px;
}

.canvas-container {
  position: relative;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow);
}

#paint-canvas {
  display: block;
  background-color: var(--canvas-bg);
  width: 100%;
  height: auto;
  cursor: crosshair;
}

.keyboard-shortcuts {
  background-color: var(--card-bg);
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  box-shadow: var(--shadow);
}

.keyboard-shortcuts h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 500;
}

.keyboard-shortcuts ul {
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
}

.keyboard-shortcuts li {
  display: flex;
  align-items: center;
  font-size: 14px;
}

kbd {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 2px 6px;
  margin: 0 3px;
  font-family: monospace;
  font-size: 12px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
  }
  
  .keyboard-shortcuts ul {
    grid-template-columns: 1fr;
  }
}
`;

document.head.appendChild(styleSheet);
applyTheme('light');
drawAllCircles();