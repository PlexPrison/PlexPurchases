import { useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Space, Row, Col, Statistic, Upload, message } from 'antd';
import { PlusOutlined, SettingOutlined, CrownOutlined, RocketOutlined, UploadOutlined, CodeOutlined } from '@ant-design/icons';
import type { ConfiguredPlexPurchasesObject } from '../types/config';
import * as yaml from 'js-yaml';

const { Title, Text, Paragraph } = Typography;

interface WelcomeScreenProps {
  configurationsCount: number;
  onImportConfigurations?: (configurations: ConfiguredPlexPurchasesObject[]) => void;
}

export default function WelcomeScreen({ configurationsCount, onImportConfigurations }: WelcomeScreenProps) {
  const navigate = useNavigate();

  const handleAddConfiguration = () => {
    navigate('/add');
  };

  const handleViewConfigurations = () => {
    navigate('/configurations');
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
            dependencyAmount: config.dependencyAmount || 1,
            permission: config.permission || '',
            hideIfNoPermission: config.hideIfNoPermission || false,
            displayItem: config.displayItem || ''
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
        // Navigate to configurations screen after successful import
        navigate('/configurations');
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

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1} style={{ marginBottom: '16px' }}>
          Welcome to PlexPurchases
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666' }}>
          Configure and manage your Mineplex purchase configurations with ease
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card 
            hoverable 
            onClick={handleAddConfiguration}
            style={{ height: '100%', cursor: 'pointer' }}
          >
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <PlusOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
              <Title level={3}>Add New Configuration</Title>
              <Text type="secondary">
                Create a new purchase or subscription configuration for your Mineplex project
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card style={{ height: '100%' }}>
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <UploadOutlined style={{ fontSize: '48px', color: '#722ed1', marginBottom: '16px' }} />
              <Title level={3}>Import Configurations</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                Import existing configurations from YAML files
              </Text>
              <Upload
                accept=".yaml,.yml"
                customRequest={customRequest}
                showUploadList={false}
                multiple={true}
                onChange={(info) => {
                  console.log('Upload onChange:', info);
                }}
              >
                <Button type="primary" icon={<UploadOutlined />}>
                  Choose Files
                </Button>
              </Upload>
            </div>
          </Card>
        </Col>
      </Row>


      <Card style={{ marginTop: '32px' }}>
        <Title level={3}>Getting Started</Title>
        <Paragraph>
          Welcome to the PlexPurchases configuration tool! This application helps you create and manage 
          purchase configurations for your Mineplex project. Here's what you can do:
        </Paragraph>
        
        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col xs={24} md={6}>
            <Card size="small">
              <Title level={4}>1. Create Configurations</Title>
              <Text>
                Add new purchase or subscription configurations with detailed settings including 
                product information, pricing, and actions.
              </Text>
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card size="small">
              <Title level={4}>2. Export & Deploy</Title>
              <Text>
                Export your configurations in the correct format for use with the PlexPurchases 
                plugin on your Mineplex project.
              </Text>
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card size="small">
              <Title level={4}>3. Unzip & Run Script</Title>
              <Text>
                Unzip the exported zip file and run the bash script contained within to deploy 
                your configurations to your server.
              </Text>
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card size="small">
              <Title level={4}>4. Verify Installation</Title>
              <Text>
                Check that your configurations are properly loaded and working on your Mineplex 
                server with the PlexPurchases plugin.
              </Text>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
} 