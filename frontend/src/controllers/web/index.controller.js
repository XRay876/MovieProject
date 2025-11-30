// function home(req, res) {
//   const { flash } = req.query;
//   const url = flash ? `/movies?flash=${encodeURIComponent(flash)}` : '/movies';
//   return res.redirect(url);
// }

// export {
//   home
// };

function home(req, res) {
  return res.render('home/home', {});
}

export {
  home
};