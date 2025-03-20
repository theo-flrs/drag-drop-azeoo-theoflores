<script setup lang="ts">
import { computed } from "vue";
import draggable from "vuedraggable"; // Bibliothèque pour le glisser-déposer
import type { Section, ComponentType, ContentComponent } from "../types";

// ========================================
// PROPS & ÉMISSIONS
// ========================================
// Accepte un tableau de sections comme prop via v-model
const props = defineProps<{
  modelValue: Section[];
}>();

// Définit l'émetteur d'événements pour v-model, permettant la mise à jour des données entre le parent et l'enfant
const emit = defineEmits(["update:modelValue"]);

// ========================================
// GESTION RÉACTIVE DES SECTIONS
// ========================================
// - get: récupère les données depuis les props
// - set: émet un événement pour mettre à jour le parent
const sections = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// ========================================
// UTILITAIRES
// ========================================
/**
 * Génère un ID unique avec préfixe, timestamp et caractères aléatoires
 * Utilisé pour les nouvelles sections et composants
 */
const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

// ========================================
// GESTION DES SECTIONS
// ========================================
/**
 * Ajoute une nouvelle section vide
 * Crée un ID unique et un titre par défaut
 */
const addSection = () => {
  const newSection: Section = {
    id: generateId("section"),
    title: `Section ${sections.value.length + 1}`,
    components: [],
  };
  sections.value = [...sections.value, newSection];
};

/**
 * Supprime une section par son ID
 * Utilise filter pour créer un nouveau tableau sans cette section
 */
const removeSection = (sectionId: string) =>
  (sections.value = sections.value.filter((section) => section.id !== sectionId));

/**
 * Met à jour une propriété spécifique d'une section
 */
const updateSection = <K extends keyof Section>(sectionId: string, key: K, value: Section[K]) => {
  const index = sections.value.findIndex((s) => s.id === sectionId);
  if (index === -1) return;

  // Créer une copie pour que Vue détecte la modification
  const updatedSections = [...sections.value];
  updatedSections[index][key] = value;
  sections.value = updatedSections;
};

/**
 * Trouve un composant par son ID de section et son ID de composant
 * Retourne le composant et son indice dans le tableau
 */
const getComponent = (sectionId: string, componentId: string) => {
  const sectionIndex = sections.value.findIndex((s) => s.id === sectionId);
  if (sectionIndex === -1) return null;

  const componentIndex = sections.value[sectionIndex].components.findIndex(
    (c) => c.id === componentId
  );
  if (componentIndex === -1) return null;

  return {
    component: sections.value[sectionIndex].components[componentIndex],
    sectionIndex,
    componentIndex,
  };
};

// ========================================
// GESTION DES COMPOSANTS
// ========================================
/**
 * Ajoute un nouveau composant à une section
 * Le type détermine le contenu par défaut et les propriétés spécifiques
 */
const addComponent = (sectionId: string, type: ComponentType) => {
  const sectionIndex = sections.value.findIndex((s) => s.id === sectionId);
  if (sectionIndex === -1) return;

  // Contenu par défaut selon le type de composant
  const defaultContent = {
    text: "Nouveau contenu texte",
    list: ["Élément 1", "Élément 2", "Élément 3"],
    image: "",
  };

  // Création du nouveau composant avec son type et son contenu
  const newComponent: ContentComponent = {
    id: generateId("component"),
    type,
    content: defaultContent[type],
    ...(type === "image" ? { imageUrl: "https://placehold.co/400" } : {}),
  };

  const updatedSections = [...sections.value];
  updatedSections[sectionIndex].components.push(newComponent);
  sections.value = updatedSections;
};

/**
 * Supprime un composant d'une section
 */
const removeComponent = (sectionId: string, componentId: string) => {
  const sectionIndex = sections.value.findIndex((s) => s.id === sectionId);
  if (sectionIndex === -1) return;

  const updatedSections = [...sections.value];
  updatedSections[sectionIndex].components = updatedSections[sectionIndex].components.filter(
    (c) => c.id !== componentId
  );
  sections.value = updatedSections;
};

/**
 * Met à jour une propriété spécifique d'un composant
 */
const updateComponent = <K extends keyof ContentComponent>(
  sectionId: string,
  componentId: string,
  key: K,
  value: ContentComponent[K]
) => {
  const result = getComponent(sectionId, componentId);
  if (!result) return;

  const { sectionIndex, componentIndex } = result;
  const updatedSections = [...sections.value];
  updatedSections[sectionIndex].components[componentIndex][key] = value;
  sections.value = updatedSections;
};

// ========================================
// FONCTIONS POUR COMPOSANTS DE TYPE LISTE
// ========================================
/**
 * Met à jour un élément spécifique dans une liste
 */
const updateListItem = (sectionId: string, componentId: string, index: number, value: string) => {
  const result = getComponent(sectionId, componentId);
  if (!result || result.component.type !== "list") return;

  const newList = [...(result.component.content as string[])];
  newList[index] = value;
  updateComponent(sectionId, componentId, "content", newList);
};

/**
 * Supprime un élément d'une liste
 */
const removeListItem = (sectionId: string, componentId: string, index: number) => {
  const result = getComponent(sectionId, componentId);
  if (!result || result.component.type !== "list") return;

  const newList = (result.component.content as string[]).filter((_, i) => i !== index);
  updateComponent(sectionId, componentId, "content", newList);
};

/**
 * Ajoute un nouvel élément vide à une liste
 */
const addListItem = (sectionId: string, componentId: string) => {
  const result = getComponent(sectionId, componentId);
  if (!result || result.component.type !== "list") return;

  const newList = [...(result.component.content as string[]), "Nouvel élément"];
  updateComponent(sectionId, componentId, "content", newList);
};
</script>

