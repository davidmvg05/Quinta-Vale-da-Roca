# Regras do Projeto e de Segurança (Vale da Roca — Nuxt 4 + Vue 3 + Tailwind CSS + E-commerce + Guestcentric)

## 1. Contexto do Projeto e UX

- **Projeto:** Renovação integral do design e melhoria substancial de UX do website Vale da Roca (https://valedaroca.com/pt/), unificando Alojamento Local (enoturismo em Sintra) e Loja Online de vinhos/produtos da quinta sob o mesmo domínio.
- **Diferenciação Estadia vs. Loja:**
  - **Alojamento (`/` e `/quartos`):** Layout contemplativo, fotografia de grande formato, comodidades e conversão direta via motor de reservas **Guestcentric Hypercommerce**.
  - **Loja Online (`/loja`):** Layout de e-commerce com grelha de produtos, categorias, carrinho persistente e checkout sob o mesmo domínio.
  - **Identidade & Navegação:** Seletor de secção explícito no topo do cabeçalho permitindo alternar de imediato entre o alojamento e a loja.
- **Idioma:** Código e comentários em inglês; interface e conteúdo visível em português (PT-PT) com i18n preparado para inglês (EN).
- **Gestor de pacotes:** `pnpm`.
- **Regra de aval:** Não adiciones serviços, bibliotecas ou dependências não previstas na secção 3 sem o aval prévio do utilizador.

## 2. Fontes de Inspiração & Referências Visuais

Para a conceção estética dos ecrãs, transições e arquitetura de componentes, consultar como referência de excelência:
- **Framer Marketplace Templates (Hospitality & Wineries):** https://www.framer.com/marketplace/templates/ — Referência para layouts imersivos de hotéis boutique, grelhas de quartos e tipografia editorial.
- **Awwwards (Boutique Hotels & Wine Stores):** https://www.awwwards.com/ — Referência para micro-interações, transições de imagem com `clip-path`, refinamento visual e luxo sereno.
- **Mobbin (Fluxos e Padrões de Checkout e UI):** https://mobbin.com/ (ou via Mobbin MCP quando ativado com conta Pro) — Referência para fluxos de checkout, filtragem e navegação transacional sem fricção.

## 3. Stack Tecnológica Definida

- **Framework:** Nuxt 4 (Vue 3, `<script setup lang="ts">`), TypeScript estrito.
- **Estilos & UI:** Tailwind CSS (v4 com `@theme`) + Nuxt UI.
- **Estado Global:** Pinia (gestão do carrinho de compras da loja online e parâmetros de reserva).
- **Animações:** GSAP (ScrollTrigger) integrado no cliente com suporte obrigatório a `prefers-reduced-motion`.
- **Imagens & Fontes:** `@nuxt/image` (WebP/AVIF com `fetchpriority="high"` no hero) e `@nuxt/fonts`.
- **Reservas de Alojamento:** Guestcentric Hypercommerce (carregamento diferido do script para não degradar LCP nem TBT).
- **Loja Online:** Servidor Nitro (`server/api/checkout`) com Stripe Elements para checkout nativo no mesmo domínio.
- **SEO & Redes Sociais:** `@nuxtjs/seo` com dados estruturados JSON-LD duplos (`LodgingBusiness` e `Product`).

## 4. Design System, Cores, Tipografia & Ícones

- **Cores Oficiais:**
  - `#1D351B` (Verde Floresta / Vinha de Sintra — cor primária identitária).
  - `#1D351B` com 85% de opacidade (`rgba(29, 53, 27, 0.85)`) para botões secundários, cartões e overlays.
  - `#000000` (Preto puro para contraste gráfico e texto).
  - `#ffffff` (Branco puro para fundos limpos e luz).
- **Tipografia:**
  - **Títulos & Espírito de Vinha/Alojamento:** `Cormorant Garamond` (serif clássica, nobre e orgânica).
  - **Interface, UI & Conteúdo Corrido:** `Inter` (sans-serif precisa, nítida e neutra).
- **Botões:**
  - **Bordas retas e finas:** `rounded-none`, `border border-[#1D351B]`.
  - **Animação em Hover:** A palavra dentro do botão realiza uma animação de transição vertical no sentido do eixo Y (efeito de deslocamento suave tipo rolling text / slide vertical no eixo Y), respeitando `prefers-reduced-motion`.
  - **Variante Primária:** Fundo `#1D351B` a 100%, texto `#ffffff`. Em hover: a palavra executa a deslocação vertical no eixo Y.
  - **Variante Secundária:** Fundo `#1D351B` a 85% de opacidade (`rgba(29, 53, 27, 0.85)`), texto `#000000` ou `#1D351B` (conforme o fundo da secção). Em hover: o texto anima no sentido Y.
  - **Variante Outline:** Fundo transparente, borda fina `1px #1D351B`, texto `#1D351B`. Em hover: o texto passa a branco e efetua a transição no sentido Y.
- **Ícones (Icônes):**
  - **PROIBIDO usar ícones Lucide.**
  - Usar exclusivamente ícones retirados de https://icones.js.org/ pertencentes às famílias de traço fino **`solar:`** (Solar Linear) ou **`ph:`** (Phosphor Light).

## 5. Media Queries e Breakpoints Obrigatórios

Configurados estritamente no ficheiro CSS principal (`app/assets/css/main.css` com `@theme`):

- `@media (max-width: 480px)`: `--breakpoint-xs: 480px` (variante `max-xs:`)
- `@media (max-width: 576px)`: `--breakpoint-sm: 576px` (variante `max-sm:`)
- `@media (min-width: 768px)`: `--breakpoint-md: 768px` (variante `md:`)
- `@media (min-width: 992px)`: `--breakpoint-lg: 992px` (variante `lg:`)
- `@media (min-width: 1200px)`: `--breakpoint-xl: 1200px` (variante `xl:`)
- `@media (min-width: 1400px)`: `--breakpoint-2xl: 1400px` (variante `2xl:`)

*Nota: Não criar breakpoints arbitrários fora destes 6 valores padronizados.*

## 6. Gatilho Inteligente de Segurança (Semgrep MCP)

- **Ao escrever ou editar código (`write_to_file` / `replace_file_content`):** Executa APENAS a ferramenta `semgrep_scan` do MCP `semgrep` nos ficheiros `.vue`, `.ts`, `.js` e `nuxt.config.ts` alterados e corrige de imediato as vulnerabilidades reportadas.
- **Formato de Caminho WSL:** Como o MCP `semgrep` corre em WSL (Ubuntu), converte o caminho Windows (`C:\...` ou `F:\...`) para formato WSL (`/mnt/c/...` ou `/mnt/f/...`), passando o argumento `code_files: [{"path": "/mnt/..."}]`.
- **Ao alterar dependências (`package.json`, `pnpm-lock.yaml`):** Executa também `semgrep_scan_supply_chain`.

## 7. Matriz de Skills do Projeto (10 Skills)

Carrega apenas as skills estritamente necessárias para a tarefa em curso:

1. `nuxt-vue-development` (própria): Desenvolvimento de páginas, layouts duplos (`stay.vue` vs `shop.vue`), rotas Nitro e `useAsyncData`.
2. `tailwind-css-development` (própria): Estruturação de classes utilitárias e respeito pelas media queries definidas.
3. `gsap-nuxt-animation` (própria): Animações editoriais da quinta, transições de imagem e ciclo de vida (`gsap.context()` e `ctx.revert()`).
4. `ui-ux-designer`: Definição de layouts, contraste visual de secções, grelha responsiva e hierarquia de informação.
5. `ui-visual-validator`: Validação visual responsiva e sem desformatações nos ecrãs de telemóvel e desktop.
6. `stripe-integration`: Configuração dos endpoints de pagamento e formulário seguro de checkout no mesmo domínio.
7. `performance-engineer`: Auditoria de LCP, CLS, INP, Priority Hints e política de cache.
8. `seo-meta-optimizer`: Metadados Open Graph, canónicas e esquemas JSON-LD (`LodgingBusiness` e `Product`).
9. `wcag-audit-patterns`: Conformidade com acessibilidade WCAG 2.2 AA (navegação por teclado e formulários).
10. `typescript-pro`: Tipagem estrita de modelos de dados, carrinho e contratos de API.

## 8. Checkout no Mesmo Domínio & Guestcentric

- **Guestcentric Hypercommerce:** A barra de reserva comunica por query parameters ou script carregado de forma diferida (`async`/`defer`). Nunca deve bloquear o carregamento principal da página (LCP).
- **Checkout da Loja:** Processado via rota interna `/loja/checkout` usando endpoints Nitro protegidos. Chaves secretas da API residem exclusivamente em `runtimeConfig` e variáveis de ambiente no servidor. Nunca exponhas chaves privadas no cliente.

## 9. Performance & Priority Hints

- **LCP:** Apenas a imagem principal do Hero do Alojamento ou do produto em destaque tem `fetchpriority="high"`.
- **Imagens Secundárias:** Todas as fotos de galerias e listas de produtos usam `<NuxtImg>` com `loading="lazy"` e `fetchpriority="low"`.
- **Prevenção de CLS:** Todas as imagens devem ter dimensões `width` e `height` (ou `aspect-ratio`) previamente definidas.

## 10. Auditoria Cloudflare (Apenas no Final)

- **Momento:** A skill de auditoria Cloudflare será ativada **SÓ E APENAS no final do projeto**, quando todo o desenvolvimento estiver concluído e o utilizador o solicitar expressamente. Durante a construção diária, a segurança é garantida unicamente pelo MCP `semgrep`.
