import authService from '../services/auth.service.js';

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const userAgent = req.get('User-Agent');
    const ip = req.ip;

    const result = await authService.register({
      username,
      email,
      password,
      userAgent,
      ip
    });

    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { emailOrUsername, password } = req.body;
    const userAgent = req.get('User-Agent');
    const ip = req.ip;

    const result = await authService.login({
      emailOrUsername,
      password,
      userAgent,
      ip
    });

    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const userAgent = req.get('User-Agent');
    const ip = req.ip;

    const result = await authService.refresh({
      refreshToken,
      userAgent,
      ip
    });

    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    await authService.logout({ refreshToken });
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function logoutAll(req, res, next) {
  try {
    const userId = req.user.id;
    await authService.logoutAll({ userId });
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await authService.getMe(userId);
    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { username } = req.body;
    const updatedUser = await authService.updateUser(userId, { username });
    return res.status(200).json({ user: updatedUser });
  } catch (err) {
    return next(err);
  }
}

async function deleteAccount(req, res, next) {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    await authService.deleteAccount(userId, password);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

export default {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  me,
  updateProfile,
  deleteAccount
};
