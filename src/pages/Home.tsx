import React, { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  Box,
  IconButton,
  Tooltip,
  Link,
  Tabs,
  Tab,
  Button,
  Stack,
} from "@mui/material";
import FileUpload from "../components/FileUpload";
import ExtractedText from "../components/ExtractedText";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CollectionsBookmarkIcon from "@mui/icons-material/CollectionsBookmark";
import EastIcon from "@mui/icons-material/East";
import { useHomeService } from "../services/homeService";
import { useTranslation } from "react-i18next";
import Logo from "../assets/images/logo_brand.png";
import { Stage } from "../types";

const Home: React.FC = () => {
  const {
    selectedFile,
    ocrText,
    loading,
    isCheckedTheme,
    handleFileChange,
    handleFileUpload,
    handleCopyToClipboard,
    toggleThemeService,
    resetExtraction,
  } = useHomeService();

  const { t } = useTranslation();
  const [stage, setStage] = useState<Stage>("intro");

  const hasText = useMemo(() => typeof ocrText === "string" && ocrText.trim().length > 0, [ocrText]);

  useEffect(() => {
    if (hasText && !loading) setStage("result");
  }, [hasText, loading]);

  let tabIndex: number;

  switch (stage) {
    case "intro":
      tabIndex = 0;
      break;
    case "upload":
      tabIndex = 1;
      break;
    default:
      tabIndex = 2;
      break;
  }

  const handleNewItem = () => {
    resetExtraction();
    setStage("upload");
  };

  return (
    <Box>
      <Container
        component="main"
        maxWidth="lg"
        sx={{ mt: { xs: 2.5, sm: 4 }, mb: { xs: 2.5, sm: 5 }, flexGrow: 1, width: "100%" }}
      >
        <AppBar position="sticky" color="default" elevation={1} sx={{ borderRadius: "10px 10px 0 0" }}>
          <Toolbar sx={{ gap: 1, px: { xs: 2, sm: 4 }, minHeight: { xs: 56, sm: 64 } }}>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, minWidth: 0 }}>
              <Link
                href="/"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "inherit",
                  minWidth: 0,
                }}
              >
                <Box
                  component="img"
                  src={Logo}
                  alt="Fonteeboa Logo"
                  sx={{ height: { xs: 28, sm: 40 }, mr: { xs: 1.25, sm: 2 }, display: "block", flexShrink: 0 }}
                />
              </Link>
            </Box>

            <Tooltip title={t("toggle.theme")}>
              <IconButton
                onClick={toggleThemeService}
                color="inherit"
                size="medium"
                sx={{ ml: 1, flexShrink: 0, maxWidth: 40 }}
              >
                {isCheckedTheme ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            bgcolor: "background.paper",
            overflow: "hidden",
            minHeight: { md: 420 },
            maxHeight: { xs: "calc(100vh - 64px)", sm: "calc(100vh - 80px)" },
            maxWidth: "100%",
            borderRadius: "0 0 10px 10px",
          }}
        >
          <Typography
            variant="h6"
            component="span"
            noWrap
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1rem", sm: "1.25rem" },
              lineHeight: 1.2,
              alignContent: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            {t("title")}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ paddingTop: "20px" }}>
            {t("welcome.subtitle")}
          </Typography>
          <Tabs
            value={tabIndex}
            onChange={(_, idx) => {
              if (idx === 0) setStage("intro");
              if (idx === 1) setStage("upload");
              if (idx === 2 && (hasText || loading)) setStage("result");
            }}
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            <Tab label={t("tab.intro")} />
            <Tab label={t("tab.intro")} />
            <Tab label={t("tab.result")} disabled={!hasText && !loading} />
          </Tabs>

          {stage === "intro" && (
            <Box
              sx={{
                textAlign: "center",
                p: { xs: 3, sm: 5 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <CollectionsBookmarkIcon sx={{ fontSize: { xs: 56, sm: 72 } }} />
              <Typography variant="h5" fontWeight={700}>
                {t("welcome.title")}
              </Typography>

              <Button
                onClick={() => setStage("upload")}
                variant="contained"
                size="large"
                startIcon={<EastIcon />}
                sx={{ mt: 1, width: { xs: "100%", sm: "auto" }, color: theme => theme.palette.common.white }}
              >
                {t("start")}
              </Button>
            </Box>
          )}

          {stage === "upload" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FileUpload
                selectedFile={stage === "upload" ? selectedFile : null}
                handleFileChange={handleFileChange}
                handleFileUpload={handleFileUpload}
                loading={loading}
              />
            </Box>
          )}

          {stage === "result" && (
            <Stack spacing={2}>
              <ExtractedText handleNewItem={handleNewItem} ocrText={ocrText} loading={loading} handleCopyToClipboard={handleCopyToClipboard} />
            </Stack>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
