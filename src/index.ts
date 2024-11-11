#!/usr/bin/env node

import { type Success, success } from "composable-functions";

type Command = (...args: unknown[]) => void;

const usageCommand = (errorMessage?: string) => () => {
	return () => {
		if (errorMessage) {
			console.error(errorMessage);
		}
		console.log("Usage: loans <command>");
		console.log("Commands:");
		console.log("  loans: List all loans");
		console.log("  usage: Show this usage information");
	};
};

const loansCommand: Command = () => {
	console.log("Loans command");
};

const getCommand = (args: string[]): Success<Command> => {
	if (args.length > 0) {
		const firstArg = args[0];
		switch (firstArg) {
			case "loans":
				return success(loansCommand);
			case "usage":
				return success(usageCommand());
			default:
				return success(usageCommand(`Unknown command: ${firstArg}`));
		}
	}
	return success(usageCommand("missing command"));
};

const main = (): void => {
	const result = getCommand(process.argv.slice(2));
	result.data();
};

main();
