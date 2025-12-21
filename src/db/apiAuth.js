import { api, setToken, removeToken } from "./supabase";

/**
 * Login user
 */
export async function login({ email, password }) {
  const response = await api('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });

  if (response.token) {
    setToken(response.token);
  }

  return response;
}

/**
 * Signup user - sends verification OTP
 */
export async function signup({ name, email, password, profile_pic }) {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  if (profile_pic) {
    formData.append('profilePic', profile_pic);
  }

  const response = await api('/api/auth/signup', {
    method: 'POST',
    body: formData
  });

  return response;
}

/**
 * Verify email with OTP
 */
export async function verifyEmail({ email, otp }) {
  const response = await api('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email, otp })
  });

  if (response.token) {
    setToken(response.token);
  }

  return response;
}

/**
 * Resend OTP
 */
export async function resendOtp({ email, type = 'verify' }) {
  const response = await api('/api/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email, type })
  });

  return response;
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await api('/api/auth/me');
    return response.user;
  } catch (error) {
    // If token is invalid, clear it
    removeToken();
    return null;
  }
}

/**
 * Logout user
 */
export async function logout() {
  removeToken();
}

/**
 * Forgot password - sends reset OTP
 */
export async function forgotPassword({ email }) {
  const response = await api('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  });

  return response;
}

/**
 * Reset password with OTP
 */
export async function resetPassword({ email, otp, newPassword }) {
  const response = await api('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp, newPassword })
  });

  return response;
}

/**
 * Update user profile
 */
export async function updateProfile({ name, profilepic }) {
  const formData = new FormData();
  if (name) formData.append('name', name);
  if (profilepic) formData.append('profilePic', profilepic);

  const response = await api('/api/auth/update-profile', {
    method: 'PUT',
    body: formData
  });

  return response;
}