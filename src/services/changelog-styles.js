const COLOR_BACKGROUND = '#322931';
const COLOR_BACKGROUND_CODE = '#473D47';
const COLOR_TEXT = '#e4eaeb';
const COLOR_TEXT_LINK = '#ffde24';
const COLOR_TEXT_HIGHLIGHT = '#ffffff';
const COLOR_TEXT_HIGHLIGHT_DARKER = '#c4932d';

export const getChangelogStyles = selector => `
  .file {
    border: 0 !important;
  }
  ${selector} { 
    width: 93% !important;
    border: 0 !important; 
    margin: 40px 40px 70px 40px; 
    box-shadow: rgba(0, 0, 0, 0.55) 0px 20px 68px; 
    border-radius: 5px  !important; 
    background-color: ${COLOR_BACKGROUND} !important;
    color: ${COLOR_TEXT};
  }
  ${selector} h1 a {
    color: ${COLOR_TEXT_HIGHLIGHT_DARKER};
  }
  ${selector} li strong, 
  ${selector} h2, 
  ${selector} h3, 
  ${selector} h4 {
    color: ${COLOR_TEXT_HIGHLIGHT};
  }
  ${selector} li a, .release-header p a {
    color: ${COLOR_TEXT_LINK};
  }
  ${selector} code {
    background-color: ${COLOR_BACKGROUND_CODE} !important;
  }
  ${selector} pre {
    background-color: ${COLOR_BACKGROUND_CODE} !important;
  }
`;
