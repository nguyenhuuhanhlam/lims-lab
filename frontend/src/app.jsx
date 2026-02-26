import { ConfigProvider, theme, App as AntApp } from 'antd'
import enUS from 'antd/locale/en_US'
import Layout from './layouts'

const App = () => {
  return (
    <ConfigProvider
      locale={enUS}
      theme={{
        algorithm: theme.darkAlgorithm
      }}
    >
      <AntApp>
        <Layout />
      </AntApp>
    </ConfigProvider>
  )
}

export default App
