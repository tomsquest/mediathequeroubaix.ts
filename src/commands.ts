import { promises as fs } from "node:fs";
import { EOL } from "node:os";
import { sep } from "node:path";
import { type Result, pipe, success } from "composable-functions";

export type Command = {
	type: string;
	run: () => Promise<Result>;
};

export type Reporter = {
	info(...data: unknown[]): void;
	error(...data: unknown[]): void;
};

export const consoleReporter: Reporter = {
	info: console.info,
	error: console.error,
};

export const usageCommand =
	({ reporter }: { reporter: Reporter }) =>
	(errorMessage?: string) =>
	async (): Promise<Result> => {
		if (errorMessage) {
			reporter.error(errorMessage + EOL);
		}
		reporter.info("Usage: npx mediathequeroubaix <command>");
		reporter.info("Commands:");
		reporter.info("  loans: List all loans");
		reporter.info("  usage: Show this usage information");
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

export const showConfigCommand = async (): Promise<Result> => {
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

export const getCommand = (args: string[]): Command => {
	if (args.length > 0) {
		const firstArg = args[0];
		switch (firstArg) {
			case "usage":
				return {
					type: "usage",
					run: usageCommand({ reporter: consoleReporter })(),
				};
			case "loans":
				return { type: "loans", run: loanCommand };
			case "config":
				return { type: "config", run: showConfigCommand };
			default:
				return {
					type: "usage",
					run: usageCommand({ reporter: consoleReporter })(
						`Unknown command: ${firstArg}`,
					),
				};
		}
	}

	return {
		type: "usage",
		run: usageCommand({ reporter: consoleReporter })(
			"Missing argument, none provided",
		),
	};
};
