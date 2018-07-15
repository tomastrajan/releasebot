export const removeIrrelevantVersions = async (page, selector, version) =>
  page.evaluate(
    (selector, version) => {
      const finalVersion = version[0] === 'v' ? version.slice(1) : version;
      const isMatchingVersion = (node, version) => {
        const nodeVersion = node.innerText;
        const isPreReleaseVersion = /v?\d+\.\d+\.\d+-.*/.test(version);
        const isPreReleaseNodeVersion = /v?\d+\.\d+\.\d+-.*/.test(nodeVersion);
        if (isPreReleaseVersion) {
          return nodeVersion.includes(version);
        } else {
          return nodeVersion.includes(version) && !isPreReleaseNodeVersion;
        }
      };
      const isVersionNode = node =>
        ['h1', 'h2', 'h3', 'h4'].includes(node.nodeName.toLowerCase()) &&
        /v?\d+\.\d+\.\d+.*/.test(node.innerText);
      const nodes = document.querySelector(selector).childNodes;
      let isIrrelevantNode = true;
      Array.from(nodes)
        .filter(node => {
          if (!isIrrelevantNode && isVersionNode(node)) {
            isIrrelevantNode = true;
          }
          if (isVersionNode(node) && isMatchingVersion(node, finalVersion)) {
            isIrrelevantNode = false;
          }
          return isIrrelevantNode;
        })
        .forEach((node: ChildNode) => node.remove());
      if (!nodes.length) {
        throw new Error(`Version ${version} not found`);
      }
    },
    selector,
    version
  );

export const addProjectName = async (page, selector, type, name) =>
  page.evaluate(
    (selector, type, name) => {
      const isVersion = n => /v?\d+\.\d+\.\d+.*/.test(n.innerText);
      const container = document.querySelector(selector);
      const versionNode =
        type === 'github'
          ? container.querySelector('h1')
          : Array.from(container.childNodes).filter(n => isVersion(n))[0];
      const nameNode = document.createElement('span');
      nameNode.className = 'project-name';
      nameNode.textContent = name;
      versionNode.prepend(nameNode);
    },
    selector,
    type,
    name
  );

export const addBranding = async (page, selector) =>
  page.evaluate(selector => {
    const container = document.querySelector(selector);
    const signature = document.createElement('div');
    signature.className = 'release-butler-signature';
    signature.innerHTML = `
      <span class="twitter">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/></svg>
        @releasebutler
      </span>
      <span class="url">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 512V48C0 21.49 21.49 0 48 0h288c26.51 0 48 21.49 48 48v464L192 400 0 512z"/></svg>
        releasebutler.now.sh
      </span>
    `;
    container.appendChild(signature);
    container.classList.add('release-butler-logo');
  }, selector);
