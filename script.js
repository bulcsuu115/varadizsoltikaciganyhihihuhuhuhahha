const gameState = {
    timer: 300,
    strikes: 0,
    isRunning: false,
    timerInterval: null,
    modulesTotal: 12,
    modulesSolved: 0,
    serialNumber: '',
    modules: {}
};

const modules = {
    wires: { solved: false },
    button: { solved: false, holding: false, text: '', color: '' },
    keypad: { solved: false, sequence: [], correctSequence: [] },
    simon: { solved: false, sequence: [], playerSequence: [], currentRound: 0, started: false },
    frequency: { solved: false, currentFreq: 3.5 },
    morse: { solved: false, frequency: 0 },
    knob: { solved: false, currentPosition: 0 },
    complex: { solved: false },
    password: { solved: false, correctPassword: '' },
    maze: { solved: false, playerX: 0, playerY: 0 },
    sequence: { solved: false, correctOrder: [], playerOrder: [] },
    colorcode: { solved: false, correctCode: '' }
};

const timerElement = document.getElementById('timer');
const messageElement = document.getElementById('message');
const bombElement = document.getElementById('bomb');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const rotateBtn = document.getElementById('rotateBtn');

function shuffleModules() {
    const allModules = Array.from(document.querySelectorAll('.module'));
    
    const shuffledModules = allModules.sort(() => Math.random() - 0.5);
    
    const faces = [
        document.querySelector('.bomb-top'),
        document.querySelector('.bomb-front'),
        document.querySelector('.bomb-back'),
        document.querySelector('.bomb-bottom')
    ];
    
    faces.forEach(face => {
        while (face.firstChild) {
            face.removeChild(face.firstChild);
        }
    });
    
    let moduleIndex = 0;
    faces.forEach(face => {
        for (let i = 0; i < 3; i++) {
            if (moduleIndex < shuffledModules.length) {
                face.appendChild(shuffledModules[moduleIndex]);
                moduleIndex++;
            }
        }
    });
}

function init() {
    generateSerialNumber();
    ManualAPI.initializeAllModules();
    
    shuffleModules();
    
    setupWiresModule();
    setupButtonModule();
    setupKeypadModule();
    setupSimonModule();
    setupFrequencyModule();
    setupMorseModule();
    setupKnobModule();
    setupSwitchesModule();
    setupPasswordModule();
    setupMazeModule();
    setupSequenceModule();
    setupColorcodeModule();
    setupBombDrag();
    
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    rotateBtn.addEventListener('click', rotateBomb);
}

function generateSerialNumber() {
    const serial = ManualAPI.generateSerialNumber();
    gameState.serialNumber = serial;
    document.getElementById('serialNumber').textContent = serial;
    return serial;
}

