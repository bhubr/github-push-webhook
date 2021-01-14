const getRepoInfo = (url) => {
  const httpsRegex = /https:\/\/github\.com\/(.*)\/(.*)(\.git)?/
  const gitRegex = /git@github.com:(.*)\/(.*)(\.git)?/
  const matches = url.match(httpsRegex) || url.match(gitRegex)
  if (!matches) throw new Error(`Not a repo: ${url}`)
  const [, username, repo] = matches
  return [username, repo]
}

module.exports = getRepoInfo
