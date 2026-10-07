# Revisão do formulário da DELM

## Escopo e estado

Destino: https://lp-solucoes.delm.com.br/. Código corrigido e validado localmente. Publicação ainda pendente: a conta Vercel disponível (custodiorod) não contém o projeto desse domínio. Nenhuma alteração foi publicada em um projeto substituto.

## Experiência e validação

- Todas as chamadas de diagnóstico apontam para o cartão do formulário, abaixo do cabeçalho fixo. O menu mobile fecha e libera a rolagem antes de navegar.
- Botões podem quebrar linha dentro da largura disponível.
- Nome: 2 a 120 caracteres; empresa: 2 a 160; e-mail: até 254; telefone formatado: até 30, com 10 a 15 dígitos; descrição: 10 a 2.000.
- Limites no HTML e no servidor, inclusive antes de remover espaços externos. Contador da descrição e mensagens de erro acessíveis.
- Autocomplete name, email, tel e organization; teclado de telefone/e-mail, e-mail sem correção ou capitalização automática e fonte de 16 px no celular.
- Os valores reais do DOM são sincronizados antes da validação, para provedores de preenchimento que não disparam eventos.
- Valores permanecem disponíveis após falha. Envio repetido simultâneo é bloqueado no cliente.
- Erros devolvidos pelo servidor focam e exibem o campo afetado depois que os campos são habilitados novamente.
- A confirmação de sucesso recebe foco e volta para a área visível, inclusive depois de preencher um formulário longo no celular.
- Diagramas de integração e automação ajustados para telas de 320 px, sem conteúdo cortado. Navegação respeita a preferência por movimento reduzido.

## Servidor

- Validação estrita dos campos e das opções, limites de tamanho e rejeição de caracteres de controle.
- Honeypot contact_note: deve ficar vazio, não entra no payload encaminhado ao CRM e não participa do autocomplete.
- Apenas GET/POST; POST exige JSON; limite de corpo de 16 KiB; bloqueio de origens externas e de Sec-Fetch-Site cross-site.
- Webhook privado somente no servidor, timeout de 12 segundos, sucesso apenas após HTTP 2xx do destino.
- Cinco tentativas por cliente em dez minutos por instância ativa. IP da borda confiável somente no ambiente Vercel; desenvolvimento usa o socket.
- Submissões iguais compartilham uma única entrega e seu resultado por dez minutos. Falhas liberam nova tentativa.
- Cabeçalhos nosniff, proteção contra iframe, política de referer e bloqueio de câmera/microfone/localização.

### Proteção distribuída ainda necessária

Os contadores e a deduplicação em memória não são compartilhados entre instâncias serverless e reiniciam com elas. Após acessar o projeto correto, configurar uma regra no firewall para POST /api/leads, agregada por IP, e verificar os limites/plano disponíveis antes de ativá-la. Não foi instalado CAPTCHA sem chaves, nem ativado produto pago. Essas medidas reduzem spam básico; não garantem bloqueio de todo bot.

Os cabeçalhos de origem/IP seguem a documentação oficial: https://vercel.com/docs/headers/request-headers.

## Verificação

- TypeScript, lint e build aprovados.
- 20 testes do servidor: campos excessivos e inesperados, honeypot, caracteres inválidos, JSON incorreto, 16 KiB, Content-Type, origem, deduplicação concorrente, retry e expiração do limite. HTTP real com destino local controlado.
- 11 testes de navegador aprovados no Chrome: larguras 320, 360, 390, 768 e 1440; chegada exata ao formulário; menu/Escape; ausência de cortes nos diagramas; limites de colagem; contador; validação; preenchimento sem eventos; dupla submissão; preservação após falha, foco em erro do servidor e confirmação visível após resposta aceita.
- Todos os links internos possuem destino. npm audit --omit=dev não encontrou vulnerabilidades conhecidas nas dependências de produção nesta verificação.
- Conteúdo pré-renderizado, SEO, GTM e ausência de erros de hidratação verificados. Capturas individuais em test-results/delm-*-form-anchor.png.
- Sem plugin de teste de navegador dedicado neste ambiente; usado Playwright do projeto com Chrome instalado. O Chromium empacotado da versão local não estava instalado.
- Não houve envio de lead de teste ao CRM de produção. Os testes de UI interceptam /api/leads; o teste de entrega real usa servidor local.

## Publicação e validação final

1. Confirmar projeto/equipe que detêm lp-solucoes.delm.com.br e manter a configuração existente de LEAD_WEBHOOK_URL e SITE_URL.
2. Publicar este código nesse projeto e conferir o domínio canônico.
3. Verificar no site publicado o menu mobile, chamadas, formulário, campos/autofill e GET /api/leads.
4. Verificar rejeições de requisições inválidas sem criar leads reais; configurar a regra de frequência da borda.
5. Se solicitado, usar um contato de teste autorizado para confirmar a automação posterior ao webhook.
