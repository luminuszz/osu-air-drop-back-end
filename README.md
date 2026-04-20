# 🚀 OsuAirDrop

**OsuAirDrop** é uma solução de transferência de arquivos pessoal, privada e de alta performance, projetada para conectar perfeitamente seus dispositivos móveis e desktops. Utilizando uma arquitetura híbrida com **P2P (WebRTC)** para velocidade e um **servidor centralizado (NestJS)** para histórico e persistência, o OsuAirDrop é a sua nuvem pessoal definitiva.

---

## 🌟 Funcionalidades

- [x] **Ecossistema Multi-plataforma:** - 📱 Mobile: App nativo para Android/iOS (React Native + Expo).
  - 💻 Desktop: Interface moderna para Windows, Linux (Arch Linux optimized) e macOS (Electron + React).
- [x] **Transferência P2P Inteligente:** Uso de WebRTC para envio direto entre aparelhos na mesma rede (ou via STUN/TURN em redes distintas), garantindo privacidade e velocidade.
- [x] **Nuvem Pessoal:** Opção de armazenamento centralizado para acesso a arquivos mesmo quando o dispositivo de origem está offline.
- [x] **Histórico Completo:** Registro detalhado de todas as transferências realizadas entre seus dispositivos vinculados.
- [x] **Criptografia de Ponta a Ponta:** Segurança nativa via protocolos DTLS/SRTP do WebRTC.

---

## 🛠️ Stack Tecnológica

### Backend (Core & Signaling)
- **Framework:** NestJS (TypeScript)
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL
- **Real-time:** Socket.io (WebSockets) para sinalização e notificações.
- **Infra:** Docker & Docker Compose.

### Frontend (Desktop & Mobile)
- **Desktop:** Electron + React (TypeScript) + Tailwind CSS.
- **Mobile:** React Native (Expo) + TypeScript.
- **P2P:** WebRTC API.

---

## 🏗️ Arquitetura do Sistema

A aplicação é dividida em módulos independentes para facilitar a manutenção e escalabilidade:

1.  **Auth Module:** Gerenciamento de sessões e pareamento de novos dispositivos via QR Code.
2.  **Devices Module:** Rastreamento de aparelhos vinculados e status de conexão (Online/Offline).
3.  **Files Module:** Gerenciamento de metadados, uploads centralizados e lógica de streaming de download.
4.  **Events Module:** Gateway de sinalização WebRTC para estabelecer conexões P2P.

---

## 🚀 Como Executar

### 1. Clonar o repositório
```bash
git clone [https://github.com/seu-usuario/osuairdrop.git](https://github.com/seu-usuario/osuairdrop.git)
cd osuairdrop
