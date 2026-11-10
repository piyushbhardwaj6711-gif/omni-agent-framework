# EstateIQ — Architecture Decision Records (ADRs)

## ADR-001: Hexagonal Domain-Driven Layering
- **Status:** Accepted
- **Context:** EstateIQ aims to be a multi-business, multi-vertical AI operating layer, starting with Indian Real Estate. Business rules must not be coupled to the web framework, AI models, or UI components.
- **Decision:** Split codebase into `core/`, `domains/real_estate/`, `agents/`, `ai/`, `application/`, `integrations/`, and `api/`. Any future vertical (e.g., auto dealership, hospitality) plugs in under `domains/<domain_name>` implementing standardized entity contracts.

## ADR-002: Multi-Tenancy from Day Zero
- **Status:** Accepted
- **Context:** Enterprise brokerages and developers require strict data and model isolation.
- **Decision:** All entities, requests, audit logs, and agent contexts are scoped by `TenantId`. In V0, a demo tenant is injected via `TenantMiddleware`. In V2/V3, this middleware resolves authenticated JWT claims into PostgreSQL Row-Level Security (RLS) policies.

## ADR-003: AI Provider Decoupling & Grounded Tool Execution
- **Status:** Accepted
- **Context:** LLMs hallucinate numbers, prices, and inventory availability when relying on parametric memory. In real estate, misstating prices or RERA statuses causes commercial and regulatory violations.
- **Decision:** All pricing, area measurements, EMI calculations, and availability checks are retrieved through deterministic calculators and read-only tools. The AI provider is abstracted behind an `AIProvider` protocol, allowing seamless switching from deterministic mock NLU to Gemini/Claude/OpenAI or local models.

## ADR-004: Action Risk Tiers and Human-in-the-Loop Governance
- **Status:** Accepted
- **Context:** Autonomous actions like discounts, unit reservations, and payment links carry immediate financial risk.
- **Decision:** Implement risk classification (T0 Read-Only, T1 Low-Risk Write, T2 Commercial Content, T3 Financial Commitment, T4 Destructive). All T3/T4 actions require human manager approval.

## ADR-005: India-First Domain Modeling
- **Status:** Accepted
- **Context:** Indian real estate terminology and transaction habits are distinct from Western markets.
- **Decision:** Support INR Lakhs/Crores natively, code-mixed Hinglish in natural conversations, RERA registration tracking, and Maharashtra stamp duty / registration rules.
