// Space Game
// Final Project for ART 151 UIC
// By Alan Ochoa

// Controls:
//   WASD: controls the direction the player moves
//   ARROWS: controls the direction the player shoots

let gameOver = false;
let whatGameOvered = '';
let gameOverRow;
let gameOverCol;

let textToShow = "";
let displayDuration = 90; // display duration in frames (frames / 30 = seconds)
let displayTimer = 0;

let grid = [];
let backgroundColor = [];
let gridSize;
let gridSquares = [];
let currentGrid;
let numGrid = 27;
let timer = 0;

let player;
let playerRow = 3;
let playerCol = 5;
let playerSize = 30;
let playerHealth = 5;
let playerDamaged = false;
let fireCooldown = 0;
let keycards = 0;

let abs;

let footsteps;
let laser;
let punch;
let song;

function preload() {
  door = loadSound('door.mp3');
  laser = loadSound('laser.mp3');
  punch = loadSound('punch.mp3');
  song = loadSound('separation.mp3');
  
  laser.setVolume(0.5);
  punch.setVolume(0.4);
  song.setVolume(0.5);
}

function setup() {
  //abs = new BeatStep("Arturia BeatStep");
  currentGrid = 0;
  
  createCanvas(500, 500);
  frameRate(30);
  
  player = new Player(-1, -1);
  
  // grid sizes
  for (let i = 0; i < numGrid; i++) {
    gridSquares[i] = 7;
  }
  
  // custom grid sizes
  gridSquares[14] = 9;
  gridSquares[19] = 9;
  gridSquares[23] = 9;
  gridSquares[24] = 11;
  gridSquares[25] = 11;
  
  // creating grids
  for (let i = 0; i < numGrid; i++) {
    gridSize = width / gridSquares[i];
    grid[i] = new Grid(gridSquares[i], gridSquares[i], gridSize);
  }
  
  // creating backgrounds
  for (let i = 0; i < 9; i++) {
    backgroundColor[i] = 'rgb(87,86,86)';
  }
  for (let i = 9; i < 15; i++) {
    backgroundColor[i] = '#6C5248';
  }
  for (let i = 15; i < 26; i++) {
    backgroundColor[i] = '#3C4F58';
  }
  backgroundColor[26] = 'rgb(87,86,86)';
  
  // grid 0
  grid[0].placeObject(new Door(-1, -1, 'left', 1), 0, 3);
  grid[0].placeObject(new Door(-1, -1, 'right', 2), 6, 3);
  grid[0].placeObject(new Door(-1, -1, 'up', 25, true, 'door', 3), 3, 0);
  
  // grid 1
  grid[1].placeObject(new Enemy(-1, -1), 1, 5);
  grid[1].placeObject(new Door(-1, -1, 'right', 0), 6, 3);
  grid[1].placeObject(new Door(-1, -1, 'down', 3), 3, 6);
  
  // grid 2
  grid[2].placeObject(new Door(-1, -1, 'left', 0), 0, 3);
  grid[2].placeObject(new Enemy(-1, -1), 5, 5);
  
  // grid 3
  grid[3].placeObject(new Door(-1, -1, 'up', 1), 3, 0);
  grid[3].placeObject(new Door(-1, -1, 'down', 4), 3, 6);
  grid[3].placeObject(new Bat(-1, -1), 3, 4);
  
  for (let i = 0; i < 2; i++) {
    for (let j = 1; j < 6; j++) {
      grid[3].placeObject(new Hole(-1, -1), i, j);
    }
  }
  
  for (let i = 5; i < 7; i++) {
    for (let j = 1; j < 6; j++) {
      grid[3].placeObject(new Hole(-1, -1), i, j);
    }
  }
  
  // grid 4
  grid[4].placeObject(new Door(-1, -1, 'up', 3), 3, 0);
  grid[4].placeObject(new Door(-1, -1, 'right', 5), 6, 3);
  grid[4].placeObject(new Hole(-1, -1), 3, 3);
  grid[4].placeObject(new Bat(-1, -1), 6, 2);
  grid[4].placeObject(new Bat(-1, -1), 0, 4);
  
  grid[4].placeObject(new Door(-1, -1, 'down', 9, true, 'door', 1), 3, 6);
  
  // grid 5
  grid[5].placeObject(new Door(-1, -1, 'left', 4), 0, 3);
  grid[5].placeObject(new Door(-1, -1, 'right', 6), 6, 3);
  
  grid[5].placeObject(new Hole(-1, -1), 2, 3);
  grid[5].placeObject(new Hole(-1, -1), 3, 3);
  grid[5].placeObject(new Hole(-1, -1), 4, 3);
  
  grid[5].placeObject(new Enemy(-1, -1), 6, 2);
  grid[5].placeObject(new Enemy(-1, -1), 6, 4);
  
  // grid 6
  grid[6].placeObject(new Door(-1, -1, 'left', 5), 0, 3);
  grid[6].placeObject(new Door(-1, -1, 'up', 7), 3, 0);
  
  grid[6].placeObject(new Enemy(-1, -1), 0, 0);
  
  for (let i = 0; i < 6; i++) {
      grid[6].placeObject(new Hole(-1, -1), i, 6);
  }
  
  for (let j = 0; j < 7; j++) {
      grid[6].placeObject(new Hole(-1, -1), 6, j);
  }
  
  // grid 7
  grid[7].placeObject(new Door(-1, -1, 'down', 6), 0, 3);
  grid[7].placeObject(new Door(-1, -1, 'left', 8), 0, 3);
  
  grid[7].placeObject(new Bat(-1, -1), 6, 2);
  grid[7].placeObject(new Bat(-1, -1), 6, 4);
  
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      grid[7].placeObject(new Hole(-1, -1), i, j);
    }
  }
  
  for (let i = 0; i < 2; i++) {
    for (let j = 5; j < 7; j++) {
      grid[7].placeObject(new Hole(-1, -1), i, j);
    }
  }
  
  for (let i = 5; i < 7; i++) {
    for (let j =0; j < 2; j++) {
      grid[7].placeObject(new Hole(-1, -1), i, j);
    }
  }
  
  for (let i = 5; i < 7; i++) {
    for (let j = 5; j < 7; j++) {
      grid[7].placeObject(new Hole(-1, -1), i, j);
    }
  }
  
  // grid 8 (first mini-boss)
  grid[8].placeObject(new MiniBoss(-1, -1), 3, 3);
  grid[8].placeObject(new Door(-1, -1, 'left', 3, true, 'mini-boss', 0), 0, 0);
  
  // grid 9
  grid[9].placeObject(new Door(-1, -1, 'up', 4), 3, 0);
  grid[9].placeObject(new Door(-1, -1, 'down', 10), 3, 6);
  
  grid[9].placeObject(new Bat(-1, -1), 3, 3);
  grid[9].placeObject(new Enemy(-1, -1), 1, 6);
  grid[9].placeObject(new Enemy(-1, -1), 5, 6);
  
  // grid 10
  grid[10].placeObject(new Door(-1, -1, 'up', 9), 3, 0);
  grid[10].placeObject(new Door(-1, -1, 'right', 11), 6, 3);
  
  grid[10].placeObject(new Turret(-1, -1), 3, 3);
  
  // grid 11
  grid[11].placeObject(new Door(-1, -1, 'up', 12), 3, 0);
  grid[11].placeObject(new Door(-1, -1, 'down', 15, true, 'door', 2), 3, 6);
  
  grid[11].placeObject(new Turret(-1, -1), 2, 6);
  grid[11].placeObject(new Turret(-1, -1), 4, 6);
  
  // grid 12
  grid[12].placeObject(new Door(-1, -1, 'down', 11), 3, 6);
  grid[12].placeObject(new Door(-1, -1, 'right', 13), 6, 3);
  
  grid[12].placeObject(new Turret(-1, -1), 0, 0);
  grid[12].placeObject(new Enemy(-1, -1), 3, 1);
  
  // grid 13
  grid[13].placeObject(new Door(-1, -1, 'left', 12), 0, 3);
  grid[13].placeObject(new Door(-1, -1, 'down', 14), 3, 6);
  
  grid[13].placeObject(new Enemy(-1, -1), 6, 2);
  grid[13].placeObject(new Enemy(-1, -1), 6, 3);
  grid[13].placeObject(new Enemy(-1, -1), 6, 4);
  
  // grid 14 (second mini-boss)
  grid[14].placeObject(new Door(-1, -1, 'left', 11, true, 'mini-boss', 0), 0, 0);
  grid[14].placeObject(new MiniBoss(-1, -1), 4, 6);
  grid[14].placeObject(new Enemy(-1, -1), 0, 6);
  grid[14].placeObject(new Enemy(-1, -1), 8, 6);
  
  // grid 15
  grid[15].placeObject(new Door(-1, -1, 'down', 16), 3, 6);
  grid[15].placeObject(new Turret(-1, -1), 0, 2);
  grid[15].placeObject(new Turret(-1, -1), 0, 3);
  grid[15].placeObject(new Turret(-1, -1), 0, 4);
  
  grid[15].placeObject(new Turret(-1, -1), 6, 2);
  grid[15].placeObject(new Turret(-1, -1), 6, 3);
  grid[15].placeObject(new Turret(-1, -1), 6, 4);
  
  for (let j = 0; j < 7; j++) {
      grid[15].placeObject(new Hole(-1, -1), 1, j);
  }
  
  for (let j = 0; j < 7; j++) {
      grid[15].placeObject(new Hole(-1, -1), 5, j);
  }
  
  // grid 16
  grid[16].placeObject(new Door(-1, -1, 'down', 17), 3, 6);
  
  for (let i = 1; i < 6; i++) {
    for (let j = 2; j < 5; j++) {
      grid[16].placeObject(new Hole(-1, -1), i, j);
    }
  }
  
  grid[16].placeObject(new Turret(-1, -1), 3, 3);
  grid[16].placeObject(new Turret(-1, -1), 0, 6);
  grid[16].placeObject(new Turret(-1, -1), 6, 6);
  
  // grid 17
  grid[17].placeObject(new Door(-1, -1, 'down', 18), 3, 6);
  
  grid[17].placeObject(new Turret(-1, -1), 3, 3);
  grid[17].placeObject(new Turret(-1, -1), 1, 5);
  grid[17].placeObject(new Turret(-1, -1), 5, 5);
  
  // grid 18
  grid[18].placeObject(new Door(-1, -1, 'left', 19), 0, 3);
  grid[18].placeObject(new Door(-1, -1, 'right', 21, true, 'door', 3), 6, 3);
  
  // grid 19 (third mini-boss)
  grid[19].placeObject(new Door(-1, -1, 'right', 18, true, 'mini-boss', 0), 8, 0);

  grid[19].placeObject(new MiniBoss(-1, -1), 2, 4);
  grid[19].placeObject(new Turret(-1, -1), 0, 0);
  grid[19].placeObject(new Turret(-1, -1), 0, 2);
  grid[19].placeObject(new Turret(-1, -1), 0, 6);
  grid[19].placeObject(new Turret(-1, -1), 0, 8);
  
  // grid 20
  
  // grid 21
  grid[21].placeObject(new Door(-1, -1, 'left', 18), 0, 3);
  grid[21].placeObject(new Door(-1, -1, 'up', 22), 3, 0);
  grid[21].placeObject(new Turret(-1, -1), 6, 3);
  
  // grid 22
  grid[22].placeObject(new Door(-1, -1, 'up', 23), 3, 0);
  grid[22].placeObject(new Enemy(-1, -1), 1, 0);
  grid[22].placeObject(new Enemy(-1, -1), 5, 0);
  grid[22].placeObject(new Enemy(-1, -1), 3, 1);
  
  // grid 23
  grid[23].placeObject(new Door(-1, -1, 'up', 24), 4, 0);
  grid[23].placeObject(new Enemy(-1, -1), 0, 0);
  grid[23].placeObject(new Enemy(-1, -1), 2, 0);
  grid[23].placeObject(new Enemy(-1, -1), 4, 1);
  grid[23].placeObject(new Enemy(-1, -1), 6, 0);
  grid[23].placeObject(new Enemy(-1, -1), 8, 0);
  
  // grid 24
  grid[24].placeObject(new Door(-1, -1, 'up', 2), 5, 0);
  grid[24].placeObject(new Enemy(-1, -1), 0, 0);
  grid[24].placeObject(new Enemy(-1, -1), 1, 0);
  grid[24].placeObject(new Enemy(-1, -1), 2, 0);
  grid[24].placeObject(new Enemy(-1, -1), 3, 0);
  grid[24].placeObject(new Enemy(-1, -1), 4, 0);
  grid[24].placeObject(new Enemy(-1, -1), 5, 1);
  grid[24].placeObject(new Enemy(-1, -1), 6, 0);
  grid[24].placeObject(new Enemy(-1, -1), 7, 0);
  grid[24].placeObject(new Enemy(-1, -1), 8, 0);
  grid[24].placeObject(new Enemy(-1, -1), 9, 0);
  grid[24].placeObject(new Enemy(-1, -1), 10, 0);
  
  // grid 25 (final boss)
  grid[25].placeObject(new Door(-1, -1, 'up', 26, true, 'boss', 0), 5, 0);
  grid[25].placeObject(new Boss(-1, -1), 5, 5);
  
  // grid 26 (escape)
}

