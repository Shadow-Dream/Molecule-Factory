import SmilesDrawer from './SmilesDrawer';
import { useEffect, useRef, useState } from 'react';
import { Button, Input, notification, Select, Divider, Layout, Typography, Card, Spin, Alert, Table, Row, Col, Upload, message, Progress } from 'antd';
import styled from 'styled-components';
import { SmilesSvgRenderer } from 'react-ocl';
import OCL from 'openchemlib/full';
import reactionGraphAPI from '../api/ReactionGraph';
import { useDispatch, useSelector } from 'react-redux';
import { clearInferenceYield, clearYield, setInferenceYield, setYield } from '../redux/store';
import { useImmer } from 'use-immer';
import { BarChartOutlined, FileOutlined, HddOutlined, InboxOutlined, InfoCircleOutlined, QuestionOutlined, RightOutlined, WarningOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ErrorBar, ResponsiveContainer } from "recharts";
import { CheckCircleOutline, ConfirmationNumberOutlined, ErrorOutline, NotAccessibleOutlined, QuestionAnswerOutlined } from '@mui/icons-material';
const { Header, Content, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;

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
position:relative;
left:10px;
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const UnderlineButton = styled(Button)`
  background: none; /* 无背景 */
  border: none; /* 无默认边框 */
  border-bottom: 1px solid #aaaaaa; /* 默认下划线颜色 */
  border-radius: 0; /* 去除圆角 */
  padding: 5px 10px;
  color: #000; /* 文字颜色 */
  font-size: 16px;
  cursor: pointer;
  transition: border-bottom 0.3s ease-in-out, color 0.3s ease-in-out;

  &:hover {
    border-bottom: 2px solid #1890ff; /* 悬浮时变蓝 */
    color: #1890ff; /* 悬浮时字体变蓝 */
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const UnderlineButtonA = styled(Button)`
  background: none; /* 无背景 */
  border: none; /* 无默认边框 */
  border-bottom: 1px solid #aaaaaa; /* 默认下划线颜色 */
  border-radius: 0; /* 去除圆角 */
  padding: 5px 10px;
  color: #000; /* 文字颜色 */
  font-size: 16px;
  cursor: pointer;
  transition: border-bottom 0.3s ease-in-out, color 0.3s ease-in-out;

  &:hover {
    border-bottom: 2px solid ${({ hoverColor }) => hoverColor || "#1890ff"}; /* 悬浮时变蓝 */
    color: ${({ hoverColor }) => hoverColor || "#1890ff"}; /* 悬浮时字体变蓝 */
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const StyledInput = styled(Input)`
  border: none;
  border-bottom: 1px solid #d9d9d9; /* 默认灰色 */
  border-radius: 0;
  outline: none;
  box-shadow: none;
  transition: border-bottom 0.3s ease-in-out;
  margin: 4px;
  height: 24px;
  &:focus {
    border-bottom: 1px solid #1890ff; /* 聚焦时变为蓝色 */
    box-shadow: none;
  }
  &:hover {
    border-bottom: 2px solid #1890ff; /* 悬浮时变蓝 */
    color: #1890ff; /* 悬浮时字体变蓝 */
  }
`;

const UnderlineInput = styled(Input)`
  border: none;
  border-bottom: 1px solid #d9d9d9; /* 默认灰色 */
  border-radius: 0;
  outline: none;
  box-shadow: none;
  transition: border-bottom 0.3s ease-in-out;
  margin: 0px 50px 0px 0px;
  padding: 2px 10px;
  font-size: 16px;
  transition: border-bottom 0.3s ease-in-out, color 0.3s ease-in-out;
  &:focus {
    border-bottom: 1px solid #1890ff; /* 聚焦时变为蓝色 */
    box-shadow: none;
  }
`;

const ModelSelectLabel = styled.label`
width: 120px;
padding: 4px;
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
margin-top: 20px;
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: top;
width: 100%;
gap: 20px;
`;

const ButtonBox = styled.div`
display: flex;
flex-direction: column;
position: relative;
justify-content: space-between;
top: 20px;
gap: 10px;
height: 200px;
padding: 20px;
border-left: 1px solid #d9d9d9;
border-right: 1px solid #d9d9d9;
/* background-color: #f9f9f9; */
/* border-radius: 8px; */
/* box-shadow: 0px -2px 3px rgba(0, 0, 0, 0.1); */
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

const ReactionYield = () => {
    const taskId = useSelector(state => state.slice.reactionYield.taskId);
    const inferenceTaskId = useSelector(state => state.slice.reactionYield.inferenceTaskId);
    const [training, setTraining] = useState(false);
    const [inferencing, setInferencing] = useState(false);
    const [inferenceInferencing, setInferenceInferencing] = useState(false);
    const dispatch = useDispatch();
    const [reactantDraw, setReactantDraw] = useState(false);
    const [reagentDraw, setReagentDraw] = useState(false);
    const [productDraw, setProductDraw] = useState(false);
    const [reactant, setReactant] = useState("C=Cc1cc(Br)ccc1F.[HH]");
    const [reagent, setReagent] = useState("[Pd].CCOC(C)=O");
    const [product, setProduct] = useState("CCc1cc(Br)ccc1F");
    const [inferenceReactantDraw, setInferenceReactantDraw] = useState(false);
    const [inferenceReagentDraw, setInferenceReagentDraw] = useState(false);
    const [inferenceProductDraw, setInferenceProductDraw] = useState(false);

    const [inferenceReactant, setInferenceReactant] = useState("Brc1cccnc1.Cc1ccc(N)cc1");
    const [inferenceReagent, setInferenceReagent] = useState("CC(C)c1cc(C(C)C)c(-c2ccccc2[PH](C(C)(C)C)(C(C)(C)C)[Pd]2(OS(=O)(=O)C(F)(F)F)Nc3ccccc3-c3ccccc32)c(C(C)C)c1.CN(C)C(=NC(C)(C)C)N(C)C.COC(=O)c1cc(-c2cccs2)on1.CS(C)=O");
    const [inferenceProduct, setInferenceProduct] = useState("Cc1ccc(Nc2cccnc2)cc1");

    const [parameter, setParameter] = useState("uspto_gram");
    let reactantSmiles = ""
    let reagentSmiles = ""
    let productSmiles = ""
    let inferenceReactantSmiles = ""
    let inferenceReagentSmiles = ""
    let inferenceProductSmiles = ""
    const [results, setResults] = useImmer({});
    const [inferenceResults, setInferenceResults] = useImmer({});
    const [trainFileContent, setTrainFileContent] = useState(null);
    const [testFileContent, setTestFileContent] = useState(null);
    const [trainFileName, setTrainFileName] = useState("");
    const [testFileName, setTestFileName] = useState("");
    const [trainTaskId, setTrainTaskId] = useState(() => {
        return localStorage.getItem("trainTaskId") || "";
    });
    const [invalidTrainTaskId, setInvalidTrainTaskId] = useState(false);
    const [progress, setProgress] = useState({});
    const [inferenceTrainTaskId, setInferenceTrainTaskId] = useState("");

    const getProgressValue = (key) => {
        return progress[key]?.progress !== undefined ? Math.round(progress[key].progress * 100) : 0;
    };

    const getResultStatus = (key) => {
        if (progress[key]?.result === true) return "✅ Done";
        if (progress[key]?.result === false) return "❌ Failed";
        return `${getProgressValue(key)}%`;
    };

    const getProgressColor = (key) => {
        return progress[key]?.result === false ? "red" : progress[key]?.progress > 0 ? "#1890ff" : "#aaaaaa";
    };

    const handleFileRead = (file, setFileContent, setFileName) => {
        if (!file.name.endsWith(".csv")) {
            message.error("❌ Only Support CSV File!");
            return false;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setFileContent(e.target.result); // 存储 CSV 文本内容
            setFileName(file.name); // 存储文件名
            message.success(`✅ "${file.name}" Upload Success!`);
        };
        reader.readAsText(file);
        return false; // 阻止默认上传行为
    };

    const intervalIdRef = useRef(null);
    useEffect(() => {
        if (taskId !== "") {
            intervalIdRef.current = setInterval(() => {
                reactionGraphAPI.post('/poll', {
                    task_id: taskId
                }).then(response => {
                    if (response.data.status === "done") {
                        dispatch(clearYield());
                        setInferencing(false);
                    }
                    setResults(response.data);
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


    const inferenceIntervalIdRef = useRef(null);
    useEffect(() => {
        if (inferenceTaskId !== "") {
            inferenceIntervalIdRef.current = setInterval(() => {
                reactionGraphAPI.post('/poll', {
                    task_id: inferenceTaskId
                }).then(response => {
                    console.log(response.data);
                    if (response.data.result != undefined){
                        setInferenceResults(response.data.result);
                    }
                    if (response.data.status === "done") {
                        dispatch(clearInferenceYield());
                        setInferenceInferencing(false);
                    }
                    
                }).catch(error => {
                    setInferenceInferencing(false);
                });
            }, 1000);
        }
        return () => {
            if (inferenceIntervalIdRef.current) {
                clearInterval(inferenceIntervalIdRef.current);
                inferenceIntervalIdRef.current = null;
            }
        }
    }, [inferenceTaskId, dispatch]);

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

    try {
        const inferenceReactantMolecule = OCL.Molecule.fromSmiles(inferenceReactant);
        inferenceReactantSmiles = inferenceReactantMolecule.toSmiles();
    }
    catch (e) { }

    try {
        const inferenceReagentMolecule = OCL.Molecule.fromSmiles(inferenceReagent);
        inferenceReagentSmiles = inferenceReagentMolecule.toSmiles();
    }
    catch (e) { }

    try {
        const inferenceProductMolecule = OCL.Molecule.fromSmiles(inferenceProduct);
        inferenceProductSmiles = inferenceProductMolecule.toSmiles();
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
                console.log(response.data);
                dispatch(setYield(response.data["task_id"]));
            });
        } else {
            notification.open({
                message: 'Error',
                description: 'Invalid SMILES',
            });
        }
    }

    const inferenceAnalyze = () => {
        if (inferenceTrainTaskId !== ""
            && inferenceReactantSmiles !== ""
            && inferenceProductSmiles !== ""
            && (inferenceReagentSmiles !== "" || inferenceReagent === "")) {
            setInferenceResults({})
            setInferenceInferencing(true);
            reactionGraphAPI.post('/analyze', {
                function: "inference_yield",
                task_id: inferenceTrainTaskId,
                reactant: inferenceReactantSmiles,
                reagent: inferenceReagentSmiles,
                product: inferenceProductSmiles
            }).then(response => {
                dispatch(setInferenceYield(response.data["task_id"]));
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
    let resultString = ("result" in results) ? " - Predict Reaction Yield: Done" : "";
    let outputString = ("result" in results) ? "Result: " + results.result.yield.toFixed(3) + " ± " + Math.sqrt(results.result.variance).toFixed(3) : "";

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
    const usptoGramMean = results.uspto_gram == undefined ? 0 : results.uspto_gram.yield * 100;
    const usptoSubgramMean = results.uspto_subgram == undefined ? 0 : results.uspto_subgram.yield * 100;
    const gramMean = results.gram == undefined ? 0 : results.gram.yield * 100;
    const subgramMean = results.subgram == undefined ? 0 : results.subgram.yield * 100;
    const usptoGramStd = results.uspto_gram == undefined ? 0 : (Math.sqrt(results.uspto_gram.variance) * 100);
    const usptoSubgramStd = results.uspto_subgram == undefined ? 0 : (Math.sqrt(results.uspto_subgram.variance) * 100);
    const yield_result = [
        {
            name: "Gram Model 1",
            yield: usptoGramMean,
            error: [usptoGramStd, usptoGramStd]
        },
        {
            name: "Subgram Model 2",
            yield: usptoSubgramMean,
            error: [usptoSubgramStd, usptoSubgramStd]
        },
        {
            name: "Gram Model 3",
            yield: gramMean
        },
        {
            name: "Subgram Model 4",
            yield: subgramMean
        },
    ];

    const trainSetExample = `smiles,yield
CCO>[Pd]>CCO,1.0
c1ccccc1>>c1ccccc1,0.5
......`;

    const testSetExample = `smiles,yield
CCO>[H]>CCO,0.9
C=O>[Pd]>C=O,0.6
......`;

    const startRegression = () => {
        if (trainFileContent != null && testFileContent != null) {
            setTraining(true);
            reactionGraphAPI.post('/analyze', {
                function: "regress_yield",
                train: trainFileContent,
                test: testFileContent
            }).then(response => {
                setTraining(false);
                console.log(response.data);
                setTrainTaskId(response.data["task_id"]);
            }).catch(error => {
                setTraining(false);
                message.error("Failed to start training!");
            });
        } else {
            message.error("Please upload the training and test set first!");
        }
    }

    useEffect(() => {
        if (trainTaskId) {
            localStorage.setItem("trainTaskId", trainTaskId);
        } else {
            localStorage.removeItem("trainTaskId"); // trainTaskId 为空时，清除存储
        }

        let intervalId;
        setInvalidTrainTaskId(false);
        if (trainTaskId != "") {
            intervalId = setInterval(() => {
                reactionGraphAPI.post("/poll", { task_id: trainTaskId })
                    .then((response) => {
                        setProgress(response.data)
                        if (response.data.train?.result) {
                            clearInterval(intervalId);
                            if (inferenceTrainTaskId == "") {
                                setInferenceTrainTaskId(trainTaskId);
                            }
                        }
                    })
                    .catch((error) => {
                        message.error("Failed to fetch task status!");
                        setInvalidTrainTaskId(true);
                        if (intervalId) {
                            clearInterval(intervalId);
                        }
                    });
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [trainTaskId]);
    const inferenceYield = inferenceResults.yield == undefined ? 0 : inferenceResults.yield * 100;
    const inferenceError = inferenceResults.variance == undefined ? 0 : Math.sqrt(inferenceResults.variance) * 100;
    const inferenceData = [
        { name: "Yield", value: inferenceYield, error: inferenceError },
    ]
    console.log(inferenceResults);
    return (
        <PageLayout>
            <div style={{ textAlign: 'center' }}>
                <Title level={2} style={{ padding: "0px 20px" }}> <b>Reaction Yield Analysis</b></Title>
                <div style={{ position: "relative", width: "100%", height: "1px", top: "-12px", backgroundColor: "#eeeeee" }} />
                <div style={{ position: "relative", top: "-6px", padding: "0px 20px" }}>Online tools for reaction <b>yield prediction</b> and yield <b>data regression</b>.</div>
            </div>

            <Content style={{ marginTop: "30px" }}>
                <Paragraph>
                    Chemical yield refers to the amount of product obtained from a chemical reaction compared to the maximum possible amount that could theoretically be produced. It is a crucial metric for evaluating the efficiency of chemical reactions. In computer-aided synthesis and industrial production, accurate yield predictions help chemists and engineers optimize reaction conditions, enhance production efficiency, and reduce costs. Understanding yield is essential for scaling up reactions from the laboratory to industrial scale.
                </Paragraph>
                <div style={{ width: "100%", display: "flex", justifyContent: "right" }}>
                    <Button
                        type="text" // 使用无边框样式
                        icon={<InfoCircleOutlined />}
                        onClick={() => { window.open('https://en.wikipedia.org/wiki/Yield_(chemistry)', '_blank'); }}
                    >
                        Know More
                    </Button>

                </div>

                <Divider />

                <Card bordered={false} title={<span style={{ fontSize: "20px" }} ><BarChartOutlined /> <b>Yield Prediction</b></span>} style={{ marginBottom: '24px' }}>

                    {/* <div style={{padding:"5px"}}>
                    <b>· Step 1: </b> We trained models for gram-level and milligram-level reactions, respectively. Please first specify the product scale for the prediction.
                    </div>
                    <ModelSelectionBox>
                        <ModelSelectLabel>Product Scale:</ModelSelectLabel>
                        <StyledSelect
                            placeholder="Please select a parameter"
                            onChange={onParameterSelect}
                            defaultValue={"uspto_gram"}
                            
                        >
                            <Option value="uspto_gram">Gram Scale</Option>
                            <Option value="uspto_subgram">Milligram Scale</Option>
                        </StyledSelect>
                    </ModelSelectionBox>
                    <Divider style={{ backgroundColor: '#d9d9d9' }} /> */}
                    {/* <b>· Step 2: </b> Please enter or draw the chemical reaction for which you want to predict the yield. */}
                    <ReactionInputBox>
                        <MoleculeBox>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div style={{ margin: "6px", fontWeight: "bold" }}>Reactant:</div>
                                <StyledInput
                                    placeholder="Reactant SMILES"
                                    value={reactant}
                                    onChange={event => { setReactant(event.target.value); }}
                                />
                            </div>
                            <Button onClick={() => setReactantDraw(true)} style={{ height: "200px", border: "none" }}>
                                <SVGBox>
                                    <SmilesSvgRenderer smiles={reactantSmiles} />
                                </SVGBox>
                            </Button>
                            <SmilesDrawer initial={reactant} open={reactantDraw} setOpen={setReactantDraw} confirm={setReactant} />
                        </MoleculeBox>
                        <Seperator>{">"}</Seperator>
                        <MoleculeBox>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div style={{ margin: "6px", fontWeight: "bold" }}>Reagent:</div>
                                <StyledInput
                                    placeholder="Reagent SMILES"
                                    value={reagent}
                                    onChange={event => { setReagent(event.target.value); }}
                                />
                            </div>
                            <Button onClick={() => setReagentDraw(true)} style={{ height: "200px", border: "none" }}>
                                <SVGBox>
                                    <SmilesSvgRenderer smiles={reagentSmiles} />
                                </SVGBox>
                            </Button>
                            <SmilesDrawer initial={reagent} open={reagentDraw} setOpen={setReagentDraw} confirm={setReagent} />
                        </MoleculeBox>
                        <Seperator>{">"}</Seperator>
                        <MoleculeBox>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div style={{ margin: "6px", fontWeight: "bold" }}>Product:</div>
                                <StyledInput
                                    placeholder="Product SMILES"
                                    value={product}
                                    onChange={event => { setProduct(event.target.value); }}
                                />
                            </div>
                            <Button onClick={() => setProductDraw(true)} style={{ height: "200px", border: "none" }}>
                                <SVGBox>
                                    <SmilesSvgRenderer smiles={productSmiles} />
                                </SVGBox>
                            </Button>
                            <SmilesDrawer initial={product} open={productDraw} setOpen={setProductDraw} confirm={setProduct} />
                        </MoleculeBox>
                    </ReactionInputBox>
                    {/* <Divider style={{ backgroundColor: '#d9d9d9' }} /> */}
                    {/* <b>· Step 3 </b> Start analyze the reaction and get the prediction result. */}
                    <OperationBox>
                        {/* <OutputBox>
                            {statusString ? <div><b>{statusString}</b></div> : <></>}
                            {smilesString ? <div>{smilesString}</div> : <></>}
                            {resultString ? <div>{resultString}</div> : <></>}
                            {outputString ? <div><b>{outputString}</b></div> : <></>}
                        </OutputBox> */}
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={yield_result}
                                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                                barSize={50}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="yield" fill="white" stroke='black'>
                                    <ErrorBar dataKey="error" width={4} stroke="black" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
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
                            <UnderlineButton onClick={analyze}>Predict</UnderlineButton>
                            <UnderlineButton onClick={handleDownload}>Download</UnderlineButton>
                            <UnderlineButton onClick={() => { setResults({}) }}>Clear</UnderlineButton>


                        </ButtonBox>



                    </OperationBox>
                    <Divider style={{ backgroundColor: '#d9d9d9' }} />
                    <Paragraph>
                        <b>*</b> Our model is trained on the <a href='https://rxn4chemistry.github.io/rxn_yields/uspto_data_exploration/'>USPTO-Yield</a>, which comprises a substantial collection of yield data from diverse chemical reactions.
                        We trained four deep learning models to provide a more comprehensive result,
                        which can uncover patterns and relationships within the data, offering researchers reliable estimates of reaction yields across a wide range of reaction types.
                    </Paragraph>
                </Card>

                <Divider style={{ margin: "50px 0px" }} />

                <Card bordered={false} title={<span style={{ fontSize: "20px" }} ><HddOutlined /> <b>Yield Regression</b></span>} style={{ marginBottom: '24px' }}>
                    <Paragraph>
                        Upload your own yield data to train a <b>customized</b> prediction model tailored to specific types of chemical reactions! This customization allows for more accurate predictions based on unique datasets that may not be covered by general models.
                    </Paragraph>

                    <Divider style={{ backgroundColor: '#d9d9d9' }} />
                    <Paragraph style={{ fontSize: "16px" }}>
                        <b>Step 1. Prepare your yield data in the following format:</b>
                    </Paragraph>
                    <div style={{ padding: "0px 20px" }}>
                        <Paragraph>
                            <Text strong style={{ color: "#1890ff" }}>1. </Text>
                            Both the training set and the test set must be in CSV format, containing
                            <Text code>smiles</Text>  and <Text code>yield</Text> columns, representing the chemical reaction SMILES expression and yield, respectively.
                        </Paragraph>

                        <Paragraph>
                            <Text strong style={{ color: "#1890ff" }}>2. </Text>
                            The format of the SMILES expression is:  <Text code>{"{reactants}>{reagents}>{products}"}</Text>,
                            where <Text code>reactants</Text>, <Text code>reagents</Text>, and <Text code>products</Text> are all in a SMILES format that can be parsed by RDKit.
                        </Paragraph>

                        <Paragraph>
                            <Text strong style={{ color: "#1890ff" }}>3. </Text>
                            The <Text code>yield</Text> column must be a floating-point number, ranging from <Text code>0-1</Text>.
                        </Paragraph>

                        <Paragraph>
                            <Text strong style={{ color: "#1890ff" }}>4. </Text>
                            Due to limited computational resources:
                            <ul>
                                <li> The total number of data points in the training and test sets should <Text strong>not exceed 10,000</Text>.</li>
                                <li> The combined file size for uploads should <Text strong>not exceed 1MB</Text>.</li>
                            </ul>
                        </Paragraph>
                        <Row gutter={24}>
                            <Col span={12}>
                                <Card title="📊 Train Set Example" bordered={true}>
                                    <pre style={{
                                        backgroundColor: "#f5f5f5",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        fontFamily: "monospace",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                    }}>
                                        {trainSetExample}
                                    </pre>
                                </Card>
                            </Col>

                            <Col span={12}>
                                <Card title="🧪 Test Set Example" bordered={true}>
                                    <pre style={{
                                        backgroundColor: "#f5f5f5",
                                        padding: "10px",
                                        borderRadius: "5px",
                                        fontFamily: "monospace",
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                    }}>
                                        {testSetExample}
                                    </pre>
                                </Card>
                            </Col>
                        </Row>
                    </div>

                    <Divider style={{ backgroundColor: '#d9d9d9', margin: "60px 0px" }} />
                    <Paragraph style={{ fontSize: "16px" }}>
                        <b>Step 2. Upload your train and test data.</b>
                    </Paragraph>
                    <Row gutter={24} style={{ margin: "auto" }}>
                        {/* 训练集上传框 */}
                        <Col span={12}>
                            <Card title="📊 Train Set Upload" bordered>
                                <Dragger
                                    multiple={false}
                                    accept=".csv"
                                    beforeUpload={(file) => handleFileRead(file, setTrainFileContent, setTrainFileName)}
                                    showUploadList={false} // 不展示上传列表
                                >
                                    {trainFileContent == null ? (
                                        <>
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">Drag and drop files here or click to select</p>
                                            <p className="ant-upload-hint">Only CSV format is supported</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="ant-upload-drag-icon">
                                                <FileOutlined style={{ color: "gray" }} />
                                            </p>
                                            <p className="ant-upload-text"><strong>Uploaded:</strong> {trainFileName}</p>
                                            <p className="ant-upload-hint">Click to replace the file</p>
                                        </>
                                    )}
                                </Dragger>
                            </Card>
                        </Col>

                        {/* 测试集上传框 */}
                        <Col span={12}>
                            <Card title="🧪 Test Set Upload" bordered>
                                <Dragger
                                    multiple={false}
                                    accept=".csv"
                                    beforeUpload={(file) => handleFileRead(file, setTestFileContent, setTestFileName)}
                                    showUploadList={false}
                                >
                                    {testFileContent == null ? (
                                        <>
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p className="ant-upload-text">Drag and drop files here or click to select</p>
                                            <p className="ant-upload-hint">Only CSV format is supported</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="ant-upload-drag-icon">
                                                <FileOutlined style={{ color: "gray" }} />
                                            </p>
                                            <p className="ant-upload-text"><strong>Uploaded:</strong> {testFileName}</p>
                                            <p className="ant-upload-hint">Click to replace the file</p>
                                        </>
                                    )}

                                </Dragger>
                            </Card>
                        </Col>
                    </Row>
                    <Divider style={{ backgroundColor: '#d9d9d9', margin: "60px 0px" }} />
                    <Paragraph style={{ fontSize: "16px" }}>
                        <b>Step 3. Start training and wait for the training to finish.</b>
                    </Paragraph>
                    <div style={{ padding: "20px", position: "relative" }}>
                        {invalidTrainTaskId ? <div style={{
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
                            flexDirection: "row",
                            fontSize: 32,
                            fontWeight: "bold"
                        }}>
                            <ErrorOutline style={{ fontSize: 60, marginRight: "12px" }} />
                            Task Not Found
                        </div>
                            : (trainTaskId != "" && progress.train == undefined) ? <div style={{
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
                            </div>
                                : progress.train?.result ?
                                    <div style={{
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
                                        flexDirection: "row",
                                        fontSize: 32,
                                        fontWeight: "bold"
                                    }}>
                                        <CheckCircleOutline style={{ fontSize: 60, marginRight: "12px" }} />
                                        Training Completed!
                                    </div>
                                    : <></>}

                        {["valid", "analysis", "preprocess", "train"].map((key, index) => (
                            <div style={{ marginBottom: 10 }}>
                                <Text strong>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                                <Progress style={{ width: "100%" }} percent={getProgressValue(key)} strokeColor={getProgressColor(key)} format={() => <div style={{ width: "80px" }}><Text style={{ fontWeight: "bold", color: getProgressColor(key) }}>{getResultStatus(key)}</Text></div>} />
                            </div>
                        ))}
                        {progress.train?.r2 == undefined ? <></> : <div style={{ display: "flex", flexDirection: "row", gap: "60px" }}>
                            <span><b>Current Loss:</b> {progress.train.loss.toFixed(3)}</span>
                            <span><b>R2 Score:</b> {progress.train.r2.toFixed(3)}</span>
                        </div>}
                    </div>

                    <div></div>

                    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                        <UnderlineButtonA onClick={() => { startRegression() }} disabled={training || (trainTaskId != "")}
                            hoverColor={(training || (trainTaskId != "")) ? "#aaaaaa" : "#1890ff"}
                        >Start Training</UnderlineButtonA>
                        <UnderlineInput
                            placeholder="Training Task ID"
                            value={trainTaskId}
                            onChange={event => {
                                setProgress({});
                                setTrainTaskId(event.target.value);
                            }}
                        />
                        {/* 0cdd3727-11c7-44c2-ae0f-8ad4aeab5d4b */}

                    </div>
                    <Paragraph>
                        <b>*</b> After the training starts, the server will generate a Task ID for you. You can write down the Task ID and return to the webpage later to check the progress by entering the Task ID.
                    </Paragraph>
                    <Divider style={{ backgroundColor: '#d9d9d9', margin: "60px 0px" }} />
                    <Paragraph style={{ fontSize: "16px" }}>
                        <b>Step 4. Use your customized model for inference.</b>
                    </Paragraph>
                    <div style={{ position: "relative" }}>
                        {inferenceInferencing ? <div style={{
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

                        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                            <UnderlineButtonA
                                onClick={() => { inferenceAnalyze() }}
                                disabled={inferenceInferencing || inferenceTrainTaskId == ""}
                                hoverColor={(inferenceInferencing || (inferenceTrainTaskId == "")) ? "#aaaaaa" : "#1890ff"}
                            >Inference</UnderlineButtonA>
                            <UnderlineInput
                                placeholder="Task ID"
                                value={inferenceTrainTaskId}
                                onChange={event => {
                                    setInferenceTrainTaskId(event.target.value);
                                }}
                            />
                            {/* 0cdd3727-11c7-44c2-ae0f-8ad4aeab5d4b */}

                        </div>
                        <ReactionInputBox>
                            <MoleculeBox>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    {/* <div style={{ margin: "6px", fontWeight: "bold" }}>Reactant:</div> */}
                                    <StyledInput
                                        placeholder="Reactant SMILES"
                                        value={inferenceReactant}
                                        onChange={event => { setInferenceReactant(event.target.value); }}
                                    />
                                </div>
                                <Button onClick={() => setInferenceReactantDraw(true)} style={{ height: "200px", border: "none" }}>
                                    <SVGBox>
                                        <SmilesSvgRenderer smiles={inferenceReactantSmiles} />
                                    </SVGBox>
                                </Button>
                                <SmilesDrawer initial={inferenceReactant} open={inferenceReactantDraw} setOpen={setInferenceReactantDraw} confirm={setInferenceReactant} />
                            </MoleculeBox>
                            <Seperator>{">"}</Seperator>
                            <MoleculeBox>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    {/* <div style={{ margin: "6px", fontWeight: "bold" }}>Reagent:</div> */}
                                    <StyledInput
                                        placeholder="Reagent SMILES"
                                        value={inferenceReagent}
                                        onChange={event => { setInferenceReagent(event.target.value); }}
                                    />
                                </div>
                                <Button onClick={() => setInferenceReagentDraw(true)} style={{ height: "200px", border: "none" }}>
                                    <SVGBox>
                                        <SmilesSvgRenderer smiles={inferenceReagentSmiles} />
                                    </SVGBox>
                                </Button>
                                <SmilesDrawer initial={inferenceReagent} open={inferenceReagentDraw} setOpen={setInferenceReagentDraw} confirm={setInferenceReagent} />
                            </MoleculeBox>
                            <Seperator>{">"}</Seperator>
                            <MoleculeBox>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    {/* <div style={{ margin: "6px", fontWeight: "bold" }}>Product:</div> */}
                                    <StyledInput
                                        placeholder="Product SMILES"
                                        value={inferenceProduct}
                                        onChange={event => { setInferenceProduct(event.target.value); }}
                                    />
                                </div>
                                <Button onClick={() => setInferenceProductDraw(true)} style={{ height: "200px", border: "none" }}>
                                    <SVGBox>
                                        <SmilesSvgRenderer smiles={inferenceProductSmiles} />
                                    </SVGBox>
                                </Button>
                                <SmilesDrawer initial={inferenceProduct} open={inferenceProductDraw} setOpen={setInferenceProductDraw} confirm={setInferenceProduct} />
                            </MoleculeBox>
                        </ReactionInputBox>
                        <ResponsiveContainer width="100%" height={160}>
                            <BarChart
                                layout="vertical"
                                data={inferenceData}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                barSize={40}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" tick={{ fontSize: "16px", fontWeight: "bold" }} tickMargin={20} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="white" stroke="black">
                                    <ErrorBar dataKey="error" width={4} stroke="black" />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </Content>


            {/* 
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

            </ModelSelectionContainer> */}

        </PageLayout>
    );
}

export default ReactionYield;
