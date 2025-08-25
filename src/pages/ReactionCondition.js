import SmilesDrawer from './SmilesDrawer';
import { useEffect, useRef, useState } from 'react';
import { Button, Input, notification, Select, Divider, Table, Spin } from 'antd';
import styled from 'styled-components';
import { SmilesSvgRenderer } from 'react-ocl';
import OCL from 'openchemlib/full';
import reactionGraphAPI from '../api/ReactionGraph';
import { useDispatch, useSelector } from 'react-redux';
import { clearCondition, setCondition } from '../redux/store';
import { useImmer } from 'use-immer';
import Title from 'antd/es/typography/Title';
import { Card, Col, Row } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
const { Option } = Select;

const StyledTable = styled(Table)`
margin-top: 20px;
width: 100%;
  .ant-table {
    table-layout: fixed;
  }

  .ant-table th,
  .ant-table td {
    font-size: 12px;
    line-height: 0;
  }

  .ant-table th {
    background-color: #f0f0f0;
  }
`;

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
  flex-direction: row;
  gap: 5px;
  margin:2px;
`;

const ModelSelectLabel = styled.label`
padding:6px;
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
margin: 10px;
/* border: 1px solid #d9d9d9; */
border-radius: 6px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
padding: 10px;
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
display: flex;
flex-direction: column;
flex: 1;
`;

const OperationBox = styled.div`
display: flex;
flex-direction: column;
margin: 10px;
`;

const ButtonBox = styled.div`
display: flex;
flex-direction: row;
justify-content: space-around;
gap: 10px;
height: 20px;
/* padding: 10px;  
border-radius: 8px;
box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
margin: 4px;
`;

const OutputBox = styled.div`
font-family: monospace;
padding: 10px;
display: flex;
flex-direction: column;
width: 100%;
border: 1px solid #d9d9d9;
border-radius: 6px;
height: 60px;
overflow-y: auto;
margin: 4px;
`;

const ReactionCondition = () => {
    const taskId = useSelector(state => state.slice.reactionCondition.taskId);
    const dispatch = useDispatch();
    const [inferencing, setInferencing] = useState(false);
    const [reactantDraw, setReactantDraw] = useState(false);
    const [reagentDraw, setReagentDraw] = useState(false);
    const [productDraw, setProductDraw] = useState(false);
    const [reactant, setReactant] = useState("CC(C)(C)OC(=O)N1CC[C@@H](N)C1.CS(=O)c1nc(-c2ccc(Cl)c(Cl)c2)c2c(N)c(C(N)=O)sc2n1");
    const [reagent, setReagent] = useState("");
    const [product, setProduct] = useState("CC(C)(C)OC(=O)N1CC[C@@H](Nc2nc(-c3ccc(Cl)c(Cl)c3)c3c(N)c(C(N)=O)sc3n2)C1");
    const [parameter, setParameter] = useState("uspto_condition");
    let reactantSmiles = ""
    let reagentSmiles = ""
    let productSmiles = ""
    const [results, setResults] = useImmer({});

    const reactionConditions = [
        {
            title: 'Catalyst',
            description: 'Increasing the rate of a chemical reaction without undergoing permanent chemical change.',
            available: <a href="catalyst.txt">supported types</a>

        },
        {
            title: 'Solvent',
            description: 'Dissolving solutes into a solution where the reaction takes place.',
            available: <a href="solvent.txt">supported types</a>
        },
        {
            title: 'Reagent',
            description: 'Causing a chemical reaction, or testing if a reaction occurs.',
            available: <a href="reagent.txt">supported types</a>
        },
        {
            title: 'Temperature',
            description: 'A measure of the particle energy. Influencing reaction rates and equilibrium.',
            available: <p style={{ color: "gray" }}>comming soon</p>
        },
        {
            title: 'Pressure',
            description: 'The force exerted by the substance per unit area. It can significantly affect gas-phase reactions.',
            available: <p style={{ color: "gray" }}>comming soon</p>
        },
        {
            title: 'Atmosphere',
            description: 'The surrounding environment of a reaction, including the presence of air, inert gases, or vacuum.',
            available: <p style={{ color: "gray" }}>comming soon</p>
        },
    ];

    const intervalIdRef = useRef(null);
    useEffect(() => {
        if (taskId !== "") {
            intervalIdRef.current = setInterval(() => {
                reactionGraphAPI.post('/poll', {
                    task_id: taskId
                }).then(response => {
                    if (response.data.status === "done" || response.data.status === "failed") {
                        dispatch(clearCondition());
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
                dispatch(setCondition(response.data["task_id"]));
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
    let resultString = ("result" in results) ? " - Predict Reaction Condition: Done" : "";
    let outputString = ("result" in results) ? "Results are shown in the table below. " : "";

    const columns = [
        { title: 'Top', dataIndex: 'label', key: 'label', width: '5%' },
        { title: 'Catalyst', dataIndex: 'col1', key: 'col1', width: '19%' },
        { title: 'Solvent 1', dataIndex: 'col2', key: 'col2', width: '19%' },
        { title: 'Solvent 2', dataIndex: 'col3', key: 'col3', width: '19%' },
        { title: 'Reagent 1', dataIndex: 'col4', key: 'col4', width: '19%' },
        { title: 'Reagent 2', dataIndex: 'col5', key: 'col5', width: '19%' },
    ];

    const dataSource = "result" in results ? results.result.conditions.map((item, index) => ({
        key: index,
        label: `${index + 1}`,
        col1: item[0],
        col2: item[1],
        col3: item[2],
        col4: item[3],
        col5: item[4],
    })) : [];

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

    return (
        <PageLayout>
            <div style={{ textAlign: 'center' }}>
                <Title level={2} style={{ padding: "0px 20px" }}> <b>Reaction Condition Prediction</b></Title>
                <div style={{ position: "relative", width: "100%", height: "1px", top: "-12px", backgroundColor: "#eeeeee" }} />
                <div style={{ position: "relative", top: "-6px", padding: "0px 20px" }}><b>Deep learning</b> based, driven by <b>chemical rules</b> and <b>millions of reaction data</b>.</div>
            </div>
            <div style={{ textAlign: 'center' }}>

                <Title style={{ marginTop: "70px", padding: "0px 40px" }} level={3}>Condition Categories</Title>

            </div>
            <Divider />
            <Row gutter={16}>
                {reactionConditions.map((condition, index) => (
                    <Col span={8} key={index}>
                        <Card title={
                            <div><b style={{ color: "#1890ff" }}>| </b>{condition.title}</div>
                        } bordered={false}>
                            <p>{condition.description}</p>
                            {condition.available}
                        </Card>
                    </Col>
                ))}
            </Row>
            <div style={{ textAlign: 'center' }}>
                <Title style={{ marginTop: "50px", padding: "0px 40px" }} level={3}>Data Sources</Title>
            </div>
            <Divider />

            <div style={{ padding: '20px' }}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Card title={<div><b style={{ color: "#1890ff" }}>| </b> USPTO-Condition Database</div>} bordered={false}>

                            <p>
                                Contains <b>680,000+</b> reaction condition data points and <b>360+</b> types of reaction conditions, including various information annotations on catalysts, solvents, reagents, and temperatures. It includes hundreds of different types of organic chemical reactions extracted from literature.
                            </p>

                            <p>Extracted and cleaned by <a href='https://github.com/wangxr0526/Parrot'>Wang et al.</a> from the USPTO database.</p>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title={<div><b style={{ color: "#1890ff" }}>| </b> Pistachio-Condition Database</div>} bordered={false}>

                            <p>
                                Contains <b>560,000+</b> high-quality reaction condition data points and <b>470+</b> types of reaction conditions, including annotations on catalysts, solvents, reagents, environments, and temperatures. It includes over 1,700 different types of chemical reactions extracted from literature along with corresponding reaction type annotations.
                            </p>

                            <p>Extracted from the <a href='https://www.nextmovesoftware.com/pistachio.html'>Pistachio</a> database.</p>
                        </Card>
                    </Col>
                </Row>
            </div>

            <div style={{ textAlign: 'center' }}>
                <Title style={{ marginTop: "50px", padding: "0px 40px" }} level={3}>Online Inference</Title>
            </div>
            <Divider />

            <ReactionInputBox>
                <MoleculeBox>
                    <Title level={5}><b style={{ color: "#1890ff" }}>| </b> Reactant</Title>
                    <Divider style={{ margin: "0px 0px 10px 0px" }} />
                    <Input
                        placeholder="Reactant SMILES"
                        value={reactant}
                        onChange={event => { setReactant(event.target.value); }}
                        style={{ marginBottom: "10px" }}
                    />

                    <Button onClick={() => setReactantDraw(true)} style={{ height: "200px", border: "none" }}>
                        <SVGBox>
                            <SmilesSvgRenderer smiles={reactantSmiles} />
                        </SVGBox>
                    </Button>
                    <SmilesDrawer initial={reactant} open={reactantDraw} setOpen={setReactantDraw} confirm={setReactant} />
                </MoleculeBox>

                <Seperator>
                    <div>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <div style={{ height: "2px", width: "100%", right: "-11px", position: "relative", backgroundColor: "#dddddd" }} />
                            <ArrowRightOutlined style={{ color: "#dddddd", fontSize: "20px" }} />
                        </div>
                    </div>

                    <div style={{ borderRadius: "6px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", padding: "10px", margin: "10px 60px", position: "relative" }}>

                        <Title level={5}><b style={{ color: "#1890ff" }}>| </b> Condition</Title>
                        <Divider style={{ margin: "0px 0px 10px 0px" }} />
                        <div style={{ position: "relative" }}>
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
                            <ModelSelectionBox>
                                <ModelSelectLabel>Database:</ModelSelectLabel>
                                <StyledSelect
                                    placeholder="Please select a parameter"
                                    onChange={onParameterSelect}
                                    defaultValue={"uspto_condition"}
                                >
                                    <Option value="uspto_condition">USPTO-Condition</Option>
                                </StyledSelect>
                            </ModelSelectionBox>
                            <OperationBox>
                                <Button
                                    onClick={analyze}
                                    style={{
                                        width: "100%",
                                        border: "0px",
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                    }}> Predict</Button>
                            </OperationBox>
                        </div>
                    </div>
                    <div>
                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <div style={{ height: "2px", width: "100%", right: "-11px", position: "relative", backgroundColor: "#dddddd" }} />
                            <ArrowRightOutlined style={{ color: "#dddddd", fontSize: "20px" }} />
                        </div>
                    </div>
                </Seperator>
                <MoleculeBox>
                    <Title level={5}><b style={{ color: "#1890ff" }}>| </b> Product</Title>
                    <Divider style={{ margin: "0px 0px 10px 0px" }} />
                    <Input
                        placeholder="Product SMILES"
                        value={product}
                        onChange={event => { setProduct(event.target.value); }}
                        style={{ marginBottom: "10px" }}
                    />
                    <Button onClick={() => setProductDraw(true)} style={{ height: "200px", border: "none" }}>
                        <SVGBox>
                            <SmilesSvgRenderer smiles={productSmiles} />
                        </SVGBox>
                    </Button>
                    <SmilesDrawer initial={product} open={productDraw} setOpen={setProductDraw} confirm={setProduct} />
                </MoleculeBox>

            </ReactionInputBox>

            {"result" in results ? <div style={{width:"100%",padding:"0px 20px"}}>
                <Title level={5}><b style={{ color: "#1890ff" }}>| </b>Result</Title>
                <StyledTable dataSource={dataSource} columns={columns} pagination={false} />
                </div> : <></>}

        </PageLayout>
    );
}

export default ReactionCondition;
