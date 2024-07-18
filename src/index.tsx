import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css';
import Home from './pages/Home';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <I18nextProvider i18n={i18n}>
      <Home />
    </I18nextProvider>
);
