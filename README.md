<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/dongowu/dongowu@main/profile/hero-dark.svg" />
    <img src="https://cdn.jsdelivr.net/gh/dongowu/dongowu@main/profile/hero.svg" width="100%" alt="dongowu — agent infrastructure engineer" />
  </picture>
</div>

<div align="center">
  <a href="mailto:jason_w96@163.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
  &nbsp;
  <a href="https://twitter.com/dongowu1"><img src="https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white" alt="X" /></a>
  &nbsp;
  <a href="https://www.npmjs.com/package/@dongowu/git-ai-cli"><img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm" /></a>
  &nbsp;
  <img src="https://komarev.com/ghpvc/?username=dongowu&style=for-the-badge&color=8250DF&label=Profile+Views" alt="Profile Views" />
</div>

<br />

I build **agent execution infrastructure** — Go control planes, Rust runtime planes, and the Sui / Walrus layer that gives agents wallets, memory, and tamper-evident audit trails.

Most agent projects stop at the demo. I care about what comes after: how an autonomous workload gets **bounded, audited, and explained** once it runs unattended.

🔭 **Now** — AgentOS audit / replay layer · agent-economy settlement on Sui · Rust async internals

---

## 🚀 Featured projects

<details open>
<summary><b>11 repositories, one theme: agents you can operate</b></summary>
<br />

