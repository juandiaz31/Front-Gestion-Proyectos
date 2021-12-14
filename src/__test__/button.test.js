import React from "react";
import ButtonLoading from "components/ButtonLoading";
import { render, screen, cleanup } from "@testing-library/react";

afterEach(cleanup);

it("renders okay", () => {
  render(<ButtonLoading text="hola" loading={false} disabled={false} />);
  expect(screen.getByTestId("button-loading")).toBeInTheDocument();
});

it("shows text when not loading", () => {
  render(<ButtonLoading text="hola" loading={false} disabled={false} />);
  expect(screen.getByTestId("button-loading")).toHaveTextContent("hola");
});

it("doesnt show text when loading in true", () => {
  render(<ButtonLoading text="hola" loading={true} disabled={false} />);
  expect(screen.getByTestId("button-loading")).not.toHaveTextContent("hola");
});

it("is disable when prop is passed", () => {
  render(<ButtonLoading text="hola" loading={true} disabled={true} />);
  expect(screen.getByTestId("button-loading")).toHaveAttribute("disabled");
});
