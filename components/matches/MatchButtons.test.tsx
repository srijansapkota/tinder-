import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MatchButtons from './MatchButtons';

describe('MatchButtons', () => {
  it('renders a Like and a Pass button', () => {
    render(<MatchButtons onLike={vi.fn()} onPass={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Like' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pass' })).toBeInTheDocument();
  });

  it('calls onLike exactly once when the Like button is clicked', async () => {
    const user = userEvent.setup();
    const onLike = vi.fn();

    render(<MatchButtons onLike={onLike} onPass={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Like' }));

    expect(onLike).toHaveBeenCalledTimes(1);
  });

  it('calls onPass exactly once when the Pass button is clicked', async () => {
    const user = userEvent.setup();
    const onPass = vi.fn();

    render(<MatchButtons onLike={vi.fn()} onPass={onPass} />);
    await user.click(screen.getByRole('button', { name: 'Pass' }));

    expect(onPass).toHaveBeenCalledTimes(1);
  });

  it('does not call onLike when Pass is clicked, and vice versa', async () => {
    const user = userEvent.setup();
    const onLike = vi.fn();
    const onPass = vi.fn();

    render(<MatchButtons onLike={onLike} onPass={onPass} />);
    await user.click(screen.getByRole('button', { name: 'Pass' }));

    expect(onPass).toHaveBeenCalledTimes(1);
    expect(onLike).not.toHaveBeenCalled();
  });
});
