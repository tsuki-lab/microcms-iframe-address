import 'mvp.css';
import '../src/global.css';
import '../src/utility.css';
import '../src/app.css';
import * as jest from 'jest-mock';
window.jest = jest;

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
