# Tá Uma Lua Pra Cada 🌙
![License](https://img.shields.io/badge/license-MIT-green)


Uma aplicação web para consultar clima e previsões de forma rápida, com busca por cidade e histórico de pesquisas.

🔗 **Live Demo:** [https://ta-uma-lua-pra-cada.vercel.app/](https://ta-uma-lua-pra-cada.vercel.app/)

🛠 **Stack:** React + TypeScript + Vite (APIs de clima e geocoding)

---

## ✨ Funcionalidades

- Buscar clima por cidade
- Exibir condições atuais e previsão
- Histórico de cidades pesquisadas
- Tratamento de estados: loading / erro / vazio

---

## 🖼️ Preview

![Home](docs/screenshots/home.png)
![Busca](docs/screenshots/search.png)

---

## 🧭 Como funciona (arquitetura rápida)

### Fluxo principal

1. Usuário digita uma cidade
2. A aplicação resolve as coordenadas (Geocoding)
3. A API de clima é consultada com latitude e longitude
4. A UI renderiza os dados e salva no histórico

---

## 📁 Estrutura do projeto

```text
.
├── docs/
│   └── screenshots/        # Imagens usadas no README
├── public/                 # Arquivos públicos (ícones, imagens)
├── src/
│   ├── assets/             # Imagens e assets visuais
│   ├── components/         # Componentes reutilizáveis da UI
│   │   ├── ErrorBoundary.jsx
│   │   ├── Footer.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── RecentSearches.jsx
│   │   ├── SearchForm.jsx
│   │   ├── WeatherCard.jsx
│   │   └── WeatherIcon.jsx
│   ├── App.jsx             # Componente raiz da aplicação
│   ├── main.jsx            # Ponto de entrada (React + Vite)
│   └── index.css           # Estilos globais
├── index.html              # HTML base
├── vite.config.js          # Configuração do Vite
├── tailwind.config.js      # Configuração do Tailwind CSS
└── package.json
z
```

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js (versão LTS recomendada)

### Instalação

```bash
git clone https://github.com/GuilhermeFreitasOliver/TaUmaLuaPraCada.git
cd TaUmaLuaPraCada
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
cp .env.example .env
```

### Executar

```bash
npm run dev
```

---

## 🗺️ Roadmap

- [x] Modo escuro
- [ ] Favoritar cidades
- [ ] Cache de resultados com localStorage (10–30 min)
- [ ] Melhorias de acessibilidade (aria-live, foco)

---

## 📄 Licença

Este projeto está sob a licença MIT.
