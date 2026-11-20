
const canvas = document.getElementById("flowerCanvas");
const ctx = canvas.getContext("2d");

const music = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
const enterButton = document.getElementById("enterButton");
const welcomeScreen = document.getElementById("welcomeScreen");

const W = 900;
const H = 650;
const CELL_W = 6;
const CELL_H = 9;

canvas.width = W;
canvas.height = H;

const art = document.createElement("canvas");
art.width = W;
art.height = H;

const g = art.getContext("2d");

const flowers = [
    {x: 285, y: 205, color: "#eee5d4", size: 0.85, phase: 1},
    {x: 390, y: 165, color: "#ed354b", size: 1.05, phase: 2},
    {x: 535, y: 205, color: "#e9c65d", size: 0.85, phase: 3},
    {x: 650, y: 300, color: "#d65a9c", size: 0.9, phase: 4},
    {x: 335, y: 370, color: "#d98bc9", size: 1.15, phase: 5},
    {x: 545, y: 400, color: "#eee4d2", size: 1.2, phase: 6},
    {x: 700, y: 510, color: "#ed354b", size: 0.55, phase: 7},
    {x: 215, y: 515, color: "#d8b84d", size: 0.65, phase: 8},
    {x: 155, y: 340, color: "#e9a947", size: 0.65, phase: 9}
];

const glyphs = ".,:;!|/\\-+=*ox%#@";

const FLOWER_DELAY = 1200;
const FLOWER_DURATION = 1800;

let animationStarted = false;
let startTime = 0;
let musicStarted = false;

function hexToRgb(hex) {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
    };
}

function petalPath(length, width) {
    g.beginPath();
    g.moveTo(0, 0);

    g.bezierCurveTo(
        -width, -length * 0.3,
        -width * 0.65, -length * 0.85,
        0, -length
    );

    g.bezierCurveTo(
        width * 0.65, -length * 0.85,
        width, -length * 0.3,
        0, 0
    );

    g.closePath();
}

function drawFlower(f, time, opacity) {
    const sway = Math.sin(time * 0.0007 + f.phase) * 5;
    const x = f.x + sway;
    const y = f.y;
    const s = f.size;

    g.save();
    g.globalAlpha = opacity;
    g.translate(x, y);

    for (let i = 0; i < 6; i++) {
        const angle = i * Math.PI / 3;
        const length = (85 + (i % 2) * 27) * s;
        const width = 35 * s;

        g.save();
        g.rotate(angle);

        const gradient = g.createLinearGradient(0, 0, 0, -length);

        gradient.addColorStop(0, "#8f3447");
        gradient.addColorStop(0.3, f.color);
        gradient.addColorStop(0.8, f.color);
        gradient.addColorStop(1, "#fff1dc");

        g.fillStyle = gradient;
        petalPath(length, width);
        g.fill();

        g.strokeStyle = "rgba(255,245,225,0.4)";
        g.lineWidth = 1.2;

        g.beginPath();
        g.moveTo(0, -5);
        g.quadraticCurveTo(
            4 * s, -length * 0.5,
            0, -length + 5
        );
        g.stroke();

        for (let j = 0; j < 5; j++) {
            g.fillStyle = "rgba(90,30,40,0.45)";
            g.beginPath();

            g.arc(
                Math.sin(j * 7 + i) * 12 * s,
                -length * (0.28 + j * 0.09),
                1.8 * s,
                0, Math.PI * 2
            );

            g.fill();
        }

        g.restore();
    }

    g.fillStyle = "#d6a33c";
    g.beginPath();
    g.arc(0, 0, 9 * s, 0, Math.PI * 2);
    g.fill();

    for (let i = 0; i < 5; i++) {
        const a = i * Math.PI * 2 / 5;
        const sx = Math.cos(a) * 23 * s;
        const sy = Math.sin(a) * 23 * s;

        g.strokeStyle = "#f4d98d";
        g.lineWidth = 2;

        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(sx, sy);
        g.stroke();

        g.fillStyle = "#b77828";
        g.beginPath();
        g.ellipse(sx, sy, 4 * s, 7 * s, a, 0, Math.PI * 2);
        g.fill();
    }

    g.restore();
}

