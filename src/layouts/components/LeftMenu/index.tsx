import React, {useEffect, useRef, useState} from 'react';
import {Menu, Spin, Layout, Button} from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { dataFlat } from '@/utils/utils'
import { routersIcon } from  '@/routers'
const { Sider } = Layout;
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";

import './index.less'


interface LeftMenuProps {
  menu: any[];
}

// 左侧菜单
const LeftMenu: React.FC<LeftMenuProps> = (props) => {
  const { menu } = props;
  const location = useLocation()
  const navigate = useNavigate()
  const routesKey = useRef<any>({});
  const [collapsed, setCollapsed] = useState<boolean>(false); //
  const [routes, setRoutes] = useState<any[]>([]); //
  const [routesFlat, setRoutesFlat] = useState<any[]>([]); //
  const [openKeys, setOpenKeys] = useState<string>(''); //
  const [selectedKeys, setSelectedKeys] = useState<string>(''); //

  // 路由添加key, 添加icon
  const routeAddKey = (data: any[], key?: string) => {
    return data.map((item: any, index) => {
      item.key = key ? `${key}-${index}` : `${index.toString()}`;
      item.icon = routersIcon[item.path]

      routesKey.current[item.path] = item.key;
      if (Array.isArray(item.children) && item.children.length > 0) {
        // item.icon = null
        item.children = routeAddKey(item.children, index.toString())
      }
      if(location.pathname === item.path) {
        setSelectedKeys(item.key)
        if(key){
          setOpenKeys(key)
        }
      }
      return item;
    })
  }

  // 无权限则跳转到404
  useEffect(() => {
    if(routesFlat.length > 0 && !routesFlat.includes(location.pathname)) {
      navigate('/404')
    }

    const currentKey = routesKey.current[location.pathname];
    if (currentKey) {
      if(currentKey.includes('-')){
        setOpenKeys(currentKey.split('-')[0])
        setSelectedKeys(currentKey)
      }else{
        setSelectedKeys(currentKey)
      }
    }
  }, [location.pathname, routesFlat]);

  // 菜单数据处理
  useEffect(() => {
    // 路由菜单
    const route = routeAddKey(menu)
    setRoutes(route);
    setRoutesFlat(dataFlat(route, 'children', []).map(item => item.path))
  }, [menu]);

  return (
    <section id="layout-main-left">
      <div className="left-main">
        <Sider trigger={null} collapsible collapsed={collapsed}>
          {(Array.isArray(routes) && routes.length > 0) ?
            <Menu
              style={{width: '100%'}}
              selectedKeys={[selectedKeys]}
              openKeys={[openKeys]}
              mode="inline"
              theme="light"
              items={routes}
              onOpenChange={(keys: string[]): void => {
                setOpenKeys(keys[1])
              }}
              onSelect={({ item }: any): void => {
                console.log(111, item)
                if(item?.props?.path) navigate(item.props.path)
              }}
            /> : <Spin spinning><div style={{ height: '300px' }}></div></Spin>
          }
        </Sider>
      </div>
      <div className="left-collapsed">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
        />
      </div>
    </section>
  )
};

export default LeftMenu;
