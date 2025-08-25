import React, { useEffect, useState } from 'react';
import { Col, Divider, Image, Layout, Row, Typography } from 'antd';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Title from 'antd/es/typography/Title';
import styled from 'styled-components';
const { Footer } = Layout;
const { Text } = Typography;

const CustomTitle = styled(Title)`
margin-top:0 !important;
  font-family: "Poppins", "Calibri", "Arial", sans-serif;
`;

const CustomText = styled(Text)`
  font-family: "Poppins", "Calibri", "Arial", sans-serif;
`;

const HomeFooter = () => {
    const logos = [
        { name: 'dgl', url: 'https://www.dgl.ai/' },
        { name: 'pytorch', url: 'https://pytorch.org/' },
        { name: 'rdkit', url: 'https://www.rdkit.org/' },
        { name: 'rxnforchemistry', url: 'https://rxn.app.accelerate.science/rxn' },
        { name: 'pistachio', url: 'https://www.nextmovesoftware.com/' },
        { name: 'python', url: 'https://www.python.org/' },
        { name: 'react', url: 'https://react.dev/' },
        { name: 'nodejs', url: 'https://nodejs.org/' },
        { name: 'openchemlib', url: 'https://github.com/actelion/openchemlib' },
    ];

    return (
        <Footer style={{
            display: 'flex', justifyContent: 'space-between', gap: "20px", padding: '10px 80px 0px 80px', background: '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
            <div style={{ width: "400px", textAlign: "justify" }}>
                <CustomTitle level={4}>ABOUT</CustomTitle>
                
                <CustomText><b>Contacts:</b></CustomText>
                {/* <br /> */}
                <CustomText> Yingzhao Jian. Email: <a href="mailto:jian.ying.zhao@qq.com">jian.ying.zhao@qq.com</a></CustomText>
                <br />
                <CustomText><b>Self-introduction: </b></CustomText>
                <CustomText >From ReLeR (Recognition, Learning, Reasoning) Lab, CCAI (Collaborative Innovation Center of Artificial Intelligence), College of Computer Science and Technology, Zhejiang University.</CustomText>
                <br />
                <CustomText><b>Mentor:</b></CustomText>
                <CustomText> Dr. Hehe Fan. Email: <a href="mailto:hehefan@zju.edu.cn">hehefan@zju.edu.cn</a></CustomText>
                
                
            </div>
            <Divider type="vertical" style={{ height: '180px', margin: '8px 8px', }} />
            <div style={{ display: "flex", "flexDirection": "column", width: "200px", height: "200px" }}>
                <CustomTitle level={4}>VISITORS</CustomTitle>
                <Image
                    src="https://www.clustrmaps.com/map_v2.png?d=iFVyPC1yxifQcziHrhp1SvciEE-hqfaLG22EAZPL0w4&cl=ffffff"
                    preview={false}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <Divider type="vertical" style={{ height: '180px', margin: '8px 8px', }} />
            <div style={{ display: "flex", "flexDirection": "column", width: "400px" }}>
                <CustomTitle level={4}>DEV TOOLS</CustomTitle>
                <Row justify="center">
                    {logos.map((logo) => (
                        <Col key={logo.name} style={{ margin: '0 15px' }}>
                            <a href={logo.url} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={`/${logo.name}.png`}
                                    alt={logo.name}
                                    style={{ maxWidth: '100%', maxHeight: '50px', height: 'auto', width: 'auto' }}
                                />
                            </a>
                        </Col>
                    ))}
                </Row>
            </div>
        </Footer>
    );
};

export default HomeFooter;
