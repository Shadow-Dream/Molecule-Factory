import SmilesDrawer from './SmilesDrawer';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Input, notification, Select, Divider, Layout, Typography, Steps, Card, Row, Col, List, Spin } from 'antd';
import styled from 'styled-components';
import 'antd/dist/reset.css';
import { SmilesSvgRenderer } from 'react-ocl';
import OCL from 'openchemlib/full';
import reactionGraphAPI from '../api/ReactionGraph';
import { useDispatch, useSelector } from 'react-redux';
import { clearType, setType } from '../redux/store';
import { useImmer } from 'use-immer';
import React from 'react';
import { SmileOutlined, PictureOutlined, CompassOutlined, SearchOutlined, AimOutlined } from '@ant-design/icons';
import SvgRenderer from "react-ocl"

import ReactFlow, { Controls, Background, Handle } from 'reactflow';
import 'reactflow/dist/style.css';
import SmilesRenderer from './SmilesRenderer';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const { Step } = Steps;

const { Option } = Select;

const PageLayout = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
width: 100%;
`;

const ModelSelectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  /* margin: 0 auto; */
  width: 100%;
  margin-bottom: 10px;
`;

const ModelSelectionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ModelSelectLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const StyledSelect = styled(Select)`
  width: 100%;
  .ant-select-selector {
    border-radius: 6px !important;
    height: 32px !important;
    display: flex;
    align-items: center;
  }
`;

const ReactionInputBox = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
margin: 10px;
width: 100%;
`;

const MoleculeBox = styled.div` 
display: flex;
flex-direction: column;
flex: 1;
`;

const SVGBox = styled.div`
position: absolute;
width: 100%;
height: 100%;
display: flex;
justify-content: center;
align-items: center;
`;

const Seperator = styled.div`
margin: 10px;
font-size: 20px;
font-weight: bold;
display: flex;
flex-direction: column;
`;

const OperationBox = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
width: 100%;
gap: 20px;
`;

const ButtonBox = styled.div`
display: flex;
flex-direction: column;
gap: 10px;
height: 160px;
padding: 10px;
background-color: #f9f9f9;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
position: relative;
`;

const OutputBox = styled.div`
font-family: monospace;
padding: 10px;
display: flex;
flex-direction: column;
width: 100%;
border: 1px solid #d9d9d9;
border-radius: 6px;
height: 160px;
overflow-y: auto;
`;

const CustomNode = ({ data }) => (
    <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px', background: '#fff', textAlign: 'center' }}>
        <Handle type="target" position="left" style={{ background: '#555' }} /> {/* 输入端点在左侧 */}
        <div>{data.label}</div>
        <Handle type="source" position="right" style={{ background: '#555' }} /> {/* 输出端点在右侧 */}
    </div>
);

