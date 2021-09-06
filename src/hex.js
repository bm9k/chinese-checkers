/**
 * Copyright (c) Benjamin Martin
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * A coordinate on a 2d hexagonal grid/map
 * 
 * Represented by projecting three primary axes (q, r, s)
 * onto a 2d plane such that q + r + s = 0 (i.e. q, r, s are 120deg apart)
 */
export class HexVector {
    constructor(q, r) {
        this.q = q;
        this.r = r;
        this.s = -(q + r) + 0;  // +0 avoids negative zero
    }

    length() {
        // avoid floats if possible
        return Math.max(Math.abs(this.q), Math.abs(this.r), Math.abs(this.s));
    }

    add(other) {
        return new HexVector(this.q + other.q, this.r + other.r);
    }

    subtract(other) {
        return new HexVector(this.q - other.q, this.r - other.r);
    }

    multiply(factor) {
        return new HexVector(this.q * factor, this.r * factor);
    }

    // alias for multiply
    scale(factor) {
        return new HexVector(this.q * factor, this.r * factor);
    }
}

/**
 * A hexagonal grid/map
 * 
 * A hexagonal (hex) map is made up of a number of rings that radiate out from its centre.
 * A hex map is defined uniquely by its radius, which is the radius of its outermost ring.
 * 
 * The length of a hexagon is its distance away from the centre. A ring of radius k contains all hexagons of length k, exactly.
 * 
 * The centre hexagon is a special ring that has a radius of 0 and contains exactly one hexagon, the centre.
 * The kth ring has a radius k, and contains 6 * radius hexagons.
 * 
 * E.g. a hex map with radius 2 is shown below, with each hexagon showing its length/ring
 *        __
 *     __/2 \__ 
 *  __/2 \__/2 \__
 * /2 \__/1 \__/2 \
 * \__/1 \__/1 \__/
 * /2 \__/0 \__/2 \
 * \__/1 \__/1 \__/
 * /2 \__/1 \__/2 \
 * \__/2 \__/2 \__/
 *    \__/2 \__/
 *       \__/
 * 
 * Hexagonal maps are stored using 2d arrays, which are ~75% space efficient and provide O(1) set/get
 */
export class HexMap {
    /**
     * Create a hexagonal map
     * @param {int} radius - The number of hexagonal rings in the map, radiating out from the centre (which has radius 0)
     * 
     */
    constructor(radius) {
        this.radius = radius;

        // initialise map
        this.cells = [];
        const width = 2 * radius + 1;
        for (let i = 0; i < width; i++) {
            const row = [];

            for (let j = 0; j < width; j++) {
                row.push(null);
            }

            this.cells.push(row);
        }
    }

    /**
     * Checks whether the given coordinate is in the hex map
     * @param {HexVector} hex 
     * @returns {boolean} True, iff hex is in the hex map
     */
    isHexValid(hex) {
        return hex.length() <= this.radius;
    }

    _key(hex) {
        return [hex.q + this.radius, hex.r + this.radius]
    }

    /**
     * Get the value associated with hex coordinate
     * @param {HexVector} hex 
     * @returns {*}
     */
    get(hex) {
        // TODO: ensure hex is in grid?
        const [qKey, rKey] = this._key(hex);
        return this.cells[qKey][rKey];
    }

    /**
     * Set the value associated with hex coordinate
     * @param {HexVector} hex 
     * @oaram {*} value
     */
    set(hex, value) {
        // TODO: ensure hex is in grid?
        const [qKey, rKey] = this._key(hex);
        this.cells[qKey][rKey] = value;
    }
}

// ordered by r -> -q
// TODO: generate this based upon axis orientation choice?
export const NEIGHBOURS = [
    new HexVector(1, 0),
    new HexVector(0, 1),
    new HexVector(-1, 1),
    new HexVector(-1, 0),
    new HexVector(0, -1),
    new HexVector(1, -1),
]
