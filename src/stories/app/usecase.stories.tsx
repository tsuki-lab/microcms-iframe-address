import { expect } from '@storybook/jest';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { userEvent, screen, waitFor } from '@storybook/testing-library';

import { App } from '../../App';
import { Initial } from './state.stories';

export default {
  title: 'App/テストコード',
  component: App,
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <App {...args} />;

const expectSearchAddress = async () => {
  userEvent.click(screen.getByRole('button', { name: '郵便番号で住所を検索' }));
  expect(await screen.findByRole('progressbar')).toBeInTheDocument();
  await waitFor(
    async () => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    },
    { timeout: 5000 }
  );
};

export const ComplementAddress = Template.bind({});
ComplementAddress.storyName = 'SUCCESS_住所検索結果';
ComplementAddress.play = async (ctx) => {
  await Initial.play?.(ctx);
  await userEvent.type(screen.getByLabelText('郵便番号'), '1640001', {
    delay: 50,
  });
  expect(screen.getByLabelText('郵便番号')).toHaveValue('1640001');
  await expectSearchAddress();
  [
    { label: '郵便番号', value: '1640001' },
    { label: '都道府県', value: '東京都' },
    { label: '市区町村', value: '中野区' },
    { label: '町名以下', value: '中野' },
  ].forEach(({ label, value }) => {
    expect(screen.getByLabelText(label)).toHaveValue(value);
  });
};

export const ErrorNotPostalCodeValue = Template.bind({});
ErrorNotPostalCodeValue.storyName = 'ERROR_郵便番号未入力';
ErrorNotPostalCodeValue.play = async (ctx) => {
  await Initial.play?.(ctx);
  userEvent.click(screen.getByRole('button', { name: '郵便番号で住所を検索' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    '郵便番号が入力されていません。'
  );
};

export const ErrorIncorrectPostalCodeValue = Template.bind({});
ErrorIncorrectPostalCodeValue.storyName = 'ERROR_誤った郵便番号';
ErrorIncorrectPostalCodeValue.play = async (ctx) => {
  await Initial.play?.(ctx);
  await userEvent.type(screen.getByLabelText('郵便番号'), '0000000', {
    delay: 50,
  });
  expect(screen.getByLabelText('郵便番号')).toHaveValue('0000000');
  await expectSearchAddress();
  expect(await screen.findByRole('alert')).toHaveTextContent(
    '誤った郵便番号が入力されています。'
  );
};

export const ErrorPostalCodeValueLength = Template.bind({});
ErrorPostalCodeValueLength.storyName = 'ERROR_誤った桁数の郵便番号';
ErrorPostalCodeValueLength.play = async (ctx) => {
  await Initial.play?.(ctx);
  await userEvent.type(screen.getByLabelText('郵便番号'), '00000000000', {
    delay: 50,
  });
  expect(screen.getByLabelText('郵便番号')).toHaveValue('00000000000');
  await expectSearchAddress();
  expect(await screen.findByRole('alert')).toHaveTextContent(
    '郵便番号の桁数が誤っています。'
  );
};