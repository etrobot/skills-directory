import { createAPIFileRoute } from "@tanstack/react-start/api";
import { llmConfig, assertLLMConfig } from "@/lib/config";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export const APIRoute = createAPIFileRoute("/api/chat")({
  POST: async ({ request }) => {
    assertLLMConfig();
    const body = await request.json().catch(() => ({}));
    const messages: ChatMessage[] = body?.messages ?? [];
    const model: string = body?.model ?? llmConfig.model;
    const temperature: number | undefined = body?.temperature;

    // 添加思考提示到系统消息中
    const enhancedMessages = messages.map((msg, index) => {
      if (msg.role === "system") {
        return {
          ...msg,
          content: `${msg.content}

请在回答用户问题时，先在 <thinking> 标签中展示你的思考过程，然后再给出最终回答。思考过程应该包括：
1. 对问题的理解和分析
2. 可能的解决方案或回答思路
3. 选择最佳方案的原因

格式示例：
<thinking>
用户问的是...我需要考虑...最好的方法是...
</thinking>

然后给出你的回答。`
        };
      }
      return msg;
    });

    const payload = {
      model,
      messages: enhancedMessages,
      temperature,
      stream: true,
    };

    try {
      const resp = await fetch(llmConfig.baseUrl + "/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${llmConfig.apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        return new Response(
          JSON.stringify({ error: true, status: resp.status, message: text }),
          { status: resp.status, headers: { "Content-Type": "application/json" } }
        );
      }

      // 返回流式响应
      return new Response(resp.body, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    } catch (error) {
      console.error('Stream error:', error);
      return new Response(
        JSON.stringify({ 
          error: true, 
          message: error instanceof Error ? error.message : 'Unknown error' 
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    }
  },
});
