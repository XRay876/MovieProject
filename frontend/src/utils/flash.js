const FLASH_MESSAGES = {
  'login-success': 'Logged in successfully.',
  'register-success': 'Account created successfully. Welcome!',
  'logout-success': 'You have been logged out.',
  'movie-created': 'Movie was created successfully.',
  'movie-updated': 'Movie was updated successfully.',
  'movie-deleted': 'Movie was deleted.'
};

export function getFlashMessage(key) {
  return FLASH_MESSAGES[key] || null;
}