function setupWiresModule() {
    const wiresContainer = document.getElementById('wiresContainer');
    const wires = wiresContainer.querySelectorAll('.wire');
    
    const wireCount = Math.floor(Math.random() * 4) + 3;
    const colors = ['red', 'blue', 'yellow', 'white', 'black'];
    const selectedWires = [];
    
    for (let i = 0; i < wireCount; i++) {
        selectedWires.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    
    wires.forEach((wire, index) => {
        if (index < wireCount) {
            wire.style.display = 'block';
            wire.className = `wire wire-${selectedWires[index]}`;
            wire.dataset.color = selectedWires[index];
            
            wire.addEventListener('click', function() {
                if (!gameState.isRunning || modules.wires.solved || this.dataset.cut === 'true') return;
                
                cutWire(this, selectedWires);
            });
        } else {
            wire.style.display = 'none';
        }
    });
    
    modules.wires.correctWire = determineCorrectWire(selectedWires);
}

function determineCorrectWire(wires) {
    const count = wires.length;
    
    const redCount = wires.filter(w => w === 'red').length;
    const blueCount = wires.filter(w => w === 'blue').length;
    const yellowCount = wires.filter(w => w === 'yellow').length;
    const whiteCount = wires.filter(w => w === 'white').length;
    const blackCount = wires.filter(w => w === 'black').length;
    const lastWire = wires[wires.length - 1];
    
    if (count === 3) {
        if (redCount === 0) return 1;
        if (lastWire === 'white') return count - 1;
        if (blueCount > 1) return wires.lastIndexOf('blue');
        return count - 1;
    }
    
    if (count === 4) {
        if (redCount > 1) return wires.lastIndexOf('red');
        if (lastWire === 'yellow') return 0;
        if (blueCount === 1) return 0;
        if (yellowCount > 1) return count - 1;
        return 1;
    }
    
    if (count === 5) {
        if (lastWire === 'black') return 3;
        if (redCount === 1 && yellowCount > 1) return 0;
        if (blackCount === 0) return 1;
        if (whiteCount > 1) return 2;
        return 0;
    }
    
    if (count === 6) {
        if (yellowCount === 0) return 2;
        if (yellowCount === 1 && whiteCount > 1) return 3;
        if (redCount === 0) return count - 1;
        if (blueCount > 1) return 1;
        return 3;
    }
    
    return 0;
}

function cutWire(wireElement, wires) {
    const wireIndex = Array.from(wireElement.parentElement.children).indexOf(wireElement);
    wireElement.classList.add('cut');
    wireElement.dataset.cut = 'true';
    
    if (wireIndex === modules.wires.correctWire) {
        solveModule('wires', wireElement.closest('.module'));
        showMessage('Vezetékek hatástalanítva! ✓', 'success');
    } else {
        addStrike();
        showMessage('Rossz vezeték! ✗ (-30mp)', 'error');
    }
}

function setupButtonModule() {
    const button = document.getElementById('bigButton');
    const buttonText = document.getElementById('buttonText');
    const buttonStrip = document.getElementById('buttonStrip');
    
    const texts = ['DETONATE', 'HOLD', 'PRESS', 'ABORT'];
    const colors = ['red', 'blue', 'yellow', 'white'];
    
    const randomText = texts[Math.floor(Math.random() * texts.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    buttonText.textContent = randomText;
    button.dataset.color = randomColor;
    
    modules.button.text = randomText;
    modules.button.color = randomColor;
    modules.button.holding = false;
    
    let holdTimer = null;
    let isMouseDown = false;
    
    function resetHold() {
        if (holdTimer) {
            clearTimeout(holdTimer);
            holdTimer = null;
        }
        if (modules.button.holding) {
            buttonStrip.classList.remove('active');
            modules.button.holding = false;
        }
        isMouseDown = false;
    }
    
    button.addEventListener('mousedown', function() {
        if (!gameState.isRunning || modules.button.solved) return;
        
        isMouseDown = true;
        modules.button.holding = false;
        
        holdTimer = setTimeout(() => {
            if (isMouseDown && !modules.button.solved) {
                modules.button.holding = true;
                const stripColors = ['1', '4', '5'];
                const stripColor = stripColors[Math.floor(Math.random() * stripColors.length)];
                buttonStrip.textContent = stripColor;
                buttonStrip.classList.add('active');
            }
        }, 500);
    });
    
    button.addEventListener('mouseup', function() {
        if (!gameState.isRunning || modules.button.solved) return;
        if (!isMouseDown) return;
        
        clearTimeout(holdTimer);
        holdTimer = null;
        isMouseDown = false;
        
        if (modules.button.holding) {
            const stripNumber = buttonStrip.textContent;
            const timerSeconds = gameState.timer % 60;
            
            if (timerSeconds.toString().includes(stripNumber)) {
                solveModule('button', this.closest('.module'));
                showMessage('Gomb hatástalanítva! ✓', 'success');
            } else {
                addStrike();
                showMessage('Rossz időzítés! ✗ (-30mp)', 'error');
            }
            
            buttonStrip.classList.remove('active');
            modules.button.holding = false;
        } else {
            if (shouldPressButton()) {
                solveModule('button', this.closest('.module'));
                showMessage('Gomb hatástalanítva! ✓', 'success');
            } else {
                addStrike();
                showMessage('Nem kellett volna megnyomni! ✗', 'error');
            }
        }
    });
    
    button.addEventListener('mouseleave', function() {
        if (!gameState.isRunning || modules.button.solved) return;
        resetHold();
    });
    
    button.addEventListener('touchstart', function(e) {
        e.preventDefault();
        button.dispatchEvent(new MouseEvent('mousedown'));
    });
    
    button.addEventListener('touchend', function(e) {
        e.preventDefault();
        button.dispatchEvent(new MouseEvent('mouseup'));
    });
}

function shouldPressButton() {
    const { text, color } = modules.button;
    
    
    if (color === 'blue' && text === 'ABORT') {
        console.log('Szabály: Kék ABORT → NYOMD');
        return true;
    }
    
    if (color === 'white') {
        console.log('Szabály: Fehér → TARTSD');
        return false;
    }
    
    if (color === 'yellow') {
        console.log('Szabály: Sárga → TARTSD');
        return false;
    }
    
    if (color === 'red' && text === 'HOLD') {
        console.log('Szabály: Piros HOLD → NYOMD');
        return true;
    }
    
    if (color === 'red') {
        console.log('Szabály: Piros (nem HOLD) → TARTSD');
        return false;
    }
    
    console.log('Szabály: Egyéb → NYOMD');
    return true;
}

function setupKeypadModule() {
    const buttons = document.querySelectorAll('.keypad-button');
    
    const keypadModule = ManualAPI.getModule('keypad');
    keypadModule.initialize();
    
    const correctSequence = keypadModule.getSequence();
    
    
    const shuffledSymbols = [...correctSequence].sort(() => Math.random() - 0.5);
    
    modules.keypad.sequence = [];
    modules.keypad.correctSequence = correctSequence;
    
    buttons.forEach((button, index) => {
        button.style.display = 'block';
        button.style.visibility = 'visible';
        button.classList.remove('pressed');
        
        const randomSymbol = shuffledSymbols[index];
        button.dataset.symbol = randomSymbol;
        button.textContent = randomSymbol;
        
        button.addEventListener('click', function() {
            if (!gameState.isRunning || modules.keypad.solved) return;
            
            const symbol = this.dataset.symbol;
            
            if (!symbol || this.classList.contains('pressed')) {
                return;
            }
            
            this.classList.add('pressed');
            modules.keypad.sequence.push(symbol);
            
            const currentIndex = modules.keypad.sequence.length - 1;
            if (modules.keypad.sequence[currentIndex] !== correctSequence[currentIndex]) {
                addStrike();
                showMessage('Rossz szimbólum! ✗ (-30mp)', 'error');
                resetKeypad();
                return;
            }
            
            if (modules.keypad.sequence.length === 12) {
                solveModule('keypad', document.querySelector('.keypad-module'));
                showMessage('Billentyűzet megoldva! ✓', 'success');
            }
        });
    });
}

function resetKeypad() {
    const buttons = document.querySelectorAll('.keypad-button');
    buttons.forEach(button => button.classList.remove('pressed'));
    modules.keypad.sequence = [];
}

function setupSimonModule() {
    const buttons = document.querySelectorAll('.simon-button');
    const startBtn = document.getElementById('simonStart');
    const display = document.getElementById('simonDisplay');
    
    modules.simon.started = false;
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!gameState.isRunning || modules.simon.solved || !modules.simon.started) return;
            
            const color = this.dataset.color;
            flashSimonButton(this);
            modules.simon.playerSequence.push(color);
            
            checkSimonSequence();
        });
    });
    
    startBtn.addEventListener('click', function() {
        if (!gameState.isRunning || modules.simon.solved || modules.simon.started) return;
        
        modules.simon.started = true;
        startBtn.disabled = true;
        
        modules.simon.sequence = [];
        for (let i = 0; i < 8; i++) {
            const colors = ['red', 'blue', 'yellow', 'green'];
            modules.simon.sequence.push(colors[Math.floor(Math.random() * colors.length)]);
        }
        
        updateSimonDisplay();
        setTimeout(() => playSimonSequence(), 500);
    });
}

