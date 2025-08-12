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


📄 **Versão em português**: [README.md](README.md)  

**React Tesseract** is a web application that allows users to upload images, extract text using OCR (Optical Character Recognition) powered by **Tesseract.js**, and copy the extracted text to the clipboard.  
It is built with **React**, **Material-UI (MUI)**, and **i18n** support, now enhanced with **custom theme tokens**, **light/dark/system theme support**, and several UI/UX refinements.

---

## 🚀 Recent Updates
- Expanded the **pool of extractable items** for broader testing and flexibility.
- **Complete project rebranding** with a new visual identity.
- **Improved theme system**:
  - Supports **light**, **dark**, and **system** modes.
  - Organized tokens with custom colors (`palette.common`, `palette.custom`).
  - Added a dedicated `text.button` token for button text color customization.
- **UI refinements** for better contrast and responsiveness.
- Enhanced **i18n integration** for more accurate context translations.
- Improved **visual consistency** for buttons, cards, and modals.
- Integrated with **SonarCloud** for continuous code quality and security analysis.

---

## 📷 Live Demo
Try the application hosted on **Vercel**:  
🔗 [React Tesseract - Live Demo](https://react-tesseract-fonteeboa.vercel.app)

---

## 📖 How to Use
1. **Upload**  
   Click the **"Upload and Convert"** button and select an image.
2. **Extraction**  
   Wait while OCR processes the file using Tesseract.js.
3. **View**  
   The extracted text will be displayed on the screen.
4. **Copy**  
   Click **"Copy to Clipboard"** to copy the extracted text.
5. **Theme Switch**  
   Use the toggle to switch between **light**, **dark**, and **system** themes.

---

## 🧪 Tests
- Implemented with **Jest** and **Testing Library**.
- Covers main components and OCR service logic.
- Quality and coverage reports available on [SonarCloud](https://sonarcloud.io/summary/overall?id=fonteeboa_react-tesseract).

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).
