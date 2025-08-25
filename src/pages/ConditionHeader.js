
import styled from 'styled-components';
import { Divider } from 'antd';
import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
const CustomButton = styled.button`
    color: #aaaaaa;
    font-size: 16px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.3s, background-color 0.3s, transform 0.1s;
    margin: 0 8px;

    &:hover {
        color: #1890ff;
    }

    &:active {
        transform: scale(0.95);
    }
`;

export default function ConditionHeader() {
  //   return <div>
  //   <CustomButton onClick={()=>{window.location.href = "https://github.com/wangxr0526/Parrot";}}>
  //     Training Data
  //   </CustomButton>
  //   <Divider type="vertical" style={{ height: '24px', margin: '0 8px', }} />
  //   <CustomButton onClick={()=>{window.location.href = "https://huggingface.co/reactiongraph/ReactionGraph/blob/main/uspto_condition.ckpt";}}>
  //     Checkpoint
  //   </CustomButton>
  //   <Divider type="vertical" style={{ height: '24px', margin: '0 8px' }} />
  //   <CustomButton onClick={()=>{window.location.href = "/inference_uspto_condition.py"}}>
  //     Inference Code
  //   </CustomButton>
  // </div>
  return <CustomButton>
    <QuestionCircleOutlined />
    About
  </CustomButton>
}