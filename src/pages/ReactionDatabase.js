import { Card, Typography, Button, Space, Divider, Row, Col } from "antd";
import { DownloadOutlined, DatabaseOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const ReactionDatabase = () => {
    return (
        <div className="p-6 max-w-3xl mx-auto">
          <Card bordered={false} className="shadow-md rounded-2xl">
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Title level={2}>
                <DatabaseOutlined style={{ marginRight: 12 }} />
                Large-scale Reaction Collection
              </Title>
    
              <Paragraph>
                We collect and consolidate multiple open-source datasets to construct a high-quality, large-scale dataset named <Text strong>Final</Text>. This is achieved through standardization procedures, addition of atom-mapping information, and cross-validation. Specifically, six open-source datasets—<Text code>ORD</Text>, <Text code>CRD</Text>, <Text code>Rhea</Text>, <Text code>RD</Text>, <Text code>DLRD</Text>, and <Text code>CHORISO</Text>—are selected. Redundancy removal and data cleaning are further performed in conjunction with the <Text code>USPTO</Text> series datasets. As a result, we obtain a large-scale, high-quality dataset comprising <Text strong>3.7 million reaction entries</Text>.
              </Paragraph>
    
              <Divider />
    
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <Row align="middle" justify="space-between" gutter={[16, 16]}>
                  <Col span={24}>
                    <Title level={4} style={{ marginBottom: 12 }}>
                      <DownloadOutlined style={{ marginRight: 8 }} />Dataset Access
                    </Title>
                  </Col>
    
                  <Col span={24}>
                    <Paragraph style={{ marginBottom: 4 }}>
                      <Text strong>Link:</Text>
                      <Text copyable style={{ marginLeft: 8 }}>
                        https://pan.baidu.com/s/15Fev1Wryjg8A6a5mBJ1CZA?pwd=3eeq
                      </Text>
                    </Paragraph>
                    <Paragraph style={{ marginBottom: 4 }}>
                      <Text strong>Password:</Text>
                      <Text code style={{ marginLeft: 8 }}>3eeq</Text>
                    </Paragraph>
                    <Paragraph type="secondary" style={{ fontSize: 14 }}>
                      Tip: Copy the link and open it in the Baidu NetDisk mobile app for easier access.
                    </Paragraph>
                  </Col>
    
                  <Col span={24}>
                    <Button
                    //   type="primary"
                      icon={<DownloadOutlined />}
                      href="https://pan.baidu.com/s/15Fev1Wryjg8A6a5mBJ1CZA?pwd=3eeq"
                      target="_blank"
                      size="middle"
                      block
                    >
                      Open in Baidu NetDisk
                    </Button>
                  </Col>
                </Row>
              </div>
            </Space>
          </Card>
        </div>
      );
}

export default ReactionDatabase;
