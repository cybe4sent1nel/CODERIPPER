import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface GenerateCodeRequest {
  prompt: string;
  language: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, language }: GenerateCodeRequest = req.body;

    if (!prompt || !language) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Use the existing AI service or fallback to a template-based approach
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8001';
    
    try {
      const response = await axios.post(`${aiServiceUrl}/generate-code`, {
        prompt,
        language
      }, {
        timeout: 30000
      });

      return res.status(200).json({
        code: response.data.code,
        language
      });
    } catch (aiError) {
      // Fallback to template-based code generation
      console.log('AI service unavailable, using fallback generation');
      
      const generatedCode = generateCodeFallback(prompt, language);
      
      return res.status(200).json({
        code: generatedCode,
        language
      });
    }
  } catch (error: any) {
    console.error('Error generating code:', error);
    return res.status(500).json({ 
      error: 'Failed to generate code',
      details: error.message 
    });
  }
}

function generateCodeFallback(prompt: string, language: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Simple template-based code generation for common patterns
  if (lowerPrompt.includes('fibonacci')) {
    return generateFibonacci(language);
  } else if (lowerPrompt.includes('hello') || lowerPrompt.includes('world')) {
    return generateHelloWorld(language);
  } else if (lowerPrompt.includes('button') || lowerPrompt.includes('react')) {
    return generateReactButton();
  } else if (lowerPrompt.includes('form')) {
    return generateForm(language);
  } else {
    return generateBasicTemplate(language, prompt);
  }
}

function generateFibonacci(language: string): string {
  const templates: Record<string, string> = {
    javascript: `// Fibonacci function
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Test the function
for (let i = 0; i < 10; i++) {
  console.log(\`fibonacci(\${i}) = \${fibonacci(i)}\`);
}`,
    python: `# Fibonacci function
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Test the function
for i in range(10):
    print(f"fibonacci({i}) = {fibonacci(i)}")`,
    java: `public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            System.out.println("fibonacci(" + i + ") = " + fibonacci(i));
        }
    }
}`
  };
  
  return templates[language] || templates.javascript;
}

function generateHelloWorld(language: string): string {
  const templates: Record<string, string> = {
    javascript: `console.log("Hello, World!");`,
    python: `print("Hello, World!")`,
    java: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    html: `<!DOCTYPE html>
<html>
<head>
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`,
    react: `import React from 'react';

function App() {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
}

export default App;`
  };
  
  return templates[language] || templates.javascript;
}

function generateReactButton(): string {
  return `import React, { useState } from 'react';

function ButtonComponent() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Counter: {count}</h2>
      <button 
        onClick={() => setCount(count + 1)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Click Me
      </button>
      <button 
        onClick={() => setCount(0)}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginLeft: '10px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Reset
      </button>
    </div>
  );
}

export default ButtonComponent;`;
}

function generateForm(language: string): string {
  if (language === 'html') {
    return `<!DOCTYPE html>
<html>
<head>
    <title>Contact Form</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        form { max-width: 400px; }
        input, textarea { width: 100%; padding: 10px; margin: 10px 0; }
        button { padding: 10px 20px; background: #4CAF50; color: white; border: none; cursor: pointer; }
    </style>
</head>
<body>
    <h2>Contact Form</h2>
    <form>
        <input type="text" placeholder="Name" required>
        <input type="email" placeholder="Email" required>
        <textarea placeholder="Message" rows="5" required></textarea>
        <button type="submit">Submit</button>
    </form>
</body>
</html>`;
  } else if (language === 'react') {
    return `import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', padding: '20px' }}>
      <h2>Contact Form</h2>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
        style={{ width: '100%', padding: '10px', margin: '10px 0' }}
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
        style={{ width: '100%', padding: '10px', margin: '10px 0' }}
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
        rows={5}
        required
        style={{ width: '100%', padding: '10px', margin: '10px 0' }}
      />
      <button type="submit" style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
        Submit
      </button>
    </form>
  );
}

export default ContactForm;`;
  }
  
  return generateHelloWorld(language);
}

function generateBasicTemplate(language: string, prompt: string): string {
  return `// Code generated from: ${prompt}
// TODO: Implement the functionality

${generateHelloWorld(language)}

// Add your implementation here`;
}
