# React Tesseract

[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fonteeboa_react-tesseract&metric=alert_status)](https://sonarcloud.io/summary/overall?id=fonteeboa_react-tesseract)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=fonteeboa_react-tesseract&metric=security_rating)](https://sonarcloud.io/summary/overall?id=fonteeboa_react-tesseract)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=fonteeboa_react-tesseract&metric=vulnerabilities)](https://sonarcloud.io/summary/overall?id=fonteeboa_react-tesseract)
[![Maintainability](https://sonarcloud.io/api/project_badges/measure?project=fonteeboa_react-tesseract&metric=sqale_index)](https://sonarcloud.io/summary/overall?id=fonteeboa_react-tesseract)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=fonteeboa_react-tesseract&metric=reliability_rating)](https://sonarcloud.io/summary/overall?id=fonteeboa_react-tesseract)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=fonteeboa_react-tesseract&metric=duplicated_lines_density)](https://sonarcloud.io/summary/overall?id=fonteeboa_react-tesseract)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=fonteeboa_react-tesseract&metric=code_smells)](https://sonarcloud.io/summary/overall?id=fonteeboa_react-tesseract)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=fonteeboa_react-tesseract&metric=sqale_rating)](https://sonarcloud.io/summary/overall?id=fonteeboa_react-tesseract)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=fonteeboa_react-tesseract&metric=coverage)](https://sonarcloud.io/summary/overall?id=fonteeboa_react-tesseract)


📄 **English Version**: [README_EN.md](README_EN.md)

**React Tesseract** é uma aplicação web que permite realizar upload de imagens, extrair texto via OCR (Reconhecimento Óptico de Caracteres) usando **Tesseract.js**, e copiar o texto extraído para a área de transferência.  
Construída com **React**, **Material-UI (MUI)** e suporte a **i18n**, agora conta com melhorias significativas no sistema de **temas customizados**, organização de **tokens de cor**, e refinamentos de **UI/UX**.

---

## 🚀 Novidades e Mudanças Recentes
- **Expansão da pool de itens de extração** para maior flexibilidade nos testes e aplicações.
- **Rebranding completo do projeto** com nova identidade visual.
- **Sistema de tema aprimorado**:
  - Suporte a **light**, **dark** e **system**.
  - Tokens organizados e cores customizadas (`palette.common`, `palette.custom`).
  - Novo token `text.button` para personalização do texto em botões.
- **UI refinada** usando MUI, com melhor contraste e responsividade.
- Ajustes de **i18n** para suportar traduções mais completas e diretas no contexto.
- Melhorias na **consistência visual** de botões, cards e modais.
- Integração com **SonarCloud** para monitoramento contínuo de qualidade e segurança do código.

---

## 📷 Demonstração
Acesse a aplicação hospedada na **Vercel**:  
🔗 [React Tesseract - Live Demo](https://react-tesseract-fonteeboa.vercel.app)

---

## 📖 Como Usar
1. **Upload**  
   Clique no botão **"Upload and Convert"** e selecione uma imagem.
2. **Extração**  
   Aguarde enquanto o OCR processa o arquivo usando Tesseract.js.
3. **Visualização**  
   O texto extraído será exibido na tela.
4. **Cópia**  
   Clique em **"Copy to Clipboard"** para copiar o texto.
5. **Tema**  
   Use o alternador para mudar entre temas **claro**, **escuro** e **system**.

---

## 🧪 Testes
- Testes implementados com **Jest** e **Testing Library**.
- Cobertura de testes para componentes principais e serviços de OCR.
- Relatórios de qualidade e cobertura disponíveis no [SonarCloud](https://sonarcloud.io/summary/overall?id=fonteeboa_react-tesseract).

---

## 📜 Licença
Este projeto está licenciado sob a [Licença MIT](LICENSE).
