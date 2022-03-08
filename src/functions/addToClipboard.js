export const addToClipboard = (canvas) => {
    canvas.toBlob(function (blob) {
        const item = new window.ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]);
    });
};
