
# 🎯 GIFA — Gestion Intelligente des Finances et Activités

**GIFA** est une application web moderne conçue pour aider les PME, indépendants, commerçants et organisations à suivre leurs finances, gérer leurs factures, analyser leurs revenus/dépenses et optimiser leur activité, le tout depuis un tableau de bord simple et intuitif.

---

## 🚀 Fonctionnalités principales

- ✅ Dashboard en temps réel avec graphiques
- ✅ Suivi des revenus, dépenses et bénéfices
- ✅ Gestion de la facturation client
- ✅ Assistant IA (version pro)
- ✅ UI moderne responsive (dark/light mode)
- ✅ Version SaaS et version code-source dispo

---

## 📦 Technologies utilisées

- **Frontend** : React, TypeScript, Vite, Tailwind CSS  
- **Backend** : Node.js (Express ou équivalent)  
- **Base de données** : MongoDB / PostgreSQL (selon version)  
- **UI** : ShadCN, Lucide Icons, Chart.js, etc.

---

## ⚙️ Installation locale

### 1. Cloner le dépôt
```bash
git clone https://github.com/ton-utilisateur/gifa.git
cd gifa
```

### 2. Installer les dépendances
```bash
npm install
# ou
pnpm install
```

### 3. Lancer le frontend (React)
```bash
cd client
npm run dev
```

### 4. Lancer le backend (si version incluse)
```bash
cd server
npm run dev
```

---

## 🔧 Configuration

Crée un fichier `.env` à partir de `.env.example` et configure les variables suivantes :

```env
# Exemple .env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gifa
JWT_SECRET=supersecretkey
```

---

## 🧪 Données de test

Tu peux activer le mode "démo" avec des données simulées en utilisant la variable :
```env
USE_MOCK_DATA=true
```

---

## 📌 Notes

- Le module `AIAssistant` est **réservé à la version pro**.
- Certaines sections sont en cours de développement : `Rapports`, `Paiements`, etc.

---

## 📬 Contact

📞 WhatsApp : +243 990 918 934  
📧 Email : overcomeeha@gmail.com
