export interface layoutProps {
  children?: any;
  statusBarColor?: 'white' | '#009655';
  checkPermissions?: boolean;
  hasPermissionSet?: any;
  useKeyboardScroll?: boolean;
  refreshable?: boolean;
  shouldRefresh?: () => void;
}
