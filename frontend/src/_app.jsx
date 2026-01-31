import { useState } from 'react'
import { ConfigProvider, theme } from 'antd'
import Layout from './layouts'

const App = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm
      }}
    >
      <Layout />
    </ConfigProvider>
  )
}

export default App
