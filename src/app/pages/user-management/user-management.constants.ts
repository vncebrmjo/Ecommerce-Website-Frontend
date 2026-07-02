export interface NavLink {
  label: string;
  path: string;
}

export const userManagementNavLinks: NavLink[] = [
  { label: 'Landing Page', path: '/landing-page' },
  { label: 'Forbidden',    path: '/forbidden'    },
];
