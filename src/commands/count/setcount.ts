import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import isIdentifier from "../../is-identifier";

export class SetCountCommand extends Command {
	constructor(client: CommandoClient) {
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

	run(msg: CommandoMessage, args: Record<string, unknown>) {
		if (!isIdentifier(args.count as string)) {
			return msg.reply("That counter could not be changed because it is not a valid count identifier.");
		}

		const oldValue = this.client.settings.get("count:" + args.count);
		return this.client.settings
			.set("count:" + args.count, args.value)
			.then(() => {
				return msg.reply(`The \`${args.count}\` counter has been changed from ${oldValue} to ${args.value}, but role names have not been updated.`);
			})
			.catch(() => {
				return msg.reply("The `" + args.count + "` counter could not be changed.");
			});
	}
}