function updateSimonDisplay() {
    const display = document.getElementById('simonDisplay');
    display.textContent = `KÖR: ${modules.simon.currentRound + 1} / 8`;
}

function playSimonSequence() {
    let delay = 0;
    modules.simon.sequence.slice(0, modules.simon.currentRound + 1).forEach((color, index) => {
        setTimeout(() => {
            const button = document.querySelector(`.simon-button[data-color="${color}"]`);
            flashSimonButton(button);
        }, delay);
        delay += 600;
    });
}

function flashSimonButton(button) {
    button.classList.add('flash');
    setTimeout(() => button.classList.remove('flash'), 300);
}

function checkSimonSequence() {
    const currentLength = modules.simon.playerSequence.length;
    const expectedSequence = modules.simon.sequence.slice(0, modules.simon.currentRound + 1);
    
    if (modules.simon.playerSequence[currentLength - 1] !== expectedSequence[currentLength - 1]) {
        addStrike();
        showMessage('Rossz Simon szekvencia! ✗ (-30mp)', 'error');
        modules.simon.playerSequence = [];
        return;
    }
    
    if (currentLength === expectedSequence.length) {
        modules.simon.currentRound++;
        modules.simon.playerSequence = [];
        updateSimonDisplay();
        
        if (modules.simon.currentRound >= modules.simon.sequence.length) {
            solveModule('simon', document.querySelector('.simon-module'));
            showMessage('Simon megoldva! ✓', 'success');
        } else {
            setTimeout(() => playSimonSequence(), 1000);
        }
    }
}

