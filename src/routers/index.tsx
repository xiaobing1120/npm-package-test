import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CrownFilled, SmileFilled, TabletFilled, } from '@ant-design/icons';
import ReactIcon from '@/assets/react.svg'

import ErrorBoundary from '@/components/ErrorBoundary'
import LoadingPage from '@/components/LoadingPage'
import NotFound from '@/components/NotFound'
import TipsPage from '@/components/TipsPage'

import Layouts from '../layouts'

const Home = React.lazy(() => import('../pages/Home'))
const Result = React.lazy(() => import('../pages/Result'))
const Test1 = React.lazy(() => import('../pages/Test1'))
const Test2 = React.lazy(() => import('../pages/Test2'))
const Login = React.lazy(() => import('../pages/Login'))

const routersIcon: any = {}

// 路由配置处理
const routersTraversal = (data: any[], key?: string) => {
  return (
    data.map((item, index) => {
      const newKey = key ? `${key}-${index}` : `${index}`
      if(item.icon) {
        routersIcon[`${item.path}`] = item.icon
      }
      if(item.children && item.children.length > 0) {
        return (
          <Route key={newKey} path={item.path} element={item.element}>
            {routersTraversal(item.children, newKey)}
          </Route>
        )
      }
      return <Route key={newKey} path={item.path} element={item.element} />
    })
  )
}

const routers = [
  {
    path: '/',
    element: <Layouts />,
    children: [
      {
        path: '/',
        element: <Home />,
        icon: <CrownFilled />
      },
      {
        path: '/result',
        element: <Result />,
        icon: <SmileFilled />
      },
      {
        path: '/test1',
        element: <Test1 />,
        icon: <TabletFilled />
      },
      {
        path: '/test2',
        element: <Test2 />,
        icon: <img src={ReactIcon} width={14} height={14} />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '/tips-page',
    element: <TipsPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  }
]

const Routers = () => {
  return <BrowserRouter basename={`${__BASE_URL__}`}>
    <ErrorBoundary>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          {routersTraversal(routers)}
        </Routes>
      </Suspense>
    </ErrorBoundary>

  </BrowserRouter>
}
export { Routers, routersIcon }
