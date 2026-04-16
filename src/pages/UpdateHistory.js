import React from "react";
import { Card, Timeline, Row, Col, Typography, Divider } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const historyData = [
  {
    date: "2025.10.18",
    updates: [
      "Added Retrosynthesis"
    ],
  },
  {
    date: "2025.5.22",
    updates: [
      "Added Large-scale Reaction Collection Database"
    ],
  },
  {
    date: "2025.3.3",
    updates: [
      "Added customizable yield prediction model training feature",
      "Updated reaction yield prediction interface",
      "Optimized webpage layout",
    ],
  },
  {
    date: "2025.2.29",
    updates: [
      "Optimized reaction classification function",
      "Updated reaction condition prediction interface",
    ],
  },
  {
    date: "2025.2.25",
    updates: [
      "Optimized website homepage",
      "Updated reaction classification function page",
    ],
  },
  {
    date: "2025.2.15",
    updates: [
      "Added reaction condition prediction and reaction yield prediction",
      "Added website homepage",
    ],
  },
  {
    date: "2025.2.7",
    updates: ["Created website", "Deployed reaction classification function"],
  },
];

const UpdateHistory = () => {
  return (
    <div style={{ padding: "40px 20px" }}>
      {/* <Col xs={24} sm={22} md={18} lg={14} xl={12}> */}
        <Title level={3} style={{ textAlign: "left", marginBottom: 20 }}>
        🚀 Update History
        </Title>
        
        <Divider />
        <Timeline mode="left">
          {historyData.map((item, index) => (
            <Timeline.Item
              key={index}
              dot={<ClockCircleOutlined style={{ fontSize: "16px" }} />}
              color="blue"
            >
              <Card
                bordered={false}
                style={{
                  borderRadius: 8,
                  marginBottom: 20,
                //   boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Text strong style={{ fontSize: "16px" }}>{item.date}</Text>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  {item.updates.map((update, idx) => (
                    <li key={idx} style={{ marginBottom: 5 }}>
                      {update}
                    </li>
                  ))}
                </ul>
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      {/* </Col> */}
    </div>
  );
};

export default UpdateHistory;
