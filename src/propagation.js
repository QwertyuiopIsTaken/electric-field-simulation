class Propagation {
    constructor(x, y, charge, propagate, lifespan) {
        this.pos = {x: x, y: y};
        this.sourceCharge = charge;
        this.propagate = propagate;
        this.frame = frameCount;
        this.lifespan = lifespan;
        this.radius = 0;
    }

    display(ctx) {
        ctx.beginPath();

        if (this.propagate) {
            ctx.strokeStyle = "rgb(255, 0, 0)";
        } else {
            ctx.strokeStyle = "rgb(0, 255, 0)";
        }

        ctx.lineWidth = 2;
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
        ctx.stroke();
    }

    containsPoint(x, y) {
        const dx = x - this.pos.x;
        const dy = y - this.pos.y;
        const distance = Math.hypot(dx, dy);

        return Math.floor(distance) == this.radius;
    }
}