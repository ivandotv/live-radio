window.addEventListener('online', () => {
  window.clearInterval(checkNetworkInterval)
  window.location.reload()
})

async function checkNetwork() {
  try {
    const response = await fetch('./')
    if (response.status >= 200 && response.status < 500) {
      window.clearInterval(checkNetworkInterval)
      window.location.reload()
    }
  } catch {}
}

const checkNetworkInterval = window.setInterval(checkNetwork, 2000)
