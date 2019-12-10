"use strict";
exports.__esModule = true;
var DiceHandler = /** @class */ (function () {
    function DiceHandler() {
    }
    DiceHandler.prototype.randomNumber = function (low, high) {
        return Math.floor(Math.random() * (high - low + 1)) + low;
    };
    DiceHandler.prototype.roll = function (count, faces, dropHigh, dropLow) {
        var results = [];
        for (var i = 0; i < count; i++) {
            results.push(this.randomNumber(1, faces));
        }
        return results;
    };
    return DiceHandler;
}());
exports["default"] = DiceHandler;
