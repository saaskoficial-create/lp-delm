# Auditoria local de SEO e performance — 02/10/2026

Lighthouse 13.5.0, preset mobile, CPU/rede simuladas, build de produção servido no localhost. Medição de laboratório; não representa dados reais de usuários ou garantia de ranking.

| Indicador | Antes | Depois |
| --- | ---: | ---: |
| Desempenho | 83 | 93 |
| SEO | 92 | 100 |
| Acessibilidade | 100 | 100 |
| Boas práticas | 100 | 100 |
| LCP simulado | 3.59 s | 3.12 s |
| CLS | 0.0122 | 0.0000 |

Mudanças: HTML completo pré-renderizado, CSS pequeno inline, preload de fontes Latin, prioridade baixa para hidratação, GSAP sob demanda, logos responsivas e cache de assets preparado para hospedagem. O HTML fica visível sem JavaScript. Canonical e sitemap dependem de SITE_URL no ambiente de build.

GTM-P8ZS3GSZ preservado no head e no noscript imediatamente depois da abertura do body.
