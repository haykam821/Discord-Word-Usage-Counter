const { Command } = require("discord.js-commando");
const permissions = require("discord.js").Permissions.FLAGS;

module.exports = class ResetCountCommand extends Command {
	constructor(client) {
		super(client, {
			args: [{
				key: "count",
				label: "count",
				prompt: "What count should be reset?",
				type: "string",
			}],
			description: "Resets a count to its initial value.",
			group: "count",
			memberName: "resetcount",
			name: "resetcount",
			userPermissions: [
				"ADMINISTRATOR",
			],
		});
	}

	run(msg, args) {
		return this.client.settings.set("count:" + args.count, 0).then(() => {
			return msg.reply("The `" + args.count + "` counter has been reset to its initial value.");
		}).catch(() => {
			return msg.reply("The `" + args.count + "` counter could not be reset to its initial value.");
		});
	}
};