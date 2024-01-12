const LEVEL_PLAYER_CHARACTERS = [{
  name: 'player',
  x2: 100,
  y2: 120
}, {
  name: 'player',
  x2: 100,
  y2: 120
}, {
  name: 'player',
  x2: 100,
  y2: 120
}, {
  name: 'player',
  x2: 100,
  y2: 120
}, {
  name: 'player',
  x2: 100,
  y2: 120
}];

const userKeys = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32,
};

const level_virus = [ 
  [{
    name: 'virus1',
    width: 47,
    height: 37,
    y2: 200
  }, {
    name: 'virus2',
    width: 47,
    height: 37,
    y2: 205
  }],
  [{
    name: 'virus1',
    width: 47,
    height: 37,
    y2: 200
  }, {
    name: 'virus2',
    width: 60,
    height: 53,
    y2: 197
  }],
  [{
    name: 'virus1',
    width: 47,
    height: 37,
    y2: 200
  }, {
    name: 'virus1',
    width: 47,
    height: 37,
    y2: 200
  }],
  [{
    name: 'virus1',
    width: 47,
    height: 37,
    y2: 200
  }, {
    name: 'Virus',
    width: 47,
    height: 37,
    y2: 220
  }],
  [{
    name: 'virus1',
    width: 47,
    height: 37,
    y2: 200
  }, {
    name: 'Virus',
    width: 47,
    height: 37,
    y2: 220
  }, {
    name: 'sanitizer',
    width: 70,
    height: 60,
    y2: 190
  }, {
    name: 'mask',
    width: 47,
    height: 37,
    y2: 185
  }]
];

const font = 'Arial';
const totalLevels = 5; 
const sanitizerWidth = 60;
const LEVEL_COMPLETION_TIME = 4000;
const MAX_VARIABLES = Math.floor(LEVEL_COMPLETION_TIME / 50); 
const FLYING = 0; 
const WALKING = 1; 
const ROTATING = 2; 
const REVERSED = 3; 

var flyUp = false;
var flyCounter = 0;
var sanitizerpickup;
var gameover;
var gamewon;
var jump;
var viruskilled;
var currentLevel;
var collectedsanitizers = 0;
var currentsanitizers = 0;
var timeLeft; 
var score = 0;
var currentScore = 0;
var playerCharacter;
var background;
var background2;
var backgoundshift = 0;
var xPos = -5;
var sanitizerRotationValue = 0;
var scoreBoard;
var sanitizerScoreBoard;
var sanitizerScoreBoardImg;
var sanitizerScoreBoardSupImg;
var highscoreBoard;
var timeBoard;
var timeBoardImg;
var levelDisplay;
var virusCharacters = [];
var sanitizers = [];
var keysPressed = 
{
  LEFT: false,
  UP: false,
  RIGHT: false,
  DOWN: false,
  P: false,
  M: false,  
};
var gamePaused = false;
var displayOptionsModal = false;
var optionId= '';

let dir; 
var highscore = 0;

function KeyDown(event) {
  var key;
  key = event.which;
  keysPressed[key] = true;
  
  if(event.repeat)
    return;
  if(!displayOptionsModal){
    if ((keysPressed[userKeys.DOWN] || keysPressed[userKeys.S]) && playerCharacter.duckCooldown === false) {
      duck();
    }
    if((keysPressed[userKeys.LEFT] || keysPressed[userKeys.A]) && playerCharacter.leftCooldown === false){
      moveLeft();
      playerCharacter.leftCooldown = true;
    }
    if ((keysPressed[userKeys.RIGHT] || keysPressed[userKeys.D]) && playerCharacter.rightCooldown === false) {
      moveRight();
      playerCharacter.rightCooldown = true;
    }
    if((keysPressed[userKeys.UP] || keysPressed[userKeys.W]) && playerCharacter.hitGround && playerCharacter.duckCooldown === false){
      if(playerCharacter.jumpCooldown === false){
        moveUp();
      }
    }
    if(keysPressed[userKeys.SPACE]){
      restartGame();
    }
    if(keysPressed[userKeys.P]){
      keysPressed[userKeys.P] = false;
      pauseGame();
    }
    
    if(keysPressed[userKeys.C]) {
      keysPressed[userKeys.C] = false;
      resumeGame();
    }
  }
}

