import authClient from '../../api/auth.client.js';
import ApiError from '../../utils/ApiError.js';

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

function getCookieOptions(req) {
  const isSecure = req.app.get('env') === 'production';
  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/'
  };
}

function setAuthCookies(res, req, tokens) {
  const cookieOpts = getCookieOptions(req);

  res.cookie(ACCESS_COOKIE, tokens.accessToken, {
    ...cookieOpts
  });

  res.cookie(REFRESH_COOKIE, tokens.refreshToken, {
    ...cookieOpts
  });
}

function clearAuthCookies(res, req) {
  const cookieOpts = getCookieOptions(req);
  res.clearCookie(ACCESS_COOKIE, cookieOpts);
  res.clearCookie(REFRESH_COOKIE, cookieOpts);
}

function showLoginForm(req, res) {
  if (req.user) {
    return res.redirect('/movies');
  }
  return res.render('auth/login', { errors: [], values: {} });
}

function showRegisterForm(req, res) {
  if (req.user) {
    return res.redirect('/movies');
  }
  return res.render('auth/register', { errors: [], values: {} });
}

async function register(req, res, next) {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const userAgent = req.get('User-Agent');
    const ip = req.ip;

    const data = await authClient.register({
      username,
      email,
      password,
      confirmPassword,
      userAgent,
      ip
    });

    setAuthCookies(res, req, data.tokens);
    return res.redirect('/movies?flash=register-success');
  } catch (err) {
    const errors = (err.details || []).map(e => ({
      msg: e.message || e.msg || err.message,
      field: e.field || e.param
    }));

    return res
      .status(err.statusCode || 400)
      .render('auth/register', {
        errors: errors.length ? errors : [{ msg: err.message }],
        values: req.body
      });
  }
}

async function login(req, res, next) {
  try {
    const { emailOrUsername, password } = req.body;
    const userAgent = req.get('User-Agent');
    const ip = req.ip;

    const data = await authClient.login({
      emailOrUsername,
      password,
      userAgent,
      ip
    });

    setAuthCookies(res, req, data.tokens);
    return res.redirect('/movies?flash=login-success');
  } catch (err) {
    const errors = (err.details || []).map(e => ({
      msg: e.message || e.msg || err.message,
      field: e.field || e.param
    }));

    return res
      .status(err.statusCode || 400)
      .render('auth/login', {
        errors: errors.length ? errors : [{ msg: err.message }],
        values: req.body
      });
  }
}

async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies && req.cookies[REFRESH_COOKIE];
    if (refreshToken) {
      await authClient.logout({ refreshToken });
    }
    clearAuthCookies(res, req);
    return res.redirect('/movies/?flash=logout-success');
  } catch (err) {
    clearAuthCookies(res, req);
    return res.redirect('/movies/?flash=logout-success');
  }
}

async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies && req.cookies[REFRESH_COOKIE];
    if (!refreshToken) {
      throw new ApiError(401, 'No refresh token');
    }

    const userAgent = req.get('User-Agent');
    const ip = req.ip;

    const data = await authClient.refresh({
      refreshToken,
      userAgent,
      ip
    });

    setAuthCookies(res, req, data.tokens);

    return res.json({
      user: data.user,
      tokens: data.tokens
    });
  } catch (err) {
    clearAuthCookies(res, req);
    return next(
      err instanceof ApiError
        ? err
        : new ApiError(err.statusCode || 401, err.message)
    );
  }
}

async function showProfile(req, res) {
  if (!req.user) {
    return res.redirect('/auth/login');
  }
  return res.render('auth/profile', { user: req.user });
}

async function showEditProfileForm(req, res) {
  if (!req.user) {
    return res.redirect('/auth/login');
  }
  return res.render('auth/profile-edit', { user: req.user });
}

async function updateProfile(req, res, next) {
  try {
    const { username } = req.body;
    const token = req.cookies[ACCESS_COOKIE];

    const { user: updatedUser } = await authClient.updateProfile(token, username);
    
    // Redirect to profile with a success message (optional: use flash messages)
    // For now, simply redirect and the attachUser middleware will fetch the latest user
    return res.redirect('/profile');
  } catch (err) {
    const errors = (err.details || []).map(e => ({
      msg: e.message || e.msg || err.message,
      field: e.field || e.param
    }));

    return res
      .status(err.statusCode || 400)
      .render('auth/profile-edit', { // Changed to render profile-edit
        errors: errors.length ? errors : [{ msg: err.message }],
        user: req.user // Pass existing user data back to the template
      });
  }
}

async function showDeleteAccountForm(req, res) {
  if (!req.user) {
    return res.redirect('/auth/login');
  }
  return res.render('auth/profile-delete', { user: req.user });
}

async function deleteAccount(req, res, next) {
  try {
    const { password } = req.body;
    const token = req.cookies[ACCESS_COOKIE];

    await authClient.deleteAccount(token, password);
    clearAuthCookies(res, req); // Clear cookies after successful deletion
    return res.redirect('/'); // Redirect to homepage
  } catch (err) {
    const errors = (err.details || []).map(e => ({
      msg: e.message || e.msg || err.message,
      field: e.field || e.param
    }));

    return res
      .status(err.statusCode || 400)
      .render('auth/profile-delete', {
        errors: errors.length ? errors : [{ msg: err.message }],
        user: req.user // Pass existing user data back to the template
      });
  }
}

export {
  showLoginForm,
  showRegisterForm,
  register,
  login,
  logout,
  refresh,
  showProfile,
  updateProfile,
  showEditProfileForm,
  showDeleteAccountForm,
  deleteAccount
};