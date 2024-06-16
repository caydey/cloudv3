export interface FileStats {
  path: string;
  name: string;
  location?: string; // not set if folder
  type: string;
  size: number;
  modified: number;
  mime: string;
  children?: FileStats[];
  free?: number;
  total?: number;
}
