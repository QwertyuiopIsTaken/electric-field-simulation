const titleScreen = document.getElementById("titleScreen");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const settingsBtn = document.getElementById("settingsBtn");
const settingsPanel = document.getElementById("settingsPanel");

const optimizeToggle = document.getElementById("optimizeToggle");
const waveToggle = document.getElementById("waveToggle");

const FIELD_INTERVALS = 20;
const ARROW_HEAD_SIZE = 5;
const ARROW_LENGTH = 15;

let OPTIMIZE = false;
let DISPLAY_WAVE = false;
optimizeToggle.checked = OPTIMIZE;
waveToggle.checked = DISPLAY_WAVE;

let WAVE_LIFESPAN;
let particles = [];
let props = [];
let fieldPoints = [];
let selected = null;

let started = false;
let frameCount = 0;
let mouseX = 0;
let mouseY = 0;

function setup() {
    resizeCanvas();
    requestAnimationFrame(draw);
}

function resetSimulation() {
    particles = [];
    props = [];
    fieldPoints = [];
    selected = null;
    frameCount = 0;

    WAVE_LIFESPAN = Math.max(canvas.width, canvas.height);

    const cols = Math.floor(canvas.width / FIELD_INTERVALS) + 1;
    const rows = Math.floor(canvas.height / FIELD_INTERVALS) + 1;

    fieldPoints = Array.from({ length: cols }, () =>
        Array.from({ length: rows }, () => null)
    );
}

function draw() {
    if (!started) {
        requestAnimationFrame(draw);
        return;
    }

    frameCount++;

    ctx.fillStyle = "rgb(10, 10, 10)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw field arrows
    for (let i = 0; i < fieldPoints.length; i++) {
        for (let j = 0; j < fieldPoints[0].length; j++) {
            if (!fieldPoints[i][j]) {
                continue;
            }

            const fieldPos = {
                x: i * FIELD_INTERVALS,
                y: j * FIELD_INTERVALS
            };

            drawArrow(
                ctx,
                fieldPos,
                fieldPoints[i][j].netForce,
                ARROW_HEAD_SIZE,
                ARROW_LENGTH
            );
        }
    }

    // Draw particles
    for (const p of particles) {
        p.display(ctx);
    }

    // Update propagations
    for (let i = props.length - 1; i >= 0; i--) {
        const pr = props[i];
        if (pr.radius >= pr.lifespan) {
            props.splice(i, 1);
        } else {
            if (DISPLAY_WAVE) {
                pr.display(ctx);
            }
            pr.radius++;
        }
    }

    dragParticle();
    updateField();

    requestAnimationFrame(draw);
}

function dragParticle() {
    if (!selected) {
        return;
    }

    const newPos = {x: mouseX, y: mouseY};

    if (selected.pos.x !== newPos.x || selected.pos.y !== newPos.y) {
        const dir = {
            x: newPos.x - selected.pos.x,
            y: newPos.y - selected.pos.y
        };

        let span = WAVE_LIFESPAN;

        if (OPTIMIZE && props.length > 0) {
            const lastProp = props[props.length - 1];

            if (
                lastProp.propagate &&
                lastProp.pos.x === selected.pos.x &&
                lastProp.pos.y === selected.pos.y &&
                frameCount - 1 === lastProp.frame
            ) {
                props.pop();
                span = 0;
            }
        }

        props.push(
            new Propagation(
                selected.pos.x,
                selected.pos.y,
                -selected.charge,
                false,
                span
            )
        );

        const mag = Math.hypot(dir.x, dir.y);

        if (mag <= 0.5) {
            selected.pos.x = mouseX;
            selected.pos.y = mouseY;

            props.push(
                new Propagation(mouseX, mouseY, selected.charge, true, WAVE_LIFESPAN)
            );
        } else {
            dir.x /= mag;
            dir.y /= mag;

            selected.pos.x += dir.x;
            selected.pos.y += dir.y;

            props.push(
                new Propagation(
                    selected.pos.x,
                    selected.pos.y,
                    selected.charge,
                    true,
                    WAVE_LIFESPAN
                )
            );
        }
    }
}

function updateField() {
    for (let i = 0; i < fieldPoints.length; i++) {
        for (let j = 0; j < fieldPoints[0].length; j++) {
            const fieldPos = {x: i * FIELD_INTERVALS, y: j * FIELD_INTERVALS};

            for (const pr of props) {
                if (pr.containsPoint(fieldPos.x, fieldPos.y)) {
                    let netForce = {x: 0, y: 0};

                    if (fieldPoints[i][j]) {
                        netForce = fieldPoints[i][j].netForce;
                    }

                    const force = calcElectrostaticForce(
                        pr.sourceCharge,
                        pr.pos,
                        fieldPos
                    );

                    netForce = {
                        x: netForce.x + force.x,
                        y: netForce.y + force.y
                    };

                    fieldPoints[i][j] = new FieldPoint(netForce);
                }
            }
        }
    }
}

canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener("mouseup", () => {
    selected = null;
});

canvas.addEventListener("mousedown", e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    if (e.button === 0) {
        for (const p of particles) {
            if (p.isClicked(mouseX, mouseY)) {
                selected = p;
                return;
            }
        }
    }

    let charge = 5;
    if (e.button === 2) {
        charge = -5;
    }

    particles.push(new Particle(mouseX, mouseY, charge));
    props.push(new Propagation(mouseX, mouseY, charge, true, WAVE_LIFESPAN));
});

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    resetSimulation();
}

titleScreen.addEventListener("click", () => {
    started = true;
    titleScreen.style.opacity = "0";
    setTimeout(() => {
        titleScreen.style.display = "none";
    }, 500);
});

canvas.addEventListener("contextmenu", e => e.preventDefault());
window.addEventListener("resize", resizeCanvas);

document.getElementById("clearBtn").addEventListener("click", () => {
    resetSimulation();
});

settingsBtn.addEventListener("click", () => {
    settingsPanel.style.display = settingsPanel.style.display === "flex" ? "none" : "flex";
});
optimizeToggle.addEventListener("change", e => {
    OPTIMIZE = e.target.checked;
});
waveToggle.addEventListener("change", e => {
    DISPLAY_WAVE = e.target.checked;
});

setup();