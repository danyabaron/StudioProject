setup.p5promise = importScripts([
    "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/p5.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/addons/p5.dom.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.1/addons/p5.sound.min.js"
    ]);
    
    setup.asteroidGame = function (p) {
        let asteroid;
        let bullets = [];
    
        p.setup = function () {
            const gameContainer = document.getElementById("p5sketch");
            p.createCanvas(600, 400).parent(gameContainer);
            asteroid = new Asteroid();
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
        };
    
        p.keyPressed = function () {
            // Spacebar to shoot
            if (p.key === ' ') {
                let bullet = new Bullet();
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
            constructor() {
                this.x = p.width / 2;
                this.y = p.height - 50;
                this.r = 8;
                this.speed = 5;
            }
    
            update() {
                this.y -= this.speed;
            }
    
            display() {
                p.fill(255, 0, 0);
                p.noStroke();
                p.ellipse(this.x, this.y, this.r * 2);
            }
    
            hits(asteroid) {
                let d = p.dist(this.x, this.y, asteroid.x, asteroid.y);
                return d < asteroid.size / 2 + this.r;
            }
    
            offscreen() {
                return this.y < 0;
            }
        }
    };
    
    
    