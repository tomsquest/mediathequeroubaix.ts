#!/usr/bin/env node

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { type Result, composable, pipe, success } from "composable-functions";

type Command = () => Promise<Result>;

const usageCommand = (errorMessage?: string) => {
	return async (): Promise<Result> => {
		if (errorMessage) {
			console.error(errorMessage);
			console.error(); // blank line
		}
		console.log("Usage: loans <command>");
		console.log("Commands:");
		console.log("  loans: List all loans");
		console.log("  usage: Show this usage information");
		return success(void 0);
	};
};

const loanCommand = async (): Promise<Result> => {
	console.error("Not yet implemented");
	return success(void 0);
};

const getHomeDir = composable(
	(env: Record<string, string | undefined>): string => {
		const maybeHome = env.HOME;
		if (maybeHome) return maybeHome;
		throw new Error("unable to find home directory");
	},
);

const getConfigFilename = (homeDir: string): string =>
	`${homeDir}${path.sep}.config${path.sep}mediathequeroubaix${path.sep}config.json`;

const fileExist = composable(async (file: string): Promise<string> => {
	try {
		await fs.access(file, fs.constants.R_OK);
		return file;
	} catch (e: unknown) {
		throw new Error(`file '${file}' is not readable: ${e}`);
	}
});

const readFile = composable((filename: string): Promise<string> => {
	return fs.readFile(filename, "utf-8");
});

const parseJson = composable((text: string): Promise<object> => {
	try {
		return JSON.parse(text);
	} catch (e: unknown) {
		throw new Error(`Unable to parse JSON: ${text}. Error: ${e}`);
	}
});

const printConfig = composable((config: object): Promise<void> => {
	console.log(JSON.stringify(config, null, 2));
	return Promise.resolve();
});

const showConfigCommand = async (): Promise<Result> => {
	const showConfig = pipe(
		getHomeDir,
		getConfigFilename,
		fileExist,
		readFile,
		parseJson,
		printConfig,
	);
	return showConfig(process.env);
};

const getCommand = (args: string[]): Command => {
	if (args.length > 0) {
		const firstArg = args[0];
		switch (firstArg) {
			case "usage":
				return usageCommand();
			case "loans":
				return loanCommand;
			case "config":
				return showConfigCommand;
			default:
				return usageCommand(`Unknown command: ${firstArg}`);
		}
	}
	// return success(usageCommand("Missing argument, none provided"));
	return usageCommand("Missing argument, none provided");
};

const main = async (): Promise<void> => {
	const cmd = getCommand(process.argv.slice(2));
	await cmd();
};

main();
