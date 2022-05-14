export const canvasFromSVG = (svg) => {
  return new Promise((resolve, reject) => {
    // get outerHTML
    let outerHTMLSVG = svg.outerHTML;
    // add namespace
    if (!outerHTMLSVG.match(/xmlns="/im)) {
      outerHTMLSVG = outerHTMLSVG.replace(
        "<svg ",
        '<svg xmlns="http://www.w3.org/2000/svg" '
      );
    }
    // create blob
    const blob = new Blob([outerHTMLSVG], {
      type: "image/svg+xml;charset=utf-8",
    });
    // create url
    const domURL = window.URL || window.webkitURL || window;
    const blobURL = domURL.createObjectURL(blob);
    // figure out the height and width from svg text
    let match = outerHTMLSVG.match(/height="(\d+)/m);
    const height = match && match[1] ? parseInt(match[1], 10) : 200;
    match = outerHTMLSVG.match(/width="(\d+)/m);
    const width = match && match[1] ? parseInt(match[1], 10) : 200;
    // create a canvas element to pass through
    const canvas = document.createElement("canvas");
    canvas.width = width + 5;
    canvas.height = height + 5;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.onload = function () {
      ctx.drawImage(this, 5, 5);
      // we don't need the original any more
      domURL.revokeObjectURL(blobURL);
      // download(canvas);
      resolve(canvas);
    };

    image.src = blobURL;
  });
};
