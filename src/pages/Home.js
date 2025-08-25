import React, { useEffect, useState } from 'react';
import { Layout, Typography, Card, Row, Col, Divider, Image } from 'antd';
import styled from 'styled-components';
import GitHubIcon from '@mui/icons-material/GitHub';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';
import { HomeOutlined, LineChartOutlined, ApartmentOutlined } from '@ant-design/icons';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import { useDispatch } from 'react-redux';
import { setPage } from '../redux/store';
const { Content, Footer } = Layout;
const { Title, Paragraph, Link } = Typography;

const GradientText = styled.span`
  font-weight: bold;
`;

const Home = () => {
    const dispatch = useDispatch();
    return (
        <Layout>
            <Content style={{ padding: '50px' }}>
                <div style={{ textAlign: 'center' }}>
                    <Title level={1}><b>Molecule Factory</b> - Applications of <b>AI</b> in Chemistry</Title>
                </div>
                <div style={{ textAlign: "justify" }}>
                    <Paragraph >
                        <b>Molecule Factory</b> is an artificial intelligence platform dedicated to advancing chemical research, focused on enhancing efficiency and fostering innovation through intelligent methodologies. The significance of AI for Chemistry lies in its ability to leverage data-driven approaches, enabling scientists to gain deeper insights into molecular behavior, optimize reaction conditions, and accelerate the discovery of new materials and drugs. As a powerful tool, Molecule Factory offers a diverse range of functionalities, including <b>molecular understanding</b>, <b>reaction property prediction</b>, <b>retrosynthetic route planning</b>, <b>molecular and crystal generation</b>, and <b>chemical LLMs</b>, providing comprehensive support for researchers in their explorations and innovations in chemistry. Looking ahead, Molecule Factory aims to continuously expand its capabilities, integrate additional data sources, and enhance the sophistication of its models to further drive advancements and applications in chemical research.
                    </Paragraph>
                </div>

                <div style={{ textAlign: 'center', marginTop: "50px" }}>
                    <Title level={2}>🔍 Researches</Title>
                </div>
                <Divider />
                <Card title={
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        {"Reaction Graph: Towards Reaction-Level Modeling for Chemical Reactions with 3D Structures"}
                        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                            <Link href="http://47.99.54.221/Paper.pdf" target="_blank" style={{ color: "black" }}><DescriptionIcon /></Link>
                            <Link href="https://huggingface.co/reactiongraph/ReactionGraph" target="_blank" style={{ color: "black" }}><CodeIcon /></Link>
                        </div>
                    </div>
                } bordered={false} style={{ width: '100%', marginBottom: '20px' }}>
                    <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
                        <Image src="/ReactionGraphA.PNG" />
                        <Image src="/ReactionGraphB.PNG" />
                    </div>
                    <Paragraph>
                        <strong>Abstract:</strong> Accurately modeling chemical reactions using Artificial Intelligence (AI) can accelerate discovery and development, especially in fields like drug design and material science. Although AI has made remarkable advancements in single molecule recognition, such as predicting molecular properties, the study of interactions between molecules, particularly chemical reactions, has been relatively overlooked. In this paper, we introduce Reaction Graph (RG), a unified graph representation that encapsulates the 3D molecular structures within chemical reactions. RG integrates the molecular graphs of reactants and products into a cohesive framework, effectively capturing the interatomic relationships pertinent to the reaction process. Additionally, it incorporates the 3D structure information of molecules in a simple yet effective manner. We conduct experiments on a range of tasks, including chemical reaction classification, condition prediction, and yield prediction. RG achieves the highest accuracy across six datasets, demonstrating its effectiveness.
                    </Paragraph>

                </Card>

                <div style={{ textAlign: 'center', marginTop: "50px" }}>
                    <Title level={2}>🔨 Tools</Title>
                </div>
                <Divider />

                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Card title={<div style={{ display: "flex", gap: "10px" }}><VaccinesIcon />{"Reaction Condition Prediction"}</div>} bordered={false} style={{ width: '30%', marginBottom: '20px' }}>



                        <p>
                            Trained on USPTO and Pistachio databases, based on Reaction Graph and attention mechanisms. It can autoregressively outputs five categories of reaction conditions and can provide 15 prediction results. 
                            <span
                                style={{
                                    color: '#1890ff',
                                    cursor: 'pointer',
                                    marginLeft: "10px"
                                }}
                                onClick={() => dispatch(setPage("condition"))}
                            >
                                Try Now
                            </span>
                        </p>
                    </Card>

                    <Card title={<div style={{ display: "flex", gap: "10px" }}><ApartmentOutlined />{"Reaction Classification"}</div>} bordered={false} style={{ width: '30%', marginBottom: '20px' }}>
                        <p>
                            Trained on the Pistachio database, based on Reaction Graph and attention mechanisms. It offers high-accuracy reaction classification results, and can be utilized in tasks like data annotation and LLM pre-training.
                            <span
                                style={{
                                    color: '#1890ff',
                                    cursor: 'pointer',
                                    marginLeft: "10px"
                                }}
                                onClick={() => dispatch(setPage("type"))}
                            >
                                Try Now
                            </span>
                        </p>

                    </Card>

                    <Card title={<div style={{ display: "flex", gap: "10px" }}><LineChartOutlined />{"Reaction Yield Prediction"}</div>} bordered={false} style={{ width: '30%', marginBottom: '20px' }}>
                        <p>
                            Train on large-scale USPTO dataset and support customized model training on user data. It simultaneously provides yield prediction results and prediction confidence, applicable for multi-step retrosynthetic planning tasks.
                            <span
                                style={{
                                    color: '#1890ff',
                                    cursor: 'pointer',
                                    marginLeft: "10px"
                                }}
                                onClick={() => dispatch(setPage("yield"))}
                            >
                                Try Now
                            </span>
                        </p>
                    </Card>
                </div>
            </Content>
        </Layout>
    )

}

export default Home;