function draw() {
  background(backgroundColor[currentGrid]);
  
  //beatstepControls(); // uncomment for beatStep controls
  
  if (!song.isPlaying()) {
    song.play();
  }
  
  if (currentGrid == 0 ||currentGrid == 1 || currentGrid == 2) {
    noStroke();
    fill('#031524');
    rect(0, 0, width, 6);
    
    grid[0].placeObject(new Door(-1, -1, 'left', 1), 0, 3);
    grid[0].placeObject(new Door(-1, -1, 'right', 2), 6, 3);
    grid[0].placeObject(new Door(-1, -1, 'up', 25, true, 'door', 3), 3, 0);
  }
  
  if (currentGrid == 11 || currentGrid == 26) {
    noStroke();
    fill('#031524');
    rect(0, height-6, width, 6);
  }
  
  if (currentGrid == 15 || currentGrid == 16 || currentGrid == 17 || currentGrid == 18 || currentGrid == 19 || currentGrid == 21 || currentGrid == 22 || currentGrid == 23 || currentGrid == 24 || currentGrid == 25) {
    noStroke();
    fill('#031524');
    rect(0, height-6, width, 6);
    rect(0, 0, 6, height);
    rect(width-6, 0, 6, height);
    rect(0, 0, width, 6);
  }
  
  if (currentGrid == 26) {
    displayTextForDuration('You\'re alive! How did you escape!\nGet in, were leaving.', 99999999);
    
    let npc = new Player(-1, -1);
    npc.direction = 'right';
    
    grid[26].placeObject(npc, 4, 1);
    grid[26].placeObject(new Rocket(-1, -1), 3, 1);
  }
  
  
  gridSize = width / gridSquares[currentGrid];
  grid[currentGrid].display();
  
  // grid[currentGrid].printGridObjects(); // for testing
  
  grid[currentGrid].placeObject(player, playerRow, playerCol);

  // print UI
  stroke(255);
  fill(0);
  textSize(20);
  text('HP: ' + playerHealth, 5, 20);
  
  textAlign(RIGHT);
  text('Keycards: ' + keycards, width-5, 20);
  textAlign(LEFT);
  stroke(0);
  
  // move the grid and update the timer based on framerate
  if (frameCount % 45 == 0) {
    if (timer > 0) {
      timer--;
    }
    grid[currentGrid].move();
  }
  
  // cooldown for firing the laser gun
  if (frameCount % 30 == 0) {
    if (fireCooldown > 0) {
      fireCooldown--;
    }
  }
  
  // if the player falls in a hole, reduce its size like it is falling
  if (gameOver && playerSize > 0 && whatGameOvered == 'hole') {
    playerSize -= 0.3;
  }
  
  // flash the player if it's damaged
  if (playerDamaged) {
    if (frameCount % 30 < 15) { // flash every half second
      player.size = 0;
    } else {
      player.size = 30;
    }
  }
  
  // display the text if the display timer is greater than 0
  if (displayTimer > 0) {
    fill(0);
    textSize(20);
    stroke(255);
    textAlign(CENTER);
    text(textToShow, width / 2, height / 2);
    displayTimer--;
    textAlign(LEFT);
  }
  
  if (gameOver) {
    door.setVolume(0);
    laser.setVolume(0);
    punch.setVolume(0);
    if (whatGameOvered == 'hole') {
      if (timer != 0) {
        fill(0, 255, 0);
        push();
        angleMode(DEGREES);
        fill('white');

        translate(gameOverRow * gridSize + gridSize / 2, gameOverCol * gridSize + gridSize / 2); // translate to center of player

        rectMode(CENTER);
        rect(0, 0, playerSize + 12, playerSize / 2);
        rect(0, 10.7, playerSize + 6, playerSize / 2-8);

        fill('grey');
        rect(15, -15, playerSize/4, playerSize/2);

        fill('white');
        ellipse(0, 0, playerSize);

        fill('rgb(180,165,86)');
        ellipse(0, -10, playerSize / 1.5, playerSize / 4); 
        pop();
      } else {
        background(0);
        textAlign(CENTER);
        fill('red');
        textSize(50);
        text('Game Over', width/2, height/2);
        fill('white');
        textSize(15);
        text('You fell in a deep hole', width/2, height/1.5);
      }
    } else if (whatGameOvered == 'escape') {
      // you escaped
      background(0);
      fill('green');
      textSize(50);
      textAlign(CENTER);
      text('You Escaped', width/2, height/2);
    } else {
      background(0);
      textAlign(CENTER);
      fill('red');
      textSize(50);
      text('Game Over', width/2, height/2);
      fill('white');
      textSize(15);
      text('You took too much damage', width/2, height/1.5);
    }
  }
}

