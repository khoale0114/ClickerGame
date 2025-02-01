// script.js
let score = 0;
let all_score = score;
let click = 0.2;
let cps = 0;
let chef = 0;
let farmer = 0;
let miner = 0;
let factory = 0;
let bank = 0;
let temple = 0;
let wizard = 0;
let space = 0;
let portal = 0;
let time = 0;
let light = 0;
let lastUpdateTime = Date.now();

const scoreDisplay = document.getElementById('score');
const clickButton = document.getElementById('clickButton');
const upgradesList = document.getElementById('upgrades-list');
const achievementsList = document.getElementById('achievements-list'); // Thêm phần tử để hiển thị achievements
const shopList = document.getElementById("shop-list");
const toastContainer = document.getElementById('toast-container'); // Phần tử chứa thông báo


const shopItems = [
  {
    name: "🥇 Super Chef",
    cost: 1200,
    description: "Điểm click và CPS sẽ bằng số điểm click * CPS",
    effect: () => {
      click = click * cps; // Nhân điểm click lên số CPS hiện tại
      cps = click * cps; // Tăng giá trị click lên 5
    }
  },
  {
    name: "✨ Golden Click",
    cost: 2800,
    description: "Tăng giá trị mỗi lần click lên 30.",
    effect: () => click += 30
  },
  {
    name: "🔍 Tuyển chọn",
    cost: 2000,
    description: "Tăng CPS lên 10",
    effect: () => cps += 10
  },
  {
    name: "🛠️ Sửa chữa",
    cost: 6800,
    description: "Tăng giá trị mỗi lần click lên 80.",
    effect: () => click += 80
  }
];


// Danh sách nâng cấp có thể mua nhiều lần
const upgrades = [
  { name: '🎯 Luyện tập', cost: 10, level: 0, type: 'click', effect: () => click += 0.1, cpsIncrease: 0 },
  { name: '🧑‍🍳 Đầu bếp', cost: 200, level: 0, type: 'chef', effect: () => {cps += 0.2, chef += 1}, cpsIncrease: 0.2 },
  { name: '🧑‍🌾 Nông dân', cost: 800, level: 0, type: 'farmer', effect: () => {cps += 2, farmer += 1}, cpsIncrease: 2 },
  { name: '⛏️ Thợ mỏ', cost: 1_700, level: 0, type: 'miner', effect: () => {cps += 7, miner += 1}, cpsIncrease: 7 },
  { name: '🏭 Nhà máy', cost: 53_000, level: 0, type: 'factory', effect: () => {cps += 40, factory += 1}, cpsIncrease: 40 },
  { name: '🏦 Ngân hàng', cost: 2_480_000, level: 0, type: 'bank', effect: () => {cps += 100, bank += 1}, cpsIncrease: 100 },
  { name: '🛕 Đền thờ', cost: 8_520_000, level: 0, type: 'temple', effect: () => {cps += 400, temple += 1}, cpsIncrease: 400 },
  { name: '🧙 Tòa tháp pháp sư', cost: 20_610_000, level: 0, type: 'wizard', effect: () => {cps += 5_000, wizard += 1}, cpsIncrease: 5_000 },
  { name: '🚀 Du hành không gian', cost: 843_700_000, level: 0, type: 'space', effect: () => {cps += 100_000, space += 1}, cpsIncrease: 100_000 },
  { name: '🪞 Cổng không gian', cost: 740_000_000_000, level: 0, type: 'portal', effect: () => {cps += 2_000_000, portal += 1}, cpsIncrease: 2_000_000 },
  { name: '🕒 Du hành thời gian', cost: 369_000_000_000_000, level: 0, type: 'time', effect: () => {cps += 570_000_000, time += 1}, cpsIncrease: 570_000_000 },
  { name: '✨ Công nghệ nén ánh sáng', cost: 2_900_000_000_000_000, level: 0, type: 'light', effect: () => {cps += 29_830_000_000, light += 1}, cpsIncrease: 29_830_000_000 }
];

