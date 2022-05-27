import { ComponentStory, ComponentMeta } from '@storybook/react'

import { App } from './App'

export default {
  title: 'App',
  component: App,
} as ComponentMeta<typeof App>

const Template: ComponentStory<typeof App> = (args) => <App {...args} />

export const Initial = Template.bind({})
Initial.storyName = '初回描画'
