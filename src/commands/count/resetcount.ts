import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import isIdentifier from "../../is-identifier";

export class ResetCountCommand extends Command {
	constructor(client: CommandoClient) {
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
				"MANAGE_ROLES",
			],
		});
	}

	run(msg: CommandoMessage, args: Record<string, unknown>) {
		if (!isIdentifier(args.count as string)) {
			return msg.reply("That counter could not be reset because it is not a valid count identifier.");
		}

		return this.client.settings
			.set("count:" + args.count, 0)
			.then(() => {
				return msg.reply("The `" + args.count + "` counter has been reset to its initial value.");
			})
			.catch(() => {
				return msg.reply("The `" + args.count + "` counter could not be reset to its initial value.");
			});
	}
}