function setupFrequencyModule() {
    const freqValue = document.getElementById('freqValue');
    const info = document.getElementById('frequencyInfo');
    const downBtn = document.getElementById('freqDown');
    const downSmallBtn = document.getElementById('freqDownSmall');
    const upSmallBtn = document.getElementById('freqUpSmall');
    const upBtn = document.getElementById('freqUp');
    const submitBtn = document.getElementById('freqSubmit');
    
    if (!freqValue || !info || !downBtn || !downSmallBtn || !upSmallBtn || !upBtn || !submitBtn) {
        console.warn('Frequency module elements not found');
        return;
    }
    
    const freqModule = ManualAPI.getModule('frequency');
    freqModule.initialize();
    
    modules.frequency.currentFreq = 3.5;
    updateDisplay();
    
    function updateDisplay() {
        freqValue.textContent = modules.frequency.currentFreq.toFixed(1);
    }
    
    downBtn.addEventListener('click', function() {
        if (!gameState.isRunning || modules.frequency.solved) return;
        modules.frequency.currentFreq = Math.max(3.5, modules.frequency.currentFreq - 0.2);
        modules.frequency.currentFreq = Math.round(modules.frequency.currentFreq * 10) / 10;
        updateDisplay();
    });
    
    downSmallBtn.addEventListener('click', function() {
        if (!gameState.isRunning || modules.frequency.solved) return;
        modules.frequency.currentFreq = Math.max(3.5, modules.frequency.currentFreq - 0.1);
        modules.frequency.currentFreq = Math.round(modules.frequency.currentFreq * 10) / 10;
        updateDisplay();
    });
    
    upSmallBtn.addEventListener('click', function() {
        if (!gameState.isRunning || modules.frequency.solved) return;
        modules.frequency.currentFreq = Math.min(10, modules.frequency.currentFreq + 0.1);
        modules.frequency.currentFreq = Math.round(modules.frequency.currentFreq * 10) / 10;
        updateDisplay();
    });
    
    upBtn.addEventListener('click', function() {
        if (!gameState.isRunning || modules.frequency.solved) return;
        modules.frequency.currentFreq = Math.min(10, modules.frequency.currentFreq + 0.2);
        modules.frequency.currentFreq = Math.round(modules.frequency.currentFreq * 10) / 10;
        updateDisplay();
    });
    
    submitBtn.addEventListener('click', function() {
        if (!gameState.isRunning || modules.frequency.solved) return;
        
        if (freqModule.checkSolution(modules.frequency.currentFreq)) {
            solveModule('frequency', document.querySelector('.frequency-module'));
            showMessage('Frekvencia megoldva! ✓', 'success');
            info.textContent = '✅ Helyes frekvencia!';
            info.style.color = '#00ff00';
        } else {
            addStrike();
            info.textContent = '❌ Rossz frekvencia! (-30mp)';
            info.style.color = '#ff0000';
            setTimeout(() => {
                info.textContent = 'Hangold be a helyes frekvenciát!';
                info.style.color = '#00ffff';
            }, 2000);
        }
    });
}

function setupMorseModule() {
    const display = document.getElementById('morseCodeDisplay');
    const input = document.getElementById('morseInput');
    const submitBtn = document.getElementById('morseSubmit');
    
    const morseModule = ManualAPI.getModule('morse');
    morseModule.initialize();
    
    const morseCode = morseModule.getMorseCode();
    display.textContent = morseCode;
    
    function checkMorse() {
        if (!gameState.isRunning || modules.morse.solved) return;
        
        const enteredWord = input.value.trim();
        
        if (morseModule.checkSolution(enteredWord)) {
            solveModule('morse', document.querySelector('.morse-module'));
            showMessage('Morse kód megoldva! ✓', 'success');
            input.disabled = true;
        } else {
            addStrike();
            showMessage('Rossz dekódolás! ✗ (-30mp)', 'error');
            input.value = '';
        }
    }
    
    submitBtn.addEventListener('click', checkMorse);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkMorse();
        }
    });
}

