# Design System — Vale da Roca (Alojamento Local & Loja de Vinhos)

> **Documento:** Especificação Visual e Diretrizes de Design  
> **Identidade:** Enoturismo, Natureza e Luxo Sereno em Sintra  
> **Finalidade:** Guia descritivo de componentes, cores, proporções e comportamentos visuais para o website unificado (Alojamento e Loja Online).

---

## 1. Filosofia e Direção Criativa

O design do Vale da Roca assenta no diálogo entre a imponência natural da serra de Sintra/Cabo da Roca e a nobreza da sua vinha histórica de Colares:

* **Geometria Retilínea e Rigorosa:** Arestas perfeitamente retas (`0px` de raio) e contornos com linha fina contínua (`1px`), evocando a precisão arquitetural e os rótulos de vinhos de reserva.
* **Luxo Sereno e Editorial:** Espaços de respiro generosos, ausência de ruído visual, contraste assertivo e fotografia de grande escala com ritmo contemplativo.
* **Separação Intuitiva de Contextos:** O utilizador distingue de imediato a experiência de hospitalidade (relaxamento e reserva de estadias) da experiência de comércio eletrónico (compra de vinhos da quinta e produtos regionais) sem sair do mesmo domínio.

---

## 2. Paleta Cromática Oficial

A paleta de cores é estrita, orgânica e sóbria:

### Cores Principais
* **Verde Floresta / Vinha de Sintra (`#1D351B`):**  
  A cor identitária e nobre da marca. Representa a vegetação densa do Parque Natural e as folhas das videiras em pé franco. Utilizada em botões primários, títulos principais, linhas estruturantes e blocos de maior autoridade visual.
* **Verde Vinha a 85% de Opacidade (`rgba(29, 53, 27, 0.85)`):**  
  Variação translúcida com elevada presença cromática destinada a botões secundários, cartões sobrepostos e fundos de leitura suave, permitindo que a imagem de fundo ou a luz da página transpareça com subtileza mantendo excelente contraste.
* **Preto Puro (`#000000`):**  
  Garante o contraste gráfico máximo, precisão editorial, textos de corpo de elevada legibilidade, molduras e linhas de separação.
* **Branco Puro (`#ffffff`):**  
  A fonte de luz da página. Fundos desimpedidos, respiros generosos e texto sobre o verde profundo.

### Tonalidades Complementares de Apoio
* **Verde Vinha Linha Fina (20% de Opacidade):** Divisórias delicadas de secção, grelhas de quartos e contornos secundários.
* **Calcário Suave / Off-White (`#F8F9F6`):** Alternância cromática para secções de comodidades e bastidores da adega, mantendo calor orgânico.

---

## 3. Tipografia e Ritmo Editorial

Combinação cuidada entre a tradição vitivinícola e a ergonomia de leitura digital:

### 1. Tipografia Editorial e Títulos: Cormorant Garamond
* **Espírito:** Serif clássica, nobre, inspirada nas prensas renascentistas e rótulos de colheitas especiais.
* **Utilização:** Títulos de grande formato (H1, H2), cabeçalhos das suites, citações do enólogo, poesia da herdade e nomes dos vinhos da loja.
* **Sensação:** Tradição, tempo, organicidade e sofisticação.

### 2. Tipografia de Interface e Conteúdo: Inter
* **Espírito:** Sans-serif geométrica, neutra e de legibilidade impecável em qualquer escala.
* **Utilização:** Textos corridos de descrição, fichas técnicas de degustação, rótulos de botões, seletores de calendário e etapas de checkout.
* **Sensação:** Rigor técnico, clareza funcional e ausência de fricção.

### Escala de Proporções Visuais
* **Display Hero:** Caixa alta ou mista em serifa com presença imponente e espaçamento ligeiramente comprimido para impacto visual.
* **Títulos de Secção:** Tamanho generoso com espaçamento natural.
* **Sub-títulos e Badges:** Caixa alta (`UPPERCASE`), fonte sem serifa, tamanho reduzido e tracking alargado para conferir ritmo editorial.
* **Corpo de Texto:** Escala equilibrada com entrelinha desafogada para leitura pausada.
* **Botões e Ações:** Caixa alta, tamanho compacto e espaçamento acentuado entre letras.

---

## 4. Sistema de Botões e Interatividade

### Formato e Estrutura dos Botões
* **Arestas:** Rigorosamente retas (raio zero / cantos vivos em 90 graus).
* **Borda:** Linha fina e uniforme de 1 pixel em toda a volta.
* **Texto:** Tipografia sem serifa (`Inter`), em maiúsculas (`UPPERCASE`), com espaçamento generoso entre caracteres e alinhamento centrado.
* **Espaçamento Interno:** Enchimento amplo nas laterais e compacto na altura, transmitindo elegância e firmeza.

### Comportamento em Hover (Animação no Sentido Y)
* **Efeito Cinético:** Ao passar o cursor (hover) sobre qualquer botão, **a palavra realiza uma animação de transição vertical no sentido do eixo Y**.
* **Mecânica do Movimento:** 
  - A palavra original desloca-se suavemente para cima ao longo do eixo Y, dando lugar a uma réplica idêntica que sobe da base, criando um efeito de deslizamento contínuo ("rolling text / slide reveal").
  - O movimento é fluido, instantâneo e contido dentro do limite da caixa do botão (com corte de transbordo oculto).
  - Em simultâneo, a cor de fundo e a linha de contorno transitam com suavidade sem alterar as dimensões externas do botão.

### Variantes de Botão

