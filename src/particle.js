class Particle {
    constructor(x, y, charge) {
        this.pos = {x: x, y: y};
        this.charge = charge;
        this.radius = 10;

        if (charge > 0) {
            this.color = "rgb(200, 0, 0)";
        } else {
            this.color = "rgb(0, 0, 200)";
        }
    }

    display(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    isClicked(x, y) {
        const dx = x - this.pos.x;
        const dy = y - this.pos.y;
        const distance = Math.hypot(dx, dy);
        return distance <= this.radius;
    }
}