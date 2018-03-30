const COLOR_BACKGROUND = '#473D47';
const COLOR_BACKGROUND_CODE = '#685768';
const COLOR_TEXT = '#e4eaeb';
const COLOR_MUTED = '#927a92';
const COLOR_TEXT_LINK = '#ffde24';
const COLOR_TEXT_HIGHLIGHT = '#ffffff';
const COLOR_TEXT_HIGHLIGHT_DARKER = '#c4932d';

export const getChangelogStyles = selector => `
  body { background-color: transparent; }  
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
  ${selector} table tr { 
    background-color: ${COLOR_BACKGROUND} !important;
  }
  ${selector} h1 a,
  ${selector} h2 a {
    color: ${COLOR_TEXT_HIGHLIGHT_DARKER} !important;
  }
  ${selector} li strong, 
  ${selector} h2, 
  ${selector} h3, 
  ${selector} h4 {
    color: ${COLOR_TEXT_HIGHLIGHT} !important;
  }
  ${selector} li a, 
  ${selector} p a,
  .release-header p a { 
    color: ${COLOR_TEXT_LINK};
  }
  ${selector} .text-gray { 
    color: ${COLOR_MUTED} !important;
  }
  ${selector} code {
    background-color: ${COLOR_BACKGROUND_CODE} !important;
  }
  ${selector} pre {
    background-color: ${COLOR_BACKGROUND_CODE} !important;
    color: ${COLOR_TEXT} !important;
  }
  ${selector} pre > * {
    color: ${COLOR_TEXT} !important;
  }
`;
