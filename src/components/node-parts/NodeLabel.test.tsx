import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import NodeLabel from './NodeLabel';

describe('NodeLabel', () => {
  const mockOnLabelChange = jest.fn();

  it('should display the label text', () => {
    const { getByText } = render(<NodeLabel label="Test Label" onLabelChange={mockOnLabelChange} />);
    expect(getByText('Test Label')).toBeInTheDocument();
  });

  it('should switch to edit mode on double click', () => {
    const { getByText, getByDisplayValue } = render(<NodeLabel label="Test Label" onLabelChange={mockOnLabelChange} />);
    fireEvent.doubleClick(getByText('Test Label'));
    expect(getByDisplayValue('Test Label')).toBeInTheDocument();
  });

  it('should exit edit mode without saving on Escape', () => {
    const { getByText, getByDisplayValue } = render(<NodeLabel label="Test Label" onLabelChange={mockOnLabelChange} />);
    fireEvent.doubleClick(getByText('Test Label'));
    const textarea = getByDisplayValue('Test Label');
    fireEvent.change(textarea, { target: { value: 'New Label' } });
    fireEvent.keyDown(textarea, { key: 'Escape' });
    expect(getByText('Test Label')).toBeInTheDocument();
  });

  it('should call onLabelChange and exit edit mode on blur', async () => {
    const { getByText, getByDisplayValue, rerender } = render(<NodeLabel label="Test Label" onLabelChange={mockOnLabelChange} />);
    fireEvent.doubleClick(getByText('Test Label'));
    const textarea = getByDisplayValue('Test Label');
    fireEvent.change(textarea, { target: { value: 'New Label' } });
    fireEvent.blur(textarea);
    await waitFor(() => expect(mockOnLabelChange).toHaveBeenCalledWith('New Label'));
    rerender(<NodeLabel label="New Label" onLabelChange={mockOnLabelChange} />);
    expect(getByText('New Label')).toBeInTheDocument();
  });


});