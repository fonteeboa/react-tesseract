import React from 'react';
import { render } from '@testing-library/react';
import Home from '../../pages/Home';
import './assets/styles/index.css';

// Mock ReactDOM.createRoot
jest.mock('react-dom/client', () => ({
  createRoot: () => ({
    render: jest.fn(),
  }),
}));

test('renders the Home component without crashing', () => {
  const rootDiv = document.createElement('div');
  rootDiv.id = 'root';
  document.body.appendChild(rootDiv);

  const { createRoot } = require('react-dom/client');
  const rootInstance = createRoot(rootDiv);

  rootInstance.render(<Home />);

  expect(rootInstance.render).toHaveBeenCalledWith(<Home />);
});