class Grid {
  constructor(rows, cols, cellSize) {
    this.rows = rows;
    this.cols = cols;
    this.cellSize = cellSize;
    this.grid = [];
    this.createGrid();
  }

  createGrid() {
    for (let i = 0; i < this.rows; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = null; // All cells are empty at the start
      }
    }
  }

  display() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        stroke(0);
        noFill();
        rect(j * this.cellSize, i * this.cellSize, this.cellSize, this.cellSize);
        // Display the content of the cell if it's not null
        if (this.grid[i][j]) {
          this.grid[i][j].display();
        }
      }
    }
  }
  
  move() {
    for (let i = 0; i < gridSquares[currentGrid]; i++) {
      for (let j = 0; j < gridSquares[currentGrid]; j++) {
        // Move the content of the cell if it's not null
          
        if (this.grid[i][j]) {
          this.grid[i][j].move();
        }
      }
    }
  }
  
  callInteract(row, col) {
    if (row >= 0 && row < gridSquares[currentGrid] && col >= 0 && col < gridSquares[currentGrid] && grid[currentGrid].grid[row][col] !== null) {
      grid[currentGrid].grid[row][col].interact();
    }
  }

  placeObject(object, row, col) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      if (object === null) {
        this.grid[row][col] = null; // Clear the cell
      } else {
        object.x = row;
        object.y = col;
        this.grid[row][col] = object;
      }
    }
  }
  
  getObjectTag(row, col) {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      const object = this.grid[row][col];
      return object ? object.tag : null;
    } else {
      return null; // Return null if the provided row and column are out of bounds
    }
  }
  
  printGridObjects() {
    console.log("Objects on grid " + currentGrid + ":");
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const object = this.grid[i][j];
        if (object) {
          console.log(`[${i},${j}]: ${object.tag}`);
        }
      }
    }
  }
  
  clearPlayers() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.grid[i][j] instanceof Player) {
          this.grid[i][j] = null;
        }
      }
    }
  }
  
  containsObjectWithTag(tag) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const object = this.grid[i][j];
        if (object && object.tag === tag) {
          return true; // Found the object with the specified tag
        }
      }
    }
    return false; // Tag not found in the grid
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = playerSize;
    this.tag = 'player';
    this.direction = 'left';
  }

