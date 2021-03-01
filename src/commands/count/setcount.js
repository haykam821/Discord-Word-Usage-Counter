const isIdentifier = require("../../is-identifier");

const { Command } = require("discord.js-commando");
module.exports = class SetCountCommand extends Command {
	constructor(client) {
		super(client, {
			args: [{
				key: "count",
				label: "count",
				prompt: "What count should be changed?",
				type: "string",
			}, {
				key: "value",
				label: "value",
				prompt: "What should be the new value of the count?",
				type: "integer",
			}],
			description: "Sets a count to a specific value without updating roles.",
			group: "count",
			memberName: "setcount",
			name: "setcount",
			userPermissions: [
				"MANAGE_ROLES",
			],
		});
	}

	run(msg, args) {
		if (!isIdentifier(args.count)) {
			return msg.reply("That counter could not be changed because it is not a valid count identifier.");
		}

		const oldValue = this.client.settings.get("count:" + args.count);
		return this.client.settings.set("count:" + args.count, args.value).then(() => {
			return msg.reply(`The \`${args.count}\` counter has been changed from ${oldValue} to ${args.value}, but role names have not been updated.`);
		}).catch(() => {
			return msg.reply("The `" + args.count + "` counter could not be changed.");
		});
	}
};