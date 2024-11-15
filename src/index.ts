#!/usr/bin/env node

import { getCommand } from "./commands.ts";

const main = async (): Promise<void> => {
	const cmd = getCommand(process.argv.slice(2));
	const result = await cmd.run();
	if (!result.success) {
		console.error("Error:", result.errors);
		process.exit(1);
	}
};

main();
