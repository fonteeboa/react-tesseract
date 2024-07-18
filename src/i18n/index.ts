import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { detectLanguage } from '../services/languageService';

const resources = {
  en: {
    translation: {
      "title": "Image to Text",
      "toggle_theme": "Toggle light/dark theme",
      "help_text": "How to use: Upload an image and click 'Convert' to extract text.",
      "extracted_text": "Extracted Text",
      "copy_to_clipboard": "Copy to Clipboard",
      "upload_and_convert": "Upload and Convert",
      "text_copied_to_clipboard": "Text copied to clipboard",
      "error_processing_image": "Error processing the image. Please try again.",
      "error_copying_text": "Error copying text to clipboard. Please try again."
    }
  },
  pt: {
    translation: {
      "title": "Imagem para Texto",
      "toggle_theme": "Alternar tema claro/escuro",
      "help_text": "Como usar: Carregue uma imagem e clique em 'Converter' para extrair o texto.",
      "extracted_text": "Texto Extraído",
      "copy_to_clipboard": "Copiar para a Área de Transferência",
      "upload_and_convert": "Carregar e Converter",
      "text_copied_to_clipboard": "Texto copiado para a área de transferência",
      "error_processing_image": "Erro ao processar a imagem. Por favor, tente novamente.",
      "error_copying_text": "Erro ao copiar o texto para a área de transferência. Por favor, tente novamente."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectLanguage(),
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
