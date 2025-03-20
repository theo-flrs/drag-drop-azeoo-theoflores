<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import ContentEditor from './components/ContentEditor.vue';
import PhonePreview from './components/PhonePreview.vue';
import type { Section } from './types';

// ========================================
// DONNÉES INITIALES
// ========================================
// Données de contenu par défaut lors du premier chargement de l'application
// ou si aucune donnée n'est trouvée dans le localStorage
const defaultSections: Section[] = [
  {
    id: 'section-1',
    title: 'Nouvelle section',
    components: [
      {
        id: 'component-1',
        type: 'text',
        content: 'Entrez votre texte ici'
      },
      {
        id: 'component-2',
        type: 'image',
        content: '',
        imageUrl: 'https://placehold.co/400'
      }
    ]
  },
  {
    id: 'section-2',
    title: 'Fonctionnalités',
    components: [
      {
        id: 'component-3',
        type: 'list',
        content: [
          'Glisser-déposer des composants',
          'Aperçu en temps réel',
          'Édition simple',
          'Stockage persistant dans le localStorage'
        ]
      }
    ]
  }
];

// ========================================
// ÉTAT RÉACTIF
// ========================================
// Variable réactive qui contiendra toutes les sections
const sections = ref<Section[]>([]);

// ========================================
// GESTION DU STOCKAGE LOCAL
// ========================================
// Clé utilisée pour sauvegarder/récupérer les données dans localStorage
const STORAGE_KEY = 'contentBuilderSections';

/**
 * Charge les données depuis localStorage
 */
const loadFromStorage = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : null;
  } catch (e) {
    console.error('Erreur lors du chargement des données:', e);
    return null;
  }
};

/**
 * Sauvegarde les données dans localStorage
 * @param data - Les sections à sauvegarder
 */
const saveToStorage = (data: Section[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Erreur lors de la sauvegarde des données:', e);
  }
};

// ========================================
// CYCLE DE VIE
// ========================================
// Au montage du composant, charge les données depuis localStorage
// ou utilise les données par défaut si aucune donnée n'est trouvée
onMounted(() => {
  const savedSections = loadFromStorage();
  sections.value = savedSections || [...defaultSections];
});

// ========================================
// RÉACTIVITÉ
// ========================================
// Observe les changements sur "sections" et sauvegarde automatiquement
// dans le localStorage à chaque modification
watch(sections, saveToStorage, { deep: true });
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
    <header class="container-content mb-8">
      <div class="flex items-center gap-2 mb-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h1 class="text-2xl font-bold text-slate-900">Drag & Drop - AZEOO</h1>
      </div>
      <p class="text-slate-500 ml-8">Glissez / déposez des composants pour créer votre contenu</p>
    </header>

    <main class="container-content">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Panneau gauche: Éditeur de contenu -->
        <div class="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
          <ContentEditor v-model="sections" />
        </div>
        
        <!-- Panneau droit: Aperçu mobile -->
        <div class="relative min-h-[calc(100vh-12rem)]">
          <PhonePreview :sections="sections" />
        </div>
      </div>
    </main>

    <!-- Pied de page -->
    <footer class="container-content mt-12 pt-6 border-t border-slate-200 text-center text-slate-400 text-sm">
      Conçu pour AZEOO par Théo Florès
    </footer>
  </div>
</template>
