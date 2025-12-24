import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JoinForm } from "@/components/JoinForm";

test("JoinForm submits code", async () => {
  const user = userEvent.setup();
  const onJoin = jest.fn();

  render(<JoinForm onJoin={onJoin} isLoading={false} error={null} />);

  await user.type(screen.getByLabelText(/session code/i), "abc123");
  await user.click(screen.getByRole("button", { name: /join session/i }));

  expect(onJoin).toHaveBeenCalledWith("abc123");
});
