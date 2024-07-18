import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Home from '../../pages/Home';
import { useHomeService } from '../../services/homeService';

// Mock for i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock for useHomeService
jest.mock('../../services/homeService', () => ({
  useHomeService: jest.fn(),
}));

describe('Home', () => {
  const mockUseHomeService = {
    selectedFile: null,
    ocrText: '',
    loading: false,
    theme: createTheme({
      palette: {
        mode: 'dark',
      },
      spacing: 8,
    }),
    isCheckedTheme: false,
    handleFileChange: jest.fn(),
    handleFileUpload: jest.fn(),
    handleCopyToClipboard: jest.fn(),
    toggleTheme: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useHomeService as jest.Mock).mockReturnValue(mockUseHomeService);
  });

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(
      <ThemeProvider theme={mockUseHomeService.theme}>
        {ui}
      </ThemeProvider>
    );
  };

  it('should render correctly', () => {
    renderWithTheme(<Home />);
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'toggle_theme' })).toBeInTheDocument();
  });

  it('should call toggleTheme when theme button is clicked', () => {
    renderWithTheme(<Home />);
    const themeButton = screen.getByRole('button', { name: 'toggle_theme' });
    fireEvent.click(themeButton);
    expect(mockUseHomeService.toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should handle file selection and upload', async () => {
    renderWithTheme(<Home />);
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });

    const uploadButton = screen.getByRole('button', { name: 'upload_and_convert' });
    fireEvent.click(uploadButton);

    const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockUseHomeService.handleFileChange).toHaveBeenCalledTimes(1);
    expect(mockUseHomeService.handleFileUpload).toHaveBeenCalledTimes(1);
  });

  it('should handle copy to clipboard', () => {
    renderWithTheme(<Home />);
    const copyButton = screen.getByRole('button', { name: 'copy_to_clipboard' });
    fireEvent.click(copyButton);
    expect(mockUseHomeService.handleCopyToClipboard).toHaveBeenCalledTimes(1);
  });
});
