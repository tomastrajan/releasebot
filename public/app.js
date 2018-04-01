const $footerYear = document.querySelector('.footer .year');
const $actionAddLibrary = document.querySelector('.action-add-library');
const $signup = document.querySelector('.signup');
const $twitterTimelinePlaceholder = document.querySelector(
  '.twitter-timeline-placeholder'
);

const $changelogFormFeedback = document.querySelector('#changelog-feedback');
const $changelogFormSubmit = document.querySelector('#changelog-submit');
const $changelogFormSpinner = document.querySelector('#changelog-spinner');
const $changelogFormType = document.querySelector('#changelog-type');
const $changelogFormRepo = document.querySelector('#changelog-repo');
const $changelogFormVersion = document.querySelector('#changelog-version');
const $changelogImage = document.querySelector('#changelog-image');
const $changelogDownload = document.querySelector('#changelog-download');

let changelogBlobUrl;

$footerYear.innerText = new Date().getFullYear();

$actionAddLibrary.addEventListener(
  'click',
  () => ($signup.style.height = 'auto')
);

$changelogFormSubmit.addEventListener('click', event => {
  event.preventDefault();
  const e = encodeURIComponent;
  const type = $changelogFormType.value;
  const repo = $changelogFormRepo.value;
  const version = $changelogFormVersion.value;
  const filename = `changelog-${repo}-${version}.png`;
  const params = `type=${type}&repo=${e(repo)}&version=${e(version)}`;
  if (!!type && !!repo && !!version) {
    analytics('download-changelog', repo, version);
    console.log('Download changelog', type, repo, version);
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
});

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
