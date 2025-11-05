import { ContactUsSchema } from '@/schemas';
import { NextResponse } from 'next/server';

interface FeishuTextMessage {
  msg_type: 'text';
  content: {
    text: string;
  };
}

export async function POST(request: Request) {
  const params = await request.json();

  const { success, data, error } = ContactUsSchema.safeParse(params);
  if (!success && error) {
    return NextResponse.json(
      { success: false, errors: error.flatten().fieldErrors },
      { status: 200 },
    );
  }

  console.log(data);

  const feishuMessage: FeishuTextMessage = {
    msg_type: 'text',
    content: {
      text: `${data.title}

Username: ${data.username}
Email: ${data.email}
Company: ${data.company}
Messages: ${data.messages}
From: ${data.url}`,
    },
  };

  try {
    await fetch(process.env.FEISHU_WEBHOOK || '', {
      method: 'POST',
      body: JSON.stringify(feishuMessage),
    });
  } catch (error) {
    throw error;
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
