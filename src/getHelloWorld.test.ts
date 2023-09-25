import { expect, test } from "bun:test";

import { getHelloWorld } from "./getHelloWorld";

test("ok", () => {
  const result = getHelloWorld();

  expect(result).toEqual("Hello World");
});
