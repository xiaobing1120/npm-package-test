// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, App } from 'antd'
import zh_CN from 'antd/locale/zh_CN';


import { Routers } from './routers'
import './global.css'

createRoot(document.getElementById('root')!).render(
  // <StrictMode></StrictMode>
  <ConfigProvider locale={zh_CN}>
    <App>
      <Routers />
    </App>
  </ConfigProvider>,
)