function setupKnobModule() {
    const ledsContainer = document.getElementById('knobLeds');
    const dial = document.getElementById('knobDial');
    const positionButtons = document.querySelectorAll('.knob-positions span');
    
    const knobModule = ManualAPI.getModule('knob');
    knobModule.initialize();
    
    const leds = knobModule.getLEDs();
    leds.forEach(isOn => {
        const led = document.createElement('div');
        led.className = 'knob-led';
        if (isOn) led.classList.add('on');
        ledsContainer.appendChild(led);
    });
    
    modules.knob.currentPosition = 0;
    
    let isDragging = false;
    let startAngle = 0;
    
    dial.addEventListener('mousedown', (e) => {
        if (!gameState.isRunning || modules.knob.solved) return;
        isDragging = true;
        const rect = dial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = dial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const rotation = (angle * 180 / Math.PI) + 90;
        dial.style.transform = `rotate(${rotation}deg)`;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    positionButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            if (!gameState.isRunning || modules.knob.solved) return;
            
            const positions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
            const rotations = [0, 180, 270, 90];
            
            modules.knob.currentPosition = index;
            dial.style.transform = `rotate(${rotations[index]}deg)`;
            
            if (knobModule.checkSolution(positions[index])) {
                solveModule('knob', document.querySelector('.knob-module'));
                showMessage('Gomb forgatás megoldva! ✓', 'success');
            } else {
                addStrike();
                showMessage('Rossz pozíció! ✗ (-30mp)', 'error');
            }
        });
    });
}

function setupSwitchesModule() {
    const display = document.getElementById('switchesDisplay');
    const switches = document.querySelectorAll('.switch-toggle');
    
    const switchesModule = ManualAPI.getModule('switches');
    switchesModule.initialize();
    
    display.textContent = 'KONFIGURÁCIÓ: ???';
    
    modules.switches = {
        solved: false,
        states: [false, false, false, false]
    };
    
    switches.forEach((switchBtn, index) => {
        switchBtn.addEventListener('click', function() {
            if (!gameState.isRunning || modules.switches.solved) return;
            
            const currentState = this.dataset.state;
            const newState = currentState === 'off' ? 'on' : 'off';
            this.dataset.state = newState;
            
            modules.switches.states[index] = (newState === 'on');
            
            if (switchesModule.checkSolution(modules.switches.states)) {
                solveModule('switches', document.querySelector('.switches-module'));
                showMessage('Kapcsolók megoldva! ✓', 'success');
            }
        });
    });
}

function solveModule(moduleName, moduleElement) {
    modules[moduleName].solved = true;
    moduleElement.classList.add('solved');
    gameState.modulesSolved++;
    
    if (gameState.modulesSolved >= gameState.modulesTotal) {
        winGame();
    }
}

function addStrike() {
    gameState.strikes++;
    const strikeElement = document.getElementById(`strike${gameState.strikes}`);
    if (strikeElement) {
        strikeElement.classList.add('active');
    }
    
    gameState.timer = Math.max(0, gameState.timer - 30);
    
    if (gameState.strikes >= 3) {
        loseGame();
    }
}

function startGame() {
    if (gameState.isRunning) return;
    
    gameState.isRunning = true;
    gameState.timer = 300;
    
    gameState.timerInterval = setInterval(updateTimer, 1000);
    
    
    showMessage('Bomba aktiválva! Hajrá!', 'error');
}

function updateTimer() {
    if (!gameState.isRunning) return;
    
    gameState.timer--;
    
    const minutes = Math.floor(gameState.timer / 60);
    const seconds = gameState.timer % 60;
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    if (gameState.timer <= 60) {
        timerElement.classList.add('critical');
    } else if (gameState.timer <= 120) {
        timerElement.classList.add('warning');
    }
    
    if (gameState.timer <= 0) {
        loseGame();
    }
}

function resetGame() {
    gameState.isRunning = false;
    gameState.timer = 300;
    gameState.strikes = 0;
    gameState.modulesSolved = 0;
    
    clearInterval(gameState.timerInterval);
    
    timerElement.textContent = '5:00';
    timerElement.classList.remove('warning', 'critical');
    
    document.querySelectorAll('.strike').forEach(strike => {
        strike.classList.remove('active');
    });
    
    document.querySelectorAll('.module').forEach(module => {
        module.classList.remove('solved');
    });
    
    bombElement.classList.remove('exploded');
    messageElement.classList.remove('show');
    
    for (let key in modules) {
        modules[key].solved = false;
    }
    
    ManualAPI.initializeAllModules();
    
    init();
    
    showMessage('Játék visszaállítva!', 'success');
}

function rotateBomb() {
    bombElement.classList.add('rotating');
    
    setTimeout(() => {
        bombElement.classList.remove('rotating');
    }, 3000);
}

