<script setup lang="ts">
// ========================================
// IMPORTS ET PROPS
// ========================================
// Import du type Section défini dans le fichier types.ts
import type { Section } from '../types';

// Définition des props:
// sections - Tableau de sections à afficher dans la prévisualisation
defineProps<{
  sections: Section[];
}>();

</script>

<template>
  <div class="sticky top-0 flex flex-col items-center justify-start h-[calc(100vh-10rem)] p-6">
    <h3 class="text-lg font-semibold text-slate-700 mb-4 self-start">Aperçu en direct</h3>
    
    <div class="phone-preview relative scale-100 hover:scale-[1.02] transition-all duration-300">
      <div class="absolute top-0 left-0 right-0 h-8 bg-slate-800 flex items-center justify-center">
        <div class="w-28 h-4 bg-slate-900 rounded-b-xl"></div>
      </div>
      
      <div class="absolute top-2 left-0 right-0 px-5 flex justify-between items-center z-10 text-white text-xs">
        <div>9:41</div>
        <div class="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h8m0 0v8m0-8l-8 8" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        </div>
      </div>
      
      <div class="pt-10 h-full overflow-y-auto bg-white">
        <div class="p-4">
          <!-- Boucle sur chaque section -->
          <div v-for="section in sections" :key="section.id" class="mb-8">
            <h2 class="text-xl font-bold mb-4 text-slate-900 border-b border-slate-100 pb-2">{{ section.title }}</h2>
            
            <!-- Conteneur des composants de la section -->
            <div class="space-y-5">
              <!-- Boucle sur chaque composant -->
              <div v-for="component in section.components" :key="component.id" class="mb-4">
                <!-- RENDU CONDITIONNEL SELON LE TYPE DE COMPOSANT -->
                
                <!-- 1. Composant texte -->
                <div v-if="component.type === 'text'" class="prose text-slate-700">
                  <p>{{ component.content }}</p>
                </div>

                <!-- 2. Composant liste -->
                <div v-if="component.type === 'list'" class="space-y-2">
                  <ul class="list-disc pl-5 text-slate-700">
                    <li v-for="(item, index) in component.content" :key="index" class="mb-2">
                      {{ item }}
                    </li>
                  </ul>
                </div>

                <!-- 3. Composant image -->
                <div v-if="component.type === 'image'" class="overflow-hidden rounded-lg shadow-sm">
                  <img 
                    :src="component.imageUrl" 
                    alt="Image de contenu" 
                    class="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- État vide: affiché quand il n'y a pas de sections -->
          <div v-if="sections.length === 0" class="flex flex-col items-center justify-center h-[500px] text-center">
            <div class="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <!-- Message informatif -->
            <p class="text-slate-500">Ajoutez des sections et des composants pour voir l'aperçu</p>
          </div>
        </div>
      </div>
      
      <!-- Barre inférieure (indicateur du type "home" de l'Iphone) -->
      <div class="absolute bottom-0 left-0 right-0 h-1 bg-slate-300 rounded-full mx-auto w-1/3"></div>
    </div>
  </div>
</template> 