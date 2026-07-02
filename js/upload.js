// 专利评估上传页 - 智能识别逻辑
(function() {
  const dz = document.getElementById('dropzone');
  const fi = document.getElementById('fileInput');
  const fl = document.getElementById('fileList');
  const files = [];

  // 文件拖拽上传
  dz.addEventListener('click', () => fi.click());
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
  dz.addEventListener('drop', e => {
    e.preventDefault();
    dz.classList.remove('dragover');
    [...e.dataTransfer.files].forEach(addFile);
  });
  fi.addEventListener('change', e => [...e.target.files].forEach(addFile));

  function addFile(f) {
    files.push(f);
    renderList();
    // 触发智能识别
    if (files.length > 0) {
      simulateAutoFill();
    }
  }

  function renderList() {
    if (files.length === 0) {
      fl.style.display = 'none';
      const tip = document.getElementById('autoFillTip');
      if (tip) tip.style.display = 'none';
      return;
    }
    fl.style.display = 'block';
    fl.innerHTML = files.map((f, i) => `
      <div class="file-row">
        <div class="file-icon">
          <svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        <div class="file-name">${f.name}</div>
        <div class="file-size mono">${(f.size / 1024).toFixed(1)} KB</div>
        <button class="btn btn-outline" style="padding:4px 10px;font-size:12px" onclick="window.removeUploadFile(${i})">移除</button>
      </div>
    `).join('');
  }

  window.removeUploadFile = function(i) {
    files.splice(i, 1);
    renderList();
    if (files.length === 0) {
      clearAllFields();
    }
  };

  // 模拟智能识别填充
  function simulateAutoFill() {
    setTimeout(() => {
      const mockData = {
        fProject: '面向低空经济的无人机集群自主避障与协同调度技术',
        fApplicant: '云翔智能科技（深圳）有限公司',
        fField: '战略性新兴产业',
        fSource: '自研项目',
        fInventors: '张启明、李文昊、周雨薇',
        fEmail: 'ipr@yunxiang-tech.cn',
        fPhone: '0755-8888-2166',
        fDate: '2026-09-15'
      };

      Object.keys(mockData).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.value = mockData[id];
          el.readOnly = false;
          el.style.background = '#FFFBEB';
          el.style.borderColor = '#FCD34D';
        }
      });

      const tip = document.getElementById('autoFillTip');
      if (tip) {
        tip.style.display = 'flex';
        document.getElementById('autoFillCount').textContent = '8';
      }

      setTimeout(() => {
        Object.keys(mockData).forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.style.background = '';
            el.style.borderColor = '';
          }
        });
      }, 2000);
    }, 800);
  }

  // 切换编辑模式
  window.toggleEdit = function(id) {
    const el = document.getElementById(id);
    if (el && el.readOnly) {
      el.readOnly = false;
      el.focus();
      el.style.background = '#EFF6FF';
      el.style.borderColor = 'var(--color-primary)';
    }
  };

  // 全部解锁编辑
  window.enableEditAll = function() {
    ['fProject', 'fApplicant', 'fInventors', 'fEmail', 'fPhone', 'fDate'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.readOnly = false;
        el.style.background = '';
        el.style.borderColor = '';
      }
    });
  };

  // 清空所有字段
  function clearAllFields() {
    ['fProject', 'fApplicant', 'fInventors', 'fEmail', 'fPhone', 'fDate'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.value = '';
        el.readOnly = true;
        el.style.background = '';
        el.style.borderColor = '';
      }
    });
    const fField = document.getElementById('fField');
    const fSource = document.getElementById('fSource');
    if (fField) fField.selectedIndex = 0;
    if (fSource) fSource.selectedIndex = 0;

    const tip = document.getElementById('autoFillTip');
    if (tip) tip.style.display = 'none';
  }

  // 提交评估
  document.getElementById('submitBtn').addEventListener('click', () => {
    const wrap = document.getElementById('progressWrap');
    const bar = document.getElementById('progressBar');
    const pct = document.getElementById('progressPct');
    const lbl = document.getElementById('progressLabel');
    const steps = [
      [15, '正在解析上传文件…'],
      [35, '智能抽取技术方案与创新点…'],
      [58, '匹配评估机构指标体系…'],
      [78, '生成三维度指标打分…'],
      [92, '规则校验与不达标项检测…'],
      [100, '评估完成，正在跳转至结果页…']
    ];
    wrap.style.display = 'block';
    let idx = 0;
    const timer = setInterval(() => {
      const [p, t] = steps[idx];
      bar.style.width = p + '%';
      pct.textContent = p + '%';
      lbl.textContent = t;
      idx++;
      if (idx >= steps.length) {
        clearInterval(timer);
        setTimeout(() => location.href = 'result.html', 500);
      }
    }, 600);
  });

  // 初始化：禁用所有表单
  document.addEventListener('DOMContentLoaded', () => {
    clearAllFields();
  });
})();
