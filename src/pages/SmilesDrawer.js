import React, { useEffect, useRef, useState, useCallback } from 'react';
import SmilesStructureEditor from './SmilesStructureEditor';
import styled from 'styled-components';
import OCL from 'openchemlib/full';
import { Button, Modal } from 'antd';
const SmilesDrawerBox = styled.div`
position: relative;
margin: auto;
width: 500px;
height: 500px;
border: 1px solid #ccc;
`;
const SmilesStringBox = styled.div`
position: relative;
margin: auto;
width: 500px;
margin-top: 10px;
margin-bottom: 10px;
`;

const SmilesDrawer = ({ initial, open, setOpen, confirm }) => {
  const [smiles, setSmiles] = useState(initial);
  const drawCallback = useCallback((molfile) => {
    const molecule = OCL.Molecule.fromMolfile(molfile)
    setSmiles(molecule.toSmiles());
  }, [smiles, setSmiles]);

  useEffect(() => {
    if (open) {
      setSmiles(initial);
    }
  }, [open, initial]);

  let initialMolfile = ""
  try {
    const initialMolecule = OCL.Molecule.fromSmiles(initial);
    initialMolfile = initialMolecule.toMolfile();
  }
  catch (e) { }

  const confirmClick = () => {
    confirm(smiles);
    setOpen(false);
  }

  return <Modal
    open={open}
    title="SMILES Drawer"
    onCancel={() => setOpen(false)}
    footer={[
      <Button key="back" onClick={confirmClick}>
        Confirm
      </Button>
    ]}
    width={560}
  >
    <SmilesDrawerBox>
      <SmilesStructureEditor
        initialMolfile={initialMolfile}
        onChange={drawCallback}
        width={500}
        height={500} />
    </SmilesDrawerBox>
    <SmilesStringBox><b>SMILES:</b> {smiles}</SmilesStringBox>
  </Modal>
}

export default SmilesDrawer;
