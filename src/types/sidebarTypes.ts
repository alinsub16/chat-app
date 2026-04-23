export type ActiveView = 'Chat' | 'Calendar' | 'Notify';

export interface MenuItem {
  name: ActiveView;
  icon: React.ReactNode;
  badge?: number;
}