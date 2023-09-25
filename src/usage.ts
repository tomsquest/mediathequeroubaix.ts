export const usage = (errorMessage?: string): (() => void) => {
  return () => {
    if (errorMessage) console.log("Error:", errorMessage);
    console.log("Usage");
  };
};
