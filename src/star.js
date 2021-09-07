/**
 * Copyright (c) Benjamin Martin
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HexMap } from "./hex";

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
}