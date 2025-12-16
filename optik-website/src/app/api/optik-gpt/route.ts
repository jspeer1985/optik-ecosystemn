import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are OPTIK GPT, the most advanced AI for memecoin creation.

Be specific, actionable, and professional. Use data and numbers.
Never repeat yourself. Build on conversation history.
Be concise (2-3 paragraphs max).`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [], formData } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const messages: any[] = [{ role: 'system', content: SYSTEM_PROMPT }];

    if (conversationHistory.length > 0) {
      conversationHistory.forEach((msg: any) => {
        if (msg.role === 'user' || msg.role === 'assistant' || msg.role === 'optik') {
          messages.push({
            role: msg.role === 'optik' ? 'assistant' : msg.role,
            content: msg.content
          });
        }
      });
    }

    messages.push({ role: 'user', content: message });

    const demoMode = !process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

    if (demoMode) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = generateDemo(message, conversationHistory, formData);
      return NextResponse.json({ response });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: messages,
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'Please rephrase.';
    return NextResponse.json({ response, tokensUsed: completion.usage?.total_tokens || 0 });

  } catch (error: any) {
    console.error('GPT Error:', error);
    return NextResponse.json({ error: 'AI error' }, { status: 500 });
  }
}

function generateDemo(message: string, history: any[], formData: any): string {
  const lower = message.toLowerCase();
  
  const answered = history.some(msg => 
    msg.role === 'optik' && msg.content.toLowerCase().includes(lower.substring(0, 20))
  );

  if (answered && !lower.includes('more')) {
    return "Already covered that. What specific aspect would you like to explore? Or ask something else?";
  }

  if (lower.includes('trend') || lower.includes('hot')) {
    return `Top 3 Trends:\n\n1. AI + Memecoins (284K mentions)\n2. Baby Animals (viral now)\n3. Gaming Tokens (long-term)\n\nRecommendation: Combine AI + cute mascot. Launch Tuesday-Thursday 9-11 AM EST.\n\nWhat type are you creating?`;
  }

  if (lower.includes('name')) {
    return `5 Viral Names:\n\n1. $MOONPUP (92/100)\n2. $QUANTUM (89/100)\n3. $AICAT (91/100)\n4. $HYPERDOGE (88/100)\n5. $GIGACHAD (87/100)\n\nTop Pick: $MOONPUP - Easy, memeable, positive.\n\nHave a name to analyze?`;
  }

  if (lower.includes('strategy') || lower.includes('launch')) {
    return `Launch Strategy:\n\nPre-Launch: Teasers 24hrs before\n\nLaunch Day:\n- 9 AM: Announcement\n- 10 AM: Contract live\n- 12 PM: Community call\n- 3 PM: Influencer wave\n\nWeek 1: Daily engagement, holder spotlights\n\nBudget: $500-1000\nExpected: $50K-200K volume\n\nSpecific questions?`;
  }

  if (lower.includes('vault') || lower.includes('liquidity')) {
    return `Vault Economics:\n\n- Lock: 90 days\n- Fee: 2.5%\n- Your Share: 50% trading fees\n\nExample:\nDaily Volume: $10K\nTrading Fee: $50\nYour Share: $25/day = $750/month\n\nPlus token appreciation. Questions?`;
  }

  return `I help with:\n\n📊 Market trends\n💡 Token naming\n🎯 Launch strategy\n🔒 Vault economics\n🚀 Marketing\n\nWhat do you need?`;
}

export async function GET() {
  return NextResponse.json({ status: 'Online', version: '2.0' });
}
