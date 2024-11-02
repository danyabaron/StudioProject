setup.p5promise = importScripts([
    "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/p5.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/addons/p5.dom.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/addons/p5.sound.min.js"
    ]);
    
    setup.asteroidGame = function (p) {
        let asteroid;
        let bullets = [];
        let marsImg; // Variable to hold the Mars sprite image
        let mars;    // Variable to hold Mars position and size
    
        // Preload Mars image
        // getting a  CORS error on this
        p.preload = function () {
            marsImg = p.loadImage('./assets/mars-art/mars-art-official.png'); // Adjust path as needed
        };
    
        p.setup = function () {
            const gameContainer = document.getElementById("p5sketch");
            p.createCanvas(600, 400).parent(gameContainer);
            asteroid = new Asteroid();
            mars = { x: p.width / 2, y: p.height - 50, size: 80 }; // Mars position and size
        };
    
        p.draw = function () {
            p.background(0);
    
            // Update and display the asteroid
            asteroid.update();
            asteroid.display();
    
            // Update and display each bullet
            for (let i = bullets.length - 1; i >= 0; i--) {
                bullets[i].update();
                bullets[i].display();
                // Check for collision with asteroid
                if (bullets[i].hits(asteroid)) {
                    asteroid.shrink();
                    bullets.splice(i, 1);  // Remove bullet on hit
                } else if (bullets[i].offscreen()) {
                    bullets.splice(i, 1);  // Remove off-screen bullets
                }
            }
    
            // Display Mars sprite
            p.image(marsImg, mars.x - mars.size / 2, mars.y - mars.size / 2, mars.size, mars.size);
        };
    
        p.keyPressed = function () {
            // Move Mars sprite with left and right arrow keys
            if (p.keyCode === p.LEFT_ARROW) {
                mars.x -= 10; // Move left
            } else if (p.keyCode === p.RIGHT_ARROW) {
                mars.x += 10; // Move right
            }
    
            // Spacebar to shoot
            if (p.key === ' ') {
                let bullet = new Bullet(mars.x, mars.y); // Start bullet at Mars position
                bullets.push(bullet);
            }
        };
    
        // Asteroid class
        class Asteroid {
            constructor() {
                this.x = p.width / 2;
                this.y = 50;
                this.size = 40;
            }
    
            update() {
                this.y += 1;  // Move asteroid downwards
                if (this.y > p.height) this.y = 0; // Reset to top
            }
    
            display() {
                p.fill(200, 100, 100);
                p.ellipse(this.x, this.y, this.size);
            }
    
            shrink() {
                this.size -= 5;
                if (this.size < 20) {
                    this.size = 40;  // Reset size for the loop
                    this.y = 0;      // Reset position for the loop
                }
            }
        }
    
        // Bullet class
        class Bullet {
            constructor(startX, startY) {
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
    };