const imageLoader = () => {
    const img = document.querySelectorAll('img');
    for (var i = 0; i < img.length; i++) {
        img[i].onload = function() {
            const parent = this.parentElement;
            parent.classList.add('image-loaded');
        }
    }
}
imageLoader();