display() {
  if (playerHealth > 0) {
    push();
    angleMode(DEGREES);
    fill('white');

    translate(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2); // translate to center of player
    if (this.direction === 'right') {
      rotate(180);
    } else if (this.direction === 'left') {
      rotate(0);
    } else if (this.direction === 'down') {
      rotate(90);
    } else if (this.direction === 'up') {
      rotate(-90);
    }

    rectMode(CENTER);
    rect(0, 0, this.size + 12, this.size / 2);
    rect(0, 10.7, this.size + 6, this.size / 2-8);
    
    fill('grey');
    rect(15, -15, this.size/4, this.size/2);
    
    fill('white');
    ellipse(0, 0, this.size);

    fill('rgb(180,165,86)');
    ellipse(0, -10, this.size / 1.5, this.size / 4); 
    pop();
  }
}
  
  move() {
    // do nothing, keyPressed handles this already
  }
  
  interact() {
    // cannot move into the player, interact() is called when the player is trying to move into that spot
  }
  
  hurt(amount) {
    hurtPlayer(amount);
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.tag = 'enemy';
    this.health = 3;
    this.direction = 'down';
  }

  display() {
    push();
    angleMode(DEGREES);
    fill('rgb(109,7,7)');

    translate(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2);
    if (this.direction === 'right') {
      rotate(90);
    } else if (this.direction === 'left') {
      rotate(-90);
    } else if (this.direction === 'down') {
      rotate(0);
    } else if (this.direction === 'up') {
      rotate(180);
    }

    rectMode(CENTER);
    rect(0, 0, this.size + 12, this.size / 2);
    rect(0, 10.7, this.size + 6, this.size / 2-8);
    
    ellipse(0, 0, this.size);

    fill('rgb(180,165,86)');
    ellipse(0, -10, this.size / 1.5, this.size / 4); 
    pop();
  }
  
  move() {
    let alreadyMoved = false;
    
    if (player.y > this.y && !alreadyMoved) {
      if (grid[currentGrid].getObjectTag(this.x, this.y + 1) == 'player') {
        this.interact();
      } else if (grid[currentGrid].getObjectTag(this.x, this.y + 1) == null) {
        grid[currentGrid].placeObject(null, this.x, this.y);
        this.y++;
        grid[currentGrid].placeObject(this, this.x, this.y);
        alreadyMoved = true;
      }
      this.direction = 'up';
    }
    if (player.y < this.y && !alreadyMoved) {
      if (grid[currentGrid].getObjectTag(this.x, this.y - 1) == 'player') {
        this.interact();
      } else if (grid[currentGrid].getObjectTag(this.x, this.y - 1) == null) {
        grid[currentGrid].placeObject(null, this.x, this.y);
        this.y--;
        grid[currentGrid].placeObject(this, this.x, this.y);
        alreadyMoved = true;
      }
      this.direction = 'down';
    }
    if (player.x > this.x && !alreadyMoved) {
      if (grid[currentGrid].getObjectTag(this.x + 1, this.y) == 'player') {
        this.interact();
      } else if (grid[currentGrid].getObjectTag(this.x + 1, this.y) == null) {
        grid[currentGrid].placeObject(null, this.x, this.y);
        this.x++;
        grid[currentGrid].placeObject(this, this.x, this.y);
        alreadyMoved = true;
      }
      this.direction = 'right';
    }
    if (player.x < this.x && !alreadyMoved) {
      if (grid[currentGrid].getObjectTag(this.x - 1, this.y) == 'player') {
        this.interact();
      } else if (grid[currentGrid].getObjectTag(this.x - 1, this.y) == null) {
        grid[currentGrid].placeObject(null, this.x, this.y);
        this.x--;
        grid[currentGrid].placeObject(this, this.x, this.y);
        alreadyMoved = true;
      }
      this.direction = 'left';
    }
  }

  
  interact() {
    hurtPlayer(2);
  }
  
  hurt(amount) {
    this.health -= amount;
    
    if (this.health <= 0) {
      grid[currentGrid].placeObject(null, this.x, this.y);
    }
  }
}

class Bat {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.tag = 'bat';
    this.health = 2;
    this.count = 2;
  }

  display() {
    push();
    rectMode(CENTER);
    angleMode(DEGREES);
    
    fill(0);
    ellipse(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2, this.size);
    
    push();
    translate(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2);
    if (frameCount % 5 == 0) {
      if(this.count == 0) {
        rotate(20);
        this.count = 1;
      } else if(this.count == 1) {
        rotate(-20);
        this.count = 2;
      } else {
        rotate(0);
        this.count = 0;
      }
    }
    rect(0+15, 0, this.size, this.size-20);
    rect(0-15, 0, this.size, this.size-20);
    pop();
    
    fill(255);
    ellipse(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2, this.size/2);
    fill(0);
    ellipse(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2, this.size/5);
    pop();
  }
  
  move() {
    if (player.x > this.x) {
      if (grid[currentGrid].getObjectTag(this.x + 1, this.y) == 'player') {
        this.interact();
      } else if (grid[currentGrid].getObjectTag(this.x + 1, this.y) == null) {
        grid[currentGrid].placeObject(null, this.x, this.y);
        this.x++;
        grid[currentGrid].placeObject(this, this.x, this.y);
      }
    } else if (player.x < this.x) {
      if (grid[currentGrid].getObjectTag(this.x - 1, this.y) == 'player') {
        this.interact();
      } else if (grid[currentGrid].getObjectTag(this.x - 1, this.y) == null) {
        grid[currentGrid].placeObject(null, this.x, this.y);
        this.x--;
        grid[currentGrid].placeObject(this, this.x, this.y);
      }
    } else if (player.y == this.y - 1) {
      this.interact();
    } else if (player.y == this.y + 1) {
      this.interact();
    } 
  }
  
  interact() {
    hurtPlayer(1);
  }
  
  hurt(amount) {
    this.health -= amount;
    
    if (this.health <= 0) {
      grid[currentGrid].placeObject(null, this.x, this.y);
    }
  }
}

