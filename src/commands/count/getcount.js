const isIdentifier = require("../../is-identifier");

const { Command } = require("discord.js-commando");
module.exports = class GetCountCommand extends Command {
	constructor(client) {
		super(client, {
			args: [{
				key: "count",
				label: "count",
				prompt: "What count should be retrieved?",
				type: "string",
			}],
			description: "Gets a count.",
			group: "count",
			memberName: "getcount",
			name: "getcount",
		});
	}

	run(msg, args) {
		if (!isIdentifier(args.count)) {
			return msg.reply("That is not a valid count identifier.");
		}

		const value = this.client.settings.get("count:" + args.count);
		if (value === undefined) {
			return msg.reply("The `" + args.count + "` count doesn't exist.");
		}

		return msg.reply("The `" + args.count + "` count is currently at " + value + ".");
	}
};
