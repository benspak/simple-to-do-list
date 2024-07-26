document.getElementById('sync').addEventListener('click', function () {
  chrome.runtime.sendMessage({ action: 'sync' });
});