| Project | Stack | What it does |
| --- | --- | --- |
| **Agent infrastructure** | | |
| [**agentos**](https://github.com/dongowu/agentos) | `Go` `Rust` | Self-hosted agent execution platform — task orchestration & lifecycle, local / NATS dual scheduling, audit & replay APIs, SSE telemetry, agent loop with tool calling |
| [**sentinel-protocol**](https://github.com/dongowu/sentinel-protocol) | `Go` `Move` | Verifiable pre-execution security for OpenClaw agents — policy gate + multi-signal risk engine → ALLOW / REQUIRE_APPROVAL / BLOCK, decisions anchored to Sui as tamper-evident evidence |
| **On-chain agents · Sui** | | |
| [**sui-nexus**](https://github.com/dongowu/sui-nexus) | `Go` `Move` | Settlement infrastructure for the AI agent economy on Sui — HMAC + zkLogin auth, Move-enforced wallet policy (not middleware), Walrus-backed memory, PTB atomic execution. Sui Overflow 2026, live on testnet |
| [**memwal**](https://github.com/dongowu/memwal) · [PyPI](https://pypi.org/project/memwal/) | `Python` `Move` | One import gives any AI agent persistent, cross-session, verifiable memory — Walrus storage + Sui on-chain references, framework-agnostic (`pip install memwal`) |
| [**FactionForge**](https://github.com/dongowu/FactionForge) | `Move` `React` | Programmable smart infrastructure for EVE Frontier on Sui — reputation-aware storage, faction-aware gates, frontend binding to real assembly IDs. Live on testnet |
| **Developer tooling** | | |
| [**git-ai-cli**](https://github.com/dongowu/git-ai-cli) · [npm](https://www.npmjs.com/package/@dongowu/git-ai-cli) | `Rust` | Branch-aware AI Git assistant — commit generation, Copilot guard, weekly digests. DeepSeek / Qwen / GLM / Moonshot / Ollama, fully local-first |
| [**ai-tracker**](https://github.com/dongowu/ai-tracker) | `Rust` | Observability for AI coding agents — sessions, streaks and tool / model usage across Claude Code, Codex, Cursor |
| **Multi-agent applications** | | |
| [**SpecAssetPages**](https://github.com/dongowu/SpecAssetPages) | `Go` `React` | Pledgekit — multi-agent generator: one product spec → 7 crowdfunding assets (copy, renders, reward tiers). DeepSeek for text, FLUX 1.1 Pro for images |
| [**alpha-research-agent**](https://github.com/dongowu/alpha-research-agent) | `Go` | Crypto research agent — aggregates market, on-chain and DEX data into briefing / deep-dive / long-form outputs |
| **Engineering productivity** | | |
| [**EcoPilot**](https://github.com/dongowu/EcoPilot) | `Python` | Sustainable CI/CD agent for GitLab Duo — finds CI waste, quantifies time / cost / carbon savings, opens MRs with deterministic fixes |
| [**release-pilot**](https://github.com/dongowu/release-pilot) | `Go` `TypeScript` | GitHub Release notification bot — subscribe to repos, filter by rules, render templates, push to channels |

<sub>Also keeping [**MyNote**](https://github.com/dongowu/MyNote) — an Obsidian knowledge base of agent-development notes and engineering standards. The rest live in the [full repository list](https://github.com/dongowu?tab=repositories).</sub>

</details>

---

## 🏗️ How it fits together

<details open>
<summary><b>The execution path I keep rebuilding</b></summary>
<br />

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/dongowu/dongowu@main/profile/agentos-path-dark.svg" />
    <img src="https://cdn.jsdelivr.net/gh/dongowu/dongowu@main/profile/agentos-path.svg" width="92%" alt="AgentOS execution path" />
  </picture>
</p>

Every action an agent takes passes a policy gate **before** it runs — and every decision leaves evidence:

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/dongowu/dongowu@main/profile/sentinel-verdicts-dark.svg" />
    <img src="https://cdn.jsdelivr.net/gh/dongowu/dongowu@main/profile/sentinel-verdicts.svg" width="92%" alt="Sentinel pre-execution verdict chain" />
  </picture>
</p>

</details>

---

## 🛠️ Tech stack

### Languages
<img src="https://img.shields.io/badge/Go-00ADD8?style=flat-square&logo=go&logoColor=white" alt="Go" />
<img src="https://img.shields.io/badge/Rust-000000?style=flat-square&logo=rust&logoColor=white" alt="Rust" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
<img src="https://img.shields.io/badge/Move-4DA2FF?style=flat-square&logo=sui&logoColor=white" alt="Move" />
<img src="https://img.shields.io/badge/SQL-4479A1?style=flat-square&logo=postgresql&logoColor=white" alt="SQL" />

### Backend & infrastructure
<img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
<img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
<img src="https://img.shields.io/badge/NATS-27AAE1?style=flat-square&logo=natsdotio&logoColor=white" alt="NATS" />
<img src="https://img.shields.io/badge/Linux-FCC624?style=flat-square&logo=linux&logoColor=black" alt="Linux" />
<img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white" alt="Git" />

### AI & blockchain
<img src="https://img.shields.io/badge/DeepSeek-4D6BFE?style=flat-square&logo=openai&logoColor=white" alt="DeepSeek" />
<img src="https://img.shields.io/badge/Ollama-000000?style=flat-square&logo=ollama&logoColor=white" alt="Ollama" />
<img src="https://img.shields.io/badge/Sui-4DA2FF?style=flat-square&logo=sui&logoColor=white" alt="Sui" />

---

## 📊 Activity

<details>
<summary><b>Stats, PR graph & the snake</b></summary>
<br />

<div align="center">
  <table>
    <tr>
      <td align="center" width="50%">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/dongowu/dongowu@main/profile/stats-dark.svg" />
          <img src="https://cdn.jsdelivr.net/gh/dongowu/dongowu@main/profile/stats.svg" width="100%" alt="GitHub Stats" />
        </picture>
      </td>
      <td align="center" width="50%">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://streak-stats.demolab.com?user=dongowu&theme=tokyonight&hide_border=true&background=00000000&card_width=450" />
          <img src="https://streak-stats.demolab.com?user=dongowu&theme=default&hide_border=true&background=00000000&card_width=450" width="100%" alt="GitHub Streak" />
        </picture>
      </td>
    </tr>
    <tr>
      <td align="center" colspan="2">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/dongowu/dongowu@main/profile/top-langs-dark.svg" />
          <img src="https://cdn.jsdelivr.net/gh/dongowu/dongowu@main/profile/top-langs.svg" width="62%" alt="Top Languages" />
        </picture>
      </td>
    </tr>
  </table>

  <img src="https://cdn.jsdelivr.net/gh/dongowu/dongowu@main/pr-contribution-graph.svg" width="95%" alt="Pull Request Activity" />

  <br/>

  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.jsdelivr.net/gh/dongowu/dongowu@main/dist/github-contribution-grid-snake-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://cdn.jsdelivr.net/gh/dongowu/dongowu@main/dist/github-contribution-grid-snake.svg" />
    <img src="https://cdn.jsdelivr.net/gh/dongowu/dongowu@main/dist/github-contribution-grid-snake.svg" width="90%" alt="Contribution Snake" />
  </picture>
</div>

</details>

---

## 🌱 Open source contributions

<!--CONTRIBUTIONS_START-->
- **[GoPolymarket/polymarket-go-sdk](https://github.com/GoPolymarket/polymarket-go-sdk/pull/64)**: fix(clob): restore json.Number salt for POLY_1271 order payloads
- **[hoh-zone/Overflow2026-CNNo1](https://github.com/hoh-zone/Overflow2026-CNNo1/pull/5)**: add project description
- **[GoPolymarket/polymarket-go-sdk](https://github.com/GoPolymarket/polymarket-go-sdk/pull/42)**: fix(clob): support flexible order time fields & make govulncheck advisory
- **[MystenLabs/sui](https://github.com/MystenLabs/sui/pull/26038)**: [types][cleanup] fix typo: barreier -> barrier in governance.rs
- **[MystenLabs/sui](https://github.com/MystenLabs/sui/pull/25828)**: fix(kvstore): decode balance_changes and unchanged_loaded_runtime_objects from KV store
<!--CONTRIBUTIONS_END-->

---

<details>
<summary><b>🀄 中文简介</b></summary>
<br />

我是 **dongowu**，专注 **Agent 执行基础设施**：用 Go 做控制面、Rust 做运行时面，并用 Sui / Walrus 给 agent 提供钱包、记忆与不可篡改的审计锚点——关心调度、治理、可审计、可观测这些"演示之后"的工程问题，让一个自主运行的工作负载可以被**约束、审计和解释**。

- **[AgentOS](https://github.com/dongowu/agentos)**：自托管 Agent 执行平台 — 任务编排与执行生命周期、本地 / NATS 双调度路径、审计与回放 API、SSE 遥测、agent loop 与工具调用
- **[Sentinel Protocol](https://github.com/dongowu/sentinel-protocol)**：面向 OpenClaw + Sui 的可验证执行前安全层 — 策略门 + 多信号风险引擎给出 ALLOW / 需审批 / 拦截，决策经哈希链与 Merkle 批次锚定上链，形成不可篡改的审计证据
- **[sui-nexus](https://github.com/dongowu/sui-nexus)**：Sui 上 AI agent 经济的结算基础设施 — HMAC + zkLogin 认证、Move 层强制的钱包策略、Walrus 记忆、PTB 原子执行，已部署 testnet（Sui Overflow 2026）
- **[memwal](https://github.com/dongowu/memwal)**（[PyPI](https://pypi.org/project/memwal/)）：一行导入即给任意 AI agent 持久、跨会话、可验证的记忆 — Walrus 存储 + Sui 链上引用，框架无关
- **[git-ai-cli](https://github.com/dongowu/git-ai-cli)**（[npm](https://www.npmjs.com/package/@dongowu/git-ai-cli)）：分支感知的 AI Git 助手，支持 DeepSeek / 通义千问 / 智谱 GLM / Moonshot / Ollama，可完全本地部署，代码不出内网
- **[EcoPilot](https://github.com/dongowu/EcoPilot)**：面向可持续 CI/CD 的 GitLab Duo 智能体流程，量化时长、成本与碳排收益，并直接开出确定性修复的合并请求

其余项目见上方 Featured projects。

</details>

---

<div align="center">
  <sub>Banner &amp; diagrams are hand-authored SVG committed to this repo · stats cards rendered from the GitHub API · no third-party rendering service in the critical path.</sub>
  <br/>
  <sub>🐍 snake by <a href="https://github.com/Platane/snk">Platane/snk</a> · 📊 cards by <a href="https://github.com/readme-tools/github-readme-stats-action">readme-tools</a> · 🏷️ badges by <a href="https://shields.io">shields.io</a></sub>
</div>
