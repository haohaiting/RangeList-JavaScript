/**
 * @file rangeList.js is the root file for this JerryAI coding test.
 * @author 👩‍🚀 Haiting Hao
 * @see <a href="http://linkedin.com/in/haiting-hao">LinkedIn</a>
 * @see <a href="http://github.com/haohaiting">GitHub</a>
 */

/**
 * Class to create a range list object.
 * A pair of integers define a range.
 * For example: [1, 5). This range includes integers: 1, 2, 3, and 4. 
 * A range list is an aggregate of these ranges: [1, 5), [10, 11), [100, 201).
 * See {@tutorial rangelist-tutorial}.
 */
class RangeList {
    /**
     * Represents a RangeList.
     * @constructor
     */
    constructor() {
        this.rangeList = [];
    }

    /**
     * @property {Function} add(range) - Adds a validated range to the list.
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     * @return {RangeList} rangeList - the range list after adding the given range.
     */
    add(range) {
        // check if the range is validate
        if (this.isValid(range)) {
            // check if the range list is empty
            if (this.rangeList.length === 0) {
                // if so, directly push the given range
                this.rangeList.push(range);
            } else {
                // otherwise, find the right position to add the range

                // start index represents that the index of first existing range
                // that has an end greater than the beginning of the given range
                // default to be the length of the range (given range is greater than all existing ranges)
                let startIdx = this.rangeList.length;
                // start index represents that the index of first existing range
                // that has an beginning smaller than the end of the given range
                // default to be -1 (given range is smaller than all existing ranges)
                let endIdx = -1;

                for (let idx = 0; idx < this.rangeList.length; idx += 1) {
                    if (this.rangeList[idx][1] >= range[0]) {
                        startIdx = Math.min(idx, startIdx);
                    }
                    if (this.rangeList[idx][0] <= range[1]) {
                        endIdx = Math.max(idx, endIdx);
                    }
                }

                if (startIdx === this.rangeList.length) {
                    // the given range is greater than all the existing ranges
                    // add the given range to the end of the range list
                    this.rangeList.push(range);
                } else if (endIdx === -1) {
                    // the given range is smaller than all the existing ranges
                    // add the given range to the start of the range list
                    this.rangeList.unshift(range);
                } else {
                    // merge all the ranges in between the start index and end index
                    range[0] = Math.min(range[0], this.rangeList[startIdx][0]);
                    range[1] = Math.max(range[1], this.rangeList[endIdx][1]);
                    // replace the ranges in between the start index and end index with the merged range
                    // note that start index may be greater than end index by 1
                    // in this case, the 'merged range' is the given range itself
                    // the splice function will insert the given range to at the start index
                    this.rangeList.splice(startIdx, endIdx - startIdx + 1, range);
                }
            }
        }
        return this;
    }

    /**
     * @property {Function} remove(range) - Removes a validated range from the range list. 
It raises a RangeError if the given range is not in the range list.
     * @param {Array<number>} range - Array of two integers that specify beginning and end of range.
     * @return {RangeList} rangeList - the range list after removing the given range, 
     * or the original range list if there is a RangeError.
     */
    remove(range) {
        // check if the range is validate            
        if (this.isValid(range)) {
            let remove = false;
            // check if the range list is not empty
            if (this.rangeList.length > 0) {
                // iterate the whole range list
                for (let idx = 0; idx < this.rangeList.length; idx += 1) {
                    let curRange = this.rangeList[idx];
                    if (curRange[1] <= range[0] || curRange[0] > range[1]) {
                        // no overlap: do nothing
                        continue;
                    } else if (range[0] <= curRange[0] && range[1] <= curRange[1]) {
                        remove = true;
                        // overlap: the left side of the current range
                        // cut the left side of the current range
                        curRange[0] = range[1];
                    } else if (range[0] >= curRange[0] && range[1] <= curRange[1]) {
                        remove = true;
                        // overlap: given range is inside of the current range
                        // delete the current range, and insert two separate ones after removing the given range
                        this.rangeList.splice(idx, 1, [curRange[0], range[0]], [range[1], curRange[1]]);
                        idx += 1
                    } else if (range[0] >= curRange[0] && range[1] >= curRange[1]) {
                        remove = true;
                        // overlap: the right side of the current range
                        // cut the right side of the current range
                        curRange[1] = range[0];
                    } else {
                        // overlap: the current range is inside of the given range
                        // delete the current range
                        this.rangeList.splice(idx, 1);
                        idx -= 1;
                    }
                }
            }
            if (!remove) {
                throw new RangeError("The given range does not exist in the range list.");
            }
        }
        return this;
    }

    /**
     * @property {Function} print - Prints out the list of ranges in the range list in the console.
     * The print format for range list [[a, b], [c, d]] is '[a, b) [c, d)'.
     */
    print() {
        console.log(this.rangeList.map(([start, end], _) => `[${start}, ${end})`).join(" "));
    }

    /**
     * @property {Function} isValid(range) - Check if the given range is validated as an Array<Number> with 2 Intergers,
     * and the beginning of the range is not greater than the end of the range.
     * It raises a TypeError if the given range is not valid.
     * @param {*} range - Anything input that is intended to be a range.
     * @return {RangeList} rangeList - the range list itself.
     */
    isValid(range) {
        if (! // if NOT
            (range // input is not null                        
                &&
                typeof range === "object" // input is an object
                &&
                Array.isArray(range) // input is an array
                &&
                range.length == 2 // the array only contains 2 elements
                &&
                Number.isInteger(range[0]) && Number.isInteger(range[1]))) // the 2 elements are both Integers
        {
            throw TypeError('Input range is not valid. It should be an Array of 2 Integers represent the beginning and the end of the range.');
        }
        if (range[0] > range[1]) {
            throw TypeError('Input range is not valid. The beginning of the range should not be greater than the end of the range.');
        }
        return this;
    }
}

// Example run
/**
 * A RangeList object.
 * See {@link RangeList}
 */
const rl = new RangeList();
rl.add([1, 5]);
rl.print();
// Should display: [1, 5)
rl.add([10, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 20]);
rl.print();
// Should display: [1, 5) [10, 20)
rl.add([20, 21]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([2, 4]);
rl.print();
// Should display: [1, 5) [10, 21)
rl.add([3, 8]);
rl.print();
// Should display: [1, 8) [10, 21)
rl.remove([10, 10]);
rl.print();
// Should display: [1, 8) [10, 21)
rl.remove([10, 11]);
rl.print();
// Should display: [1, 8) [11, 21)
rl.remove([15, 17]);
rl.print();
// Should display: [1, 8) [11, 15) [17, 21)
rl.remove([3, 19]);
rl.print();
// Should display: [1, 3) [19, 21)