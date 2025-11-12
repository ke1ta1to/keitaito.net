import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const meta = {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function DropdownMenuExample() {
  const [showStatusBar, setShowStatusBar] = React.useState(true);
  const [showFullScreen, setShowFullScreen] = React.useState(false);
  const [position, setPosition] = React.useState<"top" | "bottom" | "right">(
    "bottom",
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Team</DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            <DropdownMenuItem>Invite members</DropdownMenuItem>
            <DropdownMenuItem>Manage roles</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={(checked) => setShowStatusBar(checked === true)}
        >
          Show status bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showFullScreen}
          onCheckedChange={(checked) => setShowFullScreen(checked === true)}
        >
          Full screen mode
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={position}
          onValueChange={(value) =>
            setPosition(value as "top" | "bottom" | "right")
          }
        >
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          Delete team
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const Default: Story = {
  render: () => <DropdownMenuExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /open menu/i });
    await expect(trigger).toBeInTheDocument();

    await userEvent.click(trigger);

    const menu = await within(canvasElement.ownerDocument.body).findByRole(
      "menu",
    );
    await expect(menu).toBeVisible();

    const statusBarItem = within(menu).getByRole("menuitemcheckbox", {
      name: /show status bar/i,
    });
    await expect(statusBarItem).toHaveAttribute("aria-checked", "true");

    await userEvent.click(statusBarItem);
    await expect(statusBarItem).toHaveAttribute("aria-checked", "false");

    const destructiveItem = within(menu).getByRole("menuitem", {
      name: /delete team/i,
    });
    await expect(destructiveItem).toBeInTheDocument();
  },
};
