export type PromptCard = {
  id: string
  title: string
  description: string
  prompt: string
  tags?: string[]
}

export const presetPrompts: PromptCard[] = [
  {
    id: "code-review",
    title: "代码评审助手",
    description: "对提交的代码进行可读性、安全性、性能评审并给出改进建议",
    prompt:
      "你是资深代码评审专家，请从可读性、架构、复杂度、性能、安全性角度进行评审，列出具体问题与可执行建议。",
    tags: ["工程实践", "代码质量"],
  },
  {
    id: "product-ideas",
    title: "产品创意生成器",
    description: "根据行业与目标用户生成10条可落地的产品创意",
    prompt:
      "请根据给定的行业与目标用户，生成10条差异化且可落地的产品创意，并附上核心价值、关键功能与风险点。",
    tags: ["产品", "创意"],
  },
  {
    id: "bug-debug",
    title: "Bug定位助手",
    description: "帮助定位问题根因并给出复现与修复步骤",
    prompt:
      "你是资深故障排查工程师，请根据上下文信息，分析可能的根因、复现路径、修复建议与回归测试要点。",
    tags: ["调试", "故障排查"],
  },
  {
    id: "writing-polish",
    title: "写作润色助手",
    description: "对中文内容进行规范化与风格统一的润色优化",
    prompt:
      "请对以下中文内容进行润色：保持语义，提升逻辑与表达，统一术语，标出修改点与理由。",
    tags: ["写作", "中文"],
  },
]
