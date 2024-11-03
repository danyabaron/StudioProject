setup.p5promise = importScripts([
    "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/p5.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/addons/p5.dom.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/addons/p5.sound.min.js"
    ]);
    
    // setup.asteroidGame = function (p) {
    //     let asteroid;
    //     let bullets = [];
    //     let marsImg; // Variable to hold the Mars sprite image
    //     let mars;    // Variable to hold Mars position and size
    
    //     // Preload Mars image
    //     // getting a  CORS error on this
    //     p.preload = function () {
    //         marsImg = p.loadImage('./assets/mars-art/mars-art-official.png'); // Adjust path as needed
    //     };
    
    //     p.setup = function () {
    //         const gameContainer = document.getElementById("p5sketch");
    //         p.createCanvas(600, 400).parent(gameContainer);
    //         asteroid = new Asteroid();
    //         mars = { x: p.width / 2, y: p.height - 50, size: 80 }; // Mars position and size
    //     };
    
    //     p.draw = function () {
    //         p.background(0);
    
    //         // Update and display the asteroid
    //         asteroid.update();
    //         asteroid.display();
    
    //         // Update and display each bullet
    //         for (let i = bullets.length - 1; i >= 0; i--) {
    //             bullets[i].update();
    //             bullets[i].display();
    //             // Check for collision with asteroid
    //             if (bullets[i].hits(asteroid)) {
    //                 asteroid.shrink();
    //                 bullets.splice(i, 1);  // Remove bullet on hit
    //             } else if (bullets[i].offscreen()) {
    //                 bullets.splice(i, 1);  // Remove off-screen bullets
    //             }
    //         }
    
    //         // Display Mars sprite
    //         p.image(marsImg, mars.x - mars.size / 2, mars.y - mars.size / 2, mars.size, mars.size);
    //     };
    
    //     p.keyPressed = function () {
    //         // Move Mars sprite with left and right arrow keys
    //         if (p.keyCode === p.LEFT_ARROW) {
    //             mars.x -= 10; // Move left
    //         } else if (p.keyCode === p.RIGHT_ARROW) {
    //             mars.x += 10; // Move right
    //         }
    
    //         // Spacebar to shoot
    //         if (p.key === ' ') {
    //             let bullet = new Bullet(mars.x, mars.y); // Start bullet at Mars position
    //             bullets.push(bullet);
    //         }
    //     };
    
    //     // Asteroid class
    //     class Asteroid {
    //         constructor() {
    //             this.x = p.width / 2;
    //             this.y = 50;
    //             this.size = 40;
    //         }
    
    //         update() {
    //             this.y += 1;  // Move asteroid downwards
    //             if (this.y > p.height) this.y = 0; // Reset to top
    //         }
    
    //         display() {
    //             p.fill(200, 100, 100);
    //             p.ellipse(this.x, this.y, this.size);
    //         }
    
    //         shrink() {
    //             this.size -= 5;
    //             if (this.size < 20) {
    //                 this.size = 40;  // Reset size for the loop
    //                 this.y = 0;      // Reset position for the loop
    //             }
    //         }
    //     }
    
    //     // Bullet class
    //     class Bullet {
    //         constructor(startX, startY) {
    //             this.x = startX; // Start bullet at Mars position
    //             this.y = startY;
    //             this.r = 8; // Bullet size
    //             this.speed = 5;
    //         }
    
    //         update() {
    //             this.y -= this.speed; // Move the bullet up
    //         }
    
    //         display() {
    //             p.fill(255, 255, 0); // Yellow bullet color
    //             p.noStroke();
    //             p.ellipse(this.x, this.y, this.r * 2);
    //         }
    
    //         hits(asteroid) {
    //             let d = p.dist(this.x, this.y, asteroid.x, asteroid.y);
    //             return d < asteroid.size / 2 + this.r; // Collision detection
    //         }
    
    //         offscreen() {
    //             return this.y < 0; // Check if the bullet is offscreen
    //         }
    //     }
    // };


    setup.asteroidGame = function (p) {
        let asteroids = [];
        let bullets = [];
        let marsImg; // Variable to hold the Mars sprite image
        let mars;    // Variable to hold Mars position and size
        let score = 0; // Player score
        let finalScore = 2000; // Goal score
        let gameOver = false; // Game state to check if the game is over
    
        // Preload Mars image
        p.preload = function () {
            marsImg = p.loadImage('./assets/mars-art/mars-art-official.png'); // Adjust path as needed
        };
    
        p.setup = function () {
            const gameContainer = document.getElementById("p5sketch");
            p.createCanvas(600, 400).parent(gameContainer);
            
            // Create multiple asteroids with varying speeds
            for (let i = 0; i < 5; i++) {
                asteroids.push(new Asteroid(p));
            }
            
            mars = { x: p.width / 2, y: p.height - 50, size: 80 }; // Mars position and size
        };
    
        p.draw = function () {
            if (gameOver) {
                p.background(0);
                p.fill(255);
                p.textSize(32);
                p.textAlign(p.CENTER, p.CENTER);
                p.text("You Win! Final Score: " + score, p.width / 2, p.height / 2);
                return; // Stop drawing the game elements
            }
            
            p.background(0);
    
            // Display the score
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
                let bullet = new Bullet(p, mars.x, mars.y); // Start bullet at Mars position
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
                this.p.fill(200, 100, 100);
                this.p.ellipse(this.x, this.y, this.size);
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
            constructor(p, startX, startY) {
                this.p = p;
                this.x = startX; // Start bullet at Mars position
                this.y = startY;
                
                this.r = 8; // Bullet size
                this.speed = 5;
            }
    
            update() {
                this.y -= this.speed; // Move the bullet up
            }
    
            display() {
                this.p.fill(255, 255, 0); // Yellow bullet color
                this.p.noStroke();
                this.p.ellipse(this.x, this.y, this.r * 2);
            }
    
            hits(asteroid) {
                let d = this.p.dist(this.x, this.y, asteroid.x, asteroid.y);
                return d < asteroid.size / 2 + this.r; // Collision detection
            }
    
            offscreen() {
                return this.y < 0; // Check if the bullet is offscreen
            }
        }
    };
    