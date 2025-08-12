import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../../pages/Home";

jest.mock("../../assets/images/logo_brand.png", () => "logo_brand.png");
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));
jest.mock("@mui/icons-material/Brightness4", () => () => <span data-testid="icon-dark" />);
jest.mock("@mui/icons-material/Brightness7", () => () => <span data-testid="icon-light" />);
jest.mock("@mui/icons-material/CollectionsBookmark", () => () => <span data-testid="icon-collections" />);
jest.mock("@mui/icons-material/East", () => () => <span data-testid="icon-east" />);
jest.mock("../../components/FileUpload", () => (props: any) => (
  <div data-testid="file-upload" data-loading={String(props.loading)}>
    <button onClick={props.handleFileUpload}>do-upload</button>
    <input
      aria-label="file-input"
      type="file"
      onChange={(e) => props.handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
    />
  </div>
));

jest.mock("../../components/ExtractedText", () => (props: any) => (
  <div data-testid="extracted-text" data-loading={String(props.loading)}>
    <div data-testid="ocr-text">{props.ocrText}</div>
    <button onClick={props.handleCopyToClipboard}>copy</button>
    <button onClick={props.handleNewItem}>new-item</button>
  </div>
));

const toggleThemeService = jest.fn();
const handleFileChange = jest.fn();
const handleFileUpload = jest.fn();
const handleCopyToClipboard = jest.fn();
const resetExtraction = jest.fn();

jest.mock("../../services/homeService", () => ({
  useHomeService: jest.fn(),
}));

import { useHomeService } from "../../services/homeService";

function mockService({ selectedFile = null, ocrText = "", loading = false, isCheckedTheme = false } = {}) {
  (useHomeService as jest.Mock).mockReturnValue({
    selectedFile,
    ocrText,
    loading,
    isCheckedTheme,
    handleFileChange,
    handleFileUpload,
    handleCopyToClipboard,
    toggleThemeService,
    resetExtraction,
  });
}

describe("<Home />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("render inicial (intro) com logo e botão Start; ícone de tema para modo escuro", () => {
    mockService({ ocrText: "", loading: false, isCheckedTheme: false });
    render(<Home />);
    const logo = screen.getByAltText("Fonteeboa Logo");
    expect(logo).toBeInTheDocument();
    expect(logo.getAttribute("src")).toContain("logo_brand.png");
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("welcome.subtitle")).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(tabs[2]).toBeDisabled();
    expect(screen.getByTestId("icon-dark")).toBeInTheDocument();
    const startBtn = screen.getByRole("button", { name: "start" });
    expect(startBtn).toBeInTheDocument();
  });

  test("toggle de tema aciona toggleThemeService e alterna ícone quando isCheckedTheme=true", () => {
    mockService({ isCheckedTheme: true });
    render(<Home />);
    expect(screen.getByTestId("icon-light")).toBeInTheDocument();
    const toggleBtn = screen.getByRole("button", { name: "toggle.theme" });
    fireEvent.click(toggleBtn);
    expect(toggleThemeService).toHaveBeenCalledTimes(1);
  });

  test("navegação: intro -> upload via botão Start; FileUpload é exibido; onChange e upload funcionam", () => {
    mockService({ ocrText: "", loading: false });
    render(<Home />);
    fireEvent.click(screen.getByRole("button", { name: "start" }));
    const upload = screen.getByTestId("file-upload");
    expect(upload).toBeInTheDocument();
    const fileInput = screen.getByLabelText("file-input");
    fireEvent.change(fileInput, { target: { files: [new File(["x"], "x.png", { type: "image/png" })] } });
    expect(handleFileChange).toHaveBeenCalled();
    fireEvent.click(screen.getByText("do-upload"));
    expect(handleFileUpload).toHaveBeenCalled();
  });

  test("abas: clicar na aba 2 (upload) e depois forçar result quando loading = true", () => {
    mockService({ ocrText: "", loading: true });
    render(<Home />);
    const tabs = screen.getAllByRole("tab");
    fireEvent.click(tabs[1]);
    expect(screen.getByTestId("file-upload")).toBeInTheDocument();
    expect(tabs[2]).toBeEnabled();
    fireEvent.click(tabs[2]);
    expect(screen.getByTestId("extracted-text")).toBeInTheDocument();
  });

  test("handleNewItem: volta para upload e chama resetExtraction", async () => {
    mockService({ ocrText: "ok", loading: false });
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByTestId("extracted-text")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("new-item"));
    expect(resetExtraction).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("file-upload")).toBeInTheDocument();
  });

  test("aba result permanece desabilitada quando !hasText e !loading; navegar por abas 0/1 funciona", () => {
    mockService({ ocrText: "", loading: false });
    render(<Home />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[2]).toBeDisabled();
    fireEvent.click(tabs[0]);
    expect(screen.getByTestId("icon-collections")).toBeInTheDocument();
    fireEvent.click(tabs[1]);
    expect(screen.getByTestId("file-upload")).toBeInTheDocument();
  });

  test("botão copy no result dispara handleCopyToClipboard", async () => {
    mockService({ ocrText: "copiar", loading: false });
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByTestId("extracted-text")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("copy"));
    expect(handleCopyToClipboard).toHaveBeenCalledTimes(1);
  });
});
