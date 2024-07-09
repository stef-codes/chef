import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const form = new formidable.IncomingForm();

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        reject(NextResponse.json({ error: 'Failed to parse form' }, { status: 500 }));
        return;
      }

      const file = fs.readFileSync((files.image as formidable.File).filepath);

      try {
        // GPT-4 Vision API call
        const visionResponse = await fetch('https://api.openai.com/v1/images', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/octet-stream',
          },
          body: file,
        });

        const visionData = await visionResponse.json();
        const ingredients = visionData.data; // Extract ingredients from response

        // Recipe generation
        const recipeResponse = await fetch('https://api.openai.com/v1/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4',
            prompt: `Generate a recipe using these ingredients: ${ingredients.join(', ')}. Dietary restrictions: ${fields.dietaryRestrictions}.`,
            max_tokens: 200,
          }),
        });

        const recipeData = await recipeResponse.json();
        const recipe = recipeData.choices[0].text;

        // DALL-E 2 API call for image generation
        const dalleResponse = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: `Create an image of the following recipe: ${recipe}`,
            n: 1,
            size: '1024x1024',
          }),
        });

        const dalleData = await dalleResponse.json();
        const imageUrl = dalleData.data[0].url;

        resolve(NextResponse.json({ ingredients, recipe, imageUrl }));
      } catch (error) {
        reject(NextResponse.json({ error: 'Failed to process image' }, { status: 500 }));
      }
    });
  });
}