// Danh sách achievements
const achievements = [
  { name: '🍪 Bắt đầu', description: 'Nhấn lần đầu tiên', achieved: false, condition: () => score >= 1 },
  { name: '💰 Đại gia', description: 'Có hơn 100 điểm', achieved: false, condition: () => score >= 100 },
  { name: '🏅 Bậc thầy clicker', description: 'Nhấn 500 lần', achieved: false, condition: () => all_score >= 500 },
  { name: '🧑‍🍳 Chủ một nhà hàng', description: 'Thuê một đầu bếp', achieved: false, condition: () => chef >= 1 },
  { name: '🧑‍🌾 Cây đột biến', description: 'Thuê một nông dân', achieved: false, condition: () => farmer >= 1},
  { name: '⛏️ Mỏ vàng', description: 'Thuê một thợ mỏ', achieved: false, condition: () => miner >= 1},
  { name: '🏭 Nhà máy cookie', description: 'Xây nhà máy đầu tiên', achieved: false, condition: () => factory >= 1},
  { name: '🏦 Cho vay nặng cookie', description: 'Xây một Ngân hàng', achieved: false, condition: () => bank >= 1},
  { name: '🛕 Thờ cúng cookie', description: 'Xây một Đền thờ', achieved: false, condition: () => temple >= 1},
  { name: '🧙 Úm ba la', description: 'Xây một Tòa tháp pháp sư', achieved: false, condition: () => wizard >= 1},
  { name: '🚀 Du hành không gian', description: 'Xây một Tàu không gian', achieved: false, condition: () => space >= 1},
  { name: '😈 Đến giờ ăn trộm rồi', description: 'Xây một Cổng không gian', achieved: false, condition: () => portal >= 1},
  { name: '🕒 Doraemon', description: 'Xây một Du hành thời gian', achieved: false, condition: () => time >= 1},
  { name: '✨ Thiên tài xuất hiện', description: 'Xây một Công nghệ nén ánh sáng', achieved: false, condition: () => light >= 1}
];

function isFloat(number) {
  return !Number.isInteger(number);
}

function formatNumber(number) {
  if (number >= 1e12) {
    return (number / 1e12).toFixed(1) + 'T';  // Tỷ
  } else if (number >= 1e9) {
    return (number / 1e9).toFixed(1) + 'B';  // Tỷ
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(1) + 'M';  // Triệu
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(1) + 'K';  // Nghìn
  } else if (isFloat(number)) {
    return parseFloat(number.toFixed(1));
  } else {
    return number;
  }
}


function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  // Thêm vào container chính
  toastContainer.appendChild(toast);

  // Kích hoạt animation
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  // Ẩn sau 3 giây
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 3000);
}


// Hàm hiển thị danh sách nâng cấp
function displayUpgrades() {
  upgradesList.innerHTML = ''; // Xóa danh sách hiện tại
  upgrades.forEach((upgrade, index) => {
    const li = document.createElement('li');
    li.classList.add('upgrade-item');

    // Hiển thị thông tin nâng cấp với CPS tăng thêm và giá rút gọn
    if (upgrade.type === 'click') {
      li.textContent = `${upgrade.name} - ${formatNumber(upgrade.cost)} điểm + 1 điểm/click`;
    } else {
      li.textContent = `${upgrade.name} - ${formatNumber(upgrade.cost)} điểm +${formatNumber(upgrade.cpsIncrease)} CPS`;
    }

    // Hiển thị mô tả khi hover vào nâng cấp
    li.title = getUpgradeDescription(upgrade);

    // Cập nhật màu sắc cho item nâng cấp
    li.style.color = score >= upgrade.cost ? '#fff' : '#828282';

    // Khi click vào sẽ mua nâng cấp
    li.addEventListener('click', () => buyUpgrade(index));

    upgradesList.appendChild(li);
  });
}



// Hàm mua nâng cấp (có thể mua nhiều lần)
function buyUpgrade(index) {
  const upgrade = upgrades[index];
  if (score >= upgrade.cost) {
    score -= upgrade.cost; // Trừ điểm
    upgrade.level++; // Tăng cấp độ nâng cấp

    // Áp dụng effect nâng cấp
    upgrade.effect();

    // Tăng giá nâng cấp
    upgrade.cost = Math.floor(upgrade.cost * 1.5);

    // Cập nhật lại điểm
    scoreDisplay.textContent = Math.floor(score * 100) / 100;
    displayUpgrades(); // Cập nhật lại danh sách nâng cấp
  }
}

