console.log('before i import script');
setup.p5promise = importScripts([
	"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/p5.min.js",
	"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/addons/p5.dom.min.js",
	"https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/addons/p5.sound.min.js"

]);

console.log('after upload script');





console.log('before game runs');
setup.asteroidGame = function (p) {
        let asteroids = [];
        let bullets = [];
        let marsImg; // Variable to hold the Mars sprite image
        let asteroidImg;
        let mars;    // Variable to hold Mars position and size
        let score = 0; // Player score
        let finalScore = 2000; // Goal score
        let gameOver = false; // Game state to check if the game is over
    
        // Preload Mars image
        p.preload = function () {
            marsImg = p.loadImage('./assets/mars-art/mars-art-official.png'); 
            asteroidImg = p.loadImage('./assets/asteroid-art/asteroid-sprite1.png');
        };
    
        p.setup = function () {
            const gameContainer = document.getElementById("mars-game");
            p.createCanvas(800, 400).parent(gameContainer);
            
            

            
            // Create multiple asteroids with varying speeds
            for (let i = 0; i < 5; i++) {
                asteroids.push(new Asteroid(p));
            }
            
            mars = { x: p.width / 2, y: p.height - 50, size: 80 }; // Mars position and size
        };
    
        p.draw = function () {
            console.log(p.width, p.height);
            
            // p.clear();
            // p.background(255, 0, 0);
         


            // console.log(Story.get('mars-venus'));
            if (gameOver) {
                p.background(0);
                p.fill(255);
                p.textSize(32);
                p.textAlign(p.CENTER, p.CENTER);
                p.text("You Win! Final Score: " + score, p.width / 2, p.height / 2);


                
                console.log(Story.get('mars-venus')); // Logs the passage object if it exists
                    if (Story.get('after-mars-game-1')) {
                        console.log('going to story');
                        Engine.play('after-mars-game-1');
                        p.noLoop();
                    } else {
                console.error('Passage "mars-venus" does not exist.');
                }    

                return; // Stop drawing the game elements

            }
            
            p.background(0);
           
            // // Display the score
            p.fill(255);
            p.textSize(24);
            p.text("Score: " + score, 10, 30);
            p.text("Goal Score: " + finalScore, 400, 30); // Display the goal score
    
            // Move Mars left or right based on key input
            if (p.keyIsDown(p.LEFT_ARROW)) {
                mars.x -= 3; // Move left
            }
            if (p.keyIsDown(p.RIGHT_ARROW)) {
                mars.x += 3; // Move right
            }
    
            // Update and display each asteroid
            for (let asteroid of asteroids) {
                asteroid.update();
                asteroid.display();
    
                // Check if asteroid hits Mars
                if (asteroid.hitsMars(mars)) {
                    score -= 50; // Decrease score on collision with Mars
                    asteroid.reset(); // Reset asteroid position and size
                }
            }
    
            // Update and display each bullet
            for (let i = bullets.length - 1; i >= 0; i--) {
                bullets[i].update();
                bullets[i].display();
    
                // Check for collision with each asteroid
                for (let j = asteroids.length - 1; j >= 0; j--) {
                    if (bullets[i].hits(asteroids[j])) {
                        asteroids[j].shrink();
                        score += 100; // Increase score on hit
                        bullets.splice(i, 1);  // Remove bullet on hit
                        break; // Exit inner loop after hit
                    }
                }
    
                // Check if the bullet is offscreen and remove it if so
                if (bullets[i] && bullets[i].offscreen()) { // Ensure bullet exists before calling offscreen
                    bullets.splice(i, 1);  // Remove off-screen bullets
                }
            }
    
            // Check if score has reached final score
            if (score >= finalScore) {
                gameOver = true; // Set game over to true
            }
    
            // Display Mars sprite
            p.image(marsImg, mars.x - mars.size / 2, mars.y - mars.size / 2, mars.size, mars.size);
        };
    
        p.keyPressed = function () {
            // Spacebar to shoot
            if (p.key === ' ') {
                let bullet = new Bullet(mars.x, mars.y); // Start bullet at Mars position
                bullets.push(bullet);
            }
        };
    
        // Asteroid class
        class Asteroid {
            constructor(p) {
                this.p = p; // Reference to p5 instance
                this.reset();
            }
    
            // Reset asteroid position, size, and speed
            reset() {
                this.x = this.p.random(this.p.width);
                this.y = this.p.random(this.p.height / 2); // Start in the top half
                this.size = 40;
                this.xSpeed = this.p.random(-2, 2);
                this.ySpeed = this.p.random(1, 3);
            }
    
            update() {
                // Move asteroid sporadically
                this.x += this.xSpeed;
                this.y += this.ySpeed;
    
                // Check boundaries and reverse direction if hit
                if (this.x < 0 || this.x > this.p.width) this.xSpeed *= -1;
                if (this.y < 0 || this.y > this.p.height / 1.3) this.ySpeed *= -1; // Limit movement to the top half 
            }
    
            display() {
                
                    // Display the asteroid image instead of an ellipse
                    this.p.image(asteroidImg, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
                
            }
    
            shrink() {
                this.size -= 5;
                if (this.size < 20) {
                    this.reset(); // Reset asteroid if it shrinks too much
                }
            }
    
            hitsMars(mars) {
                let d = this.p.dist(this.x, this.y, mars.x, mars.y);
                return d < (this.size / 2 + mars.size / 2); // Collision detection with Mars
            }
        }
    
        // Bullet class
        class Bullet {
            
            constructor(startX, startY) {
                // this.p = p;
                this.x = startX; // Start bullet at Mars position
                this.y = startY;
                this.r = 8; // Bullet size
                this.speed = 5;
            }
    
            update() {
                this.y -= this.speed; // Move the bullet up
            }
    
            display() {
                p.fill(255, 255, 0); // Yellow bullet color
                p.noStroke();
                p.ellipse(this.x, this.y, this.r * 2);
            }
    
            hits(asteroid) {
                let d = p.dist(this.x, this.y, asteroid.x, asteroid.y);
                return d < asteroid.size / 2 + this.r; // Collision detection
            }
    
            offscreen() {
                return this.y < 0; // Check if the bullet is offscreen
            }
        }

        console.log('set up bullet');
    };

console.log('after mars game runs');
    
    


setup.jupiterGame = function (p) {
    let asteroids = [];           // Array to hold multiple asteroids
    let jupiter;
    let asteroidSpeed = 0.2;      // Speed at which the asteroids approach
    let waveEffect = 50;          // Amount to push back the asteroid on correct key press
    let waveTimer = 60;           // Timer for generating "wave" instructions
    let nextKey = "";             // Next key the player should press to generate a wave
    let score = 0;                // Player score based on successful key presses
    let gameOver = false;
    let gameWon = false;          // Track if the player has won
    let minWaveTimer = 20;        // Minimum time for wave timer (to cap the difficulty)
    let asteroidImg, jupiterImg;

    p.preload = function () {
        jupiterImg = p.loadImage('./assets/jupiter-art/jupiter-art.png'); 
        asteroidImg = p.loadImage('./assets/asteroid-art/asteroid-sprite1.png');
    };

    p.setup = function() {
        p.createCanvas(600, 400);
        jupiter = { x: p.width /2, y: p.height - 50, size: 150 };

        // Create multiple asteroids with varying initial positions
        for (let i = 0; i < 5; i++) {
            asteroids.push({
                x: p.random(p.width),
                y: p.random(50, 150),  // Start asteroids at different heights
                size: 40
            });
        }

        generateNextKey();  // Set the first key for the player to press
        p.textSize(16);
        p.textAlign(p.CENTER, p.CENTER);
    }

    p.draw = function() {
        p.background(0);


        // Draw Jupiter
        p.image(jupiterImg, jupiter.x - jupiter.size / 2, jupiter.y - jupiter.size / 2, jupiter.size, jupiter.size);


        // Draw Asteroids
        for (let asteroid of asteroids) {
            p.image(asteroidImg, asteroid.x - asteroid.size / 2, asteroid.y - asteroid.size / 2, asteroid.size, asteroid.size);
        }

        // Display wave instruction
        p.fill(255);
        p.text("Press '" + nextKey + "' to emit a cosmic wave!", p.width / 2, p.height / 2);

        // Display score
        p.text("Score: " + score, p.width / 2, 30);

        // Update positions of asteroids
        updateAsteroidPositions();

        // Check for game win or game over condition
        if (gameOver) {
            endGame("Game Over! One of the asteroids reached Jupiter.");
            console.log(Story.get('mars-venus')); // Logs the passage object if it exists
            if (Story.get('jupiter-saturn')) {
                console.log('going to story');
                Engine.play('jupiter-saturn');
                p.noLoop();
            } else {
        console.error('Passage "mars-venus" does not exist.');
        }   

        } else if (gameWon) {
            endGame("You Win! All asteroids were pushed away.");
          
            if (Story.get('saturn-jupiter')) {
                console.log('going to story');
                Engine.play('saturn-jupiter');
                p.noLoop();
            } else {
        console.error('Passage "mars-venus" does not exist.');
        }   
        }
    }

    function updateAsteroidPositions() {
        // Move each asteroid closer over time
        for (let asteroid of asteroids) {
            asteroid.y += asteroidSpeed;
        }

        // Check if any asteroid reaches Jupiter (game over condition)
        for (let asteroid of asteroids) {
            if (asteroid.y >= jupiter.y - jupiter.size / 2) {
                gameOver = true;
                break;
            }
        }

        // Check if all asteroids go off the top of the screen (win condition)
        let allAsteroidsGone = true;
        for (let asteroid of asteroids) {
            if (asteroid.y >= 0) {
                allAsteroidsGone = false;
                break;
            }
        }

        if (allAsteroidsGone) {
            gameWon = true;
        }

        // Update wave timer for next key prompt
        waveTimer--;
        if (waveTimer <= 0) {
            generateNextKey();
            waveTimer = p.max(waveTimer - 2, minWaveTimer); // Reduce waveTimer but cap it at minWaveTimer
        }
    }

    p.keyPressed = function() {
        // Check if the correct key is pressed (convert both to uppercase for consistency)
        if (p.key.toUpperCase() === nextKey && !gameOver && !gameWon) {
            // Push all asteroids back
            for (let asteroid of asteroids) {
                asteroid.y -= waveEffect;
            }
            score += 10;  // Increase score for successful wave
            console.log("Wave emitted! Asteroids pushed back."); // Debug message
            waveTimer = p.max(waveTimer - 5, minWaveTimer); // Speed up wave generation on success
            generateNextKey(); // Generate a new key to press
        } else {
            console.log("Wrong key or game over."); // Debug message if key was incorrect
        }
    }

    function generateNextKey() {
        // Randomly choose a new key to press (e.g., 'A', 'S', 'D', or 'W')
        const keys = ["A", "S", "D", "W"];
        nextKey = p.random(keys);
    }

    function endGame(message) {
        p.background(0);
        p.fill(255);
        p.textSize(32);
        p.text(message, p.width / 2, p.height / 2 - 20);
        p.text("Final Score: " + score, p.width / 2, p.height / 2 + 20);
        p.noLoop();  // Stop the game loop
    }

    console.log('set up Jupiter game');
};

console.log('after Jupiter game runs');
  