#### 1. Botão Primário Sólido
* **Fundo:** Verde Floresta `#1D351B` a 100%.
* **Borda:** 1px em `#1D351B`.
* **Texto:** Branco puro `#ffffff`.
* **Em Hover:** A palavra executa a sua deslocação vertical no eixo Y.
* **Função:** Ação principal da página — *"Reservar Estadia"* ou *"Finalizar Compra"*.

#### 2. Botão Secundário Translúcido (85% de Opacidade)
* **Fundo:** Verde Floresta `#1D351B` com 85% de opacidade (`rgba(29, 53, 27, 0.85)`).
* **Borda:** 1px em `#1D351B`.
* **Texto:** Preto `#000000` ou Verde `#1D351B` (conforme o fundo da secção).
* **Em Hover:** O texto anima no sentido Y.
* **Função:** Ações secundárias — *"Conhecer os Vinhos"* ou *"Ver Galeria"*.

#### 3. Botão Outline (Linha Fina)
* **Fundo:** Transparente.
* **Borda:** 1px em `#1D351B`.
* **Texto:** Verde `#1D351B`.
* **Em Hover:** O texto passa a branco e efetua a transição no sentido Y.
* **Função:** Filtros de colheita, ordenação da loja e seletores complementares.

---

## 5. Iconografia (Catálogo Icônes — Sem Lucide)

> **Diretriz Mandatória:** Fica estritamente vedado o uso de ícones da biblioteca Lucide.  
> Toda a iconografia deve ser selecionada no catálogo **Icônes (icones.js.org)** através das famílias de traço fino minimalista **Solar (Linear/Outline)** ou **Phosphor (Light)**.

### Características do Traço
* **Espessura:** Linha fina uniforme (1px a 1.5px), sem preenchimentos densos.
* **Geometria:** Formas puras, elegantes e despojadas que complementam a tipografia sem roubar protagonismo à fotografia.

### Mapeamento Temático

* **Experiência de Estadia (Alojamento):**
  - Cama de casal e tipologia de suites: Traço linear estilizado.
  - Vista de mar / falésia do Cabo da Roca: Linha de horizonte e sol em arco fino.
  - Calendário e noites de estadia: Grelha de calendário linear e minimalista.
  - Capacidade e hóspedes: Silhuetas de traço leve.
  - Comodidades (Wi-Fi, piscina, lareira): Ícones técnicos e lineares.

* **Experiência de Enoturismo e Loja:**
  - Garrafa de vinho de Colares: Silhueta longilínea fina.
  - Taça de prova: Traço triangular elegante.
  - Saco de compras / Carrinho: Bolsa minimalista de traço fino com alça reta.
  - Filtros e colheitas: Marcadores de ajuste finos.
  - Checkout seguro e envio: Cartão estilizado e caixa de expedição sem adornos.

---

## 6. Arquitetura de Secções: Estadia vs. Loja Online

Para garantir que os visitantes compreendem com clareza a transição entre o turismo e a loja online no mesmo domínio:

### 1. Seletor de Contexto no Topo do Cabeçalho
* Uma barra fixa superior com tipografia em caixa alta permite comutar entre dois universos:
  - **Alojamento & Enoturismo:** Foco no bem-estar, nos retiros, nos quartos e na reserva com o software Guestcentric.
  - **Loja da Quinta & Vinhos:** Foco no catálogo de garrafas, azeite, cabazes e compra imediata.
* A secção ativa apresenta um traço horizontal inferior fino e contraste evidente face à inativa.

### 2. Identidade Visual de Cada Secção
* **No Alojamento:**
  - Layout focado em grandes fotografias panorâmicas das suites e da paisagem de Sintra.
  - Apresentação da barra de reserva Guestcentric Hypercommerce (Entrada, Saída, Hóspedes).
  - Ausência de elementos intrusivos de comércio eletrónico (o carrinho de compras fica recolhido).
* **Na Loja Online:**
  - Layout em grelha equilibrada com fotografias de fundo neutro dos vinhos em alta definição.
  - Mini-carrinho lateral flutuante com contador discreto.
  - Informações claras sobre castas, teor alcoólico, notas de prova, portes de envio e checkout integrado no mesmo domínio.

---

## 7. Media Queries e Grelhas Padronizadas

O comportamento responsivo rege-se exclusivamente por 6 media queries fixas:

1. **Abaixo de 480px:** Smartphones compactos (coluna única, navegação condensada em gaveta inferior, botões a ocupar a largura total do ecrã).
2. **Abaixo de 576px:** Smartphones standard (ajuste de margens laterais e proporções de imagem).
3. **A partir de 768px:** Tablets em formato vertical (grelhas a duas colunas, barra de reservas em disposição horizontal compacta).
4. **A partir de 992px:** Portáteis e ecrãs intermédios (menu de navegação expandido, grelhas de 3 colunas na loja de vinhos).
5. **A partir de 1200px:** Ecrãs desktop de alta resolução (layout pleno com espaçamentos generosos e margens laterais desafogadas).
6. **A partir de 1400px:** Monitores amplos (limite máximo de largura de leitura centrado e fotografia imersiva).

---

## 8. Acessibilidade e Qualidade Visual (WCAG 2.2 AA)

* **Contraste de Cor Garantido:** O contraste entre o texto preto `#000000` sobre fundos claros e o texto branco `#ffffff` sobre o verde `#1D351B` cumpre com distinção o rácio mínimo exigido de 4.5:1.
* **Foco Visível por Teclado:** Qualquer interação via teclado exibe um contorno nítido de foco com linha fina exterior.
* **Adaptação a Movimento Reduzido:** Caso o visitante tenha ativa a preferência por movimento reduzido nas definições do sistema, a transição no eixo Y do texto dos botões é substituída por uma alteração direta de cor, garantindo estabilidade e conforto visual.