function getUpgradeDescription(upgrade) {
  switch (upgrade.type) {
    case 'click':
      return `Tăng thêm 1 điểm mỗi lần nhấn`;
    case 'chef':
      return `Tăng CPS mỗi giây, giúp bạn nhận điểm tự động.`;
    case 'farmer':
      return `Tăng CPS mỗi giây, giúp bạn nhận điểm tự động.`;
    case 'miner':
      return `Tăng CPS mỗi giây, giúp bạn nhận điểm tự động.`;
    case 'factory':
      return `Tăng CPS mỗi giây, giúp bạn nhận điểm tự động.`;
    case 'bank':
      return `Tăng CPS mỗi giây, giúp bạn nhận điểm tự động.`;
    case 'temple':
      return `Tăng CPS mỗi giây, giúp bạn nhận điểm tự động.`;
    case 'wizard':
      return `Tăng CPS mỗi giây, giúp bạn nhận điểm tự động.`;
    case 'space':
      return `Tăng CPS mỗi giây, giúp bạn nhận điểm tự động.`;
    case 'portal':
      return `Tăng CPS mỗi giây, giúp bạn nhận điểm tự động.`;
    case 'time':
      return `Tăng CPS mỗi giây, giúp bạn nhận điểm tự động.`;
    case 'light':
      return `Tăng CPS mỗi giây, giúp bạn nhận điểm tự động.`;
    default:
      return '';
  }
}

// Hàm cập nhật điểm mỗi giây (CPS)
function updateCPS() {
  let currentTime = Date.now();
  let timeElapsed = (currentTime - lastUpdateTime) / 1000;
  if (timeElapsed >= 1) {
    click = formatNumber(click);
    cps = calculateCPS(); // Cập nhật lại CPS mỗi giây
    score += cps; // Thêm CPS vào điểm
    score = Math.floor(score * 100) / 100; // Giới hạn số điểm
    scoreDisplay.textContent = formatNumber(score); // Cập nhật điểm hiển thị
    lastUpdateTime = currentTime;
    checkAchievements(); // Kiểm tra achievements
  }
}


function calculateCPS() {
  // Tính tổng CPS dựa trên các nâng cấp và vật phẩm đã mua
  let totalCPS = 0;

  // Thêm CPS từ các nâng cấp (như Chef, Farmer, Miner...)
  upgrades.forEach((upgrade) => {
    if (upgrade.level > 0) {
      totalCPS += upgrade.cpsIncrease * upgrade.level;
    }
  });

  return totalCPS;
}

let showAllItems = false; // Trạng thái hiển thị toàn bộ vật phẩm

function renderShop() {
  shopList.innerHTML = ""; // Xóa danh sách cũ

  let itemsToShow = showAllItems ? shopItems.length : 4; // Hiển thị tối đa 4 item

  shopItems.slice(0, itemsToShow).forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "shop-item";

    // Hiển thị icon, ẩn tên (tên sẽ hiển thị trong title)
    li.textContent = item.name.split(" ")[0];

    // Thêm title chứa thông tin
    li.title = `${item.name}\nGiá: ${item.cost} points\n${item.description}`;

    li.onclick = () => buyItem(index);

    shopList.appendChild(li);
  });

  // Tìm nút "Xem tất cả" nếu có nhiều hơn 3 vật phẩm
  let toggleButton = document.querySelector(".shop-toggle");

  // Nếu nút đã tồn tại, xóa nó
  if (toggleButton) {
    toggleButton.remove();
  }

  if (shopItems.length > 3) {
    toggleButton = document.createElement("button");
    const tbd = document.querySelector(".std");
    toggleButton.textContent = showAllItems ? "➖" : "➕";
    toggleButton.className = "shop-toggle";

    toggleButton.onclick = () => {
      showAllItems = !showAllItems; // Đảo trạng thái
      renderShop();
      toggleUpgrades(!showAllItems); // Rút gọn upgrades nếu mở rộng shop
    };

    tbd.appendChild(toggleButton);
  }
}

const shopContainer = document.querySelector('.shop-container');
const updateContainer = document.querySelector('.update-container');


