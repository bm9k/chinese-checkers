/**
 * Copyright (c) Benjamin Martin
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HexVector, NEIGHBOURS, CENTRE } from "./hex";
import { StarHexMap } from "./star";
import { PLAYER_COLOURS } from "./colours";

const FIELD_RADIUS = 4;
const ROTATION = 1;

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

    // fill player zones
    for (let i = 0; i < 6; i++) {
        for (const key of grid.outerRegionKeys(i)) {
            grid.set(key, i);
        }
    }
}

function drawEdges(context, edgeVertices) {
    edgeVertices = edgeVertices.map(v => {
        let {x, y} = hexToPixel(v, CELL_WIDTH);
        x += OFFSET.x;
        y += OFFSET.y;

        return {x, y}
    })

    context.beginPath();
    
    const v = edgeVertices[edgeVertices.length - 1];
    context.moveTo(v.x, v.y);

    for (const v of edgeVertices) {
        context.lineTo(v.x, v.y);
    }

    context.stroke()
}

function draw(canvas, grid, edgeVertices) {
    const context = canvas.getContext("2d");

    context.strokeStyle = "#555"

    for (const [key, value] of grid.entries()) {
        const { x: x1, y: y1 } = hexToPixel(key.rotate(ROTATION), CELL_WIDTH);
        const x = x1 + OFFSET.x;
        const y = y1 + OFFSET.y;

        const region = grid.outerRegionId(key);

        const fillColour = value !== null ? PLAYER_COLOURS[value] : "#ddd";

        context.fillStyle = fillColour;
        context.strokeStyle = "black";
        context.beginPath();
        context.arc(x, y, DOT_WIDTH, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        context.textAlign = "center"
        context.strokeText(`(${key.q}, ${key.r}, ${key.s})`, x, y);

        if (region !== null) {
            context.strokeText(region, x, y + 17);
        }
    }

    drawEdges(context, edgeVertices);
}

function calculateEdges(grid, padding = 0.75, tipFlatness = 0.7) {
    // draw edges
    let vertices = []
    const size = grid.innerRadius;

    for (let i = 0; i < 6; i++) {
        const fieldCornerDirection = NEIGHBOURS[i];
        const tipDirection1 = NEIGHBOURS[(i + 1) % 6];
        const tipDirection2 = NEIGHBOURS[(i + 2) % 6];

        const fieldCorner = CENTRE.add(fieldCornerDirection.scale(size + padding));
        vertices.push(fieldCorner);

        const v2 = fieldCorner.add(tipDirection1.scale(size - tipFlatness + padding));
        vertices.push(v2);

        if (tipFlatness > 0) {
            const v3 = v2.add(tipDirection2.scale(tipFlatness));
            vertices.push(v3);
        }
    }

    return vertices
}

function main() {
    const canvas = document.getElementById("sternhalma");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const grid = new StarHexMap(FIELD_RADIUS);
    const edgeVertices = calculateEdges(grid);

    addTestValues(grid, testValues)

    draw(canvas, grid, edgeVertices);
}

main();