function drawStems(time, progress) {
    g.save();
    g.globalAlpha = progress;
    g.lineCap = "round";

    flowers.forEach((f, i) => {
        const sway = Math.sin(time * 0.0007 + f.phase) * 5;

        g.strokeStyle = "#4caa58";
        g.lineWidth = 5;

        g.beginPath();
        g.moveTo(f.x + sway, f.y + 12);
        g.bezierCurveTo(
            f.x - 20, f.y + 130,
            470 + i * 8, 540,
            455 + i * 5, 625
        );
        g.stroke();
    });

    for (let i = 0; i < 13; i++) {
        const x = 280 + i * 53;
        const y = 475 + (i % 3) * 35;
        const direction = i % 2 === 0 ? -1 : 1;

        g.save();
        g.translate(x, y);
        g.scale(direction, 1);

        const gradient = g.createLinearGradient(0, 0, 70, -30);
        gradient.addColorStop(0, "#256d39");
        gradient.addColorStop(1, "#8ed66c");

        g.fillStyle = gradient;
        g.beginPath();
        g.moveTo(0, 0);
        g.quadraticCurveTo(30, -65, 85, -30);
        g.quadraticCurveTo(50, 5, 0, 0);
        g.fill();

        g.strokeStyle = "#a2d98a";
        g.lineWidth = 1;

        g.beginPath();
        g.moveTo(0, 0);
        g.lineTo(80, -30);
        g.stroke();

        g.restore();
    }

    g.restore();
}

function drawBuds(time, progress) {
    const buds = [
        [350, 60, "#c6a85b"],
        [475, 45, "#bd6681"],
        [580, 65, "#d7a0a1"]
    ];

    g.save();
    g.globalAlpha = progress;

    buds.forEach(([x, y, color], i) => {
        g.strokeStyle = "#4a9a54";
        g.lineWidth = 4;

        g.beginPath();
        g.moveTo(x, y + 35);
        g.quadraticCurveTo(x + 5, y + 90, x, y + 150);
        g.stroke();

        g.fillStyle = color;
        g.beginPath();

        g.ellipse(
            x,
            y + Math.sin(time * 0.001 + i) * 2,
            12, 40, 0.12, 0, Math.PI * 2
        );

        g.fill();
    });

    g.restore();
}

function drawASCII() {
    const cols = Math.floor(W / CELL_W);
    const rows = Math.floor(H / CELL_H);

    const pixels = g.getImageData(0, 0, W, H).data;

    ctx.clearRect(0, 0, W, H);
    ctx.font = "9px monospace";
    ctx.textBaseline = "top";

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let r = 0, green = 0, b = 0;
            let count = 0;

            for (let py = 0; py < CELL_H; py += 2) {
                for (let px = 0; px < CELL_W; px += 2) {
                    const index = (
                        (row * CELL_H + py) * W +
                        col * CELL_W + px
                    ) * 4;

                    r += pixels[index];
                    green += pixels[index + 1];
                    b += pixels[index + 2];
                    count++;
                }
            }

            r /= count;
            green /= count;
            b /= count;

            const brightness = (r + green + b) / 3;

            if (brightness < 12) continue;

            const glyphIndex = Math.min(
                glyphs.length - 1,
                Math.floor(brightness / 256 * glyphs.length)
            );

            const glyph = glyphs[glyphIndex];

            ctx.fillStyle = `rgb(${r},${green},${b})`;
            ctx.shadowColor = `rgb(${r},${green},${b})`;
            ctx.shadowBlur = 3;

            ctx.fillText(
                glyph,
                col * CELL_W,
                row * CELL_H
            );
        }
    }

    ctx.shadowBlur = 0;
}

function animate(time) {
    if (!animationStarted) return;

    const elapsed = time - startTime;

    g.fillStyle = "#050307";
    g.fillRect(0, 0, W, H);

    // Stems and leaves appear first
    const plantProgress = Math.min(1, elapsed / 2500);
    drawStems(time, plantProgress);

    // Buds appear after the plants begin growing
    const budProgress = Math.max(
        0,
        Math.min(1, (elapsed - 1000) / 1800)
    );

    drawBuds(time, budProgress);

    // Flowers appear one by one
    flowers.forEach((flower, index) => {
        const delay = 2500 + index * FLOWER_DELAY;

        const progress = Math.max(
            0,
            Math.min(
                1,
                (elapsed - delay) / FLOWER_DURATION
            )
        );

        if (progress > 0) {
            drawFlower(flower, time, progress);
        }
    });

    drawASCII();

    requestAnimationFrame(animate);
}

// Start music and animation together
enterButton.addEventListener("click", async () => {
    if (animationStarted) return;

    try {
        await music.play();

        musicStarted = true;
        animationStarted = true;
        startTime = performance.now();

        musicButton.textContent = "♫ Pause Music";

        welcomeScreen.classList.add("hide");

        setTimeout(() => {
            welcomeScreen.style.display = "none";
        }, 1000);

        requestAnimationFrame(animate);

    } catch (error) {
        alert("Unable to play music. Please check your music.mp3 file and try again.");
    }
});

// Music control
musicButton.addEventListener("click", async () => {
    if (!musicStarted) return;

    if (music.paused) {
        try {
            await music.play();
            musicButton.textContent = "♫ Pause Music";
        } catch (error) {
            console.log("Unable to play music", error);
        }
    } else {
        music.pause();
        musicButton.textContent = "♫ Play Music";
    }
});
