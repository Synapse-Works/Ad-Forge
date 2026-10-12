import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));

// Shared server-side Gemini client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// POST /api/analyze-product
// Analyzes product description and URL, generates high-converting marketing copy and prompt strategies
app.post('/api/analyze-product', async (req, res) => {
  try {
    const { url, description, stylePreset } = req.body;
    if (!description && !url) {
      return res.status(400).json({ error: 'Please provide either a product description or product URL.' });
    }

    const ai = getAiClient();

    const prompt = `You are a world-class performance marketing director and creative strategist specializing in Google Display Network, Meta/Instagram, and E-commerce banner advertising.
Analyze the following product details and generate high-converting advertising copy, value propositions, and tailored visual generation prompts:

Product URL: ${url || 'Not provided'}
Product Description: ${description || 'E-commerce product'}
Selected Creative Aesthetic: ${stylePreset || 'Clean Modern Commerce'}

Return a structured JSON with:
1. "productName": Clean, concise product title (max 5-6 words)
2. "tagline": A catchy 4-8 word hook summarizing the key transformation or benefit
3. "headlines": Array of 3 distinct, punchy headline variations for banner ads (max 6-8 words each, high-impact):
   - Variant 1 (Value / Solution): focused on primary outcome
   - Variant 2 (Urgency / Scarcity): promotional or limited-time hook
   - Variant 3 (Aspirational / Curiosity): bold premium statement
4. "subheadlines": Array of 3 short, supporting sentences (max 12 words each)
5. "ctaOptions": Array of 4 high-converting CTA button labels (e.g., "Shop Now", "Get 20% Off", "Claim Yours", "Explore Collection")
6. "badgeTexts": Array of 4 badge / pill promo callouts (e.g., "Limited Release", "Free Shipping", "Award Winning", "Best Seller")
7. "brandColors": Suggested primary hex color and secondary accent hex color matching this product category
8. "visualPrompts": Object containing optimized image generation prompts for different aspect ratios:
   - "square" (1:1): Optimized for Instagram and Medium Rectangle
   - "landscape" (16:9 / 21:9): Optimized for Leaderboards, Facebook Feed, Shopify Headers
   - "portrait" (9:16 / 4:5): Optimized for Stories, Reels, and Skyscraper banners
   - "studioPureAd": A prompt to generate a complete studio ad scene with dramatic commercial lighting, pedestal or ambient setting, hyper-detailed commercial product visual
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            tagline: { type: Type.STRING },
            headlines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            subheadlines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            ctaOptions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            badgeTexts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            brandColors: {
              type: Type.OBJECT,
              properties: {
                primary: { type: Type.STRING },
                accent: { type: Type.STRING },
              },
              required: ['primary', 'accent'],
            },
            visualPrompts: {
              type: Type.OBJECT,
              properties: {
                square: { type: Type.STRING },
                landscape: { type: Type.STRING },
                portrait: { type: Type.STRING },
                studioPureAd: { type: Type.STRING },
              },
              required: ['square', 'landscape', 'portrait', 'studioPureAd'],
            },
          },
          required: ['productName', 'tagline', 'headlines', 'subheadlines', 'ctaOptions', 'badgeTexts', 'brandColors', 'visualPrompts'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing product:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze product. Please verify your GEMINI_API_KEY.',
    });
  }
});

// POST /api/generate-banner-image
// Generates commercial background or pure ad visual using gemini-3-pro-image-preview or gemini-nano-banana-2.1
app.post('/api/generate-banner-image', async (req, res) => {
  try {
    const {
      prompt,
      model = 'gemini-3-pro-image-preview',
      aspectRatio = '1:1',
      imageSize = '1K',
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Image prompt is required.' });
    }

    const ai = getAiClient();

    // Validate and normalize model name
    // Support user requested model gemini-3-pro-image-preview and gemini-nano-banana-2.1
    let targetModel = model;
    if (model === 'gemini-3-pro-image-preview' || model === 'gemini-3-pro-image') {
      targetModel = 'gemini-3-pro-image-preview';
    } else if (model === 'gemini-nano-banana-2.1') {
      targetModel = 'gemini-nano-banana-2.1';
    } else {
      targetModel = 'gemini-3-pro-image-preview';
    }

    // Validate aspect ratio
    const validAspectRatios = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9', '1:4', '1:8', '4:1', '8:1'];
    const chosenAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';

    // Validate image size: 1K, 2K, 4K
    const validSizes = ['1K', '2K', '4K'];
    const chosenSize = validSizes.includes(imageSize) ? imageSize : '1K';

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: {
        parts: [
          {
            text: `High-end commercial advertising studio visual, professional advertising photography: ${prompt}. Ultra-clean composition, commercial lighting, crisp details, no watermark, advertising grade.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: chosenAspectRatio as any,
          imageSize: chosenSize as any,
        },
      },
    });

    let imageUrl: string | null = null;
    let descriptionText = '';

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          break;
        } else if (part.text) {
          descriptionText += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: 'The image generation model did not return image data. ' + (descriptionText || 'Please try another prompt.'),
      });
    }

    return res.json({
      imageUrl,
      aspectRatio: chosenAspectRatio,
      imageSize: chosenSize,
      model: targetModel,
    });
  } catch (error: any) {
    console.error('Error generating image:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate image. Please check API quota or model permissions.',
    });
  }
});

// Start Express server and mount Vite in development or serve dist in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AdForge Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
