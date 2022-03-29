import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import isIdentifier from "../../is-identifier";

export class GetCountCommand extends Command {
	constructor(client: CommandoClient) {
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

	run(msg: CommandoMessage, args: Record<string, unknown>) {
		if (!isIdentifier(args.count as string)) {
			return msg.reply("That is not a valid count identifier.");
		}

		const value = this.client.settings.get("count:" + args.count);
		if (value === undefined) {
			return msg.reply("The `" + args.count + "` count doesn't exist.");
		}

		return msg.reply("The `" + args.count + "` count is currently at " + value + ".");
	}
}
