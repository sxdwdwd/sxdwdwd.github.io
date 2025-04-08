// 广告位
// 广告数组
var ads = [
  {
    image: "../static/img/k2.gif",
    link: "https://www.xuexi.cn/",
    description: ""
  },
  {
    image: "../static/img/k3.gif",
    link: "https://ccgg.pro/",
    description: ""
  },
  {
    image: "../static/img/k1.gif",
    link: "https://ikun.cm/",
    description: ""
  },
  {
    image: "../static/img/k4.gif",
    link: "https://hl40.co/",
    description: ""
  },
  {
    image: "../static/img/k5.gif",
    link: "https://ikun.cm/",
    description: ""
  },
  // {
  //   image: "https://jsd.cdn.noisework.cn/gh/rcy1314/tuchuang@main/20230818/2321312.1o5qd8jb6elc.jpg",
  //   link: "https://",
  //   description: "超量收录-Noise导航"
  // }
  
];

// 随机打乱广告数组
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

ads = shuffle(ads);

// 创建广告容器
var adContainer = document.createElement("div");
adContainer.className = "ad-container";

// 创建图片元素
var adImage = document.createElement("img");
adImage.className = "ad-image";
adContainer.appendChild(adImage);

// 创建文字说明元素
var adDescription = document.createElement("div");
adDescription.className = "ad-description";
adContainer.appendChild(adDescription);

// 创建链接元素
var adLink = document.createElement("a");
adLink.className = "ad-link";
adLink.target = "_blank";
adContainer.appendChild(adLink);

// 创建关闭按钮
var closeButton = document.createElement("div");
closeButton.className = "close-button";
closeButton.textContent = "X关闭";
adContainer.appendChild(closeButton);

// 将广告容器添加到页面中
document.body.appendChild(adContainer);

// 显示广告容器
function showAd() {
  adContainer.classList.add("show");
}

// 隐藏广告容器
function hideAd() {
  adContainer.classList.remove("show");
}

// 添加一个变量来跟踪广告是否已经显示过
var adDisplayed = false;

// 当前广告索引
var currentIndex = 0;

// 更换图片、链接和文字说明的函数
function changeAd() {
  // 更新图片、链接和文字说明
  var nextIndex = (currentIndex + 1) % ads.length;
  var nextAd = ads[nextIndex];
  adImage.src = nextAd.image;
  adLink.href = nextAd.link;
  adDescription.textContent = nextAd.description;

  // 更新当前索引
  currentIndex = nextIndex;

  // 如果广告尚未显示过，则添加"点击查看广告"的文本节点
  if (!adDisplayed) {
    adDisplayed = true;
  }

  // 显示广告容器
  showAd();
}

// 关闭广告的函数
function closeAd() {
  hideAd();
  document.body.removeChild(adContainer); // 从DOM中移除广告容器
}

// 延迟2.5秒后立即弹出广告
setTimeout(changeAd, 2500);

// 定时器，每隔5秒更换图片、链接和文字说明
setInterval(changeAd, 5000);

// 绑定关闭按钮的点击事件
closeButton.addEventListener("click", closeAd);
