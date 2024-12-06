export interface MenuItemType {
  id: string;
  text: string;
  icon: React.ReactNode;
  path: string;
  requiresAuth: boolean;
}