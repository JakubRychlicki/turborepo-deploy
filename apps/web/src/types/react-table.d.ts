import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface TableMeta<TData> {
    total: number;
  }
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    label?: string;
    type?: string;
  }
}