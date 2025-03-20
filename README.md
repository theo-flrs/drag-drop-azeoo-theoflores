# Drag & Drop - AZEOO

Une application moderne de création de contenu en drag & drop avec prévisualisation en temps réel sur mobile.

## Temps passé sur le projet
- 2 jours

## Fonctionnalités

- Ajout de composants texte, liste et image pour créer du contenu
- Organisation des composants en sections
- Glisser-déposer pour réorganiser les composants au sein des sections ou entre elles
- Aperçu en temps réel au format mobile
- Édition facile du contenu
- Sauvegarde automatique dans le localStorage

## Technologies utilisées

- Vue 3 avec la Composition API
- TypeScript pour le typage
- Tailwind CSS v4 pour le styling
- Vuedraggable pour la fonctionnalité de glisser-déposer
- Vite comme outil de build

## Architecture du projet

```
drag-drop-azeoo-theoflores/
├── public/              # Fichiers statiques
├── src/
│   ├── assets/          # Images et ressources
│   ├── components/      # Composants Vue
│   │   ├── ContentEditor.vue    # Éditeur principal avec glisser-déposer
│   │   └── PhonePreview.vue     # Prévisualisation mobile
│   ├── App.vue          # Composant racine
│   ├── main.ts          # Point d'entrée
│   ├── types.ts         # Types TypeScript
│   └── styles.css       # Styles globaux
├── index.html
└── vite.config.ts       # Configuration Vite
```

## Démarrage rapide

```bash
# Cloner le dépôt
git clone [URL_DU_DEPOT]
cd drag-drop-azeoo-theoflores

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

```

## Utilisation

1. Ajoutez des sections en utilisant le bouton "Ajouter une section"
2. Ajoutez des composants (texte, liste, image) à chaque section
3. Modifiez le contenu des composants
4. Glissez-déposez les composants pour les réorganiser
5. Visualisez l'aperçu en temps réel sur la partie droite

## Fonctionnement technique

- L'application utilise Vue 3 avec la Composition API pour une gestion efficace de l'état
- Les données sont persistantes grâce au stockage dans le localStorage
- Le système de drag & drop est implémenté avec la bibliothèque vuedraggable
- L'interface est responsive et adaptée aux différentes tailles d'écran
- Le design utilise les fonctionnalités modernes de Tailwind CSS v4
