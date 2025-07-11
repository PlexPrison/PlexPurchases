import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SaveOutlined, ArrowLeftOutlined, InfoCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ConfiguredPlexPurchasesObject, PurchaseActions } from '../types/config';
import { DeliveryType, SubscriptionFrequency } from '../types/config';
import { Button, Card, Input, Select, Form, Modal, Tooltip, Space, Divider, Typography, Row, Col, Checkbox } from 'antd';

// Delivery type mapping for user-friendly labels
const deliveryTypeLabels = {
  [DeliveryType.ONLY_WHEN_PLAYER_ONLINE]: 'Only when player is online',
  [DeliveryType.ALLOW_OFFLINE_DELIVERY]: 'Allow offline delivery'
} as const;

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface AddConfigurationProps {
  onSave: (config: ConfiguredPlexPurchasesObject) => void;
  existingConfigurations: ConfiguredPlexPurchasesObject[];
}

export default function AddConfiguration({ onSave, existingConfigurations }: AddConfigurationProps) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isSubscription, setIsSubscription] = useState(false);
  const [hasSelectedType, setHasSelectedType] = useState(false);
  const [formData, setFormData] = useState<Partial<ConfiguredPlexPurchasesObject>>({
    productId: '',
    productName: '',
    productDescription: '',
    price: 0,
    callbackDelivery: DeliveryType.ONLY_WHEN_PLAYER_ONLINE,
    repeatablePurchase: false,
    subscriptionId: '',
    subscriptionName: '',
    subscriptionDescription: '',
    subscriptionBasis: SubscriptionFrequency.MONTHLY,
    actions: {
      success: [''],
      expire: [''],
      renew: ['']
    },
    dependency: '',
    permission: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleActionChange = (actionType: keyof PurchaseActions, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      actions: {
        ...prev.actions!,
        [actionType]: prev.actions![actionType].map((item, i) => 
          i === index ? value : item
        )
      }
    }));
  };

  const addActionItem = (actionType: keyof PurchaseActions) => {
    setFormData(prev => ({
      ...prev,
      actions: {
        ...prev.actions!,
        [actionType]: [...prev.actions![actionType], '']
      }
    }));
  };

  const removeActionItem = (actionType: keyof PurchaseActions, index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: {
        ...prev.actions!,
        [actionType]: prev.actions![actionType].filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = () => {
    onSave(formData as ConfiguredPlexPurchasesObject);
    navigate('/configurations');
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      productName: '',
      productDescription: '',
      price: 0,
      callbackDelivery: DeliveryType.ONLY_WHEN_PLAYER_ONLINE,
      repeatablePurchase: false,
      subscriptionId: '',
      subscriptionName: '',
      subscriptionDescription: '',
      subscriptionBasis: SubscriptionFrequency.MONTHLY,
      actions: {
        success: [''],
        expire: [''],
        renew: ['']
      },
      dependency: '',
      permission: ''
    });
    form.resetFields();
  };

  if (!hasSelectedType) {
    return (
      <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/configurations')}
          style={{ marginBottom: '16px' }}
        >
          Back to Configurations
        </Button>
        
        <Title level={2}>Add New Configuration</Title>
        <Text type="secondary">Configure a new Plex Purchases item</Text>

        <Card style={{ marginTop: '24px' }}>
          <Title level={3}>Choose Purchase Type</Title>
          <Text type="secondary">Select whether you want to create a one-time purchase or a subscription</Text>
          
          <Space size="large" style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }}>
            <Button
              type={!isSubscription ? 'primary' : 'default'}
              size="large"
              onClick={() => {
                setIsSubscription(false);
                setHasSelectedType(true);
                setFormData(prev => ({ ...prev, repeatablePurchase: false }));
              }}
              style={{ width: '200px', height: '80px' }}
            >
              One-time Purchase
            </Button>
            <Button
              type={isSubscription ? 'primary' : 'default'}
              size="large"
              onClick={() => {
                setIsSubscription(true);
                setHasSelectedType(true);
                setFormData(prev => ({ ...prev, repeatablePurchase: true }));
              }}
              style={{ width: '200px', height: '80px' }}
            >
              Subscription
            </Button>
          </Space>
          
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Text type="secondary">
              {!isSubscription 
                ? "Create a single purchase item that players can buy once"
                : "Create a recurring subscription that players can purchase"
              }
            </Text>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Button 
        type="link" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/configurations')}
        style={{ marginBottom: '16px' }}
      >
        Back to Configurations
      </Button>
      
      <Title level={2}>Add New Configuration</Title>
      <Text type="secondary">Configure a new Plex Purchases item</Text>

      <Card style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <Title level={3}>{isSubscription ? 'Subscription' : 'Purchase'} Configuration</Title>
            <Text type="secondary">
              {isSubscription ? 'Creating a subscription' : 'Creating a one-time purchase'}
            </Text>
          </div>
          <Button 
            type="link" 
            onClick={() => {
              setIsSubscription(false);
              setHasSelectedType(false);
              resetForm();
            }}
          >
            Change Type
          </Button>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={formData}
        >
          {!isSubscription && (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={
                      <Space>
                        Product ID
                        <Tooltip title="Unique identifier for this product in the Mineplex system">
                          <InfoCircleOutlined />
                        </Tooltip>
                      </Space>
                    }
                    name="productId"
                    rules={[{ required: true, message: 'Please enter product ID' }]}
                  >
                    <Input 
                      value={formData.productId}
                      onChange={(e) => handleInputChange('productId', e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Product Name"
                    name="productName"
                    rules={[{ required: true, message: 'Please enter product name' }]}
                  >
                    <Input 
                      value={formData.productName}
                      onChange={(e) => handleInputChange('productName', e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Product Description" name="productDescription">
                <TextArea 
                  rows={3}
                  value={formData.productDescription}
                  onChange={(e) => handleInputChange('productDescription', e.target.value)}
                />
              </Form.Item>
            </>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please enter price' }]}>
                <Input 
                  type="number"
                  min={0}
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', Number(e.target.value))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Delivery Type" name="callbackDelivery">
                <Select
                  value={formData.callbackDelivery}
                  onChange={(value) => handleInputChange('callbackDelivery', value)}
                  placeholder="Select delivery type"
                >
                  {Object.values(DeliveryType).map((type) => (
                    <Option key={type} value={type}>
                      {deliveryTypeLabels[type]}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {!isSubscription && (
            <Form.Item label="Repeatable Purchase" name="repeatablePurchase" valuePropName="checked">
              <Checkbox
                checked={formData.repeatablePurchase}
                onChange={(e: any) => handleInputChange('repeatablePurchase', e.target.checked)}
              >
                Allow players to purchase this item multiple times
              </Checkbox>
            </Form.Item>
          )}

          {isSubscription && (
            <>
              <Divider>Subscription Details</Divider>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    label="Subscription ID" 
                    name="subscriptionId"
                    rules={[{ required: true, message: 'Please enter subscription ID' }]}
                  >
                    <Input 
                      value={formData.subscriptionId}
                      onChange={(e) => handleInputChange('subscriptionId', e.target.value)}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item 
                    label="Subscription Name" 
                    name="subscriptionName"
                    rules={[{ required: true, message: 'Please enter subscription name' }]}
                  >
                    <Input 
                      value={formData.subscriptionName}
                      onChange={(e) => handleInputChange('subscriptionName', e.target.value)}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Subscription Description" name="subscriptionDescription">
                <TextArea 
                  rows={3}
                  value={formData.subscriptionDescription}
                  onChange={(e) => handleInputChange('subscriptionDescription', e.target.value)}
                />
              </Form.Item>

              <Form.Item label="Billing Frequency" name="subscriptionBasis">
                <Select
                  value={formData.subscriptionBasis}
                  onChange={(value) => handleInputChange('subscriptionBasis', value)}
                >
                  {Object.values(SubscriptionFrequency).map((freq) => (
                    <Option key={freq} value={freq}>{freq}</Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}

          <Divider>Additional Settings</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Dependency" name="dependency">
                <Select
                  placeholder="Select a dependency (optional)"
                  value={formData.dependency}
                  onChange={(value) => handleInputChange('dependency', value)}
                  allowClear
                >
                  {existingConfigurations.map((config) => (
                    <Option key={config.productId || config.subscriptionId} value={config.productId || config.subscriptionId}>
                      {config.productName || config.subscriptionName} ({config.productId || config.subscriptionId})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Permission" name="permission">
                <Input 
                  value={formData.permission}
                  onChange={(e) => handleInputChange('permission', e.target.value)}
                  placeholder="e.g., plexpurchases.coins.times.<purchase_times>"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Actions</Divider>
          {(['success', ...(isSubscription ? ['expire', 'renew'] : [])] as (keyof PurchaseActions)[]).map((actionType) => (
            <Card key={actionType} size="small" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Text strong style={{ textTransform: 'capitalize' }}>{actionType} Actions</Text>
                <Button 
                  type="dashed" 
                  icon={<PlusOutlined />} 
                  onClick={() => addActionItem(actionType)}
                >
                  Add Action
                </Button>
              </div>
              
              {formData.actions && formData.actions[actionType] && formData.actions[actionType].map((action, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <Input
                    value={action}
                    onChange={(e) => handleActionChange(actionType, idx, e.target.value)}
                    placeholder={`e.g., /broadcast %player_name% purchased ${actionType} item`}
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeActionItem(actionType, idx)}
                    disabled={formData.actions && formData.actions[actionType] && formData.actions[actionType].length === 1}
                  />
                </div>
              ))}
            </Card>
          ))}

          <Form.Item style={{ marginTop: '24px', textAlign: 'right' }}>
            <Space>
              <Button onClick={() => navigate('/configurations')}>Cancel</Button>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
                Save Configuration
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 