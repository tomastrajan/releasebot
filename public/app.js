const $footerYear = document.querySelector('.footer .year');
const $actionAddLibrary = document.querySelector('.action-add-library');
const $signup = document.querySelector('.signup');

const $changelogFormFeedback = document.querySelector('#changelog-feedback');
const $changelogFormSubmit = document.querySelector('#changelog-submit');
const $changelogFormSpinner = document.querySelector('#changelog-spinner');
const $changelogFormType = document.querySelector('#changelog-type');
const $changelogFormRepo = document.querySelector('#changelog-repo');
const $changelogFormVersion = document.querySelector('#changelog-version');

$changelogFormSpinner.style.display = 'none';
$changelogFormFeedback.style.display = 'none';

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
    console.log('Download changelog', type, repo, version);
    downloadStart();
    fetch(`/changelog?${params}`)
      .then(fetchStatusHandler)
      .then(response => response.blob())
      .then(blob => {
        downloadEnd();
        downloadBlob(blob, filename);
      })
      .catch(err => {
        downloadEnd(err);
        console.error('Download changelog', JSON.stringify(err));
      });
  }
});

function downloadStart() {
  $changelogFormSubmit.style.display = 'none';
  $changelogFormSpinner.style.display = 'block';
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

function downloadBlob(blob, filename) {
  const newBlob = new Blob([blob], { type: 'image/png' });
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob);
    return;
  }
  const data = window.URL.createObjectURL(newBlob);
  const link = document.createElement('a');
  link.href = data;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(data)
  }, 100);
}

function fetchStatusHandler(response) {
  if (response.status === 200) {
    return response;
  } else {
    throw new Error(response);
  }
}
