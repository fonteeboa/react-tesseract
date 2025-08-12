// src/components/ExtractedText.tsx
import React, { useMemo } from "react";
import { Box, Typography, IconButton, Tooltip, Paper, Skeleton, Stack, Divider, Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import ReplayIcon from "@mui/icons-material/Replay";
import { useTranslation } from "react-i18next";
import { ExtractedTextProps } from "../types";

const Placeholder: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Paper
      variant="outlined"
      sx={{
        textAlign: "center",
        p: { xs: 3, sm: 5 },
        border: (theme) => `2px dashed ${theme.palette.divider}`,
        borderRadius: 3,
        color: "text.secondary",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <ImageSearchIcon sx={{ fontSize: { xs: 48, sm: 60 } }} />
      <Typography variant="h6" component="h3">
        {t("text.will.appear.here")}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {t("upload.file.to.start")}
      </Typography>
    </Paper>
  );
};

const LoadingSkeleton: React.FC = () => (
  <Stack spacing={1.5} sx={{ width: "100%" }}>
    <Skeleton variant="text" sx={{ fontSize: "1.5rem", maxWidth: 240 }} />
    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
    <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
  </Stack>
);

const ExtractedText: React.FC<ExtractedTextProps> = ({ ocrText, loading, handleCopyToClipboard, handleNewItem }) => {
  const { t } = useTranslation();

  const hasText = useMemo(() => typeof ocrText === "string" && ocrText.trim().length > 0, [ocrText]);

  if (loading) return <LoadingSkeleton />;
  if (!hasText) return <Placeholder />;

  return (
    <Paper
      elevation={2}
      sx={{
        width: "100%",
        p: { xs: 2, sm: 3 },
        mt: { xs: 2, sm: 3 },
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5} minWidth={0}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={handleNewItem} size="small" variant="outlined" startIcon={<ReplayIcon />}>
            {t("new.item")}
          </Button>
        </Box>
        <Typography variant="h6" component="h2" color="text.primary" noWrap sx={{ minWidth: 0, pr: 1 }}>
          {t("extracted.text")}
        </Typography>
        <Tooltip title={t("copy.to.clipboard")}>
          <IconButton onClick={handleCopyToClipboard} color="primary" size="small" aria-label={t("copy.to.clipboard")}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box
        aria-label="region"
        aria-live="polite"
        sx={{
          maxHeight: { xs: "50vh" },
          overflowY: "auto",
          borderRadius: 1.5,
          p: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: "background.default",
        }}
      >
        <Box
          component="pre"
          sx={{
            m: 0,
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            lineHeight: 1.7,
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          {ocrText}
        </Box>
      </Box>
    </Paper>
  );
};

export default ExtractedText;
