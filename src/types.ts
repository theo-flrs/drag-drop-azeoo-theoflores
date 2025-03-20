export type ComponentType = 'text' | 'list' | 'image';

export interface ContentComponent {
  id: string;
  type: ComponentType;
  content: string | string[];
  imageUrl?: string;
}

export interface Section {
  id: string;
  title: string;
  components: ContentComponent[];
} 