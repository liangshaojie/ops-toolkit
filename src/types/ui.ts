// UI相关的类型定义
export interface UIComponent {
  id: string;
  type: 'text' | 'table' | 'chart' | 'form' | 'layout';
  props?: Record<string, unknown>;
  children?: UIComponent[];
}

export interface LayoutProps {
  direction: 'horizontal' | 'vertical';
  padding?: number;
  border?: boolean;
  title?: string;
}

export interface TableProps {
  headers: string[];
  rows: string[][];
  sortable?: boolean;
  filterable?: boolean;
}

export interface ChartProps {
  type: 'line' | 'bar' | 'pie';
  data: ChartData[];
  title?: string;
  width?: number;
  height?: number;
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'select' | 'checkbox' | 'radio';
  required?: boolean;
  options?: string[];
  defaultValue?: string | number | boolean;
}

export interface Theme {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  background: string;
  foreground: string;
}

export interface AppState {
  currentPage: string;
  loading: boolean;
  error?: string;
  data: Record<string, unknown>;
}
