function drawArrow(ctx, base, vec, arrowSize, arrowLength) {
    const mag = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    const amt = map(mag, 0, 10, 0, 1);
    const color = lerpGray(10, 255, amt);

    // Normalize vector
    const len = Math.hypot(vec.x, vec.y) || 1;
    const v = {
        x: (vec.x / len) * arrowLength,
        y: (vec.y / len) * arrowLength
    };

    ctx.strokeStyle = color;
    ctx.lineWidth = 1;

    // Main arrow line
    ctx.beginPath();
    ctx.moveTo(base.x - v.x / 2, base.y - v.y / 2);
    ctx.lineTo(base.x + v.x / 2, base.y + v.y / 2);
    ctx.stroke();

    // Arrowhead
    const angle = Math.atan2(v.y, v.x);
    const tipX = base.x + v.x / 2;
    const tipY = base.y + v.y / 2;

    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(
        tipX - arrowSize * Math.cos(angle - Math.PI / 6),
        tipY - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(
        tipX - arrowSize * Math.cos(angle + Math.PI / 6),
        tipY - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
}

function calcElectrostaticForce(charge, pos1, pos2) {
    // F = kQq / r^2 (q = 1)
    const k_constant = 9000;

    const dir = {
        x: pos2.x - pos1.x,
        y: pos2.y - pos1.y
    };

    const r = Math.hypot(dir.x, dir.y) || 1;
    return {
        x: (dir.x / r) * charge * k_constant / (r * r),
        y: (dir.y / r) * charge * k_constant / (r * r)
    };
}

function map(value, inMin, inMax, outMin, outMax) {
    return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function lerpGray(c1, c2, t) {
    const v = Math.round(lerp(c1, c2, t));
    return `rgb(${v}, ${v}, ${v})`;
}