function pauseGame() {
  gamePaused = !gamePaused;
}


function gameOptions(){
  displayOptionsModal = !displayOptionsModal;
}



function updatebackgoundshift(){
  if(keysPressed[userKeys.LEFT]) {
    backgoundshift = -5;
  }else if(keysPressed[userKeys.RIGHT]) {
    backgoundshift = 5;
  }else{
    backgoundshift = 0;
  }
}

function KeyUp(event) {
  var key;
  key = event.which;
  keysPressed[key] = false;
  switch (key) {
  case userKeys.UP:
    playerCharacter.speedY += playerCharacter.gravity;
    playerCharacter.jumpCooldown = false;
    break;
  case userKeys.LEFT:
    if (keysPressed[userKeys.RIGHT]) {
      moveRight();
    } else {
      playerCharacter.speedX = 0;
    }
    playerCharacter.leftCooldown = false;
    break;
  case userKeys.RIGHT:
    if (keysPressed[userKeys.LEFT]) {
      moveLeft();
    } else {
      playerCharacter.speedX = 0;
    }
    playerCharacter.rightCooldown = false;
    break;
  case userKeys.DOWN:
    if(playerCharacter.hitGround && playerCharacter.duckCooldown === true){
      playerCharacter.height = playerCharacter.height * 2;
      playerCharacter.duckCooldown = false;
    }
  }
  updatebackgoundshift();
}


function showInstructions(){
  gameArea.init();
  background = new Component();
  background.init(gameArea.canvas.width, gameArea.canvas.height, 'Pictures/background_1.jpg', 0, 0, 'image', WALKING, true);
  var modal = document.getElementById('instructionsModal');
  modal.style.display = 'block';
}

function initialize_game() {
  currentLevel = 1;
  collectedsanitizers = 0;
  currentsanitizers = 0;
  score = 0;
  currentScore = 0;

  var sanitizerMessage = document.getElementById('sanitizerMessage');
  var pointsMessage = document.getElementById('pointsMessage');
  if (sanitizerMessage) {
    var levelTransitionModalContent = document.getElementById('levelTransitionModalContent');
    levelTransitionModalContent.removeChild(sanitizerMessage);
    levelTransitionModalContent.removeChild(pointsMessage);
  }

  startLevel();
}

function startLevel() {
  flyUp = false;
  flyCounter = 0;
  dir = 1; 
  xPos = -5;

  playerCharacter = new Component();
  let char = LEVEL_PLAYER_CHARACTERS[currentLevel - 1];
  playerCharacter.init(60, 70, `Pictures/${char.name}.png`, char.x2, char.y2, 'image', WALKING, undefined, char.name);
  playerCharacter.jumpCooldown = false; 
  playerCharacter.leftCooldown = false; 
  playerCharacter.rightCooldown = false;
  playerCharacter.duckCooldown = false;

  background = new Component();
  background2 = new Component();
  background.init(gameArea.canvas.width, gameArea.canvas.height, `Pictures/background_${currentLevel}.jpg`, -50, 0, 'image', WALKING);
  background2.init(gameArea.canvas.width, gameArea.canvas.height, `Pictures/background_${currentLevel}_reverse.jpg`,850, 0, 'image', WALKING);

  scoreBoard = new Component();
  scoreBoard.init('20px', font, 'black', 250, 40, 'text', WALKING);


  sanitizerScoreBoard = new Component();
  sanitizerScoreBoard.init('20px', font, 'black', 450, 40, 'text', WALKING);
  sanitizerScoreBoardImg = new Component();
  sanitizerScoreBoardImg.init(22, 22, 'Pictures/sanitizer.png', 420, 21, 'image', WALKING);
  

  highscoreBoard = new Component();
  highscoreBoard.init('20px', 'Consolas', 'black', 20, 40, 'text', WALKING);
  highscoreBoard.text = 'HIGHSCORE:' + highscore;



  timeBoard = new Component ();
  timeBoard.init('20px', font, 'black', 830, 40, 'text', WALKING);
  timeBoardImg = new Component();
  timeBoardImg.init(22, 22, 'Pictures/clock.png', 800, 21, 'image', WALKING);

  levelDisplay = new Component();
  levelDisplay.init('20px', font, 'black', 670, 40, 'text', WALKING);

  for (let i = 0; i < MAX_VARIABLES; i++) {
    virusCharacters[i] = new Component();
    var x = Math.floor((Math.random() * (i * (gameArea.canvas.width / 2))) + ((gameArea.canvas.width / 2) * i + (gameArea.canvas.width * 1.25)));

    var moveType = Math.floor(Math.random() * (level_virus[currentLevel - 1].length));
    let virus = level_virus[currentLevel - 1][moveType];
    if (moveType === REVERSED) {
      x = Math.floor(Math.random() * (-i * (gameArea.canvas.width / 2)));
    }

    virusCharacters[i].init(virus.width, virus.height, `Pictures/${virus.name}.png`, x, virus.y2, 'image', moveType);
  }

  for (let i = 0; i < MAX_VARIABLES; i++) {
    let x = Math.floor(((Math.random() + 1) * gameArea.canvas.width) + (i * gameArea.canvas.width / 2));
    var y = Math.floor(Math.random() * 150 + 30); 
    sanitizers[i] = new Component();
    sanitizers[i].init(sanitizerWidth, sanitizerWidth, 'Pictures/sanitizer.png', x, y, 'image', WALKING);
  }

  gameArea.init();
  gameArea.start();
}

