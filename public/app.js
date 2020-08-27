const PROJECTS = [
  { type: 'github', repo: 'prettier/prettier', name: 'Prettier' },
  { type: 'github', repo: 'Microsoft/TypeScript', name: 'Typescript' },
  { type: 'github', repo: 'webpack/webpack', name: 'Webpack' },
  { type: 'github', repo: 'nestjs/nest', name: 'nest' },
  { type: 'github', repo: 'reactjs/redux', name: 'Redux' },
  { type: 'github', repo: 'facebook/react', name: 'React' },
  { type: 'github', repo: 'vuejs/vue', name: 'Vue' },
  { type: 'github', repo: 'emberjs/ember.js', name: 'Ember.js' },
  { type: 'changelog', repo: 'angular/angular', name: 'Angular' },
  { type: 'changelog', repo: 'ReactiveX/rxjs', name: 'RxJS' },
  { type: 'changelog', repo: 'mobxjs/mobx', name: 'MobX' }
];

const THEMES = [
  'default',
  'beach',
  'cupcake',
  'dracula',
  'forrest',
  'github',
  'material',
  'paraiso',
  'reggae'
];

const $footerYear = document.querySelector('.footer .year');
const $actionAddLibrary = document.querySelector('.action-add-library');
const $signup = document.querySelector('.signup');
const $twitterTimelinePlaceholder = document.querySelector(
  '.twitter-timeline-placeholder'
);

const $changelogFormFeedback = document.querySelector('#changelog-feedback');
const $changelogFormSubmit = document.querySelector('#changelog-submit');
const $changelogFormSpinner = document.querySelector('#changelog-spinner');
const $changelogFormName = document.querySelector('#changelog-name');
const $changelogFormTheme = document.querySelector('#changelog-theme');
const $changelogFormType = document.querySelector('#changelog-type');
const $changelogFormRepo = document.querySelector('#changelog-repo');
const $changelogFormPath = document.querySelector('#changelog-path');
const $changelogFormVersion = document.querySelector('#changelog-version');
const $changelogFormBranding = document.querySelector('#changelog-branding');
const $changelogImage = document.querySelector('#changelog-image');
const $changelogDownload = document.querySelector('#changelog-download');

const { type, repo, name } = getRandomItem(PROJECTS);
$changelogFormRepo.value = repo;
$changelogFormName.value = name;
$changelogFormType.value = type;

THEMES.forEach(theme => {
  const themeOption = document.createElement('option');
  themeOption.value = theme;
  themeOption.textContent = theme.replace(/\b\w/g, s => s.toUpperCase());
  $changelogFormTheme.appendChild(themeOption);
});
$changelogFormTheme.value = getRandomItem(THEMES);

let changelogBlobUrl;

$footerYear.innerText = new Date().getFullYear();

$actionAddLibrary.addEventListener(
  'click',
  () => ($signup.style.height = 'auto')
);

$changelogFormSubmit.addEventListener('click', downloadChangelog);

function downloadChangelog(event) {
  event.preventDefault();
  const e = encodeURIComponent;
  const type = $changelogFormType.value;
  const name = $changelogFormName.value;
  const theme = $changelogFormTheme.value;
  const repo = $changelogFormRepo.value;
  const path = $changelogFormRepo.path;
  const version = $changelogFormVersion.value;
  const branding = $changelogFormBranding.checked;
  const filename = `changelog-${repo}-${version}.png`;

  let params = `type=${type}&repo=${e(repo)}&path=${e(path||'')}&version=${e(
    version
  )}&theme=${theme}`;
  if (name) {
    params += `&name=${e(name)}`;
  }
  if (branding) {
    params += `&branding=${branding}`;
  }

  if (!!type && !!repo && !!version && !!theme) {
    analytics('download-changelog', repo, version, theme);
    console.log(
      'Download changelog',
      type,
      repo,
      name,
      version,
      theme,
      branding
    );
    downloadStart();
    fetch(`/changelog?${params}`)
      .then(fetchStatusHandler)
      .then(response => response.blob())
      .then(blob => {
        downloadEnd();
        displayBlob(blob, filename);
      })
      .catch(err => {
        downloadEnd(err);
        analytics('download-changelog', 'error');
        console.error('Download changelog', JSON.stringify(err));
      });
  }
}

function downloadStart() {
  $changelogImage.style.display = 'none';
  $changelogDownload.style.display = 'none';
  $changelogFormSubmit.style.display = 'none';
  $changelogFormSpinner.style.display = 'block';
  window.URL.revokeObjectURL(changelogBlobUrl);
}

function downloadEnd(err) {
  $changelogFormSubmit.style.display = 'block';
  $changelogFormSpinner.style.display = 'none';
  if (err) {
    $changelogFormFeedback.style.display = 'block';
    setTimeout(() => {
      $changelogFormFeedback.style.display = 'none';
    }, 5000);
  }
}

function displayBlob(blob, filename) {
  const imageBlob = new Blob([blob], { type: 'image/png' });
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(imageBlob);
    return;
  }
  changelogBlobUrl = window.URL.createObjectURL(imageBlob);
  $changelogDownload.href = changelogBlobUrl;
  $changelogDownload.download = filename;
  $changelogDownload.style.display = 'inline-block';
  $changelogImage.src = changelogBlobUrl;
  $changelogImage.style.display = 'block';
  setTimeout(
    () =>
      $changelogDownload.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    100
  );
}

function fetchStatusHandler(response) {
  if (response.status === 200) {
    return response;
  } else {
    throw new Error(response);
  }
}

function getRandomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function analytics(action, label, value) {
  gtag('event', action, {
    event_category: 'engagement',
    event_label: label,
    value
  });
}

window.twttr = {
  _e: [],
  ready(f) {
    this._e.push(f);
  }
};

window.twttr.ready(t =>
  t.events.bind('rendered', e => {
    e.target.style.opacity = 1;
    $twitterTimelinePlaceholder.style.display = 'none';
  })
);
