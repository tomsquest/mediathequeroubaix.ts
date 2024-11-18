import { afterEach, describe, expect, mock, test } from "bun:test";
import { type Reporter, getCommand, usageCommand } from "./commands.ts";

describe("getCommand", () => {
	test("show config", () => {
		const args = ["config"];

		const command = getCommand(args);

		expect(command.type).toEqual("config");
	});

	test("show loans", () => {
		const args = ["loans"];

		const command = getCommand(args);

		expect(command.type).toEqual("loans");
	});

	test("show usage", () => {
		const args = ["usage"];

		const command = getCommand(args);

		expect(command.type).toEqual("usage");
	});

	test("unknown command", () => {
		const args = ["unknown"];

		const command = getCommand(args);

		expect(command.type).toEqual("usage");
	});

	test("no args", () => {
		const args: string[] = [];

		const command = getCommand(args);

		expect(command.type).toEqual("usage");
	});
});

describe("usage", () => {
	const infoLog = mock();
	const errorLog = mock();
	const reporterMock = { info: infoLog, error: errorLog } as Reporter;

	afterEach(() => {
		infoLog.mockRestore();
		errorLog.mockRestore();
	});

	test("no error message", async () => {
		const cmd = usageCommand({ reporter: reporterMock })();

		const result = await cmd();

		expect(result.success).toEqual(true);
		expect(errorLog).toHaveBeenCalledTimes(0);
		expect(infoLog.mock.calls.join(" ")).toMatch(/Usage: /);
	});

	test("with error message", async () => {
		const cmd = usageCommand({ reporter: reporterMock })("OMG");

		const result = await cmd();

		expect(result.success).toEqual(true);
		expect(errorLog.mock.calls.join(" ")).toMatch(/OMG/);
		expect(infoLog.mock.calls.join(" ")).toMatch(/Usage: /);
	});
});
