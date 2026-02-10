import React, { useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { message } from "antd";

import Header from './components/Header';
import LeftMenu from './components/LeftMenu';
import LoadingPage from '@/components/LoadingPage'


import './index.less'

const Layouts: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>({}); //
  const [loading, setLoading] = useState<boolean>(true); //
  const [menu, setMenu] = useState<any>([]);
  const navigate = useNavigate()

  // 获取用户信息
  const getUserInfo = async (): Promise<void> => {
    try{
      const res = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ name: 'vite' })

        }, 500);
      })

      setUserInfo(res);
    }catch (e){
      // 获取用户信息失败处理
      message.error('获取用户信息失败')
      navigate('/login')
    }
  }

  // 获取菜单
  const getMenu = async (): Promise<void> => {
    try{
      const res: any[] = await new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              label: '首页',
              path: '/',
              icon: 'SmileFilled',
            },
            {
              path: '/result',
              label: '结果页',
              icon: 'CrownFilled',
            },
            {
              path: '/welcome',
              label: '欢迎页',
              icon: 'CrownFilled',
              children: [
                {
                  path: '/test1',
                  label: '测试页1',
                  icon: 'TabletFilled',
                },
                {
                  path: '/test2',
                  label: '测试页2',
                  icon: 'test',
                },
              ]
            },
          ])
        }, 500);
      })

      if(res && res.length > 0){
        setMenu(res);
        setLoading(false)
      }else{
        message.error('获取用户菜单权限失败1')
        navigate('/login')
      }
    }catch (e){
      // 获取用户信息失败处理
      message.error('获取用户菜单权限失败2')
      navigate('/login')
    }
  }

  useEffect(() => {
    getUserInfo()
    getMenu()
  }, []);

  return (
    loading ? <LoadingPage/> : (
      <section id="layout-box">
        <Header projectName={"VITE测试管理系统"} userInfo={userInfo}/>
        <main id="layout-main">
          <LeftMenu menu={menu} />
          <section id="layout-main-right">
            <Suspense fallback={<LoadingPage />}>
              <Outlet/>
            </Suspense>
          </section>
        </main>
      </section>
    )
  )
}

export default Layouts
