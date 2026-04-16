import React, { useState } from 'react';
import { Button, Input, message, Spin, Card, Divider, Row, Col } from 'antd';
import styled from 'styled-components';
import { SmilesSvgRenderer } from 'react-ocl';
import OCL from 'openchemlib/full';
import SmilesDrawer from './SmilesDrawer';
import 'antd/dist/reset.css';
import { ApartmentOutlined } from '@ant-design/icons';
import retrosynthesisAPI from '../api/retrosynthesis';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  gap: 24px;
`;

const Panel = styled(Card)`
  width: 100%;
  max-width: 1000px;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
`;

const MoleculePreview = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  margin-top: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ResultContainer = styled.div`
  overflow-y: auto;
  padding: 12px;
  min-height: 300px;
`;

const EmptyHint = styled.div`
  color: #999;
  text-align: center;
  font-size: 15px;
  margin-top: 20px;
`;

const Retrosynthesis = () => {
  const [molecule, setMolecule] = useState("CCOC(C)=O");
  const [moleculeDraw, setMoleculeDraw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [api, contextHolder] = message.useMessage();

  const handleSubmit = async () => {
    const smilesValue = molecule.trim();

    if (!smilesValue) {
      api.warning('Please enter a SMILES string!');
      return;
    }

    try {
      OCL.Molecule.fromSmiles(smilesValue);
    } catch (error) {
      api.error('Invalid SMILES format!');
      return;
    }

    setLoading(true);
    setResults([]);

    try {
      const response = await retrosynthesisAPI.post('/upload', { smiles: smilesValue });
      const data = response.data;

      if (data.status === 'success' && Array.isArray(data.results)) {
        setResults(data.results);
        api.success('Analysis completed!');
      } else {
        api.error(data.message || data.detail || 'Unexpected response format.');
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error.response?.data?.message || error.response?.data?.detail;
      api.error(errorMessage || 'Request failed. Please check your connection or contact admin.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ 渲染单个分子卡片
  // ✅ 渲染结果（每个结果是一个卡片，可能包含1或2个分子）
  const renderResults = () => {
    if (results.length === 0) return <EmptyHint>No results yet.</EmptyHint>;

    const colsPerRow = 3;
    const rows = [];
    for (let i = 0; i < results.length; i += colsPerRow) {
      rows.push(results.slice(i, i + colsPerRow));
    }

    return rows.map((row, idx) => (
      <div key={idx}>
        <Row gutter={[16, 16]} justify="center">
          {row.map((item, j) => {
            const { type, structure, reactant1, reactant2 } = item;
            const globalRank = idx * colsPerRow + j + 1; // Top-N index

            return (
              <Col key={j} xs={24} sm={12} md={8}>
                <Card
                  size="small"
                  hoverable
                  title={<div style={{ fontWeight: 600 }}>Top-{globalRank}</div>}
                  style={{
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    borderRadius: 6,
                    padding: 8,
                    fontSize: 12,
                    height: 260
                  }}
                >
                  {/* Single-type molecule */}
                  {type === 'single' && structure && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>
                          {structure.formula || 'Unknown'}
                        </div>
                        <div style={{ fontSize: 12, marginBottom: 6 }}>
                          SMILES: {structure.smiles || 'Unknown'}
                        </div>
                      </div>
                      {structure.png_base64 && (
                        <img
                          src={structure.png_base64}
                          alt="molecule"
                          style={{
                            width: '100%',
                            maxHeight: 140,
                            objectFit: 'contain',
                            marginTop: 4,
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* Double-type molecule */}
                  {type === 'double' && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {reactant1?.structure && (
                          <div style={{ flex: '1 1 45%', minWidth: 120 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>
                              {reactant1.structure.formula || 'Unknown'}
                            </div>
                            <div style={{ fontSize: 12 }}>
                              SMILES: {reactant1.smiles || 'Unknown'}
                            </div>
                            {reactant1.structure.png_base64 && (
                              <img
                                src={reactant1.structure.png_base64}
                                alt="reactant1"
                                style={{
                                  width: '100%',
                                  maxHeight: 100,
                                  objectFit: 'contain',
                                  marginTop: 4,
                                }}
                              />
                            )}
                          </div>
                        )}
                        {reactant2?.structure && (
                          <div style={{ flex: '1 1 45%', minWidth: 120 }}>
                            <div style={{ fontSize: 13, fontWeight: 600 }}>
                              {reactant2.structure.formula || 'Unknown'}
                            </div>
                            <div style={{ fontSize: 12 }}>
                              SMILES: {reactant2.smiles || 'Unknown'}
                            </div>
                            {reactant2.structure.png_base64 && (
                              <img
                                src={reactant2.structure.png_base64}
                                alt="reactant2"
                                style={{
                                  width: '100%',
                                  maxHeight: 100,
                                  objectFit: 'contain',
                                  marginTop: 4,
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>
        {idx < rows.length - 1 && <Divider />}
      </div>
    ));
  };



  let moleculeSmiles = "";
  try {
    const moleculeObj = OCL.Molecule.fromSmiles(molecule);
    moleculeSmiles = moleculeObj.toSmiles();
  } catch (e) { }

  return (
    <div>
      {contextHolder}
      <Container>
        {/* ====== 新增：标题与描述 ====== */}
        <Card
          style={{
            maxWidth: 1000,
            textAlign: 'left',
            background: '#fafafa',
            border: '1px solid #f0f0f0',
            borderRadius: 8,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
            <ApartmentOutlined /> Retrosynthesis
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#444' }}>
            <strong>Retrosynthesis</strong> remains a critical task in both{' '}
            <strong>drug discovery</strong> and <strong>organic synthesis</strong>.
            Current methodologies in this field predominantly rely on{' '}
            <span style={{ color: '#1677ff', fontWeight: 500 }}>
              purely data-driven paradigms
            </span>
            , where models are expected to autonomously learn reaction patterns
            from extensive retrosynthesis datasets without incorporating established{' '}
            <strong>chemical knowledge</strong>. To address this limitation, we
            introduce{' '}
            <span style={{ color: '#1677ff', fontWeight: 600 }}>RetroAux</span>,
            a framework injected with <strong>molecular property knowledge</strong>{' '}
            to enhance existing approaches and achieve significant performance
            improvements.
            <br />
            <br />
            Throughout the entire retrosynthesis pipeline—from{' '}
            <strong>reaction rule acquisition</strong> to{' '}
            <strong>reactant molecule generation</strong>—our methodology
            systematically integrates{' '}
            <span style={{ color: '#1677ff', fontWeight: 500 }}>
              molecular property knowledge
            </span>{' '}
            (e.g., functional groups, chirality) as both{' '}
            <strong>chemical priors</strong> and <strong>foundations</strong>,
            thereby enhancing retrosynthesis prediction reliability. Our
            knowledge-driven framework can be seamlessly integrated with multiple
            existing data-driven methods to improve their performance consistently.
            <br />
            <br />
            Experimental results demonstrate that RetroAux enhances various
            existing data-driven retrosynthesis models with average{' '}
            <strong>top-1 accuracy improvements</strong> of{' '}
            <span style={{ color: '#1677ff', fontWeight: 600 }}>2.39%</span>{' '}
            without retraining original models, signifying a paradigm evolution in
            retrosynthesis from purely data-driven approaches to{' '}
            <strong>knowledge-driven methodologies</strong>.
          </p>
        </Card>

        {/* ====== 输入区域 ====== */}
        <Panel title="Input">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <span
              style={{
                fontWeight: 600,
                fontSize: 15,
                marginRight: 10,
                whiteSpace: 'nowrap',
              }}
            >
              Target Molecule:
            </span>
            <Input
              placeholder="Enter target SMILES (e.g., CCOC(C)=O)"
              value={molecule}
              onChange={e => setMolecule(e.target.value)}
              onPressEnter={handleSubmit}
              size="large"
              style={{ flex: 1 }}
            />
          </div>

          <MoleculePreview onClick={() => setMoleculeDraw(true)}>
            <SmilesSvgRenderer smiles={moleculeSmiles} />
          </MoleculePreview>

          <SmilesDrawer
            initial={molecule}
            open={moleculeDraw}
            confirm={setMolecule}
            setOpen={setMoleculeDraw}
          />

          <Button
            onClick={handleSubmit}
            loading={loading}
            style={{
              marginTop: 16,
              width: '100%',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            Run Analysis
          </Button>
        </Panel>

        {/* ====== 输出区域（仅在有结果时显示） ====== */}
        {(results.length > 0 || loading) && (
          <Panel title="Output Predicted Reactants (Top-20 Confidence)">
            <Spin spinning={loading} tip="Analyzing..." size="large">
              <ResultContainer style={{ alignItems: 'flex-start' }}>
                {renderResults()}
              </ResultContainer>
            </Spin>
          </Panel>
        )}
      </Container>
    </div>
  );
};

export default Retrosynthesis;
