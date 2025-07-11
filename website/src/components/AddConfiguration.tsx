import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SaveOutlined, ArrowLeftOutlined, InfoCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ConfiguredPlexPurchasesObject, PurchaseActions } from '../types/config';
import { DeliveryType, SubscriptionFrequency } from '../types/config';
import { Button, Card, Input, Select, Form, Modal, Tooltip, Space, Divider, Typography, Row, Col, Checkbox, AutoComplete } from 'antd';
import { minecraftItems } from '../data/minecraftItems';

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
    dependencyAmount: 1,
    permission: '',
    hideIfNoPermission: false,
    displayItem: 'COBBLESTONE'
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

  // Helper function to check if selected dependency is repeatable or a subscription
  const getSelectedDependency = () => {
    if (!formData.dependency) return null;
    return existingConfigurations.find(config => 
      (config.productId || config.subscriptionId) === formData.dependency
    );
  };

  const isDependencyRepeatable = () => {
    const selectedDependency = getSelectedDependency();
    return selectedDependency && (selectedDependency.repeatablePurchase || selectedDependency.subscriptionId);
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
      dependencyAmount: 1,
      permission: '',
      hideIfNoPermission: false,
      displayItem: 'COBBLESTONE'
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
                      <span>
                        Product ID{' '}
                        <Tooltip title="Must be lowercase, use underscores or hyphens instead of spaces (e.g., my_product or my-product)">
                          <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '4px' }} />
                        </Tooltip>
                      </span>
                    }
                    name="productId"
                    rules={[
                      { required: true, message: 'Please enter product ID' },
                      { 
                        pattern: /^[a-z0-9_-]+$/, 
                        message: 'Product ID must be lowercase and contain only letters, numbers, underscores, and hyphens' 
                      }
                    ]}
                  >
                    <Input 
                      value={formData.productId}
                      onChange={(e) => {
                        // Convert to lowercase and replace spaces with underscores
                        const value = e.target.value.toLowerCase().replace(/\s+/g, '_');
                        handleInputChange('productId', value);
                      }}
                      placeholder="e.g., my_product or my-product"
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

          <Form.Item 
            label={
              <span>
                Display Item{' '}
                <Tooltip title="Minecraft item to display in the purchase menu">
                  <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '4px' }} />
                </Tooltip>
              </span>
            } 
            name="displayItem"
            rules={[
              { required: true, message: 'Please select a display item' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const validItem = minecraftItems.find(item => item.id === value);
                  if (!validItem) {
                    return Promise.reject(new Error('Please select a valid Minecraft item'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
                            <AutoComplete
                  value={formData.displayItem}
                  onChange={(value) => handleInputChange('displayItem', value)}
                  placeholder="Search for a Minecraft item..."
                  options={minecraftItems
                    .filter(item => {
                      const searchTerm = formData.displayItem?.toLowerCase() || '';
                      return item.displayName.toLowerCase().includes(searchTerm) ||
                             item.id.toLowerCase().includes(searchTerm);
                    })
                    .slice(0, 20)
                    .map(item => ({
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.displayName}
                              style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                              onError={(e) => {
                                // Fallback to text if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'inline';
                              }}
                            />
                          ) : null}
                          <span style={{ display: item.imageUrl ? 'none' : 'inline', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
                            {item.id.charAt(0)}
                          </span>
                          <span>{item.displayName}</span>
                          <span style={{ color: '#999', fontSize: '12px' }}>({item.id})</span>
                        </div>
                      ),
                      value: item.id
                    }))}
                  filterOption={(inputValue, option) => {
                    const item = minecraftItems.find(i => i.id === option?.value);
                    if (!item) return false;
                    return item.displayName.toLowerCase().includes(inputValue.toLowerCase()) ||
                           item.id.toLowerCase().includes(inputValue.toLowerCase());
                  }}
                  onSelect={(value) => handleInputChange('displayItem', value)}
                  notFoundContent="No items found"
                  style={{ width: '100%' }}
                >
                  <Input 
                    placeholder="Search for a Minecraft item..."
                    suffix={
                      formData.displayItem ? (() => {
                        const selectedItem = minecraftItems.find(item => item.id === formData.displayItem);
                        return selectedItem ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {selectedItem.imageUrl ? (
                              <img 
                                src={selectedItem.imageUrl} 
                                alt={selectedItem.displayName}
                                style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = 'inline';
                                }}
                              />
                            ) : (
                              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
                                {selectedItem.id.charAt(0)}
                              </span>
                            )}
                            <span style={{ fontSize: '12px', color: '#666' }}>
                              {selectedItem.displayName}
                            </span>
                          </div>
                        ) : null;
                      })() : null
                    }
                  />
                </AutoComplete>
          </Form.Item>

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
                    label={
                      <span>
                        Subscription ID{' '}
                        <Tooltip title="Must be lowercase, use underscores or hyphens instead of spaces (e.g., my_subscription or my-subscription)">
                          <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '4px' }} />
                        </Tooltip>
                      </span>
                    } 
                    name="subscriptionId"
                    rules={[
                      { required: true, message: 'Please enter subscription ID' },
                      { 
                        pattern: /^[a-z0-9_-]+$/, 
                        message: 'Subscription ID must be lowercase and contain only letters, numbers, underscores, and hyphens' 
                      }
                    ]}
                  >
                    <Input 
                      value={formData.subscriptionId}
                      onChange={(e) => {
                        // Convert to lowercase and replace spaces with underscores
                        const value = e.target.value.toLowerCase().replace(/\s+/g, '_');
                        handleInputChange('subscriptionId', value);
                      }}
                      placeholder="e.g., my_subscription or my-subscription"
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
              <Form.Item 
                label={
                  <span>
                    Dependency{' '}
                    <Tooltip title="Users must purchase the selected product before they can purchase this product">
                      <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '4px' }} />
                    </Tooltip>
                  </span>
                } 
                name="dependency"
              >
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
              {formData.dependency && isDependencyRepeatable() && (
                <Form.Item 
                  label={
                    <span style={{ fontSize: '12px', color: '#666', marginLeft: '16px' }}>
                      Dependency must be purchased{' '}
                      <Input 
                        type="number"
                        min={1}
                        size="small"
                        style={{ width: '60px', margin: '0 4px' }}
                        value={formData.dependencyAmount}
                        onChange={(e) => handleInputChange('dependencyAmount', Number(e.target.value))}
                        placeholder="1"
                      />
                      times
                      <Tooltip title="How many times the user must purchase the dependency product before they can purchase this product">
                        <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '4px' }} />
                      </Tooltip>
                    </span>
                  } 
                  name="dependencyAmount"
                />
              )}
            </Col>
            <Col span={12}>
              <Form.Item 
                label={
                  <span>
                    Permission{' '}
                    <Tooltip title="Users must have the given permission node to purchase this product">
                      <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '4px' }} />
                    </Tooltip>
                  </span>
                } 
                name="permission"
              >
                <Input 
                  value={formData.permission}
                  onChange={(e) => handleInputChange('permission', e.target.value)}
                  placeholder="e.g., plexpurchases.coins.times.<purchase_times>"
                />
              </Form.Item>
              {formData.permission && (
                <Form.Item 
                  name="hideIfNoPermission" 
                  valuePropName="checked"
                >
                  <Checkbox
                    checked={formData.hideIfNoPermission}
                    onChange={(e: any) => handleInputChange('hideIfNoPermission', e.target.checked)}
                  >
                    <span>
                      Hide product if no permission{' '}
                      <Tooltip title="Hide product otherwise the product shows as locked">
                        <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '4px' }} />
                      </Tooltip>
                    </span>
                  </Checkbox>
                </Form.Item>
              )}
            </Col>
          </Row>

          <Divider>Actions</Divider>
          {(['success', ...(isSubscription ? ['expire', 'renew'] : [])] as (keyof PurchaseActions)[]).map((actionType) => (
            <Card key={actionType} size="small" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span>
                  <Text strong style={{ textTransform: 'capitalize' }}>{actionType} Actions</Text>
                  <Tooltip title={
                    actionType === 'success' 
                      ? "Commands executed when the purchase is successful"
                      : actionType === 'expire' 
                      ? "Commands executed when the subscription expires"
                      : "Commands executed when the subscription renews"
                  }>
                    <InfoCircleOutlined style={{ color: '#1890ff', marginLeft: '4px' }} />
                  </Tooltip>
                </span>
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