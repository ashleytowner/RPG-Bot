"use strict";
exports.__esModule = true;
var Discord = require("discord.js");
var dotenv = require("dotenv");
var dice_handler_1 = require("./handlers/dice.handler");
var command_handler_1 = require("./handlers/command.handler");
dotenv.config();
// Set up client.
var client = new Discord.Client();
var token = process.env.BOT_TOKEN;
var commandPrefix = process.env.COMMAND_PREFIX;
client.once('ready', function () {
    console.log('Ready!');
});
client.on('message', function (message) {
    var roller = new dice_handler_1["default"]();
    // Return if doesn't start with command prefix or is sent by a bot.
    if (!message.content.startsWith(commandPrefix) || message.author.bot)
        return;
    var commandHandler = new command_handler_1["default"]();
    commandHandler.run(message);
});
// Login
client.login(token);
