# DELM — landing page

Landing page de qualificação para empresas B2B e operações logísticas que precisam de sistemas sob medida, automações ou integrações. React, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix), Framer Motion e GSAP.

## Rodar localmente

Requer Node.js 24 e npm.

```bash
npm ci
npm run dev
```

Abra http://127.0.0.1:4178/. O servidor Vite também executa o endpoint local de leads. A porta é fixa; o comando informa um erro se ela já estiver em uso.

```bash
npm run verify       # lint, testes do endpoint, TypeScript e build
npm run test:e2e     # cenários de navegação, responsividade e formulário
npm run build
npm run preview     # prévia do build, também na porta 4178
```

Para instalar o navegador dos testes: `npx playwright install chromium`. Também é possível usar o Chrome instalado: `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e` (PowerShell: `$env:PLAYWRIGHT_CHANNEL='chrome'; npm run test:e2e`).

## Conteúdo e identidade

As dez seções seguem a copy fornecida para a DELM: hero, problema, soluções, B2B, logística, diferenciais, processo, qualificação, perfil ideal e filtro de aderência. Foram removidas as notas internas e ajustados os textos para leitura na página.

- `src/content/site.ts`: conteúdo recorrente, aplicações, navegação e etapas.
- `src/components/`: seções da página; os componentes oficiais do shadcn estão em `ui/`.
- `src/styles.css`: tokens de marca, layout e breakpoints.
- `public/brand/delm-symbol.jpg`: logo atual fornecido pelo cliente.

O azul foi derivado visualmente do logo; não foi fornecido manual com códigos oficiais. A página usa Sora nos títulos e Inter no texto, ambas hospedadas localmente. As fotografias são reais, licenciadas pelo Pexels, e não representam equipe, clientes ou endosso da DELM. Os diagramas de ERP/WMS/TMS são ilustrações explicativas, e não screenshots de um produto. Não há resultados, preços ou depoimentos inventados. A direção visual está em `DESIGN.md`; fontes, autores e licenças dos assets estão em [docs/assets.md](docs/assets.md).

## Configurar a captação

**Sem `LEAD_WEBHOOK_URL`, o formulário informa indisponibilidade e não aceita envios.** A URL do webhook fica apenas no servidor e nunca deve receber o prefixo `VITE_`.

1. Copie `.env.example` para `.env.local`.
2. Preencha `LEAD_WEBHOOK_URL` com o webhook do CRM/automação.
3. Reinicie o servidor local.
4. Envie uma solicitação de teste e confirme seu recebimento no destino.

O frontend verifica disponibilidade em `GET /api/leads` e envia os dados em `POST /api/leads`. O servidor valida novamente os campos e só confirma depois de um retorno HTTP 2xx do webhook. Em caso de falha, o formulário preserva os dados para uma nova tentativa. Um retorno 2xx confirma aceitação pelo endpoint, não a conclusão das etapas posteriores do CRM.

O destino recebe este contrato JSON:

```json
{
  "source": "lp-delm",
  "submittedAt": "2026-10-02T15:00:00.000Z",
  "lead": {
    "name": "Nome de exemplo",
    "corporateEmail": "contato@example.com",
    "whatsapp": "11999999999",
    "company": "Empresa de exemplo",
    "segment": "Operador logístico",
    "employeeRange": "21 a 50",
    "mainProblem": "Nossos sistemas não conversam entre si",
    "projectDescription": "Precisamos integrar o ERP ao WMS.",
    "timeframe": "Nos próximos 3 meses"
  }
}
```

O telefone é enviado somente com dígitos. Segmentos, faixas de equipe, situações e momentos do projeto seguem as opções da copy original. Os campos obrigatórios são os nove campos do formulário. Nenhuma resposta é salva em localStorage.

## Hospedagem

O repositório contém a configuração para hospedar o frontend e o endpoint serverless na Vercel. Ao importar o projeto, use o framework Vite, build `npm run build` e pasta `dist`. Configure `LEAD_WEBHOOK_URL` no ambiente do servidor e valide o destino.

GitHub Pages ou qualquer hospedagem somente estática entrega o frontend, mas não executa o endpoint `/api/leads`. Nesse caso, é necessário hospedar a API separadamente e ajustar seu encaminhamento. Domínio, canonical e URLs absolutas de compartilhamento devem ser configurados após a definição do endereço público.

**Estado da entrega:** fonte publicada no GitHub e prévia local; sem publicação em hospedagem ou webhook real configurado. Os testes usam destinos simulados e um webhook HTTP local.

## Validação automática

O workflow `Quality` faz instalação limpa com `npm ci`, lint, testes de entrega do endpoint, TypeScript, build e testes Playwright. Os cenários incluem 360, 390, 768 e 1440 px, navegação mobile, CTA até o formulário, indisponibilidade, validação, envio em andamento, falha com retenção dos campos e confirmação após sucesso.

As animações incluem entrada sequencial, saída do hero na rolagem e entrada/saída reversível dos blocos. Respeitam `prefers-reduced-motion`, que mantém a página estática e visível. O GSAP usa `useGSAP` para limpeza ao desmontar; os formulários têm labels, mensagens de erro e estados acessíveis. Playwright também verifica as fontes carregadas, saída e retorno da rolagem.
