import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 },
      );
    }

    // 检查必要的环境变量
    const apiKey = process.env.DASHSCOPE_API_KEY;
    const appId = process.env.DASHSCOPE_APP_ID;
    const pipelineIds = process.env.DASHSCOPE_PIPELINE_IDS?.split(',') || [];

    if (!apiKey) {
      console.error('DASHSCOPE_API_KEY not configured');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 },
      );
    }

    if (!appId) {
      console.error('DASHSCOPE_APP_ID not configured');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 },
      );
    }

    const url = `https://dashscope.aliyuncs.com/api/v1/apps/${appId}/completion`;

    const data = {
      input: {
        prompt: message,
      },
      parameters: {
        rag_options: {
          pipeline_ids: pipelineIds.length > 0 ? pipelineIds : undefined,
        },
      },
      debug: {},
    };

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });

    if (response.status === 200) {
      const aiResponse =
        response.data.output?.text || 'Sorry, I cannot answer this question.';
      return NextResponse.json({ response: aiResponse });
    } else {
      console.error('DashScope API error:', {
        status: response.status,
        data: response.data,
        requestId: response.headers['request_id'],
      });
      return NextResponse.json(
        { error: 'AI service temporarily unavailable' },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error('Error calling DashScope API:', error.message);

    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }

    // Return different responses based on error type
    if (error.code === 'ECONNABORTED') {
      return NextResponse.json({ error: 'Request timeout' }, { status: 408 });
    }

    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'API authentication failed' },
        { status: 401 },
      );
    }

    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
