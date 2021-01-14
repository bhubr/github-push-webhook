// eslint-disable-next-line no-undef
const socket = io()

const getData = (msg) => {
  const { name, ...rest } = JSON.parse(msg)
  const sanitizedName = name.replace('/', '--')
  return { name, sanitizedName, ...rest }
}

socket.on('push', (msg) => {
  const { name, sanitizedName, pushedBranch, ...rest } = getData(msg)
  const log = document.querySelector(`#pane-${sanitizedName} code`)
  log.innerHTML += `Received push: ${pushedBranch}\n`
})
socket.on('install', (msg) => {
  const { sanitizedName, stdout } = getData(msg)
  const log = document.querySelector(`#pane-${sanitizedName} code`)
  log.innerHTML += `\nInstalling deps:\n${stdout}\n`
})
socket.on('build', (msg) => {
  const { sanitizedName, stdout } = getData(msg)
  const log = document.querySelector(`#pane-${sanitizedName} code`)
  log.innerHTML += `\nBuilding:\n${stdout}\n`
})

// eslint-disable-next-line no-undef
const fetchProjects = () => fetch('/api/projects')
  .then(res => {
    if (!res.ok) throw new Error('could not fetch projects')
    return res.json()
  })

const activatePane = id => {
  const selectedLink = document.getElementById(id)
  const tabLinks = document.querySelectorAll('#tab-links a')
  for (const link of tabLinks) {
    if (link === selectedLink) {
      selectedLink.classList.add('active')
    } else {
      link.classList.remove('active')
    }
  }
  const selectedPane = document.getElementById(`pane-${id}`)
  const panes = document.querySelectorAll('.pane')
  for (const pane of panes) {
    pane.style.display = pane === selectedPane ? 'block' : 'none'
  }
}

const buildUi = (projects) => {
  // tab links
  const tabLinks = projects.map(p => {
    const sanitizedName = p.name.replace('/', '--')
    const tabLink = document.createElement('A')
    tabLink.id = sanitizedName
    tabLink.href = `#${sanitizedName}`
    tabLink.innerText = p.name
    return tabLink
  })

  const linksContainer = document.createElement('div')
  linksContainer.id = 'tab-links'
  for (const link of tabLinks) {
    linksContainer.appendChild(link)
  }

  // tab panes
  const tabPanes = projects.map(p => {
    const sanitizedName = p.name.replace('/', '--')
    const pane = document.createElement('div')
    pane.id = `pane-${sanitizedName}`
    pane.classList.add('pane')
    pane.innerHTML = `
      <h2>${p.name}</h2>
      <pre><code></code></pre>
    `
    return pane
  })

  const panesContainer = document.createElement('div')
  panesContainer.id = 'tab-panes'
  for (const pane of tabPanes) {
    panesContainer.appendChild(pane)
  }

  for (const link of tabLinks) {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      activatePane(e.target.id)
    })
  }

  const container = document.getElementById('tabs')
  container.appendChild(linksContainer)
  container.appendChild(panesContainer)
}
fetchProjects().then(projects => {
  buildUi(projects)
})
