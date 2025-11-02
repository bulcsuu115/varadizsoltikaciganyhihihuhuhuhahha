
class BombManualAPI {
    constructor() {
        this.serialNumber = '';
        this.modules = {};
        this.initializeModules();
    }

    generateSerialNumber() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        let serial = '';
        
        for (let i = 0; i < 3; i++) {
            serial += letters[Math.floor(Math.random() * letters.length)];
        }
        
        for (let i = 0; i < 3; i++) {
            serial += digits[Math.floor(Math.random() * digits.length)];
        }
        
        serial = serial.split('').sort(() => Math.random() - 0.5).join('');
        
        this.serialNumber = serial;
        return serial;
    }

    initializeModules() {
        this.modules.morse = {
            word: '',
            morseCode: '',
            morseSequence: [],
            initialize: () => {
                const words = ['SOS', 'HELLO', 'BOMB', 'HELP', 'CODE', 'WIRE', 'BOOM', 'SAFE', 'TIME', 'TICK'];

                const morseAlphabet = {
                    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
                    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
                    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
                    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
                    'Y': '-.--', 'Z': '--..'
                };

                this.modules.morse.word = words[Math.floor(Math.random() * words.length)];

                this.modules.morse.morseSequence = [];
                for (let char of this.modules.morse.word.toUpperCase()) {
                    if (morseAlphabet[char]) {
                        this.modules.morse.morseSequence.push(morseAlphabet[char]);
                    }
                }
                
                this.modules.morse.morseCode = this.modules.morse.morseSequence.join(' ');
            },
            checkSolution: (decodedWord) => {
                return decodedWord.toUpperCase() === this.modules.morse.word.toUpperCase();
            },
            getMorseCode: () => {
                return this.modules.morse.morseCode;
            },
            getMorseSequence: () => {
                return this.modules.morse.morseSequence;
            }
        };

        this.modules.frequency = {
            correctFrequency: 0,
            initialize: () => {
                const serial = gameState.serialNumber;
                
                const digits = serial.match(/\d/g).map(Number);
                const digitSum = digits.reduce((a, b) => a + b, 0);
                
                let freq = 3.5;
                freq += digitSum * 0.1;
                
                freq = Math.round(freq * 10) / 10;
                
                freq = Math.max(3.5, Math.min(5.5, freq));
                
                this.modules.frequency.correctFrequency = freq;
            },
            getCorrectFrequency: () => {
                return this.modules.frequency.correctFrequency;
            },
            checkSolution: (playerFreq) => {
                return Math.abs(playerFreq - this.modules.frequency.correctFrequency) < 0.05;
            }
        };

        this.modules.sequence = {
            displayOrder: [],
            initialize: () => {
                const numbers = [1, 2, 3, 4];
                this.modules.sequence.displayOrder = numbers.sort(() => Math.random() - 0.5);
            },
            getDisplayOrder: () => {
                return this.modules.sequence.displayOrder;
            },
            checkSolution: (order) => {
                return order.every((val, idx) => val === idx + 1);
            }
        };

        this.modules.password = {
            correctPassword: '',
            possibleLetters: [],
            initialize: () => {
                const passwords = [
                    'WATER', 'HOUSE', 'LIGHT', 'WORLD',
                    'FIRST', 'GREAT', 'SOUND', 'SMALL',
                    'MAGIC', 'BLAST', 'CODES', 'THING'
                ];

                this.modules.password.correctPassword = passwords[Math.floor(Math.random() * passwords.length)];

                this.modules.password.possibleLetters = [];
                for (let i = 0; i < 5; i++) {
                    const letters = new Set();
                    letters.add(this.modules.password.correctPassword[i]);

                    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    while (letters.size < 4) {
                        letters.add(alphabet[Math.floor(Math.random() * alphabet.length)]);
                    }

                    this.modules.password.possibleLetters.push(Array.from(letters).sort());
                }
            },
            getPossibleLetters: (position) => {
                return this.modules.password.possibleLetters[position];
            },
            checkSolution: (password) => {
                return password === this.modules.password.correctPassword;
            }
        };

        this.modules.maze = {
            walls: [],
            exitX: 7,
            exitY: 7,
            solution: [],
            initialize: () => {
                const gridSize = 8;
                this.modules.maze.walls = [];
                
                
                const complexWalls = [
                    {x:0,y:0, top:false, right:false, bottom:true, left:false},
                    {x:1,y:0, top:false, right:false, bottom:true, left:false},
                    {x:2,y:0, top:false, right:true, bottom:false, left:false},
                    {x:3,y:0, top:false, right:true, bottom:true, left:true},
                    {x:4,y:0, top:false, right:true, bottom:true, left:true},
                    {x:5,y:0, top:false, right:true, bottom:true, left:true},
                    {x:6,y:0, top:false, right:true, bottom:true, left:true},
                    {x:7,y:0, top:false, right:false, bottom:true, left:true},
                    
                    {x:0,y:1, top:true, right:true, bottom:true, left:false},
                    {x:1,y:1, top:true, right:true, bottom:true, left:true},
                    {x:2,y:1, top:false, right:true, bottom:false, left:true},
                    {x:3,y:1, top:true, right:true, bottom:true, left:true},
                    {x:4,y:1, top:true, right:true, bottom:true, left:true},
                    {x:5,y:1, top:true, right:true, bottom:true, left:true},
                    {x:6,y:1, top:true, right:true, bottom:true, left:true},
                    {x:7,y:1, top:true, right:false, bottom:true, left:true},
                    
                    {x:0,y:2, top:true, right:false, bottom:false, left:false},
                    {x:1,y:2, top:true, right:false, bottom:true, left:false},
                    {x:2,y:2, top:false, right:true, bottom:true, left:false},
                    {x:3,y:2, top:true, right:true, bottom:true, left:true},
                    {x:4,y:2, top:true, right:true, bottom:true, left:true},
                    {x:5,y:2, top:true, right:true, bottom:true, left:true},
                    {x:6,y:2, top:true, right:true, bottom:true, left:true},
                    {x:7,y:2, top:true, right:false, bottom:true, left:true},
                    
                    {x:0,y:3, top:false, right:false, bottom:true, left:false},
                    {x:1,y:3, top:true, right:true, bottom:false, left:false},
                    {x:2,y:3, top:true, right:true, bottom:true, left:true},
                    {x:3,y:3, top:true, right:true, bottom:true, left:true},
                    {x:4,y:3, top:true, right:true, bottom:true, left:true},
                    {x:5,y:3, top:true, right:true, bottom:true, left:true},
                    {x:6,y:3, top:true, right:true, bottom:true, left:true},
                    {x:7,y:3, top:true, right:false, bottom:true, left:true},
                    
                    {x:0,y:4, top:true, right:true, bottom:true, left:false},
                    {x:1,y:4, top:false, right:true, bottom:false, left:true},
                    {x:2,y:4, top:true, right:true, bottom:true, left:true},
                    {x:3,y:4, top:true, right:true, bottom:true, left:true},
                    {x:4,y:4, top:true, right:true, bottom:true, left:true},
                    {x:5,y:4, top:true, right:true, bottom:true, left:true},
                    {x:6,y:4, top:true, right:true, bottom:true, left:true},
                    {x:7,y:4, top:true, right:false, bottom:true, left:true},
                    
                    {x:0,y:5, top:true, right:true, bottom:true, left:false},
                    {x:1,y:5, top:false, right:true, bottom:false, left:true},
                    {x:2,y:5, top:true, right:false, bottom:false, left:true},
                    {x:3,y:5, top:true, right:false, bottom:true, left:false},
                    {x:4,y:5, top:true, right:false, bottom:true, left:false},
                    {x:5,y:5, top:true, right:false, bottom:true, left:false},
                    {x:6,y:5, top:true, right:true, bottom:false, left:false},
                    {x:7,y:5, top:true, right:false, bottom:true, left:true},
                    
                    {x:0,y:6, top:true, right:true, bottom:true, left:false},
                    {x:1,y:6, top:false, right:true, bottom:false, left:true},
                    {x:2,y:6, top:false, right:true, bottom:false, left:true},
                    {x:3,y:6, top:true, right:true, bottom:true, left:true},
                    {x:4,y:6, top:true, right:true, bottom:true, left:true},
                    {x:5,y:6, top:true, right:true, bottom:true, left:true},
                    {x:6,y:6, top:false, right:true, bottom:false, left:true},
                    {x:7,y:6, top:true, right:false, bottom:true, left:true},
                    
                    {x:0,y:7, top:true, right:true, bottom:false, left:false},
                    {x:1,y:7, top:false, right:false, bottom:false, left:true},
                    {x:2,y:7, top:false, right:true, bottom:false, left:false},
                    {x:3,y:7, top:true, right:true, bottom:false, left:true},
                    {x:4,y:7, top:true, right:true, bottom:false, left:true},
                    {x:5,y:7, top:true, right:true, bottom:false, left:true},
                    {x:6,y:7, top:false, right:false, bottom:false, left:true},
                    {x:7,y:7, top:true, right:false, bottom:false, left:false}
                ];
                
                this.modules.maze.walls = complexWalls;
                this.modules.maze.exitX = 7;
                this.modules.maze.exitY = 7;
                
                this.modules.maze.solution = [
                    'right',
                    'right',
                    'down',
                    'down',
                    'left',
                    'left',
                    'down',
                    'right',
                    'down',
                    'down',
                    'down',
                    'down',
                    'right',
                    'up',
                    'up',
                    'right',
                    'right',
                    'right',
                    'right',
                    'down',
                    'down',
                    'right'
                ];
            },
            hasWall: (x, y, direction) => {
                const cell = this.modules.maze.walls.find(w => w.x === x && w.y === y);
                if (!cell) return true;
                return cell[direction] || false;
            },
            isExit: (x, y) => {
                return x === this.modules.maze.exitX && y === this.modules.maze.exitY;
            },
            getSolution: () => {
                return this.modules.maze.solution;
            }
        };

        this.modules.knob = {
            leds: [],
            correctPosition: '',
            initialize: () => {
                const patterns = [
                    [true, false, true, false, true, false],
                    [false, true, false, true, false, true],
                    [true, true, false, false, true, false],
                    [false, false, true, true, false, true],
                    [true, false, false, true, true, false],
                    [false, true, true, false, false, true]
                ];
                
                const positions = ['UP', 'DOWN', 'LEFT', 'RIGHT', 'UP', 'DOWN'];
                const selectedIndex = Math.floor(Math.random() * patterns.length);
                
                this.modules.knob.leds = patterns[selectedIndex];
                this.modules.knob.correctPosition = positions[selectedIndex];
            },
            getLEDs: () => {
                return this.modules.knob.leds;
            },
            getCorrectPosition: () => {
                return this.modules.knob.correctPosition;
            },
            checkSolution: (position) => {
                return position === this.modules.knob.correctPosition;
            }
        };

        this.modules.switches = {
            correctConfiguration: [],
            initialize: () => {
                this.modules.switches.correctConfiguration = [];
                
                for (let i = 0; i < 4; i++) {
                    this.modules.switches.correctConfiguration.push(Math.random() < 0.5);
                }
            },
            getConfiguration: () => {
                return this.modules.switches.correctConfiguration.map(state => state ? 'ON' : 'OFF');
            },
            checkSolution: (states) => {
                return states.every((state, index) => state === this.modules.switches.correctConfiguration[index]);
            }
        };

        this.modules.keypad = {
            correctSequence: [],
            initialize: () => {
                this.modules.keypad.correctSequence = ['☆', '¶', 'Ω', 'Ϙ', '☃', 'Ӭ', 'ɶ', 'ψ', '¿', 'λ', 'Ѭ', 'Ѽ'];
            },
            getSequence: () => {
                return this.modules.keypad.correctSequence;
            },
            checkSolution: (sequence) => {
                return sequence.every((symbol, index) => symbol === this.modules.keypad.correctSequence[index]);
            }
        };
    }

    initializeAllModules() {
        this.modules.morse.initialize();
        this.modules.frequency.initialize();
        this.modules.sequence.initialize();
        this.modules.password.initialize();
        this.modules.maze.initialize();
        this.modules.knob.initialize();
        this.modules.switches.initialize();
        this.modules.keypad.initialize();
    }

    getModule(moduleName) {
        return this.modules[moduleName];
    }
}

const ManualAPI = new BombManualAPI();
