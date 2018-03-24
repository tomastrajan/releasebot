const COLOR_BACKGROUND = '#322931';
const COLOR_BACKGROUND_CODE = '#473D47';
const COLOR_TEXT = '#e4eaeb';
const COLOR_TEXT_LINK = '#ffde24';
const COLOR_TEXT_HIGHLIGHT = '#ffffff';
const COLOR_TEXT_HIGHLIGHT_DARKER = '#c4932d';

export const githubReleaseStyles = `
  .release-meta { display: none; } 
  .release-body { 
    width: 93% !important;
    border: 0 !important; 
    margin: 40px 30px; 
    box-shadow: rgba(0, 0, 0, 0.55) 0px 20px 68px; 
    border-radius: 5px; 
    background-color: ${COLOR_BACKGROUND};
    color: ${COLOR_TEXT};
  }
  .release-body h1 a {
    color: ${COLOR_TEXT_HIGHLIGHT_DARKER};
  }
  .release-body li strong, 
  .release-body h2, 
  .release-body h3, 
  .release-body h4 {
    color: ${COLOR_TEXT_HIGHLIGHT};
  }
  .release-body li a, .release-header p a {
    color: ${COLOR_TEXT_LINK};
  }
  .release-body code {
    background-color: ${COLOR_BACKGROUND_CODE} !important;
  }
  .release-body pre {
    background-color: ${COLOR_BACKGROUND_CODE} !important;
  }
`;

export const changelogReleaseStyles = '.markdown-body h1 { padding-top: 1000px }';

export const changelogReleaseOffsetOption = {
  shotOffset: {
    left: 40,
    right: 40,
    top: 1680,
    bottom: 0
  }
};
