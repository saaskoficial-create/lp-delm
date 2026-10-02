import { Braces, Cable, ChartNoAxesCombined, ClipboardCheck, Cog, FileSpreadsheet, Layers3, LayoutDashboard, Network, Smartphone, Users, Workflow } from 'lucide-react'

export const site = {
  hero: {
    eyebrow: 'TECNOLOGIA PARA OPERAÇÕES REAIS',
    title: 'Se sua equipe criou planilhas para fazer o sistema funcionar, o sistema já falhou.',
    description: 'A DELM desenvolve integrações, automações e sistemas sob medida para empresas B2B e operações logísticas que perderam tempo demais tentando se adaptar a ferramentas genéricas.',
    cta: 'Quero mapear meu gargalo',
    note: 'Conte como sua operação funciona hoje. Avaliamos se existe aderência para um projeto sob medida.',
  },
  navigation: [
    { label: 'Soluções', href: '#solucoes' },
    { label: 'Para empresas', href: '#b2b' },
    { label: 'Logística', href: '#logistica' },
    { label: 'Como funciona', href: '#processo' },
  ],
  problems: [
    { icon: FileSpreadsheet, title: 'Planilhas paralelas', description: 'Controles que existem para preencher o que o sistema não resolve.' },
    { icon: Cable, title: 'Sistemas que não conversam', description: 'Dados que não chegam de uma ferramenta à outra.' },
    { icon: ClipboardCheck, title: 'Conferência manual', description: 'Sua equipe revisa o que deveria acontecer automaticamente.' },
    { icon: Users, title: 'Dependência de pessoas', description: 'Processos que param quando uma pessoa específica não está.' },
    { icon: Workflow, title: 'Informação copiada', description: 'O mesmo dado é digitado várias vezes, em lugares diferentes.' },
    { icon: Layers3, title: 'Software que ficou para trás', description: 'ERP, WMS e TMS que não acompanham a realidade da operação.' },
  ],
  solutions: [
    { icon: Network, title: 'Integrações & APIs', description: 'Conecte sistemas, áreas e informações em um fluxo que faça sentido para sua empresa.', tag: 'DADOS QUE CIRCULAM' },
    { icon: Workflow, title: 'Automação de processos', description: 'Transforme tarefas repetitivas e etapas manuais em fluxos automatizados.', tag: 'MENOS TRABALHO MANUAL' },
    { icon: Braces, title: 'Sistemas sob medida', description: 'Sistemas internos e customizações construídos para as regras da sua operação.', tag: 'SUAS REGRAS, SEU SISTEMA' },
    { icon: LayoutDashboard, title: 'Portais & plataformas', description: 'Centralize processos, aprovações e informações em um ambiente próprio.', tag: 'TUDO NO MESMO LUGAR' },
    { icon: Smartphone, title: 'Aplicativos', description: 'Leve os processos da empresa até quem precisa deles, dentro ou fora da operação.', tag: 'OPERAÇÃO EM MOVIMENTO' },
    { icon: ChartNoAxesCombined, title: 'Dashboards operacionais', description: 'Organize os dados para acompanhar o que acontece e apoiar decisões.', tag: 'VISIBILIDADE PARA DECIDIR' },
  ],
  b2bApplications: ['Gestão de ordens de serviço', 'Portais internos', 'Fluxos de aprovação', 'Integração financeira e operacional', 'Automação de tarefas repetitivas', 'Centralização de informações', 'Sistemas para equipes externas', 'Dashboards e acompanhamento operacional'],
  logisticsApplications: ['ERP + WMS', 'ERP + TMS', 'Integrações com transportadoras', 'Rastreamento de operação', 'Controle de rotas', 'Dashboards', 'Portais internos', 'Automação entre sistemas', 'Fluxos de expedição e entrega'],
  differentiators: ['Entendemos a operação.', 'Identificamos o gargalo.', 'Definimos a solução.', 'Desenvolvemos a tecnologia.', 'Evoluímos junto com a empresa.'],
  steps: [
    { title: 'Entendimento', description: 'Você mostra como o processo funciona hoje e onde estão os principais problemas.', icon: Users },
    { title: 'Diagnóstico', description: 'Mapeamos gargalos, integrações, tarefas manuais e oportunidades de automação.', icon: Network },
    { title: 'Arquitetura', description: 'Definimos o que precisa ser desenvolvido, integrado ou automatizado.', icon: Layers3 },
    { title: 'Desenvolvimento', description: 'A solução é construída de acordo com as regras da sua operação.', icon: Braces },
    { title: 'Evolução', description: 'O sistema pode ser aprimorado conforme a empresa e os processos evoluem.', icon: Cog },
  ],
  ideal: ['Possuem processos específicos', 'Já utilizam mais de um sistema', 'Dependem de planilhas paralelas', 'Possuem operação com volume relevante', 'Precisam conectar áreas ou sistemas', 'Querem reduzir tarefas manuais', 'Precisam desenvolver tecnologia própria'],
}
