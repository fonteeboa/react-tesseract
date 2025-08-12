import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FileUpload from "../../components/FileUpload";

// i18n mock simples (retorna a key)
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

// Ícone → span simples pra facilitar query
jest.mock("@mui/icons-material/CloudUpload", () => () => <span data-testid="icon-upload" />);

describe("<FileUpload />", () => {
  const handleFileChange = jest.fn();
  const handleFileUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderComp(
    props?: Partial<React.ComponentProps<typeof FileUpload>>
  ) {
    const defaultProps = {
      selectedFile: null as File | null,
      handleFileChange,
      handleFileUpload,
      loading: false,
    };
    return render(<FileUpload {...defaultProps} {...props} />);
  }

  test("render básico: botão de seleção, legenda de formatos, botão de upload desabilitado sem arquivo", () => {
    renderComp();

    // Botão de selecionar arquivo (label)
    const selectBtn = screen.getByRole("button", { name: "select.file" });
    expect(selectBtn).toBeEnabled();
    expect(screen.getByTestId("icon-upload")).toBeInTheDocument();

    // Legenda (usa a chave porque o mock de i18n retorna a própria key)
    expect(screen.getByText("supported.formats")).toBeInTheDocument();

    // Botão de extrair
    const extractBtn = screen.getByRole("button", { name: "extract.text" });
    expect(extractBtn).toBeDisabled();
  });


  test("renderiza bloco com nome do arquivo quando selectedFile existe", () => {
    const file = new File(["x"], "image.png", { type: "image/png" });
    renderComp({ selectedFile: file });

    // texto "selected.file.name": <nome>
    expect(screen.getByText(/selected\.file\.name/i)).toBeInTheDocument();
    expect(screen.getByText(/image\.png/)).toBeInTheDocument();

    // Agora o botão de extrair deve estar habilitado
    const extractBtn = screen.getByRole("button", { name: "extract.text" });
    expect(extractBtn).toBeEnabled();

    // Clicar aciona handleFileUpload
    fireEvent.click(extractBtn);
    expect(handleFileUpload).toHaveBeenCalledTimes(1);
  });

  test("estado não-loading: aria-busy=false e sem progressbar", () => {
    const file = new File(["x"], "x.csv", { type: "text/csv" });
    renderComp({ selectedFile: file, loading: false });

    const extractBtn = screen.getByRole("button", { name: "extract.text" });
    expect(extractBtn).toHaveAttribute("aria-busy", "false");
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
