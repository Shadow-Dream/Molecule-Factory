
import styled from 'styled-components';
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
    display:flex;
    gap: 6px;

    &:hover {
        color: #1890ff;
    }

    &:active {
        transform: scale(0.95);
    }
`;

export default function HomeHeader() {
    return <CustomButton>
    <QuestionCircleOutlined />
    About
  </CustomButton>
}