function setupPasswordModule() {
    const letters = ['pass1', 'pass2', 'pass3', 'pass4', 'pass5'];
    
    const passwordModule = ManualAPI.getModule('password');
    passwordModule.initialize();
    
    modules.password.currentLetters = ['A', 'A', 'A', 'A', 'A'];
    modules.password.possibleLetters = [];
    
    for (let i = 0; i < 5; i++) {
        modules.password.possibleLetters[i] = passwordModule.getPossibleLetters(i);
    }
    
    letters.forEach((id, index) => {
        const el = document.getElementById(id);
        const possibleLetters = modules.password.possibleLetters[index];
        let currentLetterIndex = 0;
        
        el.textContent = possibleLetters[0];
        modules.password.currentLetters[index] = possibleLetters[0];
        
        el.addEventListener('click', function() {
            if (!gameState.isRunning || modules.password.solved) return;
            
            currentLetterIndex = (currentLetterIndex + 1) % possibleLetters.length;
            this.textContent = possibleLetters[currentLetterIndex];
            modules.password.currentLetters[index] = possibleLetters[currentLetterIndex];
        });
    });
    
    document.getElementById('passwordSubmit').addEventListener('click', function() {
        if (!gameState.isRunning || modules.password.solved) return;
        
        const entered = modules.password.currentLetters.join('');
        
        if (passwordModule.checkSolution(entered)) {
            solveModule('password', document.querySelector('.password-module'));
            showMessage('Jelszó helyes! ✓', 'success');
        } else {
            addStrike();
            showMessage('Rossz jelszó! ✗ (-30mp)', 'error');
        }
    });
}

function setupMazeModule() {
    const canvas = document.getElementById('mazeCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const gridSize = 8;
    const cellSize = 18;
    
    const mazeModule = ManualAPI.getModule('maze');
    mazeModule.initialize();
    
    modules.maze.playerX = 0;
    modules.maze.playerY = 0;
    
    function drawMaze() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= gridSize; i++) {
            ctx.beginPath();
            ctx.moveTo(i * cellSize, 0);
            ctx.lineTo(i * cellSize, gridSize * cellSize);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, i * cellSize);
            ctx.lineTo(gridSize * cellSize, i * cellSize);
            ctx.stroke();
        }
        
        
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(7 * cellSize + 3, 7 * cellSize + 3, cellSize - 6, cellSize - 6);
        
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(
            modules.maze.playerX * cellSize + cellSize / 2,
            modules.maze.playerY * cellSize + cellSize / 2,
            cellSize / 3,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
    
    function movePlayer(dx, dy) {
        if (!gameState.isRunning || modules.maze.solved) return;
        
        const newX = modules.maze.playerX + dx;
        const newY = modules.maze.playerY + dy;
        
        if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
            addStrike();
            showMessage('Falba ütköztél! ✗ (-30mp)', 'error');
            flashWallHit();
            return;
        }
        
        let direction = '';
        if (dx === 1) direction = 'right';
        if (dx === -1) direction = 'left';
        if (dy === 1) direction = 'bottom';
        if (dy === -1) direction = 'top';
        
        if (mazeModule.hasWall(modules.maze.playerX, modules.maze.playerY, direction)) {
            addStrike();
            showMessage('Láthatatlan falba ütköztél! ✗ (-30mp)', 'error');
            flashWallHit();
            return;
        }
        
        modules.maze.playerX = newX;
        modules.maze.playerY = newY;
        drawMaze();
        
        if (mazeModule.isExit(newX, newY)) {
            solveModule('maze', document.querySelector('.maze-module'));
            showMessage('Labirintus megoldva! ✓', 'success');
        }
    }
    
    function flashWallHit() {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setTimeout(() => drawMaze(), 200);
    }
    
    document.getElementById('mazeUp').addEventListener('click', () => movePlayer(0, -1));
    document.getElementById('mazeDown').addEventListener('click', () => movePlayer(0, 1));
    document.getElementById('mazeLeft').addEventListener('click', () => movePlayer(-1, 0));
    document.getElementById('mazeRight').addEventListener('click', () => movePlayer(1, 0));
    
    drawMaze();
}

function setupSequenceModule() {
    const sequenceModule = ManualAPI.getModule('sequence');
    sequenceModule.initialize();
    
    const displayOrder = sequenceModule.getDisplayOrder();
    document.getElementById('sequenceDisplay').textContent = displayOrder.join(' ');
    
    modules.sequence.playerOrder = [];
    
    const buttons = document.querySelectorAll('.sequence-btn');
    buttons.forEach((btn, index) => {
        btn.textContent = displayOrder[index];
        
        btn.addEventListener('click', function() {
            if (!gameState.isRunning || modules.sequence.solved) return;
            
            const num = parseInt(this.dataset.num);
            modules.sequence.playerOrder.push(num);
            this.classList.add('pressed');
            this.disabled = true;
            
            if (modules.sequence.playerOrder.length === 4) {
                if (sequenceModule.checkSolution(modules.sequence.playerOrder)) {
                    solveModule('sequence', document.querySelector('.sequence-module'));
                    showMessage('Sorrend helyes! ✓', 'success');
                } else {
                    addStrike();
                    showMessage('Rossz sorrend! ✗ (-30mp)', 'error');
                    
                    modules.sequence.playerOrder = [];
                    buttons.forEach(b => {
                        b.classList.remove('pressed');
                        b.disabled = false;
                    });
                }
            }
        });
    });
}

