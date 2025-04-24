import { render, screen } from "@testing-library/react";

import { AppHeader } from "./app-header";

describe("AppHeader Component", () => {
  it("renders the logo", () => {
    render(<AppHeader />);
    const logo = screen.getByAltText("keitaito.net");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logo.svg");
  });
});
