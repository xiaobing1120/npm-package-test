import React from 'react';
import {Row, Col, Dropdown, message} from 'antd';
import {LogoutOutlined} from '@ant-design/icons';
import avatar from '@/assets/avatar.png'
import logo from '@/assets/logo-header.png'
import './index.less';


interface HeaderType {
  projectName: string;
  userInfo: {
    name: string;
  };
}

const Header: React.FC<HeaderType> = (props) => {
  const { projectName, userInfo } = props;
  // 登出
  const onLogout = (): void => {
    message.success('退出登录成功');
    document.cookie = '';
    sessionStorage.clear()
  }

  return (
    <Row id="global-header">
      <Col className="global-header-logo">
        <img src={logo} alt="logo" />
      </Col>
      <Col className="global-header-name">{projectName}</Col>
      <Col className="global-header-flex" />
      <Col></Col>

      <Dropdown
        menu={{
          items: [
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: '退出登录',
              onClick: onLogout,
            }
          ],
        }}
      >
        <Col className="global-header-user">
          <img src={avatar} alt="头像"/>
          <strong>{userInfo?.name}</strong>
        </Col>
      </Dropdown>

    </Row>
  );
};

export default Header;
