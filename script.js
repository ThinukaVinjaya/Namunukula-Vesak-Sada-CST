/* ==========================================
   AR VESAK ZONE - CST 19TH BATCH
   INTERACTIVE JAVASCRIPT LOGIC
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Custom Cursor Logic ---
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');
    
    let mouseX = 0, mouseY = 0; // Current mouse position
    let cursorX = 0, cursorY = 0; // Current cursor dot position
    let followerX = 0, followerY = 0; // Current follower ring position
    
    // Track mouse movement
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor elements once active
        if (cursor && follower) {
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
        }
    });

    // Custom Cursor Interpolation (Lerp) for smooth lag effect
    function animateCursor() {
        // Dot follows cursor quickly
        const dotLerp = 0.25;
        cursorX += (mouseX - cursorX) * dotLerp;
        cursorY += (mouseY - cursorY) * dotLerp;
        
        // Ring follows cursor slowly
        const ringLerp = 0.09;
        followerX += (mouseX - followerX) * ringLerp;
        followerY += (mouseY - followerY) * ringLerp;
        
        if (cursor) {
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
        }
        
        if (follower) {
            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;
        }
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states for cursor
    const lanternBtn = document.getElementById('btn-lantern');
    const cityBtn = document.getElementById('btn-city');

    function applyCursorClass(addClass, targetCursorClass) {
        if (cursor && follower) {
            if (addClass) {
                cursor.classList.add(targetCursorClass);
                follower.classList.add(targetCursorClass);
            } else {
                cursor.classList.remove(targetCursorClass);
                follower.classList.remove(targetCursorClass);
            }
        }
    }

    if (lanternBtn) {
        lanternBtn.addEventListener('mouseenter', () => applyCursorClass(true, 'hover-lantern'));
        lanternBtn.addEventListener('mouseleave', () => applyCursorClass(false, 'hover-lantern'));
    }

    if (cityBtn) {
        cityBtn.addEventListener('mouseenter', () => applyCursorClass(true, 'hover-city'));
        cityBtn.addEventListener('mouseleave', () => applyCursorClass(false, 'hover-city'));
    }

    // --- 2. Twinkling Stars Generator ---
    const starsContainer = document.getElementById('stars-container');
    const STAR_COUNT = 85;

    if (starsContainer) {
        for (let i = 0; i < STAR_COUNT; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Random parameters
            const size = Math.random() * 2 + 0.5; // Width and height
            const x = Math.random() * 100; // Left offset %
            const y = Math.random() * 75; // Top offset % (only top portion of screen)
            const duration = Math.random() * 4 + 2; // Twinkle duration
            const delay = Math.random() * 5; // Twinkle animation delay
            
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.animationDuration = `${duration}s`;
            star.style.animationDelay = `${delay}s`;
            
            starsContainer.appendChild(star);
        }
    }

    // --- 3. HTML5 Canvas: Floating Traditional Sri Lankan Vesak Lanterns ---
    const canvas = document.getElementById('lanterns-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        let lanterns = [];
        const MAX_LANTERNS = 24;
        
        // Adjust canvas dimensions to fill screen
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Traditional Vesak Lantern class
        class VesakLantern {
            constructor(spawnAtBottom = false) {
                this.reset(spawnAtBottom);
            }
            
            reset(spawnAtBottom = false) {
                this.size = Math.random() * 22 + 12; // Diameter of central octahedron
                this.x = Math.random() * canvas.width;
                this.y = spawnAtBottom ? canvas.height + 60 : Math.random() * canvas.height;
                
                // Speed parameters
                this.speedY = Math.random() * 0.4 + 0.15; // Floating upwards
                this.speedX = 0; // Influenced by wind / mouse
                
                this.opacity = Math.random() * 0.5 + 0.3; // Random starting opacity
                this.targetOpacity = this.opacity;
                
                // Colors - warm glows (orange, golden amber, light yellow, ruby red core)
                const hueOptions = [25, 38, 48, 5, 15];
                this.hue = hueOptions[Math.floor(Math.random() * hueOptions.length)];
                
                // Sway path variables
                this.swaySpeed = Math.random() * 0.015 + 0.005;
                this.swayAmount = Math.random() * 1.5 + 0.5;
                this.swayAngle = Math.random() * Math.PI * 2;
                
                // Streamer (Ralli) parameters - Traditional tails/frills hanging
                this.streamerCount = 3;
                this.streamerLengths = [];
                for (let i = 0; i < this.streamerCount; i++) {
                    this.streamerLengths.push(this.size * (Math.random() * 0.6 + 0.8));
                }
            }
            
            update() {
                // Rise upward
                this.y -= this.speedY;
                
                // Horizontal sway using sine wave
                this.swayAngle += this.swaySpeed;
                this.x += Math.sin(this.swayAngle) * (this.swayAmount * 0.4) + this.speedX;
                
                // Mouse interaction - repel away from user's cursor
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const repelRadius = 150;
                
                if (distance < repelRadius) {
                    const force = (repelRadius - distance) / repelRadius;
                    // Push away in X direction based on force
                    this.speedX += (dx / distance) * force * 0.05;
                } else {
                    // Gradual dampening back to zero side velocity
                    this.speedX *= 0.95;
                }
                
                // Fade out as it reaches the top of the canvas
                if (this.y < canvas.height * 0.25) {
                    this.opacity -= 0.002;
                }
                
                // Reset if completely off screen or faded out
                if (this.y < -80 || this.opacity <= 0 || this.x < -40 || this.x > canvas.width + 40) {
                    this.reset(true);
                }
            }
            
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                
                // 1. Draw glowing ambient halo behind the lantern
                const glowGradient = ctx.createRadialGradient(
                    this.x, this.y, 1,
                    this.x, this.y, this.size * 2.8
                );
                glowGradient.addColorStop(0, `hsla(${this.hue}, 100%, 65%, 0.4)`);
                glowGradient.addColorStop(0.3, `hsla(${this.hue}, 100%, 55%, 0.15)`);
                glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.fillStyle = glowGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2.8, 0, Math.PI * 2);
                ctx.fill();
                
                // 2. Draw traditional hanging side small lanterns
                const sideDist = this.size * 0.75;
                this.drawSmallLantern(this.x - sideDist, this.y + this.size * 0.3, this.size * 0.35);
                this.drawSmallLantern(this.x + sideDist, this.y + this.size * 0.3, this.size * 0.35);
                
                // 3. Draw streamers/frills (Vesak Ralli) at the bottom corner nodes
                ctx.strokeStyle = `hsla(${this.hue}, 100%, 75%, 0.75)`;
                ctx.lineWidth = Math.max(1, this.size * 0.06);
                ctx.lineCap = 'round';
                
                // Streamer attachments points: left corner, bottom corner, right corner
                const attachments = [
                    { x: this.x - this.size * 0.5, y: this.y + this.size * 0.3 }, // Left corner
                    { x: this.x, y: this.y + this.size * 1.0 },                 // Bottom corner
                    { x: this.x + this.size * 0.5, y: this.y + this.size * 0.3 }  // Right corner
                ];
                
                attachments.forEach((pt, index) => {
                    const len = this.streamerLengths[index];
                    ctx.beginPath();
                    ctx.moveTo(pt.x, pt.y);
                    
                    // Wave simulation using sine wave based on time/sway
                    const waveOffset = Math.sin(this.swayAngle * 1.8 + index * 1.5) * (this.size * 0.18);
                    
                    // Draw a wavy bezier curve for the traditional streamer
                    ctx.bezierCurveTo(
                        pt.x + waveOffset * 0.5, pt.y + len * 0.3,
                        pt.x - waveOffset * 0.5, pt.y + len * 0.6,
                        pt.x + waveOffset, pt.y + len
                    );
                    ctx.stroke();
                });
                
                // 4. Draw main center octahedron (diamond/hexagon structure)
                ctx.fillStyle = `hsla(${this.hue}, 100%, 55%, 0.85)`;
                ctx.strokeStyle = `hsla(${this.hue}, 100%, 80%, 0.95)`;
                ctx.lineWidth = Math.max(1.5, this.size * 0.08);
                ctx.lineJoin = 'round';
                
                // Draw traditional diamond panels
                ctx.beginPath();
                // Top point
                ctx.moveTo(this.x, this.y - this.size * 0.95);
                // Right corner
                ctx.lineTo(this.x + this.size * 0.75, this.y - this.size * 0.15);
                // Bottom-right point
                ctx.lineTo(this.x + this.size * 0.5, this.y + this.size * 0.3);
                // Bottom center point
                ctx.lineTo(this.x, this.y + this.size * 1.0);
                // Bottom-left point
                ctx.lineTo(this.x - this.size * 0.5, this.y + this.size * 0.3);
                // Left corner
                ctx.lineTo(this.x - this.size * 0.75, this.y - this.size * 0.15);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Draw inner dividing structure lines (makes it look 3D and authentic)
                ctx.beginPath();
                // Vertical center beam
                ctx.moveTo(this.x, this.y - this.size * 0.95);
                ctx.lineTo(this.x, this.y + this.size * 1.0);
                // Horizontal cross beams
                ctx.moveTo(this.x - this.size * 0.75, this.y - this.size * 0.15);
                ctx.lineTo(this.x + this.size * 0.75, this.y - this.size * 0.15);
                
                ctx.moveTo(this.x - this.size * 0.5, this.y + this.size * 0.3);
                ctx.lineTo(this.x + this.size * 0.5, this.y + this.size * 0.3);
                
                ctx.strokeStyle = `hsla(${this.hue}, 100%, 35%, 0.4)`;
                ctx.stroke();
                
                // Inner bright glowing light core
                const coreGlow = ctx.createRadialGradient(
                    this.x, this.y - this.size * 0.1, 1,
                    this.x, this.y - this.size * 0.1, this.size * 0.4
                );
                coreGlow.addColorStop(0, '#ffffff');
                coreGlow.addColorStop(0.5, `hsla(${this.hue}, 100%, 85%, 0.95)`);
                coreGlow.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);
                
                ctx.fillStyle = coreGlow;
                ctx.beginPath();
                ctx.arc(this.x, this.y - this.size * 0.1, this.size * 0.45, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
            
            drawSmallLantern(cx, cy, radius) {
                ctx.save();
                
                // Glow behind small lantern
                const smGlow = ctx.createRadialGradient(cx, cy, 1, cx, cy, radius * 2);
                smGlow.addColorStop(0, `hsla(${this.hue}, 100%, 65%, 0.3)`);
                smGlow.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = smGlow;
                ctx.beginPath();
                ctx.arc(cx, cy, radius * 2, 0, Math.PI * 2);
                ctx.fill();
                
                // Small diamond structure
                ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, 0.8)`;
                ctx.strokeStyle = `hsla(${this.hue}, 100%, 85%, 0.9)`;
                ctx.lineWidth = Math.max(1, radius * 0.08);
                
                ctx.beginPath();
                ctx.moveTo(cx, cy - radius);
                ctx.lineTo(cx + radius * 0.8, cy);
                ctx.lineTo(cx, cy + radius);
                ctx.lineTo(cx - radius * 0.8, cy);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                
                // Tiny streamers hanging from small lantern
                ctx.strokeStyle = `hsla(${this.hue}, 100%, 75%, 0.6)`;
                ctx.beginPath();
                ctx.moveTo(cx, cy + radius);
                ctx.lineTo(cx, cy + radius + radius * 1.2);
                ctx.stroke();
                
                ctx.restore();
            }
        }
        
        // Initialize lanterns
        for (let i = 0; i < MAX_LANTERNS; i++) {
            lanterns.push(new VesakLantern(false)); // Distribute throughout the height initially
        }
        
        // Main Loop
        function loop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            lanterns.forEach(lantern => {
                lantern.update();
                lantern.draw();
            });
            
            requestAnimationFrame(loop);
        }
        loop();
    }


});
