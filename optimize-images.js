const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

imagemin(['public/images/*.png'], 'public/images-min', {
  use: [imageminPngquant()]
}).then(() => {
  console.log('Images optimized');
});
