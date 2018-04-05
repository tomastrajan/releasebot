import fs from 'fs';

const logo = new Buffer(
  fs.readFileSync('./public/images/logo-watermark.png')
).toString('base64');

export const getChangelogStyles = (selector, theme) => `
  body { background-color: transparent; }  
  .file {
    border: 0 !important;
  }
  ${selector} { 
    width: 93% !important;
    border: 0 !important; 
    margin: 40px 40px 70px 40px; 
    padding: 30px !important;
    box-shadow: rgba(0, 0, 0, 0.55) 0px 20px 68px; 
    border-radius: 5px  !important; 
    background-color: ${theme.background} !important;
    background-size: 96px 96px;
    background-image: url(data:image/png;base64,${logo}) !important;
    background-blend-mode: ${theme.backgroundBlending};
    background-repeat: no-repeat;
    background-position: top 15px right 10px;
    color: ${theme.text};
  } 
  ${selector} table tr { 
    background-color: ${theme.background} !important;
  }
  ${selector} li strong, 
  ${selector} h2, 
  ${selector} h3, 
  ${selector} h4 {
    border: 0 !important;
    color: ${theme.textHighlight} !important;
  }
  ${selector} .project-name {
    color: ${theme.textHighlightDarker} !important;
    padding: 0 5px 0 0;
  }
  ${selector} h1,
  ${selector} h1 a,
  ${selector} h2 a {
    border: 0 !important;
    color: ${theme.textHighlightDarker} !important;
  }
  ${selector} li a, 
  ${selector} p a,
  .release-header p a { 
    color: ${theme.textLink};
  }
  ${selector} .text-gray { 
    color: ${theme.textMuted} !important;
  }
  ${selector} code {
    background-color: ${theme.backgroundCode} !important;
  }
  ${selector} pre {
    background-color: ${theme.backgroundCode} !important;
    color: ${theme.text} !important;
  }
  ${selector} pre > * {
    color: ${theme.text} !important;
  }
  ${selector} .release-butler-signature {
    position: relative;
    top: 45px;
    margin: 0 -30px;
    padding: 15px 0 20px 0;
    text-align: center;
    font-size: 16px !important;
    color: ${theme.textFooter};
    background-color: ${theme.backgroundFooter};
    border-radius: 0 0 5px 5px  !important; 
  }
  ${selector} .release-butler-signature span {
    display: inline-block;
    margin: 0 20px;
  }
  ${selector} .release-butler-signature span svg {
    fill: ${theme.textFooter};
    height: 20px;
    margin: 0 3px 0 0;
    position: relative;
    top: 5px;
  }
  ${selector} .release-butler-signature span.twitter svg {
    height: 24px;
    margin: 0;
    top: 6px;
  }
`;