class Turret {
  constructor(x, y, drop) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.tag = 'turret';
    this.health = 5;
    this.count = 1;
    this.direction = 'up'
  }

  display() {
    fill(175, 0, 0);
    let halfSize = this.size / 2;
    // Adjust the positions of the triangle's vertices based on the shooting direction
    if (this.direction === 'right') {
      triangle(
        this.x * gridSize + gridSize / 2 + halfSize, this.y * gridSize + gridSize / 2, 
        this.x * gridSize + gridSize / 2 - halfSize, this.y * gridSize + gridSize / 2 - halfSize,
        this.x * gridSize + gridSize / 2 - halfSize, this.y * gridSize + gridSize / 2 + halfSize
      );
    } else if (this.direction === 'left') {
      triangle(
        this.x * gridSize + gridSize / 2 - halfSize, this.y * gridSize + gridSize / 2, 
        this.x * gridSize + gridSize / 2 + halfSize, this.y * gridSize + gridSize / 2 - halfSize,
        this.x * gridSize + gridSize / 2 + halfSize, this.y * gridSize + gridSize / 2 + halfSize
      );
    } else if (this.direction === 'down') {
      triangle(
        this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2 + halfSize, 
        this.x * gridSize + gridSize / 2 - halfSize, this.y * gridSize + gridSize / 2 - halfSize,
        this.x * gridSize + gridSize / 2 + halfSize, this.y * gridSize + gridSize / 2 - halfSize
      );
    } else if (this.direction === 'up') {
      triangle(
        this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2 - halfSize, 
        this.x * gridSize + gridSize / 2 - halfSize, this.y * gridSize + gridSize / 2 + halfSize,
        this.x * gridSize + gridSize / 2 + halfSize, this.y * gridSize + gridSize / 2 + halfSize
      );
    }
  }
  
  move() {
    let alreadyFired = false;
    this.direction = 'up';
    
    let xDistance = Math.abs(player.x - this.x);
    let yDistance = Math.abs(player.y - this.y);
    
    if (xDistance > yDistance) {
      if (player.x > this.x && !alreadyFired) {
        this.direction = 'right';
        alreadyFired = true;
      }
      if (player.x < this.x && !alreadyFired) {
        this.direction = 'left';
        alreadyFired = true;
      }
    } else {
      if (player.y > this.y && !alreadyFired) {
        this.direction = 'down';
        alreadyFired = true;
      }
      if (player.y < this.y && !alreadyFired) {
        this.direction = 'up';
        alreadyFired = true;
      }
    }
    
    if (this.count == 0) {
      fireLaser(this.x, this.y, this.direction, this);
      this.count = 1;
    } else {
      this.count--;
    }
  }
  
  interact() {

  }
  
  hurt(amount) {
    // turrets cannot be destroyed
  }
}

class MiniBoss {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.tag = 'mini-boss';
    this.health = 10;
    this.count = 3;
    this.direction = 'down';
  }

  display() {
    push();
    angleMode(DEGREES);
    fill('rgb(239,27,27)');

    translate(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2); // Translate to center of player
    if (this.direction === 'right') {
      rotate(90);
    } else if (this.direction === 'left') {
      rotate(-90);
    } else if (this.direction === 'down') {
      rotate(180);
    } else if (this.direction === 'up') {
      rotate(0);
    }

    rectMode(CENTER);
    rect(0, 0, this.size + 12, this.size / 2);
    rect(0, 10.7, this.size + 6, this.size / 2-8);
    
    fill('grey');
    rect(15, -15, this.size/4, this.size/2);
    
    fill('rgb(239,27,27)');
    ellipse(0, 0, this.size);

    fill('rgb(141,129,67)');
    ellipse(0, -10, this.size / 1.5, this.size / 4); 
    pop();
  }
  
  move() {
    // mini-bosses do not move, so shoot
    let alreadyFired = false;
    
    let xDistance = Math.abs(player.x - this.x);
    let yDistance = Math.abs(player.y - this.y);
    
    if (xDistance > yDistance) {
      if (player.x > this.x && !alreadyFired) {
        this.direction = 'right';
        alreadyFired = true;
      }
      if (player.x < this.x && !alreadyFired) {
        this.direction = 'left';
        alreadyFired = true;
      }
    } else {
      if (player.y > this.y && !alreadyFired) {
        this.direction = 'down';
        alreadyFired = true;
      }
      if (player.y < this.y && !alreadyFired) {
        this.direction = 'up';
        alreadyFired = true;
      }
    }
    
    if (this.count == 0) {
      if (this.direction == 'up' || this.direction == 'down') {
        fireLaser(this.x-1, this.y, this.direction, this);
        fireLaser(this.x, this.y, this.direction, this);
        fireLaser(this.x+1, this.y, this.direction, this);
      } else {
        fireLaser(this.x, this.y-1, this.direction, this);
        fireLaser(this.x, this.y, this.direction, this);
        fireLaser(this.x, this.y+1, this.direction, this);
      }
      this.count = 3;
    } else {
      fireLaser(this.x, this.y, this.direction, this);
      this.count--;
    }
  }
  
  interact() {
    hurtPlayer(2);
  }
  
  hurt(amount) {
    this.health -= amount;
    
    if (this.health <= 0) {
      grid[currentGrid].placeObject(null, this.x, this.y);
      
      grid[currentGrid].placeObject(new Keycard(-1, -1), this.x, this.y);
    }
  }
}

