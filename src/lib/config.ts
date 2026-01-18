export const llmConfig = {
  baseUrl: process.env.OPENAI_BASE_URL || "",
  apiKey: process.env.OPENAI_API_KEY || "",
  model: process.env.OPENAI_MODEL || "gpt-4o-mini",
}

export function assertLLMConfig() {
  if (!llmConfig.baseUrl || !llmConfig.apiKey) {
    throw new Error(
      "缺少LLM配置：请在.env中设置 OPENAI_BASE_URL 与 OPENAI_API_KEY",
    )
  }
}
