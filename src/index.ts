#!/usr/bin/env node

import { type Result, failure, success } from "composable-functions";

type Command = () => void;

const usageCommand: Command = () => {
	console.log(`Usage: <command> [options]

Commands:
	loans	List all loans
	usage	Display this usage information
`);
};

const loansCommand: Command = () => {
	console.log("Loans command");
};

const getCommand = (args: string[]): Result<Command> => {
	if (args.length > 0) {
		const firstArg = args[0];
		switch (firstArg) {
			case "loans":
				return success(loansCommand);
			case "usage":
				return success(usageCommand);
			default:
				return failure([new Error(`unknown command: ${firstArg}`)]);
		}
	}
	return failure([new Error("missing command")]);
};

const main = (): void => {
	const result = getCommand(process.argv.slice(2));
	if (result.success) {
		result.data();
	} else {
		for (const error of result.errors) {
			console.error(error.message);
		}
		console.log(); // blank lines
		usageCommand();
	}
};

main();
