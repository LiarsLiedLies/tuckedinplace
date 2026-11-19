export const dashboardPath = (role) =>
  ({ USER: '/user/dashboard', OWNER: '/owner/dashboard', ADMIN: '/admin/dashboard' }[role] || '/login');