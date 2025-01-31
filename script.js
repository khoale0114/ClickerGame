// script.js
let score = 0;
let all_score = score;
let click = 1;
let cps = 0;
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
    cost: 100,
    description: "Điểm click và CPS sẽ bằng số điểm click * CPS",
    effect: () => {
      click = click * cps; // Nhân điểm click lên số CPS hiện tại
      cps = click * cps; // Tăng giá trị click lên 5
    }
  },
  {
    name: "✨ Golden Click",
    cost: 1000,
    description: "Tăng giá trị mỗi lần click lên 10.",
    effect: () => click += 10
  },
  {
    name: "🤔 Other item for test",
    cost: 1000,
    description: "Tăng giá trị mỗi lần click lên 10.",
    effect: () => click += 10 //tôi copy của Golden click để test
  },
  {
    name: "✨ Other item for test",
    cost: 1000,
    description: "Tăng giá trị mỗi lần click lên 10.",
    effect: () => click += 10 //tôi copy của Golden click để test
  }
];


// Danh sách nâng cấp có thể mua nhiều lần
const upgrades = [
  { name: '🎯 Luyện tập', cost: 10, level: 0, type: 'click' },
  { name: '🥛 Nêm nếm', cost: 50, level: 0, type: 'click_multiplier' },
  { name: '🧑‍🍳 Đầu bếp', cost: 100, level: 0, type: 'chef' }
];

// Danh sách achievements
const achievements = [
  { name: '🍪 Bắt đầu', description: 'Nhấn lần đầu tiên', achieved: false, condition: () => score >= 1 },
  { name: '💰 Đại gia', description: 'Có hơn 100 điểm', achieved: false, condition: () => score >= 100 },
  { name: '🏅 Bậc thầy clicker', description: 'Nhấn 500 lần', achieved: false, condition: () => all_score >= 500 },
  { name: '🧑‍🍳 chủ một nhà hàng', description: 'Thuê một đầu bếp', achieved: false, condition: () => cps >= 1 },
];

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


// Hàm hiển thị các nâng cấp
function displayUpgrades() {
  upgradesList.innerHTML = ''; // Xóa danh sách hiện tại
  upgrades.forEach((upgrade, index) => {
    const li = document.createElement('li');
    li.classList.add('upgrade-item');
    li.textContent = `${upgrade.name} - ${upgrade.cost} điểm`;

    // Gán title khác nhau cho từng upgrade
    if (upgrade.type === 'click') {
      li.title = `Tăng thêm 1 điểm mỗi lần nhấn\n`;
    } else if (upgrade.type === 'click_multiplier') {
      li.title = `Nhân đôi số điểm mỗi lần nhấn\n`;
    } else if (upgrade.type === 'chef') {
      li.title = `Tăng thêm 1 điểm mỗi giây\n /ngon hơn, nhưng không phải do bạn làm - Khoale/`;
    }

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

    // Xử lý từng loại nâng cấp
    if (upgrade.type === 'chef') {
      cps += 1; // Mỗi cấp tăng 1 CPS
    } else if (upgrade.type === 'click') {
      click += 1; // Mỗi cấp tăng 1 điểm khi nhấn
    } else if (upgrade.type === 'click_multiplier') {
      click *= 2; // Nhân đôi số điểm mỗi lần click
    }

    // Tăng giá nâng cấp (công thức tăng giá, có thể chỉnh sửa)
    upgrade.cost = Math.floor(upgrade.cost * 1.5);

    scoreDisplay.textContent = score; // Cập nhật điểm
    displayUpgrades(); // Cập nhật lại danh sách nâng cấp
  }
}

// Hàm cập nhật điểm mỗi giây (CPS)
function updateCPS() {
  let currentTime = Date.now();
  let timeElapsed = (currentTime - lastUpdateTime) / 1000;
  if (timeElapsed >= 1) {
    score += cps; // Thêm CPS vào điểm
    scoreDisplay.textContent = score; // Cập nhật điểm hiển thị
    lastUpdateTime = currentTime;
    checkAchievements(); // Kiểm tra achievements mỗi giây
  }
}

let showAllItems = false; // Trạng thái hiển thị toàn bộ vật phẩm

function renderShop() {
  shopList.innerHTML = ""; // Xóa danh sách cũ

  let itemsToShow = showAllItems ? shopItems.length : 3; // Hiển thị tối đa 3 item

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
    updateScore(); // Cập nhật điểm số
    showToast(`You bought ${item.name}!`);
  } else {
    showToast("Not enough points!");
  }
}

// Khi người chơi nhấn vào nút
clickButton.addEventListener('click', (event) => {
  score += click; // Tăng điểm theo số lượng click hiện tại
  all_score += click;
  scoreDisplay.textContent = score; // Cập nhật điểm hiển thị
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