class Boss {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 35;
    this.tag = 'boss';
    this.health = 15;
    this.count = 3;
    this.direction = 'up';
  }

  display() {
    push();
    angleMode(DEGREES);
    fill('rgb(239,27,27)');

    translate(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2);
    if (this.direction === 'right') {
      rotate(90);
    } else if (this.direction === 'left') {
      rotate(-90);
    } else if (this.direction === 'down') {
      rotate(180);
    } else if (this.direction === 'up') {
      rotate(0);
    }

    rectMode(CENTER);
    rect(0, 0, this.size + 12, this.size / 2);
    rect(0, 13.2, this.size + 6, this.size / 2-8);
    
    fill('grey');
    rect(15, -15, this.size/4, this.size/2);
    
    fill('rgb(239,27,27)');
    ellipse(0, 0, this.size);

    fill('rgb(141,129,67)');
    ellipse(0, -12, this.size / 1.5, this.size / 3); 
    pop();
  }
  
  move() {
    let alreadyMoved = false;
    
    if (player.y > this.y && !alreadyMoved) {
      if (grid[currentGrid].getObjectTag(this.x, this.y + 1) == 'player') {
        this.interact();
      } else if (grid[currentGrid].getObjectTag(this.x, this.y + 1) == null) {
        grid[currentGrid].placeObject(null, this.x, this.y);
        this.y++;
        grid[currentGrid].placeObject(this, this.x, this.y);
        alreadyMoved = true;
      }
      this.direction = 'up';
    }
    if (player.y < this.y && !alreadyMoved) {
      if (grid[currentGrid].getObjectTag(this.x, this.y - 1) == 'player') {
        this.interact();
      } else if (grid[currentGrid].getObjectTag(this.x, this.y - 1) == null) {
        grid[currentGrid].placeObject(null, this.x, this.y);
        this.y--;
        grid[currentGrid].placeObject(this, this.x, this.y);
        alreadyMoved = true;
      }
      this.direction = 'down';
    }
    if (player.x > this.x && !alreadyMoved) {
      if (grid[currentGrid].getObjectTag(this.x + 1, this.y) == 'player') {
        this.interact();
      } else if (grid[currentGrid].getObjectTag(this.x + 1, this.y) == null) {
        grid[currentGrid].placeObject(null, this.x, this.y);
        this.x++;
        grid[currentGrid].placeObject(this, this.x, this.y);
        alreadyMoved = true;
      }
      this.direction = 'right';
    }
    if (player.x < this.x && !alreadyMoved) {
      if (grid[currentGrid].getObjectTag(this.x - 1, this.y) == 'player') {
        this.interact();
      } else if (grid[currentGrid].getObjectTag(this.x - 1, this.y) == null) {
        grid[currentGrid].placeObject(null, this.x, this.y);
        this.x--;
        grid[currentGrid].placeObject(this, this.x, this.y);
        alreadyMoved = true;
      }
      this.direction = 'left';
    }
    
    
    
    let alreadyFired = false;
    
    let xDistance = Math.abs(player.x - this.x);
    let yDistance = Math.abs(player.y - this.y);
    
    if (xDistance > yDistance) {
      if (player.x > this.x && !alreadyFired) {
        this.direction = 'right';
        alreadyFired = true;
      }
      if (player.x < this.x && !alreadyFired) {
        this.direction = 'left';
        alreadyFired = true;
      }
    } else {
      if (player.y > this.y && !alreadyFired) {
        this.direction = 'down';
        alreadyFired = true;
      }
      if (player.y < this.y && !alreadyFired) {
        this.direction = 'up';
        alreadyFired = true;
      }
    }
    
    if (this.count == 0) {
      fireLaser(this.x-1, this.y, 'up', this);
      fireLaser(this.x, this.y, 'up', this);
      fireLaser(this.x+1, this.y, 'up', this);
      
      fireLaser(this.x-1, this.y, 'down', this);
      fireLaser(this.x, this.y, 'down', this);
      fireLaser(this.x+1, this.y, 'down', this);
      
      fireLaser(this.x, this.y-1, 'left', this);
      fireLaser(this.x, this.y, 'left', this);
      fireLaser(this.x, this.y+1, 'left', this);
      
      fireLaser(this.x, this.y-1, 'right', this);
      fireLaser(this.x, this.y, 'right', this);
      fireLaser(this.x, this.y+1, 'right', this);
      
      this.count = 6;
    } else {
      fireLaser(this.x, this.y, this.direction, this);
      this.count--;
    }
  }
  
  interact() {
    hurtPlayer(3);
  }
  
  hurt(amount) {
    this.health -= amount;
    
    if (this.health <= 0) {
      grid[currentGrid].placeObject(null, this.x, this.y);
    }
  }
}

class Hole {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = gridSize;
    this.tag = 'hole';
  }

  display() {
    fill(0);
    rectMode(CENTER);
    rect(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2, this.size, this.size);
    rectMode(CORNER);
  }
  
  move() {
    // do nothing, holes can't move
  }
  
  interact() {
    // player dies if they fall in the hole
    if (!gameOver) {
      playerHealth = 0;
      timer = 3;
      gameOver = true;
      whatGameOvered = this.tag;
      gameOverRow = this.x;
      gameOverCol = this.y;
    }
  }
  
  hurt(amount) {
    
  }
}

class Door {
  constructor(x, y, direction, gridNum, locked, unlockTag, keycardsNeeded) {
    this.x = x;
    this.y = y;
    this.size = gridSize;
    this.direction = direction; // direction that the door is facing
    this.linkedGrid = gridNum; // links to the next grid
    this.tag = 'door';
    this.locked = locked;
    this.unlockTag = unlockTag;
    this.keycard = keycardsNeeded;
  }

  display() {
    if (this.locked) {
      fill('rgb(121,42,42)');
    } else {
      fill('rgb(32,32,99)');
    }
    
    this.size= gridSize;
    
    if (this.direction == 'left') {
      rect(this.x * gridSize, this.y * gridSize, this.size/12, this.size);
    }
    
    if (this.direction == 'right') {
      rect(this.x * gridSize + gridSize-this.size/12, this.y * gridSize, this.size/12, this.size);
    }
    
    if (this.direction == 'up') {
      rect(this.x * gridSize, this.y * gridSize, this.size, this.size/12);
    }
    
    if (this.direction == 'down') {
      rect(this.x * gridSize, this.y * gridSize + gridSize-this.size/12, this.size, this.size/12);
    }
  }
  
  move() {
    // do nothing, doors can't move
  }
  