const ReactionType = () => {
    const taskId = useSelector(state => state.slice.reactionType.taskId);
    const [inferencing, setInferencing] = useState(false);
    const dispatch = useDispatch();
    const [reactantDraw, setReactantDraw] = useState(false);
    const [reagentDraw, setReagentDraw] = useState(false);
    const [productDraw, setProductDraw] = useState(false);
    const [reactant, setReactant] = useState("CNC(C(=O)O)c1ccc(Cl)cc1.O=C(OC(=O)C(F)(F)F)C(F)(F)F");
    const [reagent, setReagent] = useState("Cc1ccccc1");
    const [product, setProduct] = useState("CN(C(=O)C(F)(F)F)C(C(=O)O)c1ccc(Cl)cc1");
    const [parameter, setParameter] = useState("pistachio_type");
    let reactantSmiles = ""
    let reagentSmiles = ""
    let productSmiles = ""
    const [results, setResults] = useImmer({});

    const intervalIdRef = useRef(null);
    useEffect(() => {
        if (taskId !== "") {
            intervalIdRef.current = setInterval(() => {
                reactionGraphAPI.post('/poll', {
                    task_id: taskId
                }).then(response => {
                    if (response.data.status === "done" || response.data.status === "failed") {
                        dispatch(clearType());
                        setResults(prevResults => { prevResults["status"] = response.data.status });
                        setInferencing(false);
                    }
                    if ("smiles" in response.data)
                        setResults(prevResults => { prevResults["smiles"] = response.data.smiles });
                    if ("coordinates" in response.data)
                        setResults(prevResults => { prevResults["coordinates"] = response.data.coordinates });
                    if ("weight" in response.data)
                        setResults(prevResults => { prevResults["weight"] = response.data.weight });
                    if ("result" in response.data)
                        setResults(prevResults => { prevResults["result"] = response.data.result });
                }).catch(error => { 
                    setInferencing(false);
                });
            }, 1000);
        }
        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
            }
        }
    }, [taskId, dispatch]);

    try {
        const reactantMolecule = OCL.Molecule.fromSmiles(reactant);
        reactantSmiles = reactantMolecule.toSmiles();
    }
    catch (e) { }

    try {
        const reagentMolecule = OCL.Molecule.fromSmiles(reagent);
        reagentSmiles = reagentMolecule.toSmiles();
    }
    catch (e) { }

    try {
        const productMolecule = OCL.Molecule.fromSmiles(product);
        productSmiles = productMolecule.toSmiles();
    }
    catch (e) { }



    const analyze = () => {
        if (reactantSmiles !== "" && productSmiles !== "" && (reagentSmiles !== "" || reagent === "")) {
            setResults({})
            setInferencing(true);
            reactionGraphAPI.post('/analyze', {
                function: parameter,
                reactant: reactantSmiles,
                reagent: reagentSmiles,
                product: productSmiles
            }).then(response => {
                dispatch(setType(response.data["task_id"]));
            });
        } else {
            notification.open({
                message: 'Error',
                description: 'Invalid SMILES',
            });
        }
    }

    const onParameterSelect = (value) => {
        setParameter(value);
    }

    let statusString = "status" in results ? (results["status"] === "done" ? "· Analysis done." : "· Analysis failed.")
        : (taskId === "" ? "· Ready to start." : "· Analyzing reaction...");

    let smilesString = ("smiles" in results) ? " - Predict SMILES Mapping: Done" : "";
    let coordinatesString = ("coordinates" in results) ? " - Calculate Atomic Coordinates: Done" : "";
    let weightString = ("weight" in results) ? " - Calculate Attention Weight: Done" : "";
    let resultString = ("result" in results) ? " - Predict Reaction Type: Done" : "";
    let outputString = ("result" in results) ? "Result: " + results.result.type : "";

    const handleDownload = () => {
        const json = JSON.stringify(results, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const reactionTypes = [
        { title: "Heteroatom alkylation and arylation", image: "/reaction/1.png" },
        { title: "Acylation and related processes", image: "/reaction/2.png" },
        { title: "C-C bond formation", image: "/reaction/3.png" },
        { title: "Heterocycle formation", image: "/reaction/4.png" },
        { title: "Protections", image: "/reaction/5.png" },
        { title: "Deprotections", image: "/reaction/6.png" },
        { title: "Reductions", image: "/reaction/7.png" },
        { title: "Oxidations", image: "/reaction/8.png" },
        { title: "Functional group interconversion (FGI)", image: "/reaction/9.png" },
        { title: "Functional group addition (FGA)", image: "/reaction/10.png" },
    ];

    const nodes = [
        { id: '1', position: { x: 50, y: 100 }, data: { label: 'Input SMILES' }, type: 'customNode' },
        { id: '2', position: { x: 350, y: 50 }, data: { label: 'Predict Mapping' }, type: 'customNode' },
        { id: '3', position: { x: 250, y: 150 }, data: { label: 'Molecular Graph' }, type: 'customNode' },
        { id: '4', position: { x: 450, y: 150 }, data: { label: 'Construct 3D Features' }, type: 'customNode' },
        { id: '5', position: { x: 650, y: 100 }, data: { label: 'Reaction Graph' }, type: 'customNode' },
        { id: '6', position: { x: 850, y: 100 }, data: { label: 'GNN Analysis' }, type: 'customNode' },
        { id: '7', position: { x: 1050, y: 100 }, data: { label: 'Attention Mechanism' }, type: 'customNode' },
        { id: '8', position: { x: 1250, y: 100 }, data: { label: 'Predict Reaction Type' }, type: 'customNode' },
    ];

    const edges = [
        { id: 'e1-2', source: '1', target: '2', animated: true, type: "" },
        { id: 'e1-3', source: '1', target: '3', animated: true },
        { id: 'e3-4', source: '3', target: '4', animated: true },
        { id: 'e2-5', source: '2', target: '5', animated: true },
        { id: 'e4-5', source: '4', target: '5', animated: true },
        { id: 'e5-6', source: '5', target: '6', animated: true },
        { id: 'e6-7', source: '6', target: '7', animated: true },
        { id: 'e7-8', source: '7', target: '8', animated: true },
    ];

    const nodeTypes = useMemo(() => ({
        customNode: CustomNode, // 注册自定义节点
    }), [])

    let mappedReactant = ""
    let mappedProduct = ""
    const reactantHighlights = []
    const productHighlights = []
    const reactantOpacities = []
    const productOpacities = []
    const reactantColors = []
    const productColors = []
    if ("weight" in results) {
        const molecules = results.smiles.split(">>")
        mappedReactant = molecules[0]
        mappedProduct = molecules[1]
        const mappedReactantMolecule = OCL.Molecule.fromSmiles(mappedReactant)
        const mappedProductMolecule = OCL.Molecule.fromSmiles(mappedProduct)
        const numReactantAtoms = mappedReactantMolecule.getAllAtoms()
        const numProductAtoms = mappedProductMolecule.getAllAtoms()

        for (let i = 0; i < numReactantAtoms; i++) {
            reactantHighlights.push(i);
        }

        for (let i = 0; i < numProductAtoms; i++) {
            productHighlights.push(i);
        }

        for (let i = 0; i < numReactantAtoms; i++) {
            reactantOpacities.push(results.weight[i]);
        }

        // 生成 productOpacities 数组
        for (let i = 0; i < numProductAtoms; i++) {
            productOpacities.push(results.weight[i + numReactantAtoms]);
        }

        // 生成 reactantColors 数组
        for (let i = 0; i < numReactantAtoms; i++) {
            reactantColors.push("red"); // 可以替换为所需的默认颜色
        }

        // 生成 productColors 数组，内容全为 red
        for (let i = 0; i < numProductAtoms; i++) {
            productColors.push("red");
        }
    }

    console.log(results)

    return (
        <PageLayout>
            <div style={{ textAlign: 'center' }}>
                <Title level={2} style={{ padding: "0px 20px" }}> <b>Reaction Classification</b></Title>
                <div style={{ position: "relative", width: "100%", height: "1px", top: "-12px", backgroundColor: "#eeeeee" }} />
                <div style={{ position: "relative", top: "-6px", padding: "0px 20px" }}>For data <b>analysis</b>, data <b>augmentation</b>, and model <b>pre-training</b>.</div>
            </div>
            <div style={{ padding: "40px" }}>
                <Title level={4}><span
                    style={{
                        display: 'inline-block',
                        width: '14px',
                        height: '14px',
                        border: '2px solid #1677FF',
                        borderRadius: '50%',
                    }}
                ></span> <b>Reaction Types</b></Title>
                <Divider/>
                <Paragraph>
                    Chemical reaction is a process in which substances interact, involving the transformation of reactants into products. The type of reaction describes the mechanism behind the reaction and the transformation process. It can be used for reaction understanding, data analysis, and chemical LLMs pre-training.
                </Paragraph>


                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", marginBottom: "40px" }}>
                    {reactionTypes.map((reaction, index) => (
                        <Card
                            key={index}
                            style={{
                                width: "17%", // 每行占 20%（包括 margin）
                                margin: "0.2%", // 间距
                                height: "150px", // 固定高度
                                textAlign: "center",
                                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                            }}
                            cover={
                                <div style={{ height: "100px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <img
                                        src={reaction.image}
                                        alt={reaction.title}
                                        style={{
                                            width: "90%", // 图片宽度自适应
                                            height: "auto", // 保持宽高比
                                        }}
                                    />
                                </div>
                            }
                        >
                            <Card.Meta title={reaction.title} />
                        </Card>
                    ))}
                </div>

                <Title level={4}><span
                    style={{
                        display: 'inline-block',
                        width: '14px',
                        height: '14px',
                        border: '2px solid #1677FF',
                        borderRadius: '50%',
                    }}
                ></span> <b>Online Tools</b></Title>
                <Divider />
                <Paragraph>
                    We utilize a neural network trained on the large-scale reaction-type database Pistachio to predict reaction types. Given the SMILES representation of a chemical reaction, the algorithm converts it into Reaction Graph to represent the atomic mapping and 3D information. A graph neural network (GNN) is then used to extract atomic features, followed by an attention mechanism to analyze the reactive sites. Finally, leveraging the knowledge obtained from large-scale training, the model infers the reaction type.
                </Paragraph>

                <div style={{ width: "100%", height: "200px" }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        fitView
                        panOnScroll={false} // 禁用滚动缩放
                        panOnDrag={false}
                        zoomOnScroll={false} // 禁用缩放
                        zoomOnPinch={false} // 禁用触摸缩放
                        zoomOnDoubleClick={false} // 禁用双击缩放
                    >
                        {/* <Controls /> */}
                        <Background />
                    </ReactFlow>
                </div>
            </div>

            <ModelSelectionContainer>
                <ModelSelectionBox>
                    <ModelSelectLabel>Model:</ModelSelectLabel>
                    <StyledSelect
                        placeholder="Please select a model"
                        defaultValue={"reactiongraph"}
                        onChange={() => { }}
                    >
                        <Option value="reactiongraph">Reaction Graph</Option>
                    </StyledSelect>
                </ModelSelectionBox>
                <ModelSelectionBox>
                    <ModelSelectLabel>Parameter:</ModelSelectLabel>
                    <StyledSelect
                        placeholder="Please select a parameter"
                        onChange={onParameterSelect}
                        defaultValue={"pistachio_type"}
                    >
                        <Option value="pistachio_type">Pistachio Type</Option>
                    </StyledSelect>
                </ModelSelectionBox>
            </ModelSelectionContainer>
            <ReactionInputBox>
                <MoleculeBox>
                    <Input
                        placeholder="Reactant SMILES"
                        value={reactant}
                        onChange={event => { setReactant(event.target.value); }}
                        style={{ marginBottom: "10px" }}
                    />

                    <Button onClick={() => setReactantDraw(true)} style={{ height: "200px" }}>
                        <SVGBox>
                            <SmilesSvgRenderer smiles={reactantSmiles} />
                        </SVGBox>
                    </Button>
                    <SmilesDrawer initial={reactant} open={reactantDraw} setOpen={setReactantDraw} confirm={setReactant} />
                </MoleculeBox>
                <Seperator>{">"}</Seperator>
                <MoleculeBox>
                    <Input
                        placeholder="Reagent SMILES"
                        value={reagent}
                        onChange={event => { setReagent(event.target.value); }}
                        style={{ marginBottom: "10px" }}
                    />
                    <Button onClick={() => setReagentDraw(true)} style={{ height: "200px" }}>
                        <SVGBox>
                            <SmilesSvgRenderer smiles={reagentSmiles} />
                        </SVGBox>
                    </Button>
                    <SmilesDrawer initial={reagent} open={reagentDraw} setOpen={setReagentDraw} confirm={setReagent} />
                </MoleculeBox>
                <Seperator>{">"}</Seperator>
                <MoleculeBox>
                    <Input
                        placeholder="Product SMILES"
                        value={product}
                        onChange={event => { setProduct(event.target.value); }}
                        style={{ marginBottom: "10px" }}
                    />
                    <Button onClick={() => setProductDraw(true)} style={{ height: "200px" }}>
                        <SVGBox>
                            <SmilesSvgRenderer smiles={productSmiles} />
                        </SVGBox>
                    </Button>
                    <SmilesDrawer initial={product} open={productDraw} setOpen={setProductDraw} confirm={setProduct} />
                </MoleculeBox>
            </ReactionInputBox>
            <Divider style={{ backgroundColor: '#d9d9d9' }} />
            <OperationBox>
                <OutputBox>
                    {statusString ? <div><b>{statusString}</b></div> : <></>}
                    {smilesString ? <div>{smilesString}</div> : <></>}
                    {coordinatesString ? <div>{coordinatesString}</div> : <></>}
                    {weightString ? <div>{weightString}</div> : <></>}
                    {resultString ? <div>{resultString}</div> : <></>}
                    {outputString ? <div><b>{outputString}</b></div> : <></>}
                </OutputBox>
                <ButtonBox>
                    {inferencing ? <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)', // 半透明背景
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10,
                    }}>
                        <Spin size="large" />
                    </div> : <></>}
                    <Button onClick={analyze}>Start Analyze</Button>
                    <Button onClick={handleDownload}>Download</Button>
                    <Button onClick={() => { setResults({}) }}>Clear</Button>


                </ButtonBox>
            </OperationBox>

            <div style={{ display: "flex", flexDirection: "row", margin: "20px 0px", flexWrap: "wrap", justifyContent: "space-between" }}>
                {("smiles" in results) && (
                    <Card
                        style={{ width: "calc(50% - 10px)", textAlign: "center" }}
                        title={"Predicted Atomic Mapping"}
                    >
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                            <SmilesRenderer OCL={OCL}
                                smiles={mappedReactant}
                                showAtomNumber={true}
                            />
                            <SmilesRenderer OCL={OCL}
                                smiles={mappedProduct}
                                showAtomNumber={true} />
                        </div>
                    </Card>
                )}

                {("weight" in results) && (
                    <Card
                        style={{ width: "calc(50% - 10px)", textAlign: "center" }}
                        title={"Reactive Site Attention"}
                    >
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                            <SmilesRenderer OCL={OCL}
                                smiles={mappedReactant}
                                atomHighlight={reactantHighlights}
                                atomHighlightOpacity={reactantOpacities}
                                atomHighlightColor={reactantColors}
                            />
                            <SmilesRenderer OCL={OCL}
                                smiles={mappedProduct}
                                atomHighlight={productHighlights}
                                atomHighlightOpacity={productOpacities}
                                atomHighlightColor={productColors} />
                        </div>
                    </Card>
                )}
            </div>

        </PageLayout>

    );
}

export default ReactionType;
