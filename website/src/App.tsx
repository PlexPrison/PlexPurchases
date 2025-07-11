import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { ConfiguredPlexPurchasesObject } from './types/config';
import AddConfiguration from './components/AddConfiguration';
import PurchaseConfigurations from './components/PurchaseConfigurations';
import WelcomeScreen from './components/WelcomeScreen';
import * as yaml from 'js-yaml';
import JSZip from 'jszip';
import 'antd/dist/reset.css';
import './App.css';

function App() {
  const [configurations, setConfigurations] = useState<ConfiguredPlexPurchasesObject[]>([]);

  const handleAddConfiguration = (config: ConfiguredPlexPurchasesObject) => {
    setConfigurations(prev => [...prev, config]);
  };

  const handleRemoveConfiguration = (index: number) => {
    setConfigurations(prev => prev.filter((_, i) => i !== index));
  };

  const handleExportConfigurations = async () => {
    const zip = new JSZip();
    
    // Process each configuration individually
    configurations.forEach(config => {
      const isSubscription = config.subscriptionId && config.subscriptionName;
      
      // Clean configuration for export
      let cleanedConfig;
      if (isSubscription) {
        // For subscriptions, remove product fields and keep only subscription fields
        const { 
          productId, 
          productName, 
          productDescription, 
          repeatablePurchase,
          ...subscriptionConfig 
        } = config;
        cleanedConfig = subscriptionConfig;
      } else {
        // For one-time purchases, remove subscription fields
        const { 
          subscriptionId, 
          subscriptionName, 
          subscriptionDescription, 
          subscriptionBasis, 
          ...productConfig 
        } = config;
        cleanedConfig = productConfig;
      }
      
      // Determine filename based on configuration type
      const filename = isSubscription 
        ? `${config.subscriptionId}.yml`
        : `${config.productId}.yml`;
      
      // Create YAML content for single configuration (not an array)
      const yamlContent = yaml.dump(cleanedConfig, { 
        indent: 2,
        lineWidth: -1,
        noRefs: true
      });
      
      // Add file to ZIP
      zip.file(filename, yamlContent);
    });
    
    // Generate and download ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plex-purchases-configs.zip';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfigurations = (importedConfigurations: ConfiguredPlexPurchasesObject[]) => {
    setConfigurations(prev => [...prev, ...importedConfigurations]);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <WelcomeScreen 
                configurationsCount={configurations.length}
                onImportConfigurations={handleImportConfigurations}
              />
            } 
          />
          <Route 
            path="/configurations" 
            element={
              <PurchaseConfigurations
                configurations={configurations}
                onRemoveConfiguration={handleRemoveConfiguration}
                onExportConfigurations={handleExportConfigurations}
                onImportConfigurations={handleImportConfigurations}
              />
            } 
          />
          <Route 
            path="/add" 
            element={
              <AddConfiguration
                onSave={handleAddConfiguration}
                existingConfigurations={configurations}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
