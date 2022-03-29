const debug = require("debug");
const log = debug("discord-word-usage-counter");

const config = require("../config.json");

const Commando = require("discord.js-commando");
const { Intents } = require("discord.js");

const client = new Commando.Client({
	intents: Intents.NON_PRIVILEGED,
	owner: config.owner,
});

const path = require("path");
const sqlite = require("sqlite");

const format = require("string-format");

// Register groups/commands/arguments
client.registry.registerGroups([
	["count", "Count tracking"],
]);
client.registry.registerDefaults();
client.registry.registerCommandsIn(path.resolve(__dirname, "./commands"));

client.on("message", async msg => {
	if (msg.isCommand) return;

	for await (const [ targetName, target ] of Object.entries(config.targets)) {
		if (msg.author.id === client.user.id) break;
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
	const dbPath = path.resolve(__dirname, "./settings.sqlite3");
	const db = await sqlite.open(dbPath);

	// Set database provider
	client.setProvider(new Commando.SQLiteProvider(db));

	await client.login(config.token);
	log("connected to discord");
}
/* eslint-disable-next-line unicorn/prefer-top-level-await */
start();
