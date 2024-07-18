import React from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { ExtractedTextProps } from '../domain';
import { useTranslation } from 'react-i18next';

const ExtractedText: React.FC<ExtractedTextProps> = ({ ocrText, handleCopyToClipboard }) => {
    const { t } = useTranslation();

    return (
        <>
            <Typography variant="h6" gutterBottom>
                {t('extracted_text')}
            </Typography>
            <TextField
                value={ocrText}
                multiline
                rows={10}
                variant="outlined"
                fullWidth
                InputProps={{
                    readOnly: true,
                }}
                style={{ marginBottom: '20px' }}
            />
            <Button
                variant="contained"
                color="secondary"
                onClick={handleCopyToClipboard}
            >
                {t('copy_to_clipboard')}
            </Button>
        </>
    );
};

export default ExtractedText;
