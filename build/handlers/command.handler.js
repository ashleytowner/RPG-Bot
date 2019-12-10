"use strict";
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var dice_handler_1 = require("./dice.handler");
var commands = {
    roll: {
        usage: 'roll <count>d<faces> [dl number | dh number]',
        description: 'Roll some dice, and optionally drop the highest or lowest ones.'
    },
    help: {
        usage: 'help [command]',
        description: 'Learn about commands.'
    }
};
var CommandHandler = /** @class */ (function () {
    function CommandHandler() {
    }
    CommandHandler.prototype.run = function (commandMessage) {
        var command = this.parse(commandMessage);
        this.execute(command, this.getHandler(command));
    };
    CommandHandler.prototype.parse = function (command) {
        var commandString = command.toString();
        if (commandString.length > 0) {
            // remove command prefix
            var args = commandString
                .substr(1, commandString.length - 1)
                .split(' ');
            return {
                name: args.shift(),
                args: args,
                message: command
            };
        }
        return undefined;
    };
    CommandHandler.prototype.getHandler = function (command) {
        switch (command.name) {
            case 'roll':
                return this.handleRoll;
            default:
                return this.helpHandler;
        }
    };
    CommandHandler.prototype.execute = function (command, handler) {
        if (!handler(command)) {
            this.usage(command);
        }
    };
    CommandHandler.prototype.usage = function (command) {
        command.message.channel.send("Usage: " + commands[command.name].usage);
    };
    CommandHandler.prototype.helpHandler = function (command) {
        if (command.name === 'help' && command.args[0]) {
            var construct = {
                name: command.args[0],
                args: [],
                message: command.message
            };
            console.log(construct);
            this.usage(construct);
        }
        var embed = new discord_js_1.RichEmbed()
            .setColor('#00ff00')
            .setTitle('Commands')
            .setDescription('List of commands');
        for (var cmd in commands) {
            embed
                .addBlankField()
                .addField('Usage', commands[cmd].usage, true)
                .addField('Description', commands[cmd].description, true);
        }
        command.message.channel.send(embed);
        return true;
    };
    // Command handlers
    CommandHandler.prototype.handleRoll = function (command) {
        var dice = new dice_handler_1["default"]();
        if (command.args[0] && command.args[0].match(/[0-9]+(d)[0-9]+/)) {
            var diceVals = command.args[0].split('d');
            var result = dice.roll(+diceVals[0], +diceVals[1]).sort();
            if (command.args.length === 3) {
                if (command.args[1].match(/(dl|dh)/) &&
                    command.args[2].match(/[0-9]+/)) {
                    var dropCount = +command.args[2];
                    if (command.args[1] === 'dl') {
                        result.splice(0, dropCount);
                    }
                    else {
                        result.splice(result.length - dropCount, dropCount);
                    }
                }
                else {
                    return false;
                }
            }
            var total = 0;
            for (var _i = 0, result_1 = result; _i < result_1.length; _i++) {
                var roll = result_1[_i];
                total += roll;
            }
            command.message.channel.send(command.message.author + ", I rolled " + command.args[0] + (command.args[1] || '') + (command.args[2] || '') + " and got " + total + ".");
            return true;
        }
        return false;
    };
    return CommandHandler;
}());
exports["default"] = CommandHandler;
