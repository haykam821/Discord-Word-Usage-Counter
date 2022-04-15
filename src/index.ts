import Commando, { CommandoMessage } from "discord.js-commando";

import { Intents } from "discord.js";
import { WordUsageCounterConfig } from "./config/config";
import { cached } from "sqlite3";
import debug from "debug";
import format from "string-format";
import path from "node:path";
import sqlite from "sqlite";

const log = debug("discord-word-usage-counter");

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const config = require("../config.json") as WordUsageCounterConfig;

const client = new Commando.Client({
	intents: [
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILDS,
	],
	owner: config.owner,
});

// Register groups/commands/arguments
client.registry.registerGroups([
	["count", "Count tracking"],
]);
client.registry.registerDefaults();
client.registry.registerCommandsIn(path.resolve(__dirname, "./commands"));

client.on("messageCreate", async msge => {
	const msg = msge as CommandoMessage;
	if (msg.isCommand) return;

	for await (const [ targetName, target ] of Object.entries(config.targets)) {
		if (msg.author.id === client.user?.id) break;
		if (!target.authors.includes(msg.author.id)) break;

		const match = new RegExp(target.match, "g");
		const matches = msg.content.match(match);
		const matchCount = Math.min((matches || []).length, target.maxMatches === -1 ? Infinity : target.maxMatches);
		if (matchCount === 0) break;

		// All checks passed; update count
		log("Target '%s' matched for message by %s, updating count", targetName, msg.author.tag);

		const oldCount = client.settings.get("count:" + targetName, 0);
		const newCount = await client.settings.set("count:" + targetName, oldCount + matchCount);
		log("Updated '%s' count to %d", targetName, newCount);

		// Set role name to reflect new count
		const displayRole = await msg.guild.roles.fetch(target.displayRole);
		if (!displayRole) break;
		displayRole.setName(format(target.displayRoleFormat, {
			count: newCount,
		}, `Updated count for ${targetName} target`));
		log("Updated '%s' display role's name to match new count", targetName);
	}
});

async function start() {
	// Set database provider
	const db = await sqlite.open({
		driver: cached.Database,
		filename: path.resolve(__dirname, "./settings.sqlite3"),
	});
	client.setProvider(new Commando.SQLiteProvider(db));

	await client.login(config.token);
	log("connected to discord");
}
/* eslint-disable-next-line unicorn/prefer-top-level-await */
start();
