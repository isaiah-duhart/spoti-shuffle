import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import App from '../App';

describe("App component", () => {
  it("renders correct heading", () => {
    render(<App />);
    expect(screen.getByRole("heading").textContent).toMatch(/Ready to revolutionize your music listening experience?/i);
  });
});