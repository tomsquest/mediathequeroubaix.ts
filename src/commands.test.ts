import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	spyOn,
	test,
} from "bun:test";
import { getCommand, usageCommand } from "./commands.ts";

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
	let consoleLog: Mock<() => void>;
	let consoleError: Mock<() => void>;

	beforeEach(() => {
		consoleLog = spyOn(console, "log");
		consoleError = spyOn(console, "error");
	});

	afterEach(() => {
		consoleLog.mockRestore();
		consoleError.mockRestore();
	});

	test("no error message", async () => {
		const cmd = usageCommand();

		const result = await cmd();

		expect(result.success).toEqual(true);
		expect(consoleError).toHaveBeenCalledTimes(0);
		expect(consoleLog.mock.calls.join(" ")).toMatch(/Usage: /);
	});

	test("with error message", async () => {
		const cmd = usageCommand("OMG");

		const result = await cmd();

		expect(result.success).toEqual(true);
		expect(consoleError.mock.calls.join(" ")).toMatch(/OMG/);
		expect(consoleLog.mock.calls.join(" ")).toMatch(/Usage: /);
	});
});
