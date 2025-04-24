import { render, screen } from "@testing-library/react";

import { OverviewCard } from "./overview-card";

describe("OverviewCard Component", () => {
  it("renders the title and children", () => {
    render(<OverviewCard title="Test Title">Test Content</OverviewCard>);
    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toBeInTheDocument();
    const content = screen.getByText("Test Content");
    expect(content).toBeInTheDocument();
  });
});
