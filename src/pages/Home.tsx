import React from 'react';
import { Toolbar, Typography, Container, Paper, Box, IconButton, Tooltip } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import FileUpload from '../components/FileUpload';
import ExtractedText from '../components/ExtractedText';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useHomeService } from '../services/homeService';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
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

  const { t } = useTranslation();

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Paper elevation={3} style={{ padding: '20px', minWidth: '300px' }}>
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              {t('title')}
            </Typography>
            <Box display="flex" alignItems="center">
              <Tooltip title={t('toggle_theme')}>
                <IconButton onClick={toggleTheme} size="small" style={{ padding: 8 }}>
                  {isCheckedTheme ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
          <Box display="flex" flexDirection="column" alignItems="center">
            <FileUpload
              selectedFile={selectedFile}
              handleFileChange={handleFileChange}
              handleFileUpload={handleFileUpload}
              loading={loading}
            />
            <ExtractedText
              ocrText={ocrText}
              handleCopyToClipboard={handleCopyToClipboard}
            />
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Home;
