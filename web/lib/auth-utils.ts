export function logout() {
  // Clear localStorage
  localStorage.removeItem('admin_auth');
  localStorage.clear();
  sessionStorage.clear();
  
  // Redirect to login page
  window.location.href = '/login';
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('admin_auth') === 'true';
}