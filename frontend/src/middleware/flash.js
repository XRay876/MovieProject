import { getFlashMessage } from '../utils/flash.js';

function flash(req, res, next) {
  const key = req.query && req.query.flash;
  res.locals.flashMessage = key ? getFlashMessage(key) : null;
  next();
}

export default flash;