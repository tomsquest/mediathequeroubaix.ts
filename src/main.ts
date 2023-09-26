import { getCommand } from "./command-line";

const main = (): void => {
  const args = process.argv.slice(2);
  const command = getCommand(args);
  command();
};

main();
