export {
  getCurrentUser as getMe,
  getCurrentUser as getCurrentUserProfile,
  login,
  loginWithFirebase,
  logout,
  normalizeAuthResponse as normalizeUserProfile,
  register,
  updateCurrentUser as updateCurrentUserProfile,
} from "./auth.api";
