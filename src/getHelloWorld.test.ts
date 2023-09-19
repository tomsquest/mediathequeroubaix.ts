import { getHelloWorld } from "./getHelloWorld";
import { test, expect } from "bun:test";

test("ok", () => {
  const result = getHelloWorld();

  expect(result).toEqual("Hello World");
});
