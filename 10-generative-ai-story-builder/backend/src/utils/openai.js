import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Story generation prompts and templates
const STORY_PROMPTS = {
  initial: `You are a creative storytelling AI. Based on the user's prompt, create an engaging opening paragraph for an interactive story. The story should be immersive, descriptive, and set up an interesting scenario.

User prompt: "{prompt}"
Genre: {genre}
Tone: {tone}

Create a compelling opening (150-200 words) that draws the reader in and sets up the scenario. End with a natural stopping point where choices would make sense.`,

  continuation: `Continue this interactive story based on the previous context and the choice made. Maintain consistency with the established tone, genre, and characters.

Previous story context:
{context}

Choice made: "{choice}"

Write the next part of the story (150-200 words) that follows naturally from this choice. Create an engaging continuation that advances the plot and maintains the story's tone and style.`,

  choices: `Based on this story segment, generate 3 compelling choices for what could happen next. Each choice should lead to a different direction in the story.

Story segment:
{content}

Generate exactly 3 choices in this format:
1. [Choice text that's engaging and specific]
2. [Choice text that's engaging and specific] 
3. [Choice text that's engaging and specific]

Each choice should be 10-20 words and represent a meaningful decision point in the story.`,

  image: `Create a detailed image description for DALL-E based on this story segment. Focus on the setting, atmosphere, and key visual elements. Keep it under 400 characters.

Story content: {content}

Generate a vivid, specific image prompt that captures the scene's essence.`,
};

/**
 * Generate initial story content based on user prompt
 */
export async function generateStoryOpening(
  prompt,
  genre = "other",
  tone = "serious"
) {
  try {
    const systemPrompt = STORY_PROMPTS.initial
      .replace("{prompt}", prompt)
      .replace("{genre}", genre)
      .replace("{tone}", tone);

    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }],
      max_tokens: parseInt(process.env.MAX_TOKENS) || 300,
      temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
    });

    const generationTime = Date.now() - startTime;
    const content = completion.choices[0].message.content.trim();

    return {
      success: true,
      content,
      metadata: {
        generationTime,
      },
    };
  } catch (error) {
    console.error("OpenAI story generation error:", error);
    throw new Error(`AI story generation failed: ${error.message}`);
  }
}

/**
 * Continue story based on previous context and choice
 */
export async function continueStory(context, choice) {
  try {
    const systemPrompt = STORY_PROMPTS.continuation
      .replace("{context}", context)
      .replace("{choice}", choice);

    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }],
      max_tokens: parseInt(process.env.MAX_TOKENS) || 300,
      temperature: parseFloat(process.env.TEMPERATURE) || 0.7,
    });

    const generationTime = Date.now() - startTime;
    const content = completion.choices[0].message.content.trim();

    return {
      success: true,
      content,
      metadata: {
        generationTime,
      },
    };
  } catch (error) {
    console.error("OpenAI story continuation error:", error);
    throw new Error(`AI story continuation failed: ${error.message}`);
  }
}

/**
 * Generate choices for the current story segment
 */
export async function generateChoices(storyContent) {
  try {
    const systemPrompt = STORY_PROMPTS.choices.replace(
      "{content}",
      storyContent
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: systemPrompt }],
      max_tokens: 150,
      temperature: 0.8, // Higher temperature for more creative choices
    });

    const response = completion.choices[0].message.content.trim();

    // Parse the choices from the response
    const choices = parseChoicesFromResponse(response);

    return {
      success: true,
      choices,
      metadata: {
        temperature: 0.8,
      },
    };
  } catch (error) {
    console.error("OpenAI choices generation error:", error);
    throw new Error(`AI choices generation failed: ${error.message}`);
  }
}

/**
 * Generate image for story segment using DALL-E
 */
export async function generateStoryImage(storyContent) {
  try {
    if (process.env.ENABLE_IMAGE_GENERATION !== "true") {
      return {
        success: false,
        message: "Image generation is disabled",
      };
    }

    // Generate image prompt
    const promptCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: STORY_PROMPTS.image.replace("{content}", storyContent),
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const imagePrompt = promptCompletion.choices[0].message.content.trim();

    // Generate image
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    return {
      success: true,
      imageUrl: imageResponse.data[0].url,
      imagePrompt,
      metadata: {
        model: "dall-e-3",
        size: "1024x1024",
        quality: "standard",
      },
    };
  } catch (error) {
    console.error("OpenAI image generation error:", error);
    // Don't throw error for image generation failures, just return failure
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Parse choices from AI response
 */
function parseChoicesFromResponse(response) {
  const lines = response.split("\n").filter((line) => line.trim());
  const choices = [];

  for (const line of lines) {
    const match = line.match(/^\d+\.\s*(.+)$/);
    if (match) {
      choices.push({
        text: match[1].trim(),
        selected: false,
      });
    }
  }

  // Fallback if parsing fails
  if (choices.length === 0) {
    return [
      { text: "Continue the adventure", selected: false },
      { text: "Take a different approach", selected: false },
      { text: "Explore other options", selected: false },
    ];
  }

  return choices.slice(0, 3); // Ensure max 3 choices
}

/**
 * Check if OpenAI API is configured
 */
export function isOpenAIConfigured() {
  return !!process.env.OPENAI_API_KEY;
}
