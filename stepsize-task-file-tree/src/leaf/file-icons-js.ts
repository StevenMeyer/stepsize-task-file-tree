export interface FileIconsJs {
  getClass(name: string, options?: Partial<{
    array: false;
    color: boolean;
  }>): Promise<string>;
  getClass(name: string, options: {
    array: true;
    color?: boolean;
  }): Promise<string[]>;
}

export type WindowWithIcons = Window & typeof globalThis & { icons: FileIconsJs };