import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ConfiguredPlexPurchasesObject } from '../types/config';
import { DeliveryType } from '../types/config';
import { Button, Card, Modal, List, Tag, Typography, Space, Empty, Row, Col, Statistic, Upload, message } from 'antd';
import { PlusOutlined, ExportOutlined, DeleteOutlined, CrownOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import * as yaml from 'js-yaml';

// Delivery type mapping for user-friendly labels
const deliveryTypeLabels = {
  [DeliveryType.ONLY_WHEN_PLAYER_ONLINE]: 'Only when player is online',
  [DeliveryType.ALLOW_OFFLINE_DELIVERY]: 'Allow offline delivery'
} as const;

const { Title, Text } = Typography;

interface PurchaseConfigurationsProps {
  configurations: ConfiguredPlexPurchasesObject[];
  onRemoveConfiguration: (index: number) => void;
  onExportConfigurations: () => void;
  onImportConfigurations?: (configurations: ConfiguredPlexPurchasesObject[]) => void;
}

export default function PurchaseConfigurations({
  configurations,
  onRemoveConfiguration,
  onExportConfigurations,
  onImportConfigurations
}: PurchaseConfigurationsProps) {
  const navigate = useNavigate();
  const [selectedPurchase, setSelectedPurchase] = useState<ConfiguredPlexPurchasesObject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (purchase: ConfiguredPlexPurchasesObject) => {
    setSelectedPurchase(purchase);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPurchase(null);
  };

  const handleRemove = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    onRemoveConfiguration(index);
  };

  const handleAddConfiguration = () => {
    navigate('/add');
  };

  const handleImport = async (file: File) => {
    console.log('Starting import for file:', file.name);
    try {
      const text = await file.text();
      console.log('File content length:', text.length);
      console.log('File content:', text);
      
      let parsedData;
      
      // Parse as YAML only
      try {
        // Try with more permissive YAML parsing
        parsedData = yaml.load(text) as any;
        console.log('Successfully parsed as YAML');
      } catch (yamlError) {
        console.log('YAML parsing failed:', yamlError);
        
        // Try to fix common YAML issues
        try {
          // Remove any trailing commas that might cause issues
          let cleanedText = text.replace(/,\s*]/g, ']').replace(/,\s*}/g, '}');
          parsedData = yaml.load(cleanedText) as any;
          console.log('Successfully parsed as YAML after cleaning');
        } catch (yamlError2) {
          console.log('YAML parsing still failed after cleaning:', yamlError2);
          console.error('YAML parsing failed');
          message.error('Invalid file format. Please use a valid YAML file.');
          return false;
        }
      }

      console.log('Parsed data:', parsedData);

      // Validate the imported data - handle both single config and array
      let configsToProcess: any[] = [];
      if (Array.isArray(parsedData)) {
        configsToProcess = parsedData;
      } else {
        // Single configuration
        configsToProcess = [parsedData];
      }

      // Validate each configuration
      const validConfigurations: ConfiguredPlexPurchasesObject[] = [];
      for (const config of configsToProcess) {
        // Check if it's a valid configuration (has either product or subscription fields)
        if (config.productId || config.subscriptionId) {
          // Ensure all required fields are present with defaults for missing ones
          const validatedConfig: ConfiguredPlexPurchasesObject = {
            productId: config.productId || '',
            productName: config.productName || '',
            productDescription: config.productDescription || '',
            price: config.price || 0,
            callbackDelivery: config.callbackDelivery || 'ONLY_WHEN_PLAYER_ONLINE',
            repeatablePurchase: config.repeatablePurchase || false,
            subscriptionId: config.subscriptionId || '',
            subscriptionName: config.subscriptionName || '',
            subscriptionDescription: config.subscriptionDescription || '',
            subscriptionBasis: config.subscriptionBasis || 'MONTHLY',
            actions: {
              success: config.actions?.success || [''],
              expire: config.actions?.expire || [''],
              renew: config.actions?.renew || ['']
            },
            dependency: config.dependency || '',
            permission: config.permission || ''
          };
          validConfigurations.push(validatedConfig);
        }
      }

      console.log('Valid configurations found:', validConfigurations.length);

      if (validConfigurations.length === 0) {
        console.error('No valid configurations found');
        message.error('No valid configurations found in the file.');
        return false;
      }

      if (onImportConfigurations) {
        onImportConfigurations(validConfigurations);
        message.success(`Successfully imported ${validConfigurations.length} configuration(s)`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during import:', error);
      message.error('Error reading file. Please try again.');
      return false;
    }
  };

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    console.log('Custom request triggered for file:', file.name);
    try {
      const success = await handleImport(file as File);
      if (success) {
        onSuccess();
      } else {
        onError(new Error('Import failed'));
      }
    } catch (error) {
      console.error('Custom request error:', error);
      onError(error);
    }
  };

  if (configurations.length === 0) {
    return (
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <Empty
          description="No Purchase Configurations"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
            You haven't created any purchase configurations yet. Start by adding your first configuration.
          </Text>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddConfiguration}>
            Add Configuration
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>Purchase Configurations</Title>
            <Text type="secondary">Manage your Plex purchase configurations</Text>
          </Col>
          <Col>
            <Space>
              <Upload
                accept=".yaml,.yml"
                customRequest={customRequest}
                showUploadList={false}
                multiple={true}
                onChange={(info) => {
                  console.log('Upload onChange:', info);
                }}
              >
                <Button icon={<UploadOutlined />}>
                  Import
                </Button>
              </Upload>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddConfiguration}>
                Add Configuration
              </Button>
              <Button icon={<ExportOutlined />} onClick={onExportConfigurations}>
                Export
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {configurations.map((config, index) => (
          <Col xs={24} sm={12} lg={8} key={index}>
            <Card
              hoverable
              onClick={() => handleCardClick(config)}
              actions={[
                <Button
                  key="view"
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(config);
                  }}
                >
                  View
                </Button>,
                <Button
                  key="delete"
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => handleRemove(e, index)}
                >
                  Delete
                </Button>
              ]}
            >
              <Card.Meta
                avatar={
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '8px', 
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CrownOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                  </div>
                }
                title={config.subscriptionId && config.subscriptionName ? config.subscriptionName : config.productName}
                description={
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {config.subscriptionId && config.subscriptionName ? config.subscriptionId : config.productId}
                    </Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text>
                        {config.subscriptionId && config.subscriptionName 
                          ? config.subscriptionDescription 
                          : config.productDescription}
                      </Text>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <Statistic
                        value={config.price}
                        prefix={<CrownOutlined />}
                        valueStyle={{ fontSize: '16px', color: '#faad14' }}
                      />
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <Tag color={(config.subscriptionId && config.subscriptionName) ? 'blue' : 'green'}>
                        {(config.subscriptionId && config.subscriptionName) ? 'Subscription' : 'One-time'}
                      </Tag>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Purchase Details"
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedPurchase && (
          <div>
            {(selectedPurchase.subscriptionId && selectedPurchase.subscriptionName) ? (
              <Card title="Subscription Information" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic title="Subscription ID" value={selectedPurchase.subscriptionId} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Subscription Name" value={selectedPurchase.subscriptionName} />
                  </Col>
                </Row>
                <div style={{ marginTop: '16px' }}>
                  <Text strong>Description:</Text>
                  <div style={{ marginTop: '8px' }}>
                    <Text>{selectedPurchase.subscriptionDescription}</Text>
                  </div>
                </div>
                <Row gutter={16} style={{ marginTop: '16px' }}>
                  <Col span={12}>
                    <Statistic
                      title="Price"
                      value={selectedPurchase.price}
                      prefix={<CrownOutlined />}
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Delivery Type" value={deliveryTypeLabels[selectedPurchase.callbackDelivery] || selectedPurchase.callbackDelivery} />
                  </Col>
                </Row>
                <div style={{ marginTop: '16px' }}>
                  <Statistic title="Billing Frequency" value={selectedPurchase.subscriptionBasis} />
                </div>
              </Card>
            ) : (
              <Card title="Product Information" style={{ marginBottom: '16px' }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic title="Product ID" value={selectedPurchase.productId} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Product Name" value={selectedPurchase.productName} />
                  </Col>
                </Row>
                <div style={{ marginTop: '16px' }}>
                  <Text strong>Description:</Text>
                  <div style={{ marginTop: '8px' }}>
                    <Text>{selectedPurchase.productDescription}</Text>
                  </div>
                </div>
                <Row gutter={16} style={{ marginTop: '16px' }}>
                  <Col span={12}>
                    <Statistic
                      title="Price"
                      value={selectedPurchase.price}
                      prefix={<CrownOutlined />}
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic title="Delivery Type" value={deliveryTypeLabels[selectedPurchase.callbackDelivery] || selectedPurchase.callbackDelivery} />
                  </Col>
                </Row>
              </Card>
            )}



            <Card title="Actions" style={{ marginBottom: '16px' }}>
              <div>
                <Text strong>Success Actions:</Text>
                <List
                  size="small"
                  dataSource={selectedPurchase.actions.success}
                  renderItem={(action, index) => (
                    <List.Item>
                      <Text>{index + 1}. {action}</Text>
                    </List.Item>
                  )}
                />
              </div>
              
              {(selectedPurchase.subscriptionId && selectedPurchase.subscriptionName) && (
                <>
                  <div style={{ marginTop: '16px' }}>
                    <Text strong>Expire Actions:</Text>
                    <List
                      size="small"
                      dataSource={selectedPurchase.actions.expire}
                      renderItem={(action, index) => (
                        <List.Item>
                          <Text>{index + 1}. {action}</Text>
                        </List.Item>
                      )}
                    />
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <Text strong>Renew Actions:</Text>
                    <List
                      size="small"
                      dataSource={selectedPurchase.actions.renew}
                      renderItem={(action, index) => (
                        <List.Item>
                          <Text>{index + 1}. {action}</Text>
                        </List.Item>
                      )}
                    />
                  </div>
                </>
              )}
            </Card>

            <Card title="Additional Settings">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic title="Dependency" value={selectedPurchase.dependency || 'None'} />
                </Col>
                <Col span={12}>
                  <Statistic title="Permission" value={selectedPurchase.permission} />
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}