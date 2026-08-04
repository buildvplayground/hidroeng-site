# Direção de estilo — Hidroeng (consulta ui-ux-pro-max v2.11)

## Autoridade das fontes
- **Paleta e tipografia: vêm da marca real** (portfólio institucional + logo SVG) — navy
  #06101C/#0A1826, azul Hidroeng #0060B0, cinzas frios; Archivo + Inter. As sugestões de
  cor do ui-ux-pro-max servem só de validação (recomendou "professional blue + neutral
  grey" — converge com a marca).
- ui-ux-pro-max fornece: direção de estilo do segmento, efeitos e anti-padrões.

## Estilo recomendado (segmento: B2B Service / engenharia e infraestrutura)
- **Primário: Trust & Authority** — credenciais de especialistas, cases com métricas
  reais, números de autoridade em destaque, fotografia técnica real (não stock genérico).
- **Secundário: Swiss Modernism 2.0** — grid de 12 colunas rígido, espaçamento matemático
  (base 8px), hierarquia tipográfica clara, decoração mínima, **um único acento** (azul
  #0060B0).
- Landing pattern: **Feature-Rich Showcase** — hero forte → serviços → prova
  (números/cases) → equipe → CTA.

## Efeitos/animações sugeridos
- Reveal suave de estatísticas (stat cards com contagem/entrada em stagger).
- Hover discreto em cards (elevação + borda superior de acento).
- Smooth scroll; micro-interações 150–250ms; nada de parallax pesado ou partículas.

## Anti-padrões da indústria (NÃO fazer)
1. **Overflow horizontal em qualquer viewport** (320px+) — severidade alta.
2. Stock photos genéricas de "aperto de mão"/capacete sorridente — usar imagens reais dos
   projetos (extraídas do portfólio).
3. Métricas sem fonte/contexto — números de autoridade devem ser os reais do portfólio
   (12+ anos, 84 km+ de adutoras etc.), nunca inventados.
4. "Cara de site feito por IA": gradientes roxo/azul-neon arbitrários, emojis como ícones,
   glassmorphism sem propósito, seções todas com o mesmo card 3-colunas, textos genéricos
   ("soluções inovadoras que transformam").
5. Formulário como CTA principal — **CTA é sempre botão de WhatsApp** (padrão BuildV).
6. Dourado/serifada por default — não pertence a esta marca.
7. Excesso de acento: azul #0060B0 é o ÚNICO acento; sem verde/laranja decorativos.
8. Scroll-cue ("role para baixo") e back-to-top — proibidos pelo padrão BuildV.
9. Carrossel automático de depoimentos/logos sem controle do usuário.
10. Texto branco sobre foto sem overlay escuro (contraste WCAG AA mínimo).

## Aplicação no front-end (etapa 5)
- Fundo escuro navy no hero e footer; seções alternando branco/#F5F8FA.
- Portfólio de cases em grade 3/2/1 com lightbox (requisito BuildV).
- Ícones stroke 2px temáticos de saneamento (já definidos no design system).
- Tom de voz: técnico, claro, confiável — sem superlativos vazios.