function setupColorcodeModule() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const colorNames = { '#ff0000': 'R', '#00ff00': 'G', '#0000ff': 'B', '#ffff00': 'Y', '#ff00ff': 'M', '#00ffff': 'C' };
    
    const selected = [];
    for (let i = 0; i < 3; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        selected.push(color);
        document.getElementById(`color${i + 1}`).style.backgroundColor = color;
    }
    
    modules.colorcode.correctCode = selected.map(c => colorNames[c]).join('');
    
    document.getElementById('colorcodeSubmit').addEventListener('click', function() {
        if (!gameState.isRunning || modules.colorcode.solved) return;
        
        const entered = document.getElementById('colorcodeInput').value.toUpperCase();
        
        if (entered === modules.colorcode.correctCode) {
            solveModule('colorcode', document.querySelector('.colorcode-module'));
            showMessage('Színkód helyes! ✓', 'success');
        } else {
            addStrike();
            showMessage('Rossz kód! ✗ (-30mp)', 'error');
        }
    });
}

function setupBombDrag() {
    let isDragging = false;
    let previousX = 0;
    let previousY = 0;
    let currentRotationY = 20;
    let currentRotationX = -20;
    const bombContainer = document.querySelector('.bomb-container');
    
    bombContainer.addEventListener('mousedown', (e) => {
        const interactiveElements = [
            'button', 'input', '.wire', '.keypad-button', '.simon-button',
            '.memory-button', '.whos-button', '.sequence-btn', '.maze-btn',
            '.password-letter', '.wire-line', 'canvas'
        ];
        
        for (let selector of interactiveElements) {
            if (e.target.closest(selector)) {
                return;
            }
        }
        
        if (e.target.closest('.module')) {
            return;
        }
        
        isDragging = true;
        previousX = e.clientX;
        previousY = e.clientY;
        bombContainer.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - previousX;
        const deltaY = e.clientY - previousY;
        
        currentRotationY += deltaX * 0.5;
        currentRotationX -= deltaY * 0.5;
        
        currentRotationX = Math.max(-60, Math.min(60, currentRotationX));
        
        bombElement.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
        
        previousX = e.clientX;
        previousY = e.clientY;
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            bombContainer.style.cursor = 'grab';
        }
    });
    
    bombContainer.addEventListener('touchstart', (e) => {
        const interactiveElements = [
            'button', 'input', '.wire', '.keypad-button', '.simon-button',
            '.memory-button', '.whos-button', '.sequence-btn', '.maze-btn',
            '.password-letter', '.wire-line', 'canvas'
        ];
        
        for (let selector of interactiveElements) {
            if (e.target.closest(selector)) {
                return;
            }
        }
        
        if (e.target.closest('.module')) return;
        
        const touch = e.touches[0];
        isDragging = true;
        previousX = touch.clientX;
        previousY = touch.clientY;
        e.preventDefault();
    }, { passive: false });
    
    bombContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - previousX;
        const deltaY = touch.clientY - previousY;
        
        currentRotationY += deltaX * 0.5;
        currentRotationX -= deltaY * 0.5;
        currentRotationX = Math.max(-60, Math.min(60, currentRotationX));
        
        bombElement.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
        
        previousX = touch.clientX;
        previousY = touch.clientY;
        e.preventDefault();
    }, { passive: false });
    
    bombContainer.addEventListener('touchend', () => {
        isDragging = false;
    });
}

function winGame() {
    gameState.isRunning = false;
    clearInterval(gameState.timerInterval);
    
    showMessage('🎉 BOMBA HATÁSTALANÍTVA! GYŐZELEM! 🎉', 'success');
    
    document.body.style.background = 'linear-gradient(135deg, #00ff00 0%, #00aa00 100%)';
    setTimeout(() => {
        document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
    }, 3000);
    
    setTimeout(() => {
        showResetButton();
    }, 1500);
}

