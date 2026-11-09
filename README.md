# Quinta Vale da Roca — Boutique Hotel & Enoturismo

[![Website Oficial](https://img.shields.io/badge/Website%20Oficial-valedaroca.com-1D351B?style=for-the-badge&logo=googlechrome&logoColor=white)](https://valedaroca.com/pt/)
[![Nuxt 4](https://img.shields.io/badge/Nuxt-4.x-00DC82?style=for-the-badge&logo=nuxtdotjs&logoColor=white)](https://nuxt.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

### 🌐 Acesso Direto ao Website

> **Aceda ao website oficial da Quinta Vale da Roca:**  
> 👉 **[https://valedaroca.com/pt/](https://valedaroca.com/pt/)**

---

## 🌿 Sobre o Projeto

Plataforma digital integrada para a **Quinta Vale da Roca** (Sintra, Portugal), unificando num único ecossistema web de alta performance:

1. **Alojamento Boutique & Enoturismo (`/` e `/quartos`):**
   - Experiência visual contemplativa com design editorial requintado e tipografia clássica (*Cormorant Garamond* & *Inter*).
   - Apresentação de quartos, comodidades e reservas diretas integradas com o motor **Guestcentric Hypercommerce**.
   - Experiências vínicas e eventos na encosta de Sintra voltada para o Oceano Atlântico.

2. **Loja Online de Vinhos (`/loja`):**
   - Catálogo de colheitas exclusivas e vinhos de autor.
   - Carrinho persistente (gerido com Pinia).
   - Checkout nativo no mesmo domínio com integração segura Stripe Elements.

---

## 🛠️ Tecnologias

- **Framework:** [Nuxt 4](https://nuxt.com/) (Vue 3 com `<script setup lang="ts">`)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) (`@theme`) + [Nuxt UI](https://ui.nuxt.com/)
- **Animações:** [GSAP](https://greensock.com/gsap/) (ScrollTrigger) com respeito rigoroso por `prefers-reduced-motion`
- **Tipografia:** Cormorant Garamond & Inter via `@nuxt/fonts`
- **Imagens & Otimização:** `@nuxt/image` (formatos AVIF/WebP, LCP prioritário com `fetchpriority="high"`)
- **Ícones:** Solar Linear (`solar:`) & Phosphor Light (`ph:`)
- **Gestão de Estado:** [Pinia](https://pinia.vuejs.org/)
- **Pagamentos & Reservas:** Stripe Elements + Guestcentric Hypercommerce
- **Auditoria de Segurança:** Semgrep

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão LTS recomendada, 18+ ou 20+)
- [pnpm](https://pnpm.io/) (versão 9+)

### Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/davidmvg05/Quinta-Vale-da-Roca.git
cd Quinta-Vale-da-Roca

# 2. Instalar dependências
pnpm install

# 3. Iniciar o servidor de desenvolvimento
pnpm dev
```

O servidor local ficará disponível em `http://localhost:3000`.

### Scripts Disponíveis

- `pnpm dev` — Inicia o servidor local de desenvolvimento
- `pnpm build` — Compila a aplicação para produção
- `pnpm preview` — Pré-visualiza a build de produção localmente
- `pnpm typecheck` — Validação estrita de tipos TypeScript

---

## 📍 Localização & Contactos

- **Website:** [https://valedaroca.com/pt/](https://valedaroca.com/pt/)
- **Localização:** Sintra, Portugal
