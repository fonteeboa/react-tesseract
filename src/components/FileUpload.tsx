import React, { useRef } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { FileUploadProps } from '../domain';
import { useTranslation } from 'react-i18next';

const FileUpload: React.FC<FileUploadProps> = ({ handleFileChange, handleFileUpload, loading }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event);
        handleFileChange(event);
        handleFileUpload();
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                style={{ display: 'none' }}
                data-testid="file-input"
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleButtonClick}
                disabled={loading}
                style={{ marginBottom: '20px' }}
            >
                {loading ? <CircularProgress size={24} /> : t('upload_and_convert')}
            </Button>
        </>
    );
};

export default FileUpload;