/**
 * @type {{canvas: Element, start: gameArea.start, clear: gameArea.clear, stop: gameArea.stop}}
 */
var gameArea = {
  init: function() {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = 900;
    this.canvas.height = 400;
    this.context = this.canvas.getContext('2d');

    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    document.body.insertBefore(document.getElementById('banner'), document.body.childNodes[0])
    this.time = 0;
    this.bonusActiveTime = 1500; 
    this.sanitizerScoreActiveTime = 1500; 
    this.sanitizerScoreInterval = null;
  },

  start: function() {
    this.frameNo = 0;
    this.time = 0;
    var modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
      var modal = modals[i];
      modal.style.display = 'none';
    }
    this.interval = setInterval(updateGameArea, 20);
  },

  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  stop: function() {
    clearInterval(this.interval);
  }
};

function Component() {
  this.init = function(width, height, color, x, y, dataType, moveType, initialShow = false, charName = undefined) {
    this.moveType = moveType; 
    this.alive = true;
    this.alive = true;
    this.color = color;

    this.dataType = dataType;

    this.ctx = gameArea.context;

    if (dataType === 'image') {
      this.image = new Image();
      this.image.src = this.color;
      this.image.width = width;
      this.image.height = height;

      if (charName) {
        this.imageMirror = new Image();
        this.imageMirror.src = `Pictures/${charName}_left.png`;
        this.imageMirror.width = width;
        this.imageMirror.height = height;
      }

      if (initialShow) {
        var imgCopy = this.image;
        var ctxCopy = this.ctx;
        this.image.onload = function() {
          ctxCopy.drawImage(imgCopy, this.x, this.y, this.width, this.height);
        };
      }
    }

    this.width = width;
    this.initHeight = height;
    this.alpha = 1;
    this.height = height;


    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.orignX = x;
    this.gravity = 1.5;
    this.hitGround = true;
    this.doubleJumpAllowed = true;
    this.angle = 0;
  };

  this.update = function() {
    if (this.dataType === 'image') {
      this.ctx.globalAlpha = this.alpha;
      if (this.angle !== 0) {
        this.ctx.save();
        this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        this.ctx.rotate(this.angle);
        this.ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.ctx.restore();
      } else {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
    } else if (this.dataType === 'text') {
      this.ctx.font = this.width + ' ' + this.height;
      this.ctx.fillStyle = this.color;
      this.ctx.fillText(this.text, this.x, this.y);
    } else {
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  this.moveBackgrounds = function(background2){
    if(0 <= xPos){
      xPos += backgoundshift;
      this.x -= backgoundshift;
      background2.x -= backgoundshift;
    }else{
      backgoundshift = 0;
    }
    if(this.x <= -900){this.x = 900;}
    else if(background2.x <= -900){background2.x = 900;}
    else if(900 <= this.x){this.x = -900;}
    else if(900 <= background2.x){background2.x = -900;}
    else if(900 < Math.abs(this.x)+Math.abs(background2.x)){
      if(Math.abs(background2.x) < Math.abs(this.x)){
        this.x += (0 < this.x)?-5:5;
      }else{
        background2.x += (0 < background2.x)?-5:5;
      }
    }
  };

  this.crashWith = function(otherobj) {
    var left = this.x;
    var right = this.x + (this.width);
    var top = this.y;
    var bottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((bottom < othertop + 10) ||
			(top > otherbottom - 20) ||
			(right < otherleft + 15) ||
			(left > otherright - 15)) {
      crash = false;
    }
    return crash;
  };

  this.jumpsOn = function(otherobj) {
    var bottomY = this.y + (this.height);
    var farX = this.x + this.width;
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var smoosh = false;
    if ((bottomY > othertop - 5) &&
			(bottomY < (othertop + 20)) &&
			(farX > otherleft) &&
			(this.x < otherright)) {
      smoosh = true;
      moveUp('hit');
    }
    return smoosh;
  };


  this.newPos = function() {
    this.y += this.speedY;
    this.speedY += this.gravity; 
    this.x += this.speedX;
    this.hitBottom();
  };


  this.hitBottom = function() {
    var rockbottom = gameArea.canvas.height - this.height - 150;
    if (this.y > rockbottom) {
      this.y = rockbottom;
      this.hitGround = true;
      this.doubleJumpAllowed = true;
    }
  };

  this.setAlive = function(alive) {
    this.alive = alive;
  };
  this.isAlive = function() {
    return this.alive;
  };

  this.setX = function(x){
    this.x = x;
  };

  this.getX = function(){
    return this.x;
  };

  this.getOrignX = function(){
    return this.orignX;
  };

  this.getImgSrc = function(){
    return this.image.src;
  };

  this.setSrc = function(src){
    this.image.src = src;
  };

  this.rotation = function(){
    if(sanitizerRotationValue === 0){
      this.setSrc('Pictures/sanitizer.png');
    }
  };

  this.changeDir = function(newDir) {
    if (dir !== newDir) {
      [playerCharacter.image, playerCharacter.imageMirror] = [playerCharacter.imageMirror, playerCharacter.image];
      dir = newDir;
    }
  };

  this.sanitizerDisappear = function(){
    this.y += -2;
    this.alpha -= 0.03;
    if(this.alpha < 0){
      this.alpha = 0;
    }
  };
}

function gameOver() {
  interval && clearInterval(interval);
  if(highscore < score){
    highscore = score;
  }
  var modal = document.getElementById('gameOverModal');
  modal.style.display = 'block';

}

function restartGame() {
  gameArea.stop();
  initialize_game();
}

function gameComplete() {
  var modal = document.getElementById('gameCompleteModal');
  modal.style.display = 'block';
  gameArea.stop();
  if(highscore < score){
    highscore = score;
  }
}

function correctCharacterPos() {
  if (playerCharacter.y < 0) {
    playerCharacter.speedY = 0;
    playerCharacter.y = 0;
  }
  if (playerCharacter.x < 0) {
    playerCharacter.speedX = 0;
    playerCharacter.x = 0;
  }
  if (playerCharacter.x > gameArea.canvas.width - playerCharacter.width) {
    playerCharacter.speedX = 0;
    playerCharacter.x = gameArea.canvas.width - playerCharacter.width;
  }
  if (playerCharacter.y > gameArea.canvas.height - playerCharacter.height) {
    playerCharacter.speedY = 0;
    playerCharacter.y = gameArea.canvas.height - playerCharacter.height;
  }
}

function updateGameArea() {
  let pausemodal = document.getElementById('gamePauseModal');
  let optionsModal = document.getElementById('optionsModal');
  if (gamePaused) 
  {
    pausemodal.style.display = 'block';
    return;
  } 
  else if (displayOptionsModal)
  {
    optionsModal.style.display = 'block';
    return;
  } 
  else
  {
    pausemodal.style.display = 'none';
    optionsModal.style.display = 'none';
  }
  if (gameArea.time >= LEVEL_COMPLETION_TIME) {
    gameArea.stop();
    if (currentLevel === totalLevels) gameComplete();
    else {
      currentLevel++;
      var levelTransitionModal = document.getElementById('levelTransitionModal');
      levelTransitionModal.style.display = 'block';
      var levelTransitionModalContent = document.getElementById('levelTransitionModalContent');
      levelTransitionModalContent.innerHTML += `<p id="sanitizerMessage" class="levelTransitionMessage">sanitizers earned: ${currentsanitizers}</p>`;
      levelTransitionModalContent.innerHTML += `<p id="pointsMessage" class="levelTransitionMessage">Points earned: ${currentScore}</p>`;
    }
  }

  for (let i = 0; i < virusCharacters.length; i++){
    if(virusCharacters[i].isAlive()) {
      if(playerCharacter.jumpsOn(virusCharacters[i])){
        virusCharacters[i].setAlive(false);
        incrementScore(100*currentLevel);
        gameArea.bonusActiveTime = 0;
        gameArea.bonusInterval = setInterval(flashScore, 150);
        if (!musicMuted) {
          viruskilled = document.getElementById('viruskilled');
          viruskilled.autoplay = true;
          viruskilled.load();
        }
      } else if (playerCharacter.crashWith(virusCharacters[i])){
        backgoundshift = 0;
        gameArea.stop();
        gameOver();
      }
    }
  }

  for (let i = 0; i < sanitizers.length; i++) 
  {
    if (sanitizers[i].isAlive()){
      if (playerCharacter.crashWith(sanitizers[i])){
        
        collectedsanitizers++;
        currentsanitizers++;
        incrementScore(50 * currentLevel);
        sanitizers[i].setAlive(false);
        gameArea.sanitizerScoreActiveTime = 0;
        gameArea.sanitizerScoreInterval = setInterval(flashsanitizerScore, 150);
        if(!musicMuted){
          sanitizerpickup = document.getElementById('sanitizerpickup');
          sanitizerpickup.autoplay = true;
          sanitizerpickup.load();
        }
      }else{
        sanitizers[i].rotation();
      }
    }
  }

  gameArea.clear();
  background.moveBackgrounds(background2);
  background.update();
  background2.update();
  scoreBoard.text = 'SCORE: ' + score;
  scoreBoard.update();
  sanitizerScoreBoard.text = collectedsanitizers;
  sanitizerScoreBoard.update();
  sanitizerScoreBoardImg.update();
  highscoreBoard.update();
  timeBoard.text = Math.ceil(timeLeft);
  timeBoard.update();
  timeBoardImg.update();
  incrementFrameNumber(2);
  incrementTime(2);

  levelDisplay.text = 'Level ' + currentLevel;
  levelDisplay.update();

  for (let i = 0; i < virusCharacters.length; i++) {
    virusCharacters[i].update();
  }

  for (let i = 0; i < sanitizers.length; i++) {
    sanitizers[i].update();
  }

  playerCharacter.newPos();
  correctCharacterPos();
  playerCharacter.update();

  if (flyCounter === 35) {
    flyUp = !flyUp;
    flyCounter = 0;
  }
  flyCounter++;

  for (let i = 0; i < virusCharacters.length; i++) {
    if (virusCharacters[i].isAlive()) {
      if (currentLevel >= 3 && virusCharacters[i].moveType !== FLYING) { 
        if (currentLevel === 5 && virusCharacters[i].moveType === REVERSED) {
          virusCharacters[i].x -= (-4 + backgoundshift);
        } else {
          virusCharacters[i].x += (-4 - backgoundshift);
        }
      } else {
        virusCharacters[i].x += (-2 - backgoundshift);
      }
      if (virusCharacters[i].moveType === FLYING) {
        if (flyUp === true) {
          virusCharacters[i].y += 3;
        } else {
          virusCharacters[i].y += -3;
        }
      }
      if (virusCharacters[i].moveType === ROTATING) {
        virusCharacters[i].angle += 10 * Math.PI / 180;
      }
    } else { 
      virusCharacters[i].height = virusCharacters[i].initHeight / 3;
      virusCharacters[i].x -= backgoundshift;
      virusCharacters[i].y += 10;
      virusCharacters[i].alpha += -0.01;
      if (virusCharacters[i].alpha < 0) {
        virusCharacters[i].alpha = 0;
      }
      virusCharacters[i].hitBottom();
    }
  }

  for (let i = 0; i < sanitizers.length; i++) {
    if(sanitizers[i].isAlive()){
      sanitizers[i].x += -2-backgoundshift;
    }
    else{
      sanitizers[i].sanitizerDisappear();
    }
  }
}

function incrementFrameNumber(value) {
  gameArea.frameNo += value;
}

function incrementScore(value) {
  score += value;
  currentScore += value;
}

function incrementTime(value) {
  gameArea.time += value;
  timeLeft = (LEVEL_COMPLETION_TIME - gameArea.time) / 100;
}

function stopMove() {
  playerCharacter.speedX = 0;
  playerCharacter.speedY = 0;
  if (playerCharacter.y < 0) {
    playerCharacter.speedY = 0;
    playerCharacter.y = 0;
  }
  if (playerCharacter.x < 0) {
    playerCharacter.speedX = 0;
    playerCharacter.x = 0;
  }
  if (playerCharacter.x > gameArea.canvas.width - playerCharacter.width) {
    playerCharacter.speedX = 0;
    playerCharacter.x = gameArea.canvas.width - playerCharacter.width;
  }
}

function moveUp(state){
  if(state === 'hit'){
    if(playerCharacter.speedY >= -3){
      playerCharacter.speedY = -7;
    }else{ 
      playerCharacter.speedY -= 4;
    }
    playerCharacter.hitGround = false;
  }
  else if (playerCharacter.hitGround && playerCharacter.y >= 170){
    playerCharacter.speedY = -20;
    playerCharacter.hitGround = false;
    playerCharacter.jumpCooldown = true;
    if (!musicMuted) {
      jump = document.getElementById('jump');
      jump.autoplay = true;
      jump.load();
    }
  }
  else if(playerCharacter.doubleJumpAllowed === true){ 
    playerCharacter.speedY = -7;
    playerCharacter.doubleJumpAllowed = false;
  }
}

function moveLeft() {
  playerCharacter.changeDir(-1);
  backgoundshift = -5;
}

function moveRight(){
  playerCharacter.changeDir(1);
  if(xPos <= -5){
    xPos = 0;
    background.setX(-50);
    background2.setX(850);
  }
  backgoundshift = 5;
}

function duck(){
  if (playerCharacter.hitGround){
    playerCharacter.height = playerCharacter.height / 2;
    playerCharacter.duckCooldown = true;
  }
}
var interval;

function moveLeftMouse() {
  interval = setInterval(moveLeft, 1);
  backgroundDx = -5;
}

function moveRightMouse() {
  interval = setInterval(moveRight, 1);
  if(xPos <= -5){
    xPos = 0;
    background.setX(-50);
    background2.setX(850);
  }
  backgroundDx = 5;
}

function onMouseUp() {
  clearInterval(interval);
  stopMove();
  backgroundDx = 0;
}

function duckMouseUp() {
  if(playerCharacter.hitGround && playerCharacter.duckCooldown === true){
    playerCharacter.height = playerCharacter.height * 2;
    playerCharacter.duckCooldown = false;
  }
}
function resumeGame() {
  var levelTransitionModal = document.getElementById('levelTransitionModal');
  var levelTransitionModalContent = document.getElementById('levelTransitionModalContent');
  if (levelTransitionModal.style.display === 'block') {
    var sanitizerMessage = document.getElementById('sanitizerMessage');
    var pointsMessage = document.getElementById('pointsMessage');
    levelTransitionModalContent.removeChild(sanitizerMessage);
    levelTransitionModalContent.removeChild(pointsMessage);
    levelTransitionModal.style.display = 'none';
    currentsanitizers = 0;
    currentScore = 0;
    startLevel();
  }
}
