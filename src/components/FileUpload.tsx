import React, { useId } from "react";
import { Button, Box, Typography, CircularProgress, Paper, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FileUploadProps } from "../types";

const FileUpload: React.FC<FileUploadProps> = ({ selectedFile, handleFileChange, handleFileUpload, loading }) => {
  const { t } = useTranslation();
  const inputId = useId();

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 3 },
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        borderRadius: 3,
      }}
    >
      <Stack spacing={2} alignItems="stretch" width="100%">
        <Box>
          <Button
            component="label"
            htmlFor={inputId}
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{
              width: { xs: "100%", sm: "auto" },
            }}
            disabled={loading}
            aria-label={t("select.file")}
          >
            {t("select.file")}
            <input
              id={inputId}
              type="file"
              hidden
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.pdf,.svg,.html,.htm,.txt,.csv"
            />
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, lineHeight: 1.4 }}>
            {t("supported.formats", "PDF, PNG, JPG, SVG, HTML, TXT, CSV")}
          </Typography>
        </Box>

        {selectedFile && (
          <Box
            sx={{
              px: 1.5,
              py: 1,
              borderRadius: 1.5,
              bgcolor: "action.hover",
              border: (theme) => `1px solid ${theme.palette.divider}`,
              maxWidth: "100%",
            }}
            title={selectedFile.name}
            aria-live="polite"
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                wordBreak: "break-all",
                overflowWrap: "anywhere",
              }}
            >
              {t("selected.file.name")}: {selectedFile.name}
            </Typography>
          </Box>
        )}

        <Button
          onClick={handleFileUpload}
          disabled={!selectedFile || loading}
          variant="contained"
          size="large"
          sx={{ width: { xs: "100%", sm: "auto" }, alignSelf: { sm: "start" } }}
          endIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          aria-busy={loading ? "true" : "false"}
        >
          {loading ? t("processing") : t("extract.text")}
        </Button>
      </Stack>
    </Paper>
  );
};

export default FileUpload;
