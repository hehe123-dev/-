// 后台管理主逻辑
(function checkAdmin() {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'login.html';
    return;
  }
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser || currentUser.username !== 'admin') {
    alert('仅管理员可访问后台管理系统');
    window.location.href = 'index.html';
    return;
  }
  document.getElementById('currentUserDisplay').textContent = '欢迎回来，' + currentUser.name;
  const sidebarName = document.getElementById('sidebarUserName');
  if (sidebarName) sidebarName.textContent = currentUser.name;
})();

function logout() {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }
}

document.querySelectorAll('.admin-nav-item').forEach(item => {
  item.addEventListener('click', function(e) {
    if (this.getAttribute('href') === 'index.html') return;
    e.preventDefault();
    const section = this.dataset.section;
    if (!section) return;
    document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.admin-content').forEach(c => c.classList.add('section-hidden'));
    document.getElementById(section + 'Section').classList.remove('section-hidden');
    const titles = { users: '用户管理', weights: '评估指标权重' };
    document.getElementById('pageTitle').textContent = titles[section];
    if (section === 'users') loadUsers();
    if (section === 'weights') renderWeightsUI();
  });
});

function renderWeightsUI() {
  // 先加载产业下拉列表
  loadIndustryOptions();

  const container = document.getElementById('weightsContainer');

  let html = '<div class="weight-card">';
  html += '<div class="weight-card-title">一级指标权重分配 <span id="level1-sum" class="weight-sum">总和: 100%</span></div>';

  // 一级指标
  const level1 = [
    { id: 'legal-1', label: '法律价值' },
    { id: 'tech-1', label: '技术价值' },
    { id: 'econ-1', label: '经济价值' }
  ];

  level1.forEach(ind => {
    html += `
      <div class="weight-item">
        <div class="weight-item-label">${ind.label}</div>
        <div class="weight-input-group">
          <input type="range" class="weight-slider" min="0" max="100" value="33" id="weight-${ind.id}" oninput="updateWeight('${ind.id}')">
          <span class="weight-value" id="value-${ind.id}">33%</span>
        </div>
      </div>`;
  });
  html += '</div>';

  // 法律价值二级指标
  html += '<div class="weight-card">';
  html += '<div class="weight-card-title">法律价值 · 二级指标 <span id="legal-sum" class="weight-sum">总和: 100%</span></div>';
  const legal = [
    { id: 'legal-novelty', label: '新颖性' },
    { id: 'legal-creativity', label: '创造性' },
    { id: 'legal-utility', label: '实用性' },
    { id: 'legal-stability', label: '稳定性' }
  ];
  legal.forEach(ind => {
    html += `
      <div class="weight-item">
        <div class="weight-item-label">${ind.label}</div>
        <div class="weight-input-group">
          <input type="range" class="weight-slider" min="0" max="100" value="25" id="weight-${ind.id}" oninput="updateWeight('${ind.id}')">
          <span class="weight-value" id="value-${ind.id}">25%</span>
        </div>
      </div>`;
  });
  html += '</div>';

  // 技术价值二级指标
  html += '<div class="weight-card">';
  html += '<div class="weight-card-title">技术价值 · 二级指标 <span id="tech-sum" class="weight-sum">总和: 100%</span></div>';
  const tech = [
    { id: 'tech-advanced', label: '技术先进性' },
    { id: 'tech-complexity', label: '技术复杂度' },
    { id: 'tech-maturity', label: '技术成熟度' },
    { id: 'tech-replaceable', label: '可替代性' }
  ];
  tech.forEach(ind => {
    html += `
      <div class="weight-item">
        <div class="weight-item-label">${ind.label}</div>
        <div class="weight-input-group">
          <input type="range" class="weight-slider" min="0" max="100" value="25" id="weight-${ind.id}" oninput="updateWeight('${ind.id}')">
          <span class="weight-value" id="value-${ind.id}">25%</span>
        </div>
      </div>`;
  });
  html += '</div>';

  // 经济价值二级指标
  html += '<div class="weight-card">';
  html += '<div class="weight-card-title">经济价值 · 二级指标 <span id="econ-sum" class="weight-sum">总和: 100%</span></div>';
  const econ = [
    { id: 'econ-market', label: '市场前景' },
    { id: 'econ-cycle', label: '产业化周期' },
    { id: 'econ-benefit', label: '经济效益' },
    { id: 'econ-advantage', label: '竞争优势' }
  ];
  econ.forEach(ind => {
    html += `
      <div class="weight-item">
        <div class="weight-item-label">${ind.label}</div>
        <div class="weight-input-group">
          <input type="range" class="weight-slider" min="0" max="100" value="25" id="weight-${ind.id}" oninput="updateWeight('${ind.id}')">
          <span class="weight-value" id="value-${ind.id}">25%</span>
        </div>
      </div>`;
  });
  html += '</div>';

  container.innerHTML = html;
  loadWeights();
}

loadUsers();
