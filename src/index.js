const config = require("../config.json");

const Commando = require("discord.js-commando");
const client = new Commando.Client({
	owner: config.owner,
});

const path = require("path");
const sqlite = require("sqlite");

const format = require("string-format");

// Set database provider
const providerPromise = sqlite.open(path.resolve(__dirname, "./settings.sqlite3")).then(db => {
	return new Commando.SQLiteProvider(db);
});
client.setProvider(providerPromise);

// Register groups/commands/arguments
client.registry.registerGroups([
	["count", "Count tracking"],
]);
client.registry.registerDefaults();
client.registry.registerCommandsIn(path.resolve(__dirname, "./commands"));

client.on("message", async msg => {
	for await (const [ targetName, target ] of Object.entries(config.targets)) {
		if (msg.author.id === client.user.id) break;
		if (!target.authors.includes(msg.author.id)) break;

		const match = new RegExp(target.match, "g");
		const matches = msg.content.match(match);
		const matchCount = Math.min((matches || []).length, target.maxMatches === -1 ? Infinity : target.maxMatches);
		if (matchCount === 0) break;

		const oldCount = client.settings.get("count:" + targetName, 0);
		const newCount = await client.settings.set("count:" + targetName, oldCount + matchCount);
		
		// Set role name to reflect new count
		const displayRole = msg.guild.roles.get(target.displayRole);
		if (!displayRole) break;
		displayRole.setName(format(target.displayRoleFormat, {
			count: newCount,
		}, `Updated count for ${targetName} target`));
	}
});

client.login(config.token);