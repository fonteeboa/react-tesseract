import { useState } from 'react';
import { processImage } from './ocrService';
import { lightTheme, darkTheme } from '../assets/styles/theme';
import { Theme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

export const useHomeService = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [ocrText, setOcrText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [theme, setTheme] = useState<Theme>(darkTheme);
    const [isCheckedTheme, setIsChecked] = useState(false);

    const { t } = useTranslation();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;
        setLoading(true);
        try {
            const text = await processImage(selectedFile);
            setOcrText(text);
        } catch (error) {
            console.error('Error processing image:', error);
            alert(t('error_processing_image'));
        } finally {
            setLoading(false);
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(ocrText).then(() => {
            alert(t('text_copied_to_clipboard'));
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert(t('error_copying_text'));
        });
    };

    const toggleTheme = () => {
        setIsChecked(!isCheckedTheme);
        setTheme((prevTheme) => (prevTheme.palette.mode === 'dark' ? lightTheme : darkTheme));
    };

    return {
        selectedFile,
        ocrText,
        loading,
        theme,
        isCheckedTheme,
        handleFileChange,
        handleFileUpload,
        handleCopyToClipboard,
        toggleTheme,
    };
};
