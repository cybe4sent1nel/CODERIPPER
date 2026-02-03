// Type declarations for @babel/standalone
declare module '@babel/standalone' {
  export interface TransformOptions {
    presets?: string[];
    filename?: string;
    [key: string]: any;
  }

  export interface TransformResult {
    code: string;
    map?: any;
    ast?: any;
  }

  export function transform(code: string, options?: TransformOptions): TransformResult;
  export function registerPreset(name: string, preset: any): void;
  export function registerPlugin(name: string, plugin: any): void;
  export const availablePresets: string[];
  export const availablePlugins: string[];
}
