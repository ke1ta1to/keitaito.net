import { render, screen } from "@testing-library/react";

import { AppHeader } from "./app-header";

describe("AppHeader", () => {
  it("renders logo image", () => {
    render(<AppHeader />);

    const logo = screen.getByRole("img", { name: "keitaito.net" });

    expect(logo).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<AppHeader />);

    expect(screen.getByRole("link", { name: "Overview" })).toBeInTheDocument();
  });

  it("renders header element", () => {
    render(<AppHeader />);

    const header = screen.getByRole("banner");

    expect(header).toBeInTheDocument();
  });
});
