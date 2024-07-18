import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { processImage } from '../../services/ocrService';
import { useHomeService } from '../../services/homeService';
import { lightTheme, darkTheme } from '../../assets/styles/theme';

// Mock for i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('../../services/ocrService');

// Mock navigator.clipboard.writeText
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

const TestComponent = () => {
  const {
    selectedFile,
    ocrText,
    loading,
    theme,
    isCheckedTheme,
    handleFileChange,
    handleFileUpload,
    handleCopyToClipboard,
    toggleTheme,
  } = useHomeService();

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        data-testid="file-input"
        style={{ display: 'none' }}
      />
      <button onClick={() => document.querySelector('input')?.click()} data-testid="upload-button">
        {loading ? 'Loading...' : 'Upload and Convert'}
      </button>
      <button onClick={handleFileUpload} data-testid="process-button">Process File</button>
      <button onClick={handleCopyToClipboard} data-testid="copy-button">Copy to Clipboard</button>
      <button onClick={toggleTheme} data-testid="theme-button">Toggle Theme</button>
      <div data-testid="ocr-text">{ocrText}</div>
      <div data-testid="theme-mode">{theme.palette.mode}</div>
    </div>
  );
};

describe('useHomeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createFileChangeEvent = (file: File): React.ChangeEvent<HTMLInputElement> => {
    const event: Partial<React.ChangeEvent<HTMLInputElement>> = {
      target: { files: [file] } as unknown as HTMLInputElement,
      currentTarget: { files: [file] } as unknown as HTMLInputElement,
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      persist: jest.fn(),
      nativeEvent: {} as any,
    };

    return event as React.ChangeEvent<HTMLInputElement>;
  };

  it('should handle file change', () => {
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    render(<TestComponent />);

    const input = screen.getByTestId('file-input') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    expect(input.files).not.toBeNull();
    if (input.files) {
      expect(input.files[0]).toBe(file);
    }
  });

  it('should handle file upload successfully', async () => {
    (processImage as jest.Mock).mockResolvedValue('extracted text');
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    render(<TestComponent />);

    const input = screen.getByTestId('file-input') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(screen.getByTestId('process-button'));

    await waitFor(() => {
      expect(processImage).toHaveBeenCalledWith(file);
      expect(screen.getByTestId('ocr-text')).toHaveTextContent('extracted text');
    });

    expect(screen.getByTestId('upload-button')).toHaveTextContent('Upload and Convert');
  });

  it('should handle file upload error', async () => {
    (processImage as jest.Mock).mockRejectedValue(new Error('Processing error'));
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    render(<TestComponent />);

    const input = screen.getByTestId('file-input') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(screen.getByTestId('process-button'));

    await waitFor(() => {
      expect(processImage).toHaveBeenCalledWith(file);
      expect(screen.getByTestId('ocr-text')).toHaveTextContent('');
    });

    expect(screen.getByTestId('upload-button')).toHaveTextContent('Upload and Convert');
  });

  it('should handle copy to clipboard successfully', async () => {
    const writeTextMock = navigator.clipboard.writeText as jest.Mock;
    writeTextMock.mockResolvedValue(0);
    render(<TestComponent />);

    fireEvent.click(screen.getByTestId('copy-button'));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
    });
  });

  it('should handle copy to clipboard error', async () => {
    const writeTextMock = navigator.clipboard.writeText as jest.Mock;
    writeTextMock.mockRejectedValue(new Error('Copy error'));
    render(<TestComponent />);

    fireEvent.click(screen.getByTestId('copy-button'));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('');
    });
  });

  it('should toggle theme', () => {
    render(<TestComponent />);

    fireEvent.click(screen.getByTestId('theme-button'));

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');

    fireEvent.click(screen.getByTestId('theme-button'));

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });
});
