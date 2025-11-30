(function () {
  const message = window.__FLASH_MESSAGE__;
  if (!message) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('toast--visible');
  });

  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => {
      toast.remove();
    }, 400); 
  }, 3000);
})();