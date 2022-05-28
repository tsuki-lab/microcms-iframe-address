import 'mvp.css';
import '../src/global.css';
import '../src/utility.css';
import '../src/app.css';
import { initialize, mswDecorator } from 'msw-storybook-addon';

import * as jest from 'jest-mock';
window.jest = jest;

// Initialize MSW
initialize();

// Provide the MSW addon decorator globally
export const decorators = [mswDecorator];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
