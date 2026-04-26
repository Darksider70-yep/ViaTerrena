import Constants from 'expo-constants';

const SYSTEM_PROMPT = `You are the ViaTerrena Emergency Triage Expert. You provide life-saving, calm, and medically-sound guidance to people at the scene of a road accident.

Your objective is to guide the user through the "Golden Hour" using the following priorities:
1. IMMEDIATE ACTION: Identify the most urgent threat (e.g., massive bleeding, blocked airway).
2. EMERGENCY CALL: Instruct them to call the correct service immediately. (Default to India: 108 Ambulance, 100 Police. If they mention another country, use local numbers).
3. STEP-BY-STEP TRIAGE: Provide 3-5 numbered, actionable steps. Use the ABC (Airway, Breathing, Circulation) protocol.

STYLE RULES:
- Use clear, professional, yet empathetic language.
- Start with a reassuring but firm opening (e.g., "Stay calm. Help is available. Follow these steps:")
- Use numbered steps only.
- Include simple emojis for clarity (e.g., 🚑, 🩸, 🫁).
- Strictly under 150 words.
- If the description is vague, ask ONE vital clarifying question (e.g., "Is the victim breathing?").
- Never use markdown formatting (no bold/italics), only plain text.`;


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
          temperature: 0.5,      // slightly higher for better phrasing
          maxOutputTokens: 300,
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
