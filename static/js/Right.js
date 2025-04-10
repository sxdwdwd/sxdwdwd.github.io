window.onload = () => {
    const menu = document.querySelector('.menu')
    const menuHeight = menu.offsetHeight - parseInt(getComputedStyle(menu)['paddingTop']) - parseInt(getComputedStyle(menu)['paddingBottom'])
    menu.style.height = '0'

    openMenu = e => {
        e.preventDefault()

        menu.style.left = `${e.clientX}px`
        menu.style.top = `${e.clientY + 5}px`
        menu.style.height = `${menuHeight}px`
        menu.classList.add('is-active')

        return false
    }

    colseMenu = () => {
        menu.style.height = '0'
        menu.classList.remove('is-active')
    }

    window.onclick = () => colseMenu()
}
let isFullScreen = false;

function toggleFullScreen() {
    if (!isFullScreen) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
        isFullScreen = true;
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        isFullScreen = false;
    }
}

function copyContent() {
    const textToCopy = document.documentElement.innerHTML;
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            console.log('Text copied to clipboard');
        })
        .catch((error) => {
            console.error('Failed to copy text:', error);
        });
}

function refreshPage() {
    location.reload();
}

function goBack() {
    window.history.back();
}

function changeMode() {
    // Your code to change the mode goes here
}
// function showImage(imgElement) {
//     var overlay = document.createElement("div");
//     overlay.style.position = "fixed";
//     overlay.style.top = "0";
//     overlay.style.left = "0";
//     overlay.style.width = "100%";
//     overlay.style.height = "100%";
//     overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
//     overlay.style.zIndex = "9999";
//     overlay.onclick = function() {
//         document.body.removeChild(overlay);
//     };

//     var image = document.createElement("img");
//     image.src = imgElement.src; 
//     image.style.position = "absolute";
//     image.style.top = "50%";
//     image.style.left = "50%";
//     image.style.transform = "translate(-50%, -50%)";
//     image.style.maxWidth = "90%";
//     image.style.maxHeight = "90%";

//     overlay.appendChild(image);
//     document.body.appendChild(overlay);
// }

function showImage(imgElement) {
    const overlay = document.createElement("div");
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.8);
        z-index: 9999;
        cursor: zoom-out;
    `;

    const image = document.createElement("img");
    image.src = imgElement.src;
    image.style.cssText = `
        position: absolute;
        top: 50%; left: 50%;
        max-width: 90vw; max-height: 90vh;
        transform: translate(-50%, -50%) scale(1);
        transform-origin: center center;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
        touch-action: none;
    `;

    let scale = 1, offsetX = 0, offsetY = 0;
    let lastX, lastY, isDragging = false, doubleToggle = false;

    const updateTransform = () => {
        image.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${scale})`;
    };

    // PC 拖拽
    image.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isDragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        image.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        offsetX += e.clientX - lastX;
        offsetY += e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        updateTransform();
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        image.style.cursor = "grab";
    });

    // PC 滚轮缩放
    overlay.addEventListener("wheel", (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        scale = Math.min(Math.max(0.2, scale + delta), 5);
        updateTransform();
    }, { passive: false });

    // PC 双击缩放
    image.addEventListener("dblclick", (e) => {
        e.stopPropagation();
        if (!doubleToggle) {
            scale = 2;
        } else {
            scale = 1;
            offsetX = offsetY = 0;
        }
        doubleToggle = !doubleToggle;
        updateTransform();
    });

    // 移动端触摸缩放 + 拖动
    let startDist = 0, startScale = 1, startX = 0, startY = 0;

    image.addEventListener("touchstart", (e) => {
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            startDist = Math.hypot(dx, dy);
            startScale = scale;
        } else if (e.touches.length === 1) {
            lastX = e.touches[0].clientX;
            lastY = e.touches[0].clientY;
        }
    }, { passive: false });

    image.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.hypot(dx, dy);
            scale = Math.min(Math.max(0.2, startScale * (dist / startDist)), 5);
            updateTransform();
        } else if (e.touches.length === 1) {
            const touch = e.touches[0];
            offsetX += touch.clientX - lastX;
            offsetY += touch.clientY - lastY;
            lastX = touch.clientX;
            lastY = touch.clientY;
            updateTransform();
        }
    }, { passive: false });

    // 点击遮罩关闭
    overlay.onclick = () => document.body.removeChild(overlay);
    image.onclick = e => e.stopPropagation();

    overlay.appendChild(image);
    document.body.appendChild(overlay);
}