<template>
  <div class="p-4 bg-slate-100 rounded-lg h-full overflow-auto">
    <div class="flex justify-between items-center mb-6">
      <h2
        class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
        Éditeur de contenu
      </h2>
      <button
        @click="addSection"
        class="px-4 py-2 rounded-md bg-primary-500 text-white font-medium hover:shadow-lg hover:translate-y-(-1px) transition-all">
        <span class="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ajouter une section
        </span>
      </button>
    </div>

    <draggable
      v-model="sections"
      group="sections"
      item-key="id"
      class="space-y-5"
      animation="300"
      handle=".section-handle">
      <template #item="{ element: section }">
        <div
          class="bg-white rounded-lg shadow-sm p-5 border border-slate-200 transition-all hover:shadow-md">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-2">
              <button
                class="section-handle cursor-move text-slate-400 hover:text-primary-500 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 8h16M4 16h16" />
                </svg>
              </button>
              <input
                v-model="section.title"
                @input="updateSection(section.id, 'title', section.title)"
                class="font-semibold text-lg border-0 border-b-2 border-transparent focus:ring-0 focus:border-primary-500 bg-transparent" />
            </div>
            <button
              @click="removeSection(section.id)"
              class="p-1.5 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <draggable
            v-model="section.components"
            group="components"
            item-key="id"
            class="space-y-4"
            animation="300"
            handle=".component-handle">
            <template #item="{ element: component }">
              <div
                class="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:shadow-sm transition-all">
                <div class="flex justify-between items-center mb-3">
                  <div class="flex items-center gap-2">
                    <button
                      class="component-handle cursor-move text-slate-400 hover:text-primary-500 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 8h16M4 16h16" />
                      </svg>
                    </button>
                    <span
                      class="text-sm font-medium capitalize px-2 py-1 bg-slate-200 rounded-full text-slate-700">
                      {{
                        component.type === "text"
                          ? "texte"
                          : component.type === "list"
                          ? "liste"
                          : "image"
                      }}
                    </span>
                  </div>
                  <button
                    @click="removeComponent(section.id, component.id)"
                    class="p-1 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div v-if="component.type === 'text'" class="mt-3">
                  <textarea
                    :value="component.content as string"
                    @input="
                      updateComponent(
                        section.id,
                        component.id,
                        'content',
                        ($event.target as HTMLTextAreaElement).value
                      )
                    "
                    class="w-full p-3 border border-slate-200 rounded-lg text-sm min-h-[100px] focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Saisissez votre texte ici..."></textarea>
                </div>

                <div v-if="component.type === 'list'" class="mt-3 space-y-2">
                  <draggable
                    v-model="component.content"
                    item-key="index"
                    @change="updateComponent(section.id, component.id, 'content', component.content)"
                    class="space-y-2"
                    handle=".item-handle"
                    animation="150">
                    <template #item="{element: item, index}">
                      <div class="flex items-center gap-2">
                        <button
                          class="item-handle cursor-move text-slate-400 hover:text-primary-500 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M4 8h16M4 16h16" />
                          </svg>
                        </button>
                        <input
                          :value="item"
                          @input="
                            updateListItem(
                              section.id,
                              component.id,
                              index,
                              ($event.target as HTMLInputElement).value
                            )
                          "
                          class="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Élément de liste..." />
                        <button
                          @click="removeListItem(section.id, component.id, index)"
                          class="p-1 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </template>
                  </draggable>
                  <button
                    @click="addListItem(section.id, component.id)"
                    class="w-full p-3 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:bg-slate-100 hover:border-primary-500 hover:text-primary-500 transition-colors">
                    <span class="flex items-center justify-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Ajouter un élément
                    </span>
                  </button>
                </div>

                <div v-if="component.type === 'image'" class="mt-3">
                  <div class="mb-3">
                    <input
                      :value="component.imageUrl"
                      @input="
                        updateComponent(
                          section.id,
                          component.id,
                          'imageUrl',
                          ($event.target as HTMLInputElement).value
                        )
                      "
                      class="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                      placeholder="URL de l'image..." />
                  </div>
                  <div class="aspect-video bg-slate-200 rounded-lg overflow-hidden">
                    <img
                      :src="component.imageUrl"
                      alt="Aperçu"
                      class="w-full h-full object-cover transition-opacity hover:opacity-95" />
                  </div>
                </div>
              </div>
            </template>
          </draggable>

          <div class="flex gap-2 mt-5">
            <button
              @click="addComponent(section.id, 'text')"
              class="flex-1 py-2.5 px-2 text-sm rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors flex items-center justify-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Texte
            </button>
            <button
              @click="addComponent(section.id, 'list')"
              class="flex-1 py-2.5 px-2 text-sm rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors flex items-center justify-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Liste
            </button>
            <button
              @click="addComponent(section.id, 'image')"
              class="flex-1 py-2.5 px-2 text-sm rounded-lg bg-slate-200 hover:bg-slate-300 transition-colors flex items-center justify-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Image
            </button>
          </div>
        </div>
      </template>
    </draggable>

    <div
      v-if="sections.length === 0"
      class="p-8 text-center bg-white rounded-lg shadow-sm border border-dashed border-slate-300 mt-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-12 w-12 text-slate-300 mx-auto mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <p class="text-slate-500 mb-4">
        Aucune section pour l'instant. Ajoutez une section pour commencer.
      </p>
      <button
        @click="addSection"
        class="px-5 py-2.5 rounded-lg bg-primary-500 text-white font-medium hover:shadow-lg transition-all">
        <span class="flex items-center justify-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ajouter une première section
        </span>
      </button>
    </div>
  </div>
</template>