  interact() {
    if (!grid[currentGrid].containsObjectWithTag(this.unlockTag) || (keycards == this.keycard && this.keycard != 0)) {
      this.locked = false;
    }
    
    if (!this.locked) {
      door.play();
      currentGrid = this.linkedGrid;

      if (this.direction == 'left') {
        playerRow = gridSquares[currentGrid] - 2;
        player.x = playerRow;
      }

      if (this.direction == 'right') {
        playerRow = 1;
        player.x = playerRow;
      }

      if (this.direction == 'up') {
        playerCol = gridSquares[currentGrid] - 2;
        player.y = playerCol;
      }

      if (this.direction == 'down') {
        playerCol = 1;
        player.y = playerCol;
      }

      grid[currentGrid].clearPlayers();

      timer = 2; // make player immune when entering door

      // console.log('Current grid: ' + currentGrid);
    } else {
      if (this.unlockTag != 'door') {
        displayTextForDuration('This door is locked by the warden', 24);
      } else {
        displayTextForDuration('This door requires more keycards', 24);
      }
    }
  }
  
  hurt(amount) {
    
  }
}

class Keycard {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.tag = 'keycard';
  }

  display() {
    fill(255);
    rect(this.x * gridSize+14, this.y * gridSize+20, 30, 20);
  }
  
  move() {
    // do nothing, holes can't move
  }
  
  interact() {
    keycards++;
    
    grid[currentGrid].placeObject(null, this.x, this.y);
    
    playerHealth = 5;
  }
  
  hurt(amount) {
    
  }
}

class Rocket {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 60;
    this.tag = 'escape';
  }

display() {
  fill(0);
  noStroke();
  // Triangle (top)
  fill('red');
  triangle(
    this.x * gridSize + gridSize / 2 - this.size / 4, this.y * gridSize + gridSize / 2 - this.size / 2, // Top vertex
    this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2 - this.size, // Bottom left vertex
    this.x * gridSize + gridSize / 2 + this.size / 4, this.y * gridSize + gridSize / 2 - this.size / 2 // Bottom right vertex
  );
  
  // Flipped Trapezoid (base)
  fill('#000000');
  quad(
    this.x * gridSize + gridSize / 2 - this.size / 8, this.y * gridSize + gridSize / 2 + this.size * 0.75 / 2-3, // Top left vertex
    this.x * gridSize + gridSize / 2 + this.size / 8, this.y * gridSize + gridSize / 2 + this.size * 0.75 / 2-3, // Top right vertex
    this.x * gridSize + gridSize / 2 + this.size / 4, this.y * gridSize + gridSize / 2 + this.size * 0.75 / 2 + this.size / 4-3, // Bottom right vertex
    this.x * gridSize + gridSize / 2 - this.size / 4, this.y * gridSize + gridSize / 2 + this.size * 0.75 / 2 + this.size / 4-3 // Bottom left vertex
  );

  // Rectangle (body)
  rectMode(CENTER);
  fill('grey');
  rect(this.x * gridSize + gridSize / 2, this.y * gridSize + gridSize / 2-3, this.size / 2, this.size * 0.85);


  rectMode(CORNER);
}
  
  move() {
  }
  
  interact() {
    if (!gameOver) {
      gameOver = true;
      whatGameOvered = this.tag;
      gameOverRow = this.x;
      gameOverCol = this.y;
      
      timer = 3;
    }
  }
  
  hurt(amount) {
  }
}

function displayTextForDuration(text, duration) {
  textToShow = text; // set the text to display
  displayTimer = duration; // set the display timer
}

function keyPressed() {
  let playerMoved = false;
  
  // check if the arrow keys are pressed
  if (keyCode === 87) {
    if (playerCol > 0 && !grid[currentGrid].grid[playerRow][playerCol - 1]) {
      grid[currentGrid].grid[playerRow][playerCol] = null;
      playerCol--; // move left
      player.direction = 'left';
      playerMoved = true;
    } else {
      grid[currentGrid].callInteract(playerRow, playerCol-1);
    }
  } else if (keyCode === 83) {
    if (playerCol < grid[currentGrid].cols - 1 && !grid[currentGrid].grid[playerRow][playerCol + 1]) {
      grid[currentGrid].grid[playerRow][playerCol] = null;
      playerCol++; // move right
      player.direction = 'right';
      playerMoved = true;
    } else {
      grid[currentGrid].callInteract(playerRow, playerCol+1);
    }
  } else if (keyCode === 65) {
    if (playerRow > 0 && !grid[currentGrid].grid[playerRow - 1][playerCol]) {
      grid[currentGrid].grid[playerRow][playerCol] = null;
      playerRow--; // move up
      player.direction = 'up';
      playerMoved = true;
    } else {
      grid[currentGrid].callInteract(playerRow-1, playerCol);
    }
  } else if (keyCode === 68) {
    if (playerRow < grid[currentGrid].rows - 1 && !grid[currentGrid].grid[playerRow + 1][playerCol]) {
      grid[currentGrid].grid[playerRow][playerCol] = null;
      playerRow++; // move down
      player.direction = 'down';
      playerMoved = true;
    } else {
      grid[currentGrid].callInteract(playerRow+1, playerCol);
    }
  } else if (keyCode === UP_ARROW && fireCooldown == 0) {
    // fire laser up
    player.direction = 'left';
    fireLaser(playerRow, playerCol, 'up', player);
  } else if (keyCode === DOWN_ARROW && fireCooldown == 0) {
    // fire laser down
    player.direction = 'right';
    fireLaser(playerRow, playerCol, 'down', player);
  } else if (keyCode === LEFT_ARROW && fireCooldown == 0) {
    // fire laser left
    player.direction = 'up';
    fireLaser(playerRow, playerCol, 'left', player);
  } else if (keyCode === RIGHT_ARROW && fireCooldown == 0) {
    // fire laser right
    player.direction = 'down';
    fireLaser(playerRow, playerCol, 'right', player);
  }

  // if the player's position changed, update the grid
  if (playerMoved) {
    grid[0].placeObject(player, playerRow, playerCol);
  }
}

