export const download = (canvas) => {
    var a = document.createElement('a');
    a.download = 'image.png';
    a.href = canvas.toDataURL('image/png');
    document.body.appendChild(a);
    a.click();
};
