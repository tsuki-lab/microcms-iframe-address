import 'mvp.css';
import '../src/global.css';
import '../src/utility.css';
import '../src/app.css';
import { initialize, mswDecorator } from 'msw-storybook-addon';
import { rest } from 'msw';

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
  msw: {
    handlers: [
      rest.get('https://zipcloud.ibsnet.co.jp/api/search', (req, res, ctx) => {
        const zipcodeParams = req.url.searchParams.get('zipcode') ?? '';
        const zipcode = zipcodeParams.replace('-', '');
        const defaultResponse = [ctx.delay(700), ctx.status(200)];

        if (zipcodeParams.length <= 0) {
          return res(
            ...defaultResponse,
            ctx.json({
              message: '必須パラメータが指定されていません。',
              results: null,
              status: 400,
            })
          );
        }

        if (zipcode.length !== 7) {
          return res(
            ...defaultResponse,
            ctx.json({
              message: 'パラメータ「郵便番号」の桁数が不正です。',
              results: null,
              status: 400,
            })
          );
        }

        if (zipcode === '1640001') {
          return res(
            ...defaultResponse,
            ctx.json({
              message: null,
              results: [
                {
                  address1: '東京都',
                  address2: '中野区',
                  address3: '中野',
                  kana1: 'ﾄｳｷｮｳﾄ',
                  kana2: 'ﾅｶﾉｸ',
                  kana3: 'ﾅｶﾉ',
                  prefcode: '13',
                  zipcode: '1640001',
                },
              ],
              status: 200,
            })
          );
        } else {
          return res(
            ...defaultResponse,
            ctx.json({
              message: null,
              results: null,
              status: 200,
            })
          );
        }
      }),
    ],
  },
};
