# Guide de Dépannage - Problèmes d'Authentification

## Problèmes Résolus

### ✅ 1. Configuration des Variables d'Environnement
- **Problème** : Variables d'environnement manquantes
- **Solution** : Fichier `.env.local` créé avec toutes les variables nécessaires
- **Action** : Modifiez les valeurs dans `.env.local` selon votre configuration

### ✅ 2. Positionnement de l'Icône de Mot de Passe
- **Problème** : Icône œil mal positionnée dans les formulaires
- **Solution** : Structure HTML corrigée dans `SignInForm.tsx` et `SignUpForm.tsx`

### ✅ 3. Protection des Routes
- **Problème** : Accès non autorisé aux pages protégées
- **Solution** : Middleware créé pour gérer l'authentification automatiquement
- **Fichier** : `middleware.ts`

### ✅ 4. Vérification de Session
- **Problème** : Pas de vérification de session côté client
- **Solution** : Composant `AuthGuard` créé et intégré au layout admin

## Configuration Requise

### 1. Base de Données PostgreSQL

```bash
# Installer PostgreSQL (si pas déjà fait)
# Windows : Télécharger depuis https://www.postgresql.org/download/windows/
# Créer une base de données
psql -U postgres
CREATE DATABASE gmao_builder;
```

### 2. Variables d'Environnement

Modifiez le fichier `.env.local` :

```env
# Remplacez par vos vraies valeurs
DATABASE_URL="postgresql://votre_utilisateur:votre_mot_de_passe@localhost:5432/gmao_builder"
BETTER_AUTH_SECRET="votre-clé-secrète-très-longue-et-sécurisée"
RESEND_API_KEY="votre-clé-resend-pour-les-emails"
```

### 3. Initialisation de la Base de Données

```bash
# Exécuter le script de configuration
node setup-db.js

# Ou manuellement :
npm install
npx drizzle-kit generate
npx drizzle-kit push
```

## Tests de Fonctionnement

### 1. Test de Connexion
1. Allez sur `http://localhost:3001/signin`
2. Essayez de vous connecter
3. Vérifiez la redirection vers le dashboard

### 2. Test d'Inscription
1. Allez sur `http://localhost:3001/signup`
2. Créez un nouveau compte
3. Vérifiez la création en base de données

### 3. Test de Protection des Routes
1. Essayez d'accéder à `http://localhost:3001/dashboard` sans être connecté
2. Vous devriez être redirigé vers `/signin`

## Problèmes Courants et Solutions

### ❌ Erreur "Database connection failed"
**Cause** : PostgreSQL n'est pas démarré ou URL incorrecte
**Solution** :
```bash
# Vérifier que PostgreSQL fonctionne
psql -U postgres -c "SELECT version();"
# Corriger l'URL dans .env.local
```

### ❌ Erreur "BETTER_AUTH_SECRET is required"
**Cause** : Variable d'environnement manquante
**Solution** : Générer une clé secrète
```bash
# Générer une clé secrète
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### ❌ Compilation en boucle
**Cause** : Erreurs TypeScript ou imports circulaires
**Solution** : Vérifier les logs de compilation
```bash
npm run build
# Corriger les erreurs affichées
```

### ❌ Session non persistante
**Cause** : Configuration de cookies ou domaine incorrect
**Solution** : Vérifier la configuration dans `auth.ts`

## Commandes Utiles

```bash
# Redémarrer le serveur de développement
npm run dev

# Vérifier la base de données
npx drizzle-kit studio

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Voir les logs détaillés
npm run dev -- --verbose
```

## Support

Si les problèmes persistent :
1. Vérifiez les logs de la console navigateur (F12)
2. Vérifiez les logs du serveur dans le terminal
3. Testez avec une base de données vide
4. Vérifiez que toutes les dépendances sont installées

## Prochaines Étapes

1. **Configurer l'envoi d'emails** pour la vérification et récupération de mot de passe
2. **Ajouter la vérification email** obligatoire
3. **Configurer Google OAuth** avec de vraies clés
4. **Ajouter des tests automatisés** pour l'authentification