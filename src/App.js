import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import styled from 'styled-components';
import { Button, Divider, Layout, Menu } from 'antd';
import { HomeOutlined, LineChartOutlined, ApartmentOutlined, QuestionOutlined, QuestionCircleOutlined, HistoryOutlined, DatabaseOutlined, RadarChartOutlined } from '@ant-design/icons';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import React, { useRef, useState } from 'react';
import { setPage } from './redux/store';
import ReactionType from './pages/ReactionType';
import ReactionCondition from './pages/ReactionCondition';
import ReactionYield from './pages/ReactionYield';
import ScienceIcon from '@mui/icons-material/Science';
import Home from './pages/Home';
import HomeHeader from './pages/HomeHeader';
import TypeHeader from './pages/TypeHeader';
import ConditionHeader from './pages/ConditionHeader';
import YieldHeader from './pages/YieldHeader';
import { Footer } from 'antd/es/layout/layout';
import HomeFooter from './pages/HomeFooter';
import UpdateHistory from './pages/UpdateHistory';
import ReactionDatabase from './pages/ReactionDatabase';
import Retrosynthesis from './pages/Retrosynthesis';
const { Header, Sider, Content } = Layout;

const MoleculeFactoryTitle = styled.div`
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 14px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bolder;
`;

const CustomButton = styled.button`
    color: #aaaaaa;
    font-size: 16px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.3s, background-color 0.3s, transform 0.1s;
    margin: 0 8px;
    display:flex;
    gap: 6px;

    &:hover {
        color: #1890ff;
    }

    &:active {
        transform: scale(0.95);
    }
`;

function App() {
  const page = useSelector(state => state.slice.page);
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [opened, setOpened] = useState(false);
  const footerRef = useRef(null);

  const scrollToFooter = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' }); // 平滑滚动到 HomeFooter
    }
  };

  const onSiderCollapse = (currentCollapsed) => {
    if (currentCollapsed) {
      setCollapsed(true);
      setOpened(false);
    } else {
      setOpened(true);
      setTimeout(() => {
        setOpened((currentOpen) => {
          if (currentOpen) {
            setCollapsed(false);
          }
          return currentOpen;
        })
      }, 200);
    }
  }

  const onMenuClick = (event) => {
    dispatch(setPage(event.key));
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible onCollapse={onSiderCollapse}>
        <MoleculeFactoryTitle>
          {collapsed ? "MF" : "MOL-FACTORY"}
        </MoleculeFactoryTitle>
        <Menu theme="dark" mode="inline" selectedKeys={[page]} onClick={onMenuClick}>
          <Menu.Item key="home" icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="type" icon={<RadarChartOutlined />}>
            Type Prediction
          </Menu.Item>
          <Menu.Item key="condition" icon={<VaccinesIcon />}>
            Condition Prediction
          </Menu.Item>
          <Menu.Item key="yield" icon={<LineChartOutlined />}>
            Yield Prediction
          </Menu.Item>
          <Menu.Item key="retro" icon={<ApartmentOutlined />}>
            Retrosynthesis
          </Menu.Item>
          <Menu.Item key="database" icon={<DatabaseOutlined />}>
          Reaction Database
          </Menu.Item>
          <Menu.Item key="update" icon={<HistoryOutlined />}>
            Update History
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 16px',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            display: "flex",
            justifyContent: 'right',
            alignItems: 'center'
          }}
        >
          <CustomButton onClick={scrollToFooter} style={{ display: "flex", justifyContent: "right", alignItems: "center" }}>
            <QuestionCircleOutlined />
            About
          </CustomButton>
        </Header>

        <Content style={{ margin: '16px', padding: '16px', background: '#fff' }}>
          {page === "home" && <Home />}
          {page === "type" && <ReactionType />}
          {page === "condition" && <ReactionCondition />}
          {page === "yield" && <ReactionYield />}
          {page === "retro" && <Retrosynthesis />}
          {page === "database" && <ReactionDatabase />}
          {page === "update" && <UpdateHistory />}
        </Content>
        <div ref={footerRef}>
          <HomeFooter />
        </div>
      </Layout>
    </Layout>
  );
}

export default App;
