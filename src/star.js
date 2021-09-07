/**
 * Copyright (c) Benjamin Martin
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CENTRE, HexMap, NEIGHBOURS } from "./hex";

/**
 * A representation of a hex map bounded by a star shape, such as is used 
 * for Chinese checkers.
 * 
 * The inner radius is the radius of the inner hexagonal region, which also 
 * defines the size of the triangular point regions
 * 
 * This is effectively a hex map of radius = 2 * inner radius, with parts of 
 * the outer rings "disabled" to form a star shape
 */
export class StarHexMap extends HexMap {
    constructor(innerRadius) {
        super(2 * innerRadius);
        this.innerRadius = innerRadius;
    }

    *ringKeys(radius) {
        if (radius > this.innerRadius) {
            const playerRadius = radius - this.innerRadius;
            for (const key of super.ringKeys(radius)) {
                const { q, r, s } = key;
                const smallest = Math.min(...[q, r, s].map(Math.abs));
                if (smallest >= playerRadius) {
                    yield key;
                }
            }
        } else {
            for (const key of super.ringKeys(radius)) {
                yield key;
            }
        }
    }

    outerRegionId(key) {
        return calculateOuterRegion(key, this.innerRadius);
    }

    *outerRegionKeys(id) {
        const fieldCorner = CENTRE.add(NEIGHBOURS[(4 + id) % 6].scale(this.innerRadius));
        const deltaRow = NEIGHBOURS[(4 + id + 1) % 6];
        const deltaColumn = NEIGHBOURS[(4 + id + 2) % 6];

        for (let i = 1; i <= this.innerRadius; i++) {
            const rowStart = fieldCorner.add(deltaRow.scale(i))
            yield rowStart;

            for (let j = 1; j < this.innerRadius - i + 1; j++) {
                yield rowStart.add(deltaColumn.scale(j));
            }
        }
    }
}

// TODO: improve readability
const outerRegionHexants = [
    // i2, i1, i0   =>  j2, j1, j0
    [1, 0, 1],  // 000
    [1, 0, 0],  // 001
    [1, 1, 0],  // 010
    [0, 1, 0],  // 011
    [0, 1, 1],  // 100
    [0, 0, 1],  // 101
]

// j2 = ~i2 & i0
// j1 = i1 & ~i0
// j0 = i2 ^ i1 ^ i0

const outerRegions = [null];

for (let i = 0; i < 6; i++) {
    outerRegions.push(null);
}

for (const [i, [q, r, s]] of outerRegionHexants.entries()) {
    const key = q * 4 + r * 2 + s * 1;
    outerRegions[key] = i;
}

function calculateOuterRegion(hex, middleEdge) {
    const length = hex.length();

    if (length <= middleEdge) {
        return null;
    }

    const {q, r, s} = hex;
    const [q1, r1, s1] = [q, r, s].map(e => e > 0 ? 1 : 0);
    const key = q1 * 4 + r1 * 2 + s1 * 1;

    return outerRegions[key];

}