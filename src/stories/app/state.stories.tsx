import { expect } from '@storybook/jest';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { screen, waitFor } from '@storybook/testing-library';

import { App } from '../../App';

export default {
  title: 'App/画面状態',
  component: App,
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <App {...args} />;

export const Initial = Template.bind({});
Initial.storyName = '正常表示';
Initial.play = async () => {
  await waitFor(
    async () => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    },
    { timeout: 5000 }
  );
};