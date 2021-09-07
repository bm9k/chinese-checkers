import { HexMap, HexVector, NEIGHBOURS } from "./hex";

const RADIUS = 4;

const CELL_WIDTH = 35;
const DOT_WIDTH = 28;

const OFFSET = {
    x: 550,
    y: 500
}

// TODO: calculate this based upon axis definition
// e.g., in this case: q => x,-y; r => +y
// Should it be in a layout/coordinate translator class?
const Q_BASIS = [Math.sqrt(3), 0];
const R_BASIS = [Math.sqrt(3) / 2, 3 / 2];

function hexToPixel(hex, size) {
    const x = size * (Q_BASIS[0] * hex.q + R_BASIS[0] * hex.r);
    const y = size * (Q_BASIS[1] * hex.r + R_BASIS[1] * hex.r);

    return { x, y };
}

const testValues = [
    [2, -2, 0],
    [2, -1, 0],
    [-1, -1, 5],
]

function addTestValues(grid, values) {
    for (const [q, r, value] of values) {
        grid.set(new HexVector(q, r), value);
    }
}

function draw(canvas, grid) {
    const context = canvas.getContext("2d");

    context.strokeStyle = "#555"

    for (const [key, value] of grid.entries()) {
        const { x: x1, y: y1 } = hexToPixel(key, CELL_WIDTH);
        const x = x1 + OFFSET.x;
        const y = y1 + OFFSET.y;

        context.fillStyle = "#ddd";
        context.strokeStyle = "black";
        context.beginPath();
        context.arc(x, y, DOT_WIDTH, 0, Math.PI * 2);
        context.stroke();

        context.textAlign = "center"
        context.strokeText(`(${key.q}, ${key.r}, ${key.s})`, x, y - DOT_WIDTH * .1);
        if (value !== null) {
            context.strokeStyle = "red";
            context.strokeText(value, x, y + DOT_WIDTH * .6);
        }
    }
}

function main() {
    const canvas = document.getElementById("sternhalma");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const grid = new HexMap(RADIUS);

    addTestValues(grid, testValues)

    draw(canvas, grid);
}

main();