function toggleUpgrades(visible) {
  upgradesList.style.display = visible ? "block" : "none";

  // Lấy chiều cao của shop
  const shopContainer = document.querySelector('.shop-container');
  const updateContainer = document.querySelector('.update-container');

  if (visible) {
    // Nếu nâng cấp được hiển thị, điều chỉnh vị trí của phần nâng cấp
    const shopHeight = shopContainer.offsetHeight;
    updateContainer.style.top = `${shopHeight + 20}px`; // Đẩy phần nâng cấp xuống dưới shop
  } else {
    // Nếu nâng cấp không được hiển thị, đặt lại vị trí
    updateContainer.style.top = `${shopContainer.offsetHeight + 10}px`; // Đảm bảo khoảng cách
  }
}


function buyItem(index) {
  const item = shopItems[index];

  if (score >= item.cost) {
    score -= item.cost;
    item.effect(); // Áp dụng hiệu ứng vật phẩm
    showToast(`You bought ${item.name}!`);
  } else {
    showToast("Not enough points!");
  }
}

// Khi người chơi nhấn vào nút
clickButton.addEventListener('click', (event) => {
  score += click; // Tăng điểm theo số lượng click hiện tại
  all_score += click;
  scoreDisplay.textContent = formatNumber(score); // Cập nhật điểm hiển thị
  displayUpgrades(); // Cập nhật danh sách nâng cấp
  checkAchievements(); // Kiểm tra achievements khi nhấn

  // Tạo phần tử hiển thị số điểm cộng thêm
  const clickDisplay = document.createElement('div');
  clickDisplay.classList.add('click-display');
  clickDisplay.textContent = `+${click}`;

  // Lấy vị trí con trỏ chuột khi nhấn vào button
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // Đặt phần tử tại vị trí con trỏ chuột
  clickDisplay.style.left = `${mouseX}px`;
  clickDisplay.style.top = `${mouseY}px`;

  // Thêm phần tử vào body
  document.body.appendChild(clickDisplay);

  // Hiệu ứng di chuyển và mờ dần
  clickDisplay.style.animation = 'moveAndFade 0.5s ease forwards';

  // Phần tử sẽ tự động biến mất sau hiệu ứng
  setTimeout(() => {
    clickDisplay.style.opacity = 0; // Dần dần biến mất
  }, 200);

  setTimeout(() => {
    document.body.removeChild(clickDisplay); // Xóa phần tử sau khi hiệu ứng hoàn thành
  }, 500);
});

function upadateScore() {
  setTimeout(() => {
    scoreDisplay.textContent = formatNumber(score);
  }, 200);
}

// Hàm kiểm tra achievements
function checkAchievements() {
  achievements.forEach((achievement) => {
    if (!achievement.achieved && achievement.condition()) {
      achievement.achieved = true; // Đánh dấu achievement đã đạt được
      showAchievementToast(achievement); // Hiển thị thông báo achievement
      addAchievementToList(achievement); // Thêm achievement vào danh sách hiển thị
    }
  });
}

// Hàm hiển thị thông báo achievement (Toast)
function showAchievementToast(achievement) {
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = `Bạn đã đạt được achievement: ${achievement.name}`;

  // Thêm vào container
  toastContainer.appendChild(toast);

  // Hiển thị thông báo và tự động ẩn sau 4 giây
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 4000);
}

// Hàm thêm achievement vào danh sách hiển thị
function addAchievementToList(achievement) {
  const li = document.createElement('li');
  li.textContent = `${achievement.name}: ${achievement.description}`;
  achievementsList.appendChild(li);

  // Ẩn thông báo "Bạn chưa có thành tựu nào cả" khi có thành tựu
  const noAchievements = document.getElementById('no-achievements');
  if (noAchievements) {
    noAchievements.style.display = 'none'; // Ẩn thông báo khi có thành tựu
  }
}

function adjustUpgradePosition() {
  const shopContainer = document.querySelector('.shop-container');
  const updateContainer = document.querySelector('.update-container');

  // Lấy chiều cao của shop
  const shopHeight = shopContainer.offsetHeight;

  // Đặt vị trí của phần nâng cấp ngay dưới phần shop
  updateContainer.style.top = `${shopHeight + 20}px`; // Thêm khoảng cách
}


// Cập nhật CPS mỗi giây
setInterval(updateCPS, 1000);

// Hiển thị nâng cấp khi trang tải xong
displayUpgrades();

// Gọi hàm render shop khi game khởi động
renderShop();
adjustUpgradePosition();
