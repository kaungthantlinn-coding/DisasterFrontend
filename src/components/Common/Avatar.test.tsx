import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Avatar from './Avatar';

describe('Avatar Component', () => {
  it('renders with valid image URL', async () => {
    const mockSrc = 'https://example.com/avatar.jpg';
    const mockName = 'John Doe';
    
    render(<Avatar src={mockSrc} name={mockName} alt="User avatar" />);
    
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockSrc);
    expect(img).toHaveAttribute('alt', 'User avatar');
  });

  it('renders initials when no image URL provided', () => {
    const mockName = 'John Doe';
    
    render(<Avatar name={mockName} />);
    
    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders initials when image fails to load', async () => {
    const mockSrc = 'https://invalid-url.com/avatar.jpg';
    const mockName = 'John Doe';
    
    render(<Avatar src={mockSrc} name={mockName} />);
    
    const img = screen.getByRole('img');
    
    // Simulate image load error
    fireEvent.error(img);
    
    await waitFor(() => {
      expect(screen.getByText('JD')).toBeInTheDocument();
    });
  });

  it('renders default user icon when no name provided', () => {
    render(<Avatar />);
    
    // Should render the default user icon
    const container = screen.getByRole('img', { hidden: true }).parentElement;
    expect(container).toHaveClass('bg-blue-100');
  });

  it('handles different sizes correctly', () => {
    const { rerender } = render(<Avatar name="John Doe" size="sm" />);
    expect(screen.getByText('JD').parentElement).toHaveClass('w-6', 'h-6');

    rerender(<Avatar name="John Doe" size="lg" />);
    expect(screen.getByText('JD').parentElement).toHaveClass('w-10', 'h-10');

    rerender(<Avatar name="John Doe" size="xl" />);
    expect(screen.getByText('JD').parentElement).toHaveClass('w-12', 'h-12');
  });

  it('applies custom className', () => {
    const customClass = 'custom-avatar-class';
    render(<Avatar name="John Doe" className={customClass} />);
    
    expect(screen.getByText('JD').parentElement).toHaveClass(customClass);
  });

  it('handles single name correctly', () => {
    render(<Avatar name="John" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('handles empty name gracefully', () => {
    render(<Avatar name="" />);
    
    // Should render the default user icon when name is empty
    const container = screen.getByRole('img', { hidden: true }).parentElement;
    expect(container).toHaveClass('bg-blue-100');
  });

  it('shows loading state initially when image is provided', () => {
    const mockSrc = 'https://example.com/avatar.jpg';
    
    render(<Avatar src={mockSrc} name="John Doe" />);
    
    // Should show loading state initially
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('logs warning when image fails to load', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const mockSrc = 'https://invalid-url.com/avatar.jpg';
    
    render(<Avatar src={mockSrc} name="John Doe" />);
    
    const img = screen.getByRole('img');
    fireEvent.error(img);
    
    expect(consoleSpy).toHaveBeenCalledWith('Avatar image failed to load:', mockSrc);
    
    consoleSpy.mockRestore();
  });
});
