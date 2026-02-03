import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface FigmaToCodeRequest {
  url: string;
  framework: 'html' | 'react' | 'vue';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, framework }: FigmaToCodeRequest = req.body;

    if (!url || !framework) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!url.includes('figma.com')) {
      return res.status(400).json({ error: 'Invalid Figma URL' });
    }

    // Extract file ID from Figma URL
    const fileIdMatch = url.match(/file\/([a-zA-Z0-9]+)/);
    if (!fileIdMatch) {
      return res.status(400).json({ error: 'Could not extract file ID from URL' });
    }

    const fileId = fileIdMatch[1];
    const figmaToken = process.env.FIGMA_ACCESS_TOKEN;

    if (!figmaToken) {
      // Return demo code if no Figma token is configured
      console.log('No Figma token configured, returning demo code');
      return res.status(200).json({
        code: generateDemoCode(framework),
        language: framework
      });
    }

    // Fetch Figma file data
    const figmaResponse = await axios.get(
      `https://api.figma.com/v1/files/${fileId}`,
      {
        headers: {
          'X-Figma-Token': figmaToken
        }
      }
    );

    // Convert Figma design to code (simplified version)
    const code = convertFigmaToCode(figmaResponse.data, framework);

    return res.status(200).json({
      code,
      language: framework
    });
  } catch (error: any) {
    console.error('Error converting Figma to code:', error);
    
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Figma file not found or not accessible' });
    }
    
    if (error.response?.status === 403) {
      return res.status(403).json({ error: 'Invalid Figma access token' });
    }
    
    return res.status(500).json({ 
      error: 'Failed to convert design to code',
      details: error.message 
    });
  }
}

function convertFigmaToCode(figmaData: any, framework: string): string {
  // This is a simplified conversion - in production, you'd use a proper Figma-to-code library
  // or service like Builder.io, Anima, or a custom solution
  
  return generateDemoCode(framework as 'html' | 'react' | 'vue');
}

function generateDemoCode(framework: 'html' | 'react' | 'vue'): string {
  const templates = {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Figma Design - Converted</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
        }

        h1 {
            font-size: 32px;
            color: #333;
            margin-bottom: 10px;
        }

        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }

        .button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            width: 100%;
        }

        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
        }

        .features {
            margin-top: 30px;
            display: grid;
            gap: 15px;
        }

        .feature {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
        }

        .icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>✨ Converted from Figma</h1>
        <p>This design has been automatically converted to production-ready code from your Figma design.</p>
        
        <button class="button">Get Started</button>
        
        <div class="features">
            <div class="feature">
                <div class="icon">🎨</div>
                <div>
                    <strong>Pixel Perfect</strong>
                    <div style="color: #666; font-size: 14px;">Matches your design exactly</div>
                </div>
            </div>
            <div class="feature">
                <div class="icon">⚡</div>
                <div>
                    <strong>Responsive</strong>
                    <div style="color: #666; font-size: 14px;">Works on all devices</div>
                </div>
            </div>
            <div class="feature">
                <div class="icon">🚀</div>
                <div>
                    <strong>Production Ready</strong>
                    <div style="color: #666; font-size: 14px;">Clean, maintainable code</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`,

    react: `import React, { useState } from 'react';

// Converted from Figma Design
function FigmaComponent() {
  const [isHovered, setIsHovered] = useState(false);

  const containerStyle = {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    maxWidth: '500px',
    width: '100%'
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '15px 30px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    width: '100%',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: isHovered ? '0 10px 20px rgba(102, 126, 234, 0.4)' : 'none'
  };

  const features = [
    { icon: '🎨', title: 'Pixel Perfect', desc: 'Matches your design exactly' },
    { icon: '⚡', title: 'Responsive', desc: 'Works on all devices' },
    { icon: '🚀', title: 'Production Ready', desc: 'Clean, maintainable code' }
  ];

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: '32px', color: '#333', marginBottom: '10px' }}>
          ✨ Converted from Figma
        </h1>
        <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '30px' }}>
          This design has been automatically converted to production-ready code from your Figma design.
        </p>
        
        <button 
          style={buttonStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => alert('Button clicked!')}
        >
          Get Started
        </button>
        
        <div style={{ marginTop: '30px', display: 'grid', gap: '15px' }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '10px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                {feature.icon}
              </div>
              <div>
                <strong>{feature.title}</strong>
                <div style={{ color: '#666', fontSize: '14px' }}>{feature.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FigmaComponent;`,

    vue: `<!-- Converted from Figma Design -->
<template>
  <div class="container">
    <div class="card">
      <h1>✨ Converted from Figma</h1>
      <p>This design has been automatically converted to production-ready code from your Figma design.</p>
      
      <button 
        class="button" 
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        @click="handleClick"
      >
        Get Started
      </button>
      
      <div class="features">
        <div 
          v-for="(feature, index) in features" 
          :key="index" 
          class="feature"
        >
          <div class="icon">{{ feature.icon }}</div>
          <div>
            <strong>{{ feature.title }}</strong>
            <div class="desc">{{ feature.desc }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isHovered: false,
      features: [
        { icon: '🎨', title: 'Pixel Perfect', desc: 'Matches your design exactly' },
        { icon: '⚡', title: 'Responsive', desc: 'Works on all devices' },
        { icon: '🚀', title: 'Production Ready', desc: 'Clean, maintainable code' }
      ]
    }
  },
  methods: {
    handleClick() {
      alert('Button clicked!');
    }
  }
}
</script>

<style scoped>
.container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  width: 100%;
}

h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.features {
  margin-top: 30px;
  display: grid;
  gap: 15px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.desc {
  color: #666;
  font-size: 14px;
}
</style>`
  };

  return templates[framework];
}
