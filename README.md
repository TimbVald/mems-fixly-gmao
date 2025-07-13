# Configuration de l'Authentification

## Vue d'ensemble

Ce projet utilise **Better Auth** avec Prisma pour gérer l'authentification. Le système supporte :
- Authentification par email/mot de passe
- Authentification sociale (Google)
- Sessions sécurisées
- Rôles utilisateur (ADMIN, TECHNICIAN)

## Configuration requise

### Variables d'environnement

Créez un fichier `.env.local` avec les variables suivantes :

```env
# Base de données
DATABASE_URL="postgresql://username:password@localhost:5432/gmao_builder"

# Better Auth
BETTER_AUTH_SECRET="votre-clé-secrète-ici"

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID="votre-google-client-id"
GOOGLE_CLIENT_SECRET="votre-google-client-secret"

# URL de l'application (pour la production)
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"
```

### Configuration de la base de données

1. Assurez-vous que PostgreSQL est installé et en cours d'exécution
2. Créez une base de données pour le projet
3. Exécutez les migrations Prisma :

```bash
npx prisma generate
npx prisma db push
```

## Fonctionnalités implémentées

### ✅ Authentification par email/mot de passe
- Inscription avec validation des champs
- Connexion avec gestion d'erreurs
- Validation côté client avec Zod
- Messages d'erreur en français

### ✅ Authentification sociale
- Connexion avec Google (configurée mais nécessite les clés API)
- Interface utilisateur pour les boutons sociaux

### ✅ Gestion des sessions
- Sessions sécurisées avec Better Auth
- Stockage en base de données
- Gestion des tokens

### ✅ Interface utilisateur
- Formulaires de connexion et d'inscription
- Validation en temps réel
- Messages d'erreur personnalisés
- Design responsive

## Structure des fichiers

```
src/
├── components/auth/
│   ├── SignInForm.tsx    # Formulaire de connexion
│   └── SignUpForm.tsx    # Formulaire d'inscription
├── lib/
│   ├── auth.ts          # Configuration Better Auth
│   └── auth-client.ts   # Client d'authentification
├── server/
│   └── users.ts         # Fonctions d'authentification
└── app/api/auth/
    └── [...all]/
        └── route.ts      # Routes API d'authentification
```

## Prochaines étapes

1. **Configurer Google OAuth** :
   - Créer un projet Google Cloud
   - Configurer les identifiants OAuth
   - Ajouter les variables d'environnement

2. **Ajouter la vérification email** :
   - Configurer un service d'email (SendGrid, etc.)
   - Activer `requireEmailVerification: true` dans `auth.ts`

3. **Implémenter la récupération de mot de passe** :
   - Créer la page de réinitialisation
   - Configurer l'envoi d'emails

4. **Sécuriser les routes** :
   - Ajouter des middlewares de protection
   - Gérer les redirections selon les rôles

## Test de la configuration

1. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```

2. Testez l'inscription :
   - Allez sur `/signup`
   - Remplissez le formulaire
   - Vérifiez que l'utilisateur est créé en base

3. Testez la connexion :
   - Allez sur `/signin`
   - Connectez-vous avec les identifiants créés
   - Vérifiez la redirection vers le dashboard

## Dépannage

### Erreurs courantes

1. **Erreur de base de données** :
   - Vérifiez que PostgreSQL est en cours d'exécution
   - Vérifiez l'URL de connexion dans `DATABASE_URL`

2. **Erreur d'authentification** :
   - Vérifiez que `BETTER_AUTH_SECRET` est défini
   - Redémarrez le serveur après modification des variables d'environnement

3. **Erreur Google OAuth** :
   - Vérifiez que les clés Google sont correctes
   - Vérifiez que l'URL de redirection est configurée dans Google Cloud

### Logs utiles

Les erreurs d'authentification sont loggées dans la console du serveur. Vérifiez les logs pour diagnostiquer les problèmes. 