#!/usr/bin/env node

import { promises as fs } from "node:fs";
import { sep } from "node:path";
import { type Result, pipe, success } from "composable-functions";

type Command = {
	type: string;
	run: () => Promise<Result>;
};

const usageCommand = (errorMessage?: string) => async (): Promise<Result> => {
	if (errorMessage) {
		console.error(errorMessage);
		console.error(); // blank line
	}
	console.log("Usage: npx mediathequeroubaix <command>");
	console.log("Commands:");
	console.log("  loans: List all loans");
	console.log("  usage: Show this usage information");
	return success(undefined);
};

const loanCommand = async (): Promise<Result> => {
	console.error("Not yet implemented");
	return success(undefined);
};

const getHomeDir = (env: Record<string, string | undefined>): string => {
	const home = env.HOME;
	if (home) return home;
	throw new Error("unable to find home directory");
};

const getConfigFilename = (homeDir: string): string =>
	`${homeDir}${sep}.config${sep}mediathequeroubaix${sep}config.json`;

const fileExist = async (file: string): Promise<string> => {
	try {
		await fs.access(file, fs.constants.R_OK);
		return file;
	} catch (e: unknown) {
		throw new Error(`file '${file}' is not readable: ${e}`);
	}
};

const readFile = (filename: string): Promise<string> =>
	fs.readFile(filename, "utf-8");

const parseJson = (text: string): Promise<object> => {
	try {
		return JSON.parse(text);
	} catch (e: unknown) {
		throw new Error(`Unable to parse JSON: ${text}. Error: ${e}`);
	}
};

const printConfig = (config: object): Promise<void> => {
	console.log(JSON.stringify(config, null, 2));
	return Promise.resolve();
};

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
				return { type: "usage", run: usageCommand() };
			case "loans":
				return { type: "loans", run: loanCommand };
			case "config":
				return { type: "config", run: showConfigCommand };
			default:
				return {
					type: "usage",
					run: usageCommand(`Unknown command: ${firstArg}`),
				};
		}
	}
	return {
		type: "usage",
		run: usageCommand("Missing argument, none provided"),
	};
};

const main = async (): Promise<void> => {
	const cmd = getCommand(process.argv.slice(2));
	const result = await cmd.run();
	if (!result.success) {
		console.error("Error:", result.errors);
		process.exit(1);
	}
};

main();
