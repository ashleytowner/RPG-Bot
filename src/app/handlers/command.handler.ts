import { Command } from '../interfaces/command.interface';
import { Message, RichEmbed } from 'discord.js';
import DiceHandler from './dice.handler';

const commands = {
  roll: {
    usage: 'roll <count>d<faces> [dl number | dh number]',
    description:
      'Roll some dice, and optionally drop the highest or lowest ones.'
  },
  help: {
    usage: 'help [command]',
    description: 'Learn about commands.'
  }
};

class CommandHandler {
  public run(commandMessage: Message): void {
    const command = this.parse(commandMessage);
    this.execute(command, this.getHandler(command));
  }

  private parse(command: Message): Command {
    const commandString = command.toString();
    if (commandString.length > 0) {
      // remove command prefix
      const args: string[] = commandString
        .substr(1, commandString.length - 1)
        .split(' ');
      return {
        name: args.shift(),
        args: args,
        message: command
      };
    }
    return undefined;
  }

  private getHandler(command: Command): Function {
    switch (command.name) {
      case 'roll':
        return this.handleRoll;
      default:
        return this.helpHandler;
    }
  }

  private execute(command: Command, handler: Function): void {
    if (!handler(command)) {
      this.usage(command);
    }
  }

  protected usage(command: Command): void {
    command.message.channel.send(`Usage: ${commands[command.name].usage}`);
  }

  protected helpHandler(command: Command): boolean {
    if (command.name === 'help' && command.args[0]) {
      const construct = {
        name: command.args[0],
        args: [],
        message: command.message
      };
      console.log(construct);
      this.usage(construct);
    }
    const embed: RichEmbed = new RichEmbed()
      .setColor('#00ff00')
      .setTitle('Commands')
      .setDescription('List of commands');
    for (const cmd in commands) {
      embed
        .addBlankField()
        .addField('Usage', commands[cmd].usage, true)
        .addField('Description', commands[cmd].description, true);
    }
    command.message.channel.send(embed);
    return true;
  }

  // Command handlers
  protected handleRoll(command: Command): boolean {
    const dice = new DiceHandler();
    if (command.args[0] && command.args[0].match(/[0-9]+(d)[0-9]+/)) {
      const diceVals = command.args[0].split('d');
      let result = dice.roll(+diceVals[0], +diceVals[1]).sort();
      if (command.args.length === 3) {
        if (
          command.args[1].match(/(dl|dh)/) &&
          command.args[2].match(/[0-9]+/)
        ) {
          const dropCount = +command.args[2];
          if (command.args[1] === 'dl') {
            result.splice(0, dropCount);
          } else {
            result.splice(result.length - dropCount, dropCount);
          }
        } else {
          return false;
        }
      }
      let total: number = 0;
      for (const roll of result) {
        total += roll;
      }
      command.message.channel.send(
        `${command.message.author}, I rolled ${command.args[0]}${command.args[1] || ''}${command.args[2] || ''} and got ${total}.`
      );
      return true;
    }
    return false;
  }
}

export default CommandHandler;
