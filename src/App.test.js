import { render } from "@testing-library/react";
import '@testing-library/jest-dom'
import App from "./App";

test("renders RCPCH Growth Charts text", () => {
  const { getByText } = render(<App />);
  const textElement = getByText("Dates");
  expect(textElement).toBeInTheDocument();
});
