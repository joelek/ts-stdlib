"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const wtf = require("@joelek/wtf");
const avl = require("./avl");
wtf.test(`It should compute tree balance.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null, 2);
    let n2 = new avl.Node(2, null, 1);
    let n3 = new avl.Node(3, null, 3);
    let n4 = new avl.Node(4, null, 1);
    let n5 = new avl.Node(5, null, 2);
    n3.setLower(n1);
    n3.setUpper(n5);
    n5.setLower(n4);
    n1.setUpper(n2);
    assert.equals(n1.computeBalance(), 1);
    assert.equals(n2.computeBalance(), 0);
    assert.equals(n3.computeBalance(), 0);
    assert.equals(n4.computeBalance(), 0);
    assert.equals(n5.computeBalance(), -1);
}));
wtf.test(`It should compute tree height.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null, 2);
    let n2 = new avl.Node(2, null, 1);
    let n3 = new avl.Node(3, null, 3);
    let n4 = new avl.Node(4, null, 1);
    let n5 = new avl.Node(5, null, 2);
    n3.setLower(n1);
    n3.setUpper(n5);
    n5.setLower(n4);
    n1.setUpper(n2);
    assert.equals(n1.computeHeight(), 2);
    assert.equals(n2.computeHeight(), 1);
    assert.equals(n3.computeHeight(), 3);
    assert.equals(n4.computeHeight(), 1);
    assert.equals(n5.computeHeight(), 2);
}));
wtf.test(`It should support filtering nodes without using a filter.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let n4 = new avl.Node(4, null);
    let n5 = new avl.Node(5, null);
    n3.setLower(n1);
    n3.setUpper(n5);
    n5.setLower(n4);
    n1.setUpper(n2);
    let observed = Array.from(n3.filter()).map((entry) => entry.key);
    let expected = [1, 2, 3, 4, 5];
    assert.equals(observed, expected);
}));
wtf.test(`It should support filtering nodes using a ">" filter and a "<" filter.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let n4 = new avl.Node(4, null);
    let n5 = new avl.Node(5, null);
    n3.setLower(n1);
    n3.setUpper(n5);
    n5.setLower(n4);
    n1.setUpper(n2);
    let observed = Array.from(n3.filter({ operator: ">", key: 1 }, { operator: "<", key: 5 }))
        .map((entry) => entry.key);
    let expected = [2, 3, 4];
    assert.equals(observed, expected);
}));
wtf.test(`It should locate maximum nodes.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let n4 = new avl.Node(4, null);
    let n5 = new avl.Node(5, null);
    n3.setLower(n1);
    n3.setUpper(n5);
    n5.setLower(n4);
    n1.setUpper(n2);
    assert.equals(n1.getMaximum() === n2, true);
    assert.equals(n2.getMaximum() === n2, true);
    assert.equals(n3.getMaximum() === n5, true);
    assert.equals(n4.getMaximum() === n4, true);
    assert.equals(n5.getMaximum() === n5, true);
}));
wtf.test(`It should support filtering nodes using a single filter.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null);
    let n3 = new avl.Node(3, null);
    let n5 = new avl.Node(5, null);
    let n7 = new avl.Node(7, null);
    let n9 = new avl.Node(9, null);
    n5.setLower(n1);
    n5.setUpper(n9);
    n9.setLower(n7);
    n1.setUpper(n3);
    let operators = [">", ">=", "=", "<=", "<"];
    let keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let operator of operators) {
        for (let key of keys) {
            let observed = Array.from(n5.filter({ operator: operator, key: key })).map((entry) => entry.key);
            let expected = [];
            if (operator === "<") {
                expected = keys.filter((k) => k % 2 === 1 && k < key);
            }
            else if (operator === "<=") {
                expected = keys.filter((k) => k % 2 === 1 && k <= key);
            }
            else if (operator === "=") {
                expected = keys.filter((k) => k % 2 === 1 && k === key);
            }
            else if (operator === ">=") {
                expected = keys.filter((k) => k % 2 === 1 && k >= key);
            }
            else if (operator === ">") {
                expected = keys.filter((k) => k % 2 === 1 && k > key);
            }
            assert.equals(observed, expected);
        }
    }
}));
wtf.test(`It should locate minimum nodes.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let n4 = new avl.Node(4, null);
    let n5 = new avl.Node(5, null);
    n3.setLower(n1);
    n3.setUpper(n5);
    n5.setLower(n4);
    n1.setUpper(n2);
    assert.equals(n1.getMinimum() === n1, true);
    assert.equals(n2.getMinimum() === n2, true);
    assert.equals(n3.getMinimum() === n1, true);
    assert.equals(n4.getMinimum() === n4, true);
    assert.equals(n5.getMinimum() === n4, true);
}));
wtf.test(`It should locate lower parent nodes.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let n4 = new avl.Node(4, null);
    let n5 = new avl.Node(5, null);
    n3.setLower(n1);
    n3.setUpper(n5);
    n5.setLower(n4);
    n1.setUpper(n2);
    assert.equals(n2.getLowerParent() === n1, true);
    assert.equals(n4.getLowerParent() === n3, true);
}));
wtf.test(`It should locate upper parent nodes.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let n4 = new avl.Node(4, null);
    let n5 = new avl.Node(5, null);
    n3.setLower(n1);
    n3.setUpper(n5);
    n5.setLower(n4);
    n1.setUpper(n2);
    assert.equals(n2.getUpperParent() === n3, true);
    assert.equals(n4.getUpperParent() === n5, true);
}));
wtf.test(`It should locate predecessor nodes.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let n4 = new avl.Node(4, null);
    let n5 = new avl.Node(5, null);
    n3.setLower(n1);
    n3.setUpper(n5);
    n5.setLower(n4);
    n1.setUpper(n2);
    assert.equals(n1.getPredecessor() === undefined, true);
    assert.equals(n2.getPredecessor() === n1, true);
    assert.equals(n3.getPredecessor() === n2, true);
    assert.equals(n4.getPredecessor() === n3, true);
    assert.equals(n5.getPredecessor() === n4, true);
}));
wtf.test(`It should locate successor nodes.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let n4 = new avl.Node(4, null);
    let n5 = new avl.Node(5, null);
    n3.setLower(n1);
    n3.setUpper(n5);
    n5.setLower(n4);
    n1.setUpper(n2);
    assert.equals(n1.getSuccessor() === n2, true);
    assert.equals(n2.getSuccessor() === n3, true);
    assert.equals(n3.getSuccessor() === n4, true);
    assert.equals(n4.getSuccessor() === n5, true);
    assert.equals(n5.getSuccessor() === undefined, true);
}));
wtf.test(`It should support inserting 1,2,3 in 1,2,3 order.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let r = n1;
    r = (_a = r.insert(n2)) !== null && _a !== void 0 ? _a : r;
    r = (_b = r.insert(n3)) !== null && _b !== void 0 ? _b : r;
    assert.equals(r === n2, true);
    assert.equals(r.getLower() === n1, true);
    assert.equals(r.getUpper() === n3, true);
}));
wtf.test(`It should support inserting 1,2,3 in 1,3,2 order.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let r = n1;
    r = (_c = r.insert(n3)) !== null && _c !== void 0 ? _c : r;
    r = (_d = r.insert(n2)) !== null && _d !== void 0 ? _d : r;
    assert.equals(r === n2, true);
    assert.equals(r.getLower() === n1, true);
    assert.equals(r.getUpper() === n3, true);
}));
wtf.test(`It should support inserting 1,2,3 in 2,1,3 order.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let r = n2;
    r = (_e = r.insert(n1)) !== null && _e !== void 0 ? _e : r;
    r = (_f = r.insert(n3)) !== null && _f !== void 0 ? _f : r;
    assert.equals(r === n2, true);
    assert.equals(r.getLower() === n1, true);
    assert.equals(r.getUpper() === n3, true);
}));
wtf.test(`It should support inserting 1,2,3 in 2,3,1 order.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let r = n2;
    r = (_g = r.insert(n3)) !== null && _g !== void 0 ? _g : r;
    r = (_h = r.insert(n1)) !== null && _h !== void 0 ? _h : r;
    assert.equals(r === n2, true);
    assert.equals(r.getLower() === n1, true);
    assert.equals(r.getUpper() === n3, true);
}));
wtf.test(`It should support inserting 1,2,3 in 3,1,2 order.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k;
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let r = n3;
    r = (_j = r.insert(n1)) !== null && _j !== void 0 ? _j : r;
    r = (_k = r.insert(n2)) !== null && _k !== void 0 ? _k : r;
    assert.equals(r === n2, true);
    assert.equals(r.getLower() === n1, true);
    assert.equals(r.getUpper() === n3, true);
}));
wtf.test(`It should support inserting 1,2,3 in 3,2,1 order.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, _m;
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let r = n3;
    r = (_l = r.insert(n2)) !== null && _l !== void 0 ? _l : r;
    r = (_m = r.insert(n1)) !== null && _m !== void 0 ? _m : r;
    assert.equals(r === n2, true);
    assert.equals(r.getLower() === n1, true);
    assert.equals(r.getUpper() === n3, true);
}));
wtf.test(`It should support locating nodes.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    var _o;
    let n1 = new avl.Node(1, null);
    let n3 = new avl.Node(3, null);
    let n5 = new avl.Node(5, null);
    let n7 = new avl.Node(7, null);
    let n9 = new avl.Node(9, null);
    n5.setLower(n1);
    n5.setUpper(n9);
    n9.setLower(n7);
    n1.setUpper(n3);
    let operators = [">", ">=", "=", "<=", "<"];
    let keys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    for (let operator of operators) {
        for (let key of keys) {
            let observed = (_o = n5.locate({ operator: operator, key: key })) === null || _o === void 0 ? void 0 : _o.entry().key;
            let expected;
            if (operator === "<") {
                if (key >= 2) {
                    expected = key - (key % 2 === 0 ? 1 : 2);
                }
            }
            else if (operator === "<=") {
                if (key >= 1) {
                    expected = key - (key % 2 === 0 ? 1 : 0);
                }
            }
            else if (operator === "=") {
                if (key % 2 === 1) {
                    expected = key;
                }
            }
            else if (operator === ">=") {
                if (key <= 9) {
                    expected = key + (key % 2 === 0 ? 1 : 0);
                }
            }
            else if (operator === ">") {
                if (key <= 8) {
                    expected = key + (key % 2 === 0 ? 1 : 2);
                }
            }
            assert.equals(observed, expected);
        }
    }
}));
wtf.test(`It should support removing nodes with no children.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null, 2);
    let n2 = new avl.Node(2, null, 1);
    let n3 = new avl.Node(3, null, 3);
    let n4 = new avl.Node(4, null, 2);
    let n5 = new avl.Node(5, null, 1);
    n1.setUpper(n2);
    n3.setLower(n1);
    n3.setUpper(n5);
    n5.setLower(n4);
    let result = n3.remove(2);
    assert.equals(result === n3, true);
    assert.equals(n1.getUpper() === undefined, true);
}));
wtf.test(`It should support removing nodes with one lower child.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null, 2);
    let n2 = new avl.Node(2, null, 1);
    let n3 = new avl.Node(3, null, 3);
    let n4 = new avl.Node(4, null, 2);
    let n5 = new avl.Node(5, null, 1);
    n1.setUpper(n2);
    n3.setLower(n1);
    n3.setUpper(n5);
    n5.setLower(n4);
    let result = n3.remove(5);
    assert.equals(result === n3, true);
    assert.equals(n3.getUpper() === n4, true);
}));
wtf.test(`It should support removing nodes with one upper child.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null, 2);
    let n2 = new avl.Node(2, null, 1);
    let n3 = new avl.Node(3, null, 3);
    let n4 = new avl.Node(4, null, 2);
    let n5 = new avl.Node(5, null, 1);
    n1.setUpper(n2);
    n3.setLower(n1);
    n3.setUpper(n5);
    n5.setLower(n4);
    let result = n3.remove(1);
    assert.equals(result === n3, true);
    assert.equals(n3.getLower() === n2, true);
}));
wtf.test(`It should support removing nodes with two children through substitution.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, 1, 2);
    let n2 = new avl.Node(2, 2, 1);
    let n3 = new avl.Node(3, 3, 3);
    let n4 = new avl.Node(4, 4, 2);
    let n5 = new avl.Node(5, 5, 1);
    n1.setUpper(n2);
    n3.setLower(n1);
    n3.setUpper(n5);
    n5.setLower(n4);
    let result = n3.remove(3);
    assert.equals(result === n3, true);
    assert.equals(result === null || result === void 0 ? void 0 : result.entry().key, 4);
    assert.equals(result === null || result === void 0 ? void 0 : result.entry().value, 4);
    assert.equals(n3.getLower() === n1, true);
    assert.equals(n3.getUpper() === n5, true);
}));
wtf.test(`It should rebalance left left heavy nodes.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null, 2);
    let n2 = new avl.Node(2, null, 3);
    let n3 = new avl.Node(3, null, 1);
    let n4 = new avl.Node(4, null, 4);
    let n5 = new avl.Node(5, null, 1);
    n4.setLower(n2);
    n4.setUpper(n5);
    n2.setLower(n1);
    n2.setUpper(n3);
    let result = n4.rebalance();
    assert.equals(result === n2, true);
    assert.equals(n2.getLower() === n1, true);
    assert.equals(n2.getUpper() === n4, true);
    assert.equals(n4.getLower() === n3, true);
    assert.equals(n4.getUpper() === n5, true);
}));
wtf.test(`It should rebalance left right heavy nodes.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null, 1);
    let n2 = new avl.Node(2, null, 3);
    let n3 = new avl.Node(3, null, 2);
    let n4 = new avl.Node(4, null, 4);
    let n5 = new avl.Node(5, null, 1);
    n4.setLower(n2);
    n4.setUpper(n5);
    n2.setLower(n1);
    n2.setUpper(n3);
    let result = n4.rebalance();
    assert.equals(result === n3, true);
    assert.equals(n3.getLower() === n2, true);
    assert.equals(n3.getUpper() === n4, true);
    assert.equals(n2.getLower() === n1, true);
    assert.equals(n4.getUpper() === n5, true);
}));
wtf.test(`It should rebalance right left heavy nodes.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null, 1);
    let n2 = new avl.Node(2, null, 4);
    let n3 = new avl.Node(3, null, 2);
    let n4 = new avl.Node(4, null, 3);
    let n5 = new avl.Node(5, null, 1);
    n2.setLower(n1);
    n2.setUpper(n4);
    n4.setLower(n3);
    n4.setUpper(n5);
    let result = n2.rebalance();
    assert.equals(result === n3, true);
    assert.equals(n3.getLower() === n2, true);
    assert.equals(n3.getUpper() === n4, true);
    assert.equals(n2.getLower() === n1, true);
    assert.equals(n4.getUpper() === n5, true);
}));
wtf.test(`It should rebalance right right heavy nodes.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null, 1);
    let n2 = new avl.Node(2, null, 4);
    let n3 = new avl.Node(3, null, 1);
    let n4 = new avl.Node(4, null, 3);
    let n5 = new avl.Node(5, null, 2);
    n2.setLower(n1);
    n2.setUpper(n4);
    n4.setLower(n3);
    n4.setUpper(n5);
    let result = n2.rebalance();
    assert.equals(result === n4, true);
    assert.equals(n4.getLower() === n2, true);
    assert.equals(n4.getUpper() === n5, true);
    assert.equals(n2.getLower() === n1, true);
    assert.equals(n2.getUpper() === n3, true);
}));
wtf.test(`It should perform left rotations.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let n4 = new avl.Node(4, null);
    let n5 = new avl.Node(5, null);
    n2.setLower(n1);
    n2.setUpper(n4);
    n4.setLower(n3);
    n4.setUpper(n5);
    let result = n2.rotateLeft();
    assert.equals(result === n4, true);
    assert.equals(n4.getLower() === n2, true);
    assert.equals(n4.getUpper() === n5, true);
    assert.equals(n2.getLower() === n1, true);
    assert.equals(n2.getUpper() === n3, true);
    assert.equals(n2.getHeight(), 2);
    assert.equals(n4.getHeight(), 3);
}));
wtf.test(`It should perform right rotations.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    let n3 = new avl.Node(3, null);
    let n4 = new avl.Node(4, null);
    let n5 = new avl.Node(5, null);
    n4.setLower(n2);
    n4.setUpper(n5);
    n2.setLower(n1);
    n2.setUpper(n3);
    let result = n4.rotateRight();
    assert.equals(result === n2, true);
    assert.equals(n2.getLower() === n1, true);
    assert.equals(n2.getUpper() === n4, true);
    assert.equals(n4.getLower() === n3, true);
    assert.equals(n4.getUpper() === n5, true);
    assert.equals(n4.getHeight(), 2);
    assert.equals(n2.getHeight(), 3);
}));
wtf.test(`It should update all pointers when setting the lower child.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n0 = new avl.Node(0, null);
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    n1.setLower(n0);
    assert.equals(n0.getParent() === n1, true);
    assert.equals(n1.getLower() === n0, true);
    assert.equals(n2.getLower() === undefined, true);
    n2.setLower(n0);
    assert.equals(n0.getParent() === n2, true);
    assert.equals(n1.getLower() === undefined, true);
    assert.equals(n2.getLower() === n0, true);
}));
wtf.test(`It should update all pointers when setting the upper child.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let n0 = new avl.Node(0, null);
    let n1 = new avl.Node(1, null);
    let n2 = new avl.Node(2, null);
    n1.setUpper(n0);
    assert.equals(n0.getParent() === n1, true);
    assert.equals(n1.getUpper() === n0, true);
    assert.equals(n2.getUpper() === undefined, true);
    n2.setUpper(n0);
    assert.equals(n0.getParent() === n2, true);
    assert.equals(n1.getUpper() === undefined, true);
    assert.equals(n2.getUpper() === n0, true);
}));
wtf.test(`It should support for-of iteration.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let tree = new avl.Tree();
    tree.insert(1, null);
    tree.insert(2, null);
    let observed = [];
    for (let entry of tree) {
        observed.push(entry.key);
    }
    let expected = [1, 2];
    assert.equals(observed, expected);
}));
wtf.test(`It should support removing all nodes stored in the tree.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let tree = new avl.Tree();
    tree.insert(1, null);
    tree.insert(2, null);
    tree.clear();
    assert.equals(tree.lookup(1) === undefined, true);
    assert.equals(tree.lookup(2) === undefined, true);
}));
wtf.test(`It should support filtering.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let tree = new avl.Tree();
    tree.insert(1, null);
    tree.insert(2, null);
    let observed = Array.from(tree.filter()).map((entry) => entry.key);
    let expected = [1, 2];
    assert.equals(observed, expected);
}));
wtf.test(`It should support insertions, lookups and removals.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let tree = new avl.Tree();
    tree.insert(1, null);
    assert.equals(tree.lookup(1) === null, true);
    tree.remove(1);
    assert.equals(tree.lookup(1) === undefined, true);
}));
wtf.test(`It should keep track of the number of nodes stored in the tree.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    let tree = new avl.Tree();
    assert.equals(tree.length(), 0);
    tree.insert(1, null);
    assert.equals(tree.length(), 1);
    tree.insert(2, null);
    assert.equals(tree.length(), 2);
    tree.remove(2);
    assert.equals(tree.length(), 1);
    tree.remove(1);
    assert.equals(tree.length(), 0);
}));
wtf.test(`It should support locating a node through a filter.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    var _p;
    let tree = new avl.Tree();
    tree.insert(1, null);
    assert.equals((_p = tree.locate({ operator: "=", key: 1 })) === null || _p === void 0 ? void 0 : _p.key, 1);
}));
wtf.test(`It should not locate removed nodes.`, (assert) => __awaiter(void 0, void 0, void 0, function* () {
    var _q;
    let tree = new avl.Tree();
    tree.insert(0, null);
    tree.insert(1, null);
    tree.remove(0);
    assert.equals((_q = tree.locate({ operator: "<=", key: 0 })) === null || _q === void 0 ? void 0 : _q.key, undefined);
}));