function loseGame() {
    gameState.isRunning = false;
    clearInterval(gameState.timerInterval);
    
    bombElement.classList.add('exploded');
    document.body.classList.add('shake');
    
    createExplosionFlash();
    setTimeout(() => createExplosionFlash(), 200);
    setTimeout(() => createExplosionFlash(), 400);
    
    createShockwave();
    
    createExplosionParticles();

    createSmokeCloud();
    
    document.body.style.background = 'linear-gradient(135deg, #ff0000 0%, #aa0000 100%)';
    setTimeout(() => {
        document.body.style.background = 'linear-gradient(135deg, #ff6600 0%, #ff0000 100%)';
    }, 150);
    setTimeout(() => {
        document.body.style.background = 'linear-gradient(135deg, #ffff00 0%, #ff6600 100%)';
    }, 300);
    setTimeout(() => {
        document.body.style.background = 'linear-gradient(135deg, #ff0000 0%, #aa0000 100%)';
    }, 450);
    setTimeout(() => {
        document.body.style.background = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
        document.body.classList.remove('shake');
    }, 1500);
    
    setTimeout(() => {
        showMessage('💥 A BOMBA FELROBBANT! 💥', 'error');
    }, 500);
}

function createExplosionFlash() {
    const flash = document.createElement('div');
    flash.className = 'explosion-flash';
    document.body.appendChild(flash);
    
    setTimeout(() => {
        flash.remove();
    }, 1500);
}

function createExplosionParticles() {
    const bombRect = bombElement.getBoundingClientRect();
    const centerX = bombRect.left + bombRect.width / 2;
    const centerY = bombRect.top + bombRect.height / 2;
    
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'explosion-particle';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        
        const colors = [
            'radial-gradient(circle, #ffff00, #ff6600)',
            'radial-gradient(circle, #ff9900, #ff0000)',
            'radial-gradient(circle, #ff6600, #cc0000)',
            'radial-gradient(circle, #ffcc00, #ff3300)',
            'radial-gradient(circle, #ffffff, #ffff00)',
            'radial-gradient(circle, #ff3300, #990000)',
            'radial-gradient(circle, #ffaa00, #ff5500)'
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        const size = 20 + Math.random() * 70;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        document.body.appendChild(particle);

        const angle = (Math.random() * Math.PI * 2);
        const distance = 150 + Math.random() * 300;
        const duration = 0.6 + Math.random() * 0.8;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
            { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0) rotate(${360 * Math.random()}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => {
            particle.remove();
        }, duration * 1000);
    }
}

function createShockwave() {
    const bombRect = bombElement.getBoundingClientRect();
    const centerX = bombRect.left + bombRect.width / 2;
    const centerY = bombRect.top + bombRect.height / 2;
    
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const shockwave = document.createElement('div');
            shockwave.className = 'shockwave';
            shockwave.style.left = centerX + 'px';
            shockwave.style.top = centerY + 'px';
            document.body.appendChild(shockwave);
            
            setTimeout(() => {
                shockwave.remove();
            }, 1500);
        }, i * 150);
    }
}

function createSmokeCloud() {
    const bombRect = bombElement.getBoundingClientRect();
    const centerX = bombRect.left + bombRect.width / 2;
    const centerY = bombRect.top + bombRect.height / 2;
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const smoke = document.createElement('div');
            smoke.className = 'smoke-particle';
            smoke.style.left = centerX + 'px';
            smoke.style.top = centerY + 'px';
            
            const size = 40 + Math.random() * 80;
            smoke.style.width = size + 'px';
            smoke.style.height = size + 'px';
            
            document.body.appendChild(smoke);
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 200;
            const duration = 1.5 + Math.random() * 1;
            
            smoke.animate([
                { transform: 'translate(0, 0) scale(0.5)', opacity: 0.8 },
                { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance - 100}px) scale(2)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                easing: 'ease-out'
            });
            
            setTimeout(() => {
                smoke.remove();
            }, duration * 1000);
        }, i * 50);
    }
}

function showResetButton() {
    let resetBtn = document.getElementById('resetButton');
    if (resetBtn) {
        resetBtn.style.display = 'block';
        return;
    }
    resetBtn = document.createElement('button');
    resetBtn.id = 'resetButton';
    resetBtn.className = 'control-btn reset-btn';
    resetBtn.textContent = '🔄 ÚJRAKEZDÉS';
    resetBtn.addEventListener('click', resetGame);
    
    const controls = document.querySelector('.controls');
    controls.appendChild(resetBtn);
}

function resetGame() {
    location.reload();
}

function showMessage(text, type) {
    messageElement.textContent = text;
    messageElement.className = `message ${type} show`;
    
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 3000);
}

init();
