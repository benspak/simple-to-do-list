chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'sync') {
    syncWithServer();
  }
});

function syncWithServer() {
  chrome.storage.local.get({ todos: [] }, function (result) {
    fetch('https://your-external-server.com/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ todos: result.todos })
    })
    .then(response => response.json())
    .then(data => {
      chrome.storage.local.set({ todos: data.todos });
    })
    .catch(error => console.error('Error syncing with server:', error));
  });
}