function fireLaser(row, col, direction, creator, type) {
  if (!gameOver) {
    laser.play();
    
    // if its a player's laser, set a cooldown
    if (creator == player) {
      fireCooldown = 1; // sets timer on how fast the player can shoot
    }
    
    let laserX = row * gridSize + gridSize / 2;
    let laserY = col * gridSize + gridSize / 2;
    
    let pistol = (grid[currentGrid].getObjectTag(row, col) == 'mini-boss' || creator == player);
    
    // the laser's direction
    if (direction === 'up') {
      if (pistol) {
        laserX += 15;
        laserY -= 55;
      }
      laserY = col * gridSize + gridSize / 2 - 15;
    } else if (direction === 'down') {
      if (pistol) {
        laserX -= 15;
        laserY += 55;
      }
      laserY = col * gridSize + gridSize / 2 + 15;
    } else if (direction === 'left') {
      if (pistol) {
        laserX += 55;
        laserY -= 15;
      }
      laserX = row * gridSize + gridSize / 2 - 15;
    } else if (direction === 'right') {
      if (pistol) {
        laserX -= 55;
        laserY += 15;
      }
      laserX = row * gridSize + gridSize / 2 + 15;
    }
    
    // set speed depending on laser type
    let projectileSpeed = 5;
    if (type == 'slow') {
      let projectileSpeed = 2;
    }
    
    let laserWidth = 0;
    let laserHeight = 0;
    
    const interval = setInterval(() => {
      // set laser color
      if (creator == player) {
        fill('rgb(0,255,0)');
      } else {
        fill('red');
      }
      
      // draw the laser
      noStroke();
      rectMode(CENTER);
      rect(laserX, laserY, laserWidth, laserHeight);
      rectMode(CORNER);

      if (direction === 'up') {
        laserY -= projectileSpeed;
        laserWidth = 5;
        if (type == 'slow') {
          laserWidth = 8;
        }
        laserHeight= 15;
      } else if (direction === 'down') {
        laserY += projectileSpeed;
        laserWidth = 5;
        if (type == 'slow') {
          laserWidth = 8;
        }
        laserHeight= 15;
      } else if (direction === 'left') {
        laserX -= projectileSpeed;
        laserHeight = 5;
        if (type == 'slow') {
          laserHeight = 8;
        }
        laserWidth= 15;
      } else if (direction === 'right') {
        laserX += projectileSpeed;
        laserHeight = 5;
        if (type == 'slow') {
          laserHeight = 8;
        }
        laserWidth= 15;
      }

      // check if the projectile has reached the screen boundaries
      if (laserX <= 0 || laserX >= width || laserY <= 0 || laserY >= height) {
        clearInterval(interval); // stop the interval if the projectile is out of bounds
      } else {
        // check if the projectile has hit any object on the grid
        let hitRow = Math.floor(laserX / gridSize);
        let hitCol = Math.floor(laserY / gridSize);

        let current = grid[currentGrid].grid[hitRow][hitCol];

        if (current && current != creator && grid[currentGrid].getObjectTag(hitRow, hitCol) != 'hole' && grid[currentGrid].getObjectTag(hitRow, hitCol) != 'door') {
          // console.log('HIT @ ' + hitRow + " " + hitCol);
          if (creator != player && grid[currentGrid].getObjectTag(hitRow, hitCol) != 'player') {
            clearInterval(interval);
          } else {
            if (type == 'slow') {
              current.hurt(2);
            } else {
              current.hurt(1);
            }
            clearInterval(interval);
          }
        }
      }
    }, 1 );
  }
}

// the player flashes for a few seconds after taking damage
function hurtPlayer(amount) {
  if (timer == 0) {
    punch.play();
    playerHealth -= amount;
    if (playerHealth <= 0) {
      gameOver = true;
      whatGameOvered = this.tag;
      gameOverRow = this.x;
      gameOverCol = this.y;
    }
    timer = 3;
    playerDamaged = true;
    setTimeout(() => {
      playerDamaged = false;
      player.size = 30;
    }, 3000);
  }
}

function beatstepControls() {
  let playerMoved = false;
  
  // check if the arrow keys are pressed
  if (abs.pads[8] != 0) {
    if (playerCol > 0 && !grid[currentGrid].grid[playerRow][playerCol - 1]) {
      grid[currentGrid].grid[playerRow][playerCol] = null;
      playerCol--; // move left
      player.direction = 'left';
      playerMoved = true;
    } else {
      grid[currentGrid].callInteract(playerRow, playerCol-1);
    }
    abs.pads[8] = 0;
  } else if (abs.pads[10] != 0) {
    if (playerCol < grid[currentGrid].cols - 1 && !grid[currentGrid].grid[playerRow][playerCol + 1]) {
      grid[currentGrid].grid[playerRow][playerCol] = null;
      playerCol++; // move right
      player.direction = 'right';
      playerMoved = true;
    } else {
      grid[currentGrid].callInteract(playerRow, playerCol+1);
    }
    abs.pads[10] = 0;
  } else if (abs.pads[1] != 0) {
    if (playerRow > 0 && !grid[currentGrid].grid[playerRow - 1][playerCol]) {
      grid[currentGrid].grid[playerRow][playerCol] = null;
      playerRow--; // move up
      player.direction = 'up';
      playerMoved = true;
    } else {
      grid[currentGrid].callInteract(playerRow-1, playerCol);
    }
    abs.pads[1] = 0;
  } else if (abs.pads[9] != 0) {
    if (playerRow < grid[currentGrid].rows - 1 && !grid[currentGrid].grid[playerRow + 1][playerCol]) {
      grid[currentGrid].grid[playerRow][playerCol] = null;
      playerRow++; // move down
      player.direction = 'down';
      playerMoved = true;
    } else {
      grid[currentGrid].callInteract(playerRow+1, playerCol);
    }
    abs.pads[9] = 0;
  } else if (abs.pads[4] != 0 && fireCooldown == 0) {
    // fire laser up
    player.direction = 'left';
    if (abs.pads[4] > 100) {
      fireLaser(playerRow, playerCol, 'up', player, 'slow');
    } else {
      fireLaser(playerRow, playerCol, 'up', player);
    }
    abs.pads[4] = 0;
  } else if (abs.pads[12] != 0 && fireCooldown == 0) {
    // fire laser down
    player.direction = 'right';
    if (abs.pads[12] > 100) {
      fireLaser(playerRow, playerCol, 'down', player, 'slow');
    } else {
      fireLaser(playerRow, playerCol, 'down', player);
    }
    abs.pads[12] = 0;
  } else if (abs.pads[11] != 0 && fireCooldown == 0) {
    // fire laser left
    player.direction = 'up';
    if (abs.pads[11] > 100) {
      fireLaser(playerRow, playerCol, 'left', player, 'slow');
    } else {
      fireLaser(playerRow, playerCol, 'left', player);
    }
    abs.pads[11] = 0;
  } else if (abs.pads[13] != 0 && fireCooldown == 0) {
    // fire laser right
    player.direction = 'down';
    if (abs.pads[13] > 100) {
      fireLaser(playerRow, playerCol, 'right', player, 'slow');
    } else {
      fireLaser(playerRow, playerCol, 'right', player);
    }
    abs.pads[13] = 0;
  }

  // if the player's position changed, update the grid
  if (playerMoved) {
    grid[0].placeObject(player, playerRow, playerCol);
  }
}