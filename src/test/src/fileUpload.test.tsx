import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FileUpload from '../../components/FileUpload';
import { FileUploadProps } from '../../domain';

// Mock for i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const renderComponent = (props: Partial<FileUploadProps> = {}) => {
  const defaultProps: FileUploadProps = {
    selectedFile: null,
    handleFileChange: jest.fn(),
    handleFileUpload: jest.fn(),
    loading: false,
  };
  return render(<FileUpload {...defaultProps} {...props} />);
};

describe('FileUpload', () => {
  it('should render correctly', () => {
    renderComponent();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent('upload_and_convert');
  });

  it('should handle file selection and upload', () => {
    const handleFileChange = jest.fn();
    const handleFileUpload = jest.fn();
    renderComponent({ handleFileChange, handleFileUpload });

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(fileInput).toBeInTheDocument();

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(handleFileChange).toHaveBeenCalledTimes(1);
    expect(handleFileUpload).toHaveBeenCalledTimes(1);
  });

  it('should disable button when loading', () => {
    renderComponent({ loading: true });
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should enable button when not loading', () => {
    renderComponent({ loading: false });
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });
});
