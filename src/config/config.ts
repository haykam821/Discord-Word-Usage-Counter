import { Snowflake } from "discord.js";

interface TargetConfig {
	authors: Snowflake[];
	displayRole: Snowflake;
	displayRoleFormat: string;
	match: string;
	maxMatches: number | -1;
}

export interface WordUsageCounterConfig {
	owner: Snowflake;
	targets: Record<string, TargetConfig>;
	token: string;
}
