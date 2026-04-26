import Constants from 'expo-constants';

const SYSTEM_PROMPT = `You are a road accident triage assistant embedded in an
emergency response app. The user has just been in or witnessed a road accident.

Your job:
1. Identify the most urgent threat to life
2. Tell them which emergency service to call first (use Indian numbers by default:
   ambulance 108, police 100, fire 101 — adjust if user mentions another country)
3. Give 3-5 specific first aid steps for their exact situation

Rules:
- Be calm, clear, direct
- Plain language only — no markdown, no bullet symbols, use numbered steps
- Under 120 words total
- Never say "I'm just an AI" or similar — just help
- If the situation is unclear, ask ONE clarifying question`;

export interface TriageMessage {
  role: 'user' | 'assistant';
  text: string;
}

export async function getTriageResponse(

  messages: TriageMessage[]
): Promise<string> {
  const geminiApiKey = Constants.expoConfig?.extra?.geminiApiKey;
  
  if (!geminiApiKey) {
    console.warn('[ViaTerrena] GEMINI_API_KEY is not set in expoConfig');
    return 'Service unavailable. Call 112 immediately.';
  }

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiApiKey}`;




  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.text }],
  }));

  // Prepend system instruction as first user turn
  const fullContents = [
    { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
    { role: 'model', parts: [{ text: 'Understood. Describe what happened.' }] },
    ...contents,
  ];

  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: fullContents,
        generationConfig: {
          temperature: 0.3,      // low = consistent, calm responses
          maxOutputTokens: 200,
          topP: 0.8,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Unable to get response. Call 112 immediately.';
  } catch (error) {
    console.error('[ViaTerrena] getTriageResponse error', error);
    throw error;
  }
}
