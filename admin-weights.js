// 权重配置JS
// 系统内置产业（不可删除）
const SYSTEM_INDUSTRIES = ['strategic', 'future', 'traditional'];

function initWeights() {
  if (!localStorage.getItem('industryWeights')) {
    const defaultWeights = {
      strategic: {
        level1: { legal: 33, tech: 34, econ: 33 },
        legal: { novelty: 25, creativity: 25, utility: 20, stability: 30 },
        tech: { advanced: 30, complexity: 25, maturity: 20, replaceable: 25 },
        econ: { market: 30, cycle: 25, benefit: 25, advantage: 20 }
      },
      future: {
        level1: { legal: 30, tech: 40, econ: 30 },
        legal: { novelty: 30, creativity: 30, utility: 20, stability: 20 },
        tech: { advanced: 40, complexity: 25, maturity: 15, replaceable: 20 },
        econ: { market: 35, cycle: 25, benefit: 20, advantage: 20 }
      },
      traditional: {
        level1: { legal: 35, tech: 30, econ: 35 },
        legal: { novelty: 20, creativity: 20, utility: 25, stability: 35 },
        tech: { advanced: 20, complexity: 25, maturity: 30, replaceable: 25 },
        econ: { market: 25, cycle: 25, benefit: 30, advantage: 20 }
      }
    };
    localStorage.setItem('industryWeights', JSON.stringify(defaultWeights));
  }

  // 初始化产业名称映射
  if (!localStorage.getItem('industryNames')) {
    const defaultNames = {
      strategic: '战略性新兴产业',
      future: '未来产业',
      traditional: '传统产业'
    };
    localStorage.setItem('industryNames', JSON.stringify(defaultNames));
  }
}

// 加载产业下拉列表
function loadIndustryOptions() {
  initWeights();
  const names = JSON.parse(localStorage.getItem('industryNames'));
  const select = document.getElementById('industrySelect');
  if (!select) return;

  const currentValue = select.value;
  select.innerHTML = '';

  Object.keys(names).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = names[key] + (SYSTEM_INDUSTRIES.includes(key) ? ' [系统]' : ' [自定义]');
    select.appendChild(option);
  });

  if (currentValue && names[currentValue]) {
    select.value = currentValue;
  }

  updateDeleteButtonState();
}

// 更新删除按钮状态
function updateDeleteButtonState() {
  const select = document.getElementById('industrySelect');
  const deleteBtn = document.getElementById('deleteIndustryBtn');
  if (!select || !deleteBtn) return;

  const isSystem = SYSTEM_INDUSTRIES.includes(select.value);
  deleteBtn.disabled = isSystem;
  deleteBtn.style.opacity = isSystem ? '0.5' : '1';
  deleteBtn.style.cursor = isSystem ? 'not-allowed' : 'pointer';
  deleteBtn.title = isSystem ? '系统内置产业不可删除' : '删除当前产业';
}

// 打开新增产业模态框
function openAddIndustryModal() {
  document.getElementById('industryForm').reset();
  document.getElementById('copyIndustryRow').style.display = 'none';

  // 填充复制来源下拉
  const names = JSON.parse(localStorage.getItem('industryNames'));
  const copySelect = document.getElementById('inputCopyFrom');
  copySelect.innerHTML = '';
  Object.keys(names).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = names[key];
    copySelect.appendChild(option);
  });

  document.getElementById('industryModal').classList.add('show');
}

// 关闭新增产业模态框
function closeIndustryModal() {
  document.getElementById('industryModal').classList.remove('show');
}

// 删除当前产业
function deleteCurrentIndustry() {
  const select = document.getElementById('industrySelect');
  const key = select.value;

  if (SYSTEM_INDUSTRIES.includes(key)) {
    alert('系统内置产业不可删除');
    return;
  }

  const names = JSON.parse(localStorage.getItem('industryNames'));
  if (!confirm(`确定要删除产业「${names[key]}」吗？删除后其权重配置将永久丢失。`)) return;

  const weights = JSON.parse(localStorage.getItem('industryWeights'));
  delete weights[key];
  delete names[key];

  localStorage.setItem('industryWeights', JSON.stringify(weights));
  localStorage.setItem('industryNames', JSON.stringify(names));

  loadIndustryOptions();
  loadWeights();
  alert('删除成功');
}

// 处理新增产业表单提交
document.addEventListener('DOMContentLoaded', function() {
  const initModeSelect = document.getElementById('inputInitMode');
  if (initModeSelect) {
    initModeSelect.addEventListener('change', function() {
      document.getElementById('copyIndustryRow').style.display =
        this.value === 'copy' ? 'block' : 'none';
    });
  }

  const industryForm = document.getElementById('industryForm');
  if (industryForm) {
    industryForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('inputIndustryName').value.trim();
      const code = document.getElementById('inputIndustryCode').value.trim();
      const initMode = document.getElementById('inputInitMode').value;

      if (!name || !code) {
        alert('请填写完整信息');
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(code)) {
        alert('产业编码只能包含英文字母、数字和下划线');
        return;
      }

      const names = JSON.parse(localStorage.getItem('industryNames'));
      const weights = JSON.parse(localStorage.getItem('industryWeights'));

      if (names[code]) {
        alert('该产业编码已存在');
        return;
      }

      // 初始化权重
      let newWeights;
      if (initMode === 'copy') {
        const copyFrom = document.getElementById('inputCopyFrom').value;
        newWeights = JSON.parse(JSON.stringify(weights[copyFrom]));
      } else {
        newWeights = {
          level1: { legal: 33, tech: 34, econ: 33 },
          legal: { novelty: 25, creativity: 25, utility: 20, stability: 30 },
          tech: { advanced: 25, complexity: 25, maturity: 25, replaceable: 25 },
          econ: { market: 25, cycle: 25, benefit: 25, advantage: 25 }
        };
      }

      names[code] = name;
      weights[code] = newWeights;

      localStorage.setItem('industryNames', JSON.stringify(names));
      localStorage.setItem('industryWeights', JSON.stringify(weights));

      closeIndustryModal();
      loadIndustryOptions();
      document.getElementById('industrySelect').value = code;
      loadWeights();
      alert('新增产业成功');
    });
  }
});

function loadWeights() {
  initWeights();
  const industry = document.getElementById('industrySelect').value;
  const allWeights = JSON.parse(localStorage.getItem('industryWeights'));
  const weights = allWeights[industry];
  if (!weights) return;
  updateDeleteButtonState();

  // 一级指标
  setWeight('legal-1', weights.level1.legal);
  setWeight('tech-1', weights.level1.tech);
  setWeight('econ-1', weights.level1.econ);

  // 法律价值二级指标
  setWeight('legal-novelty', weights.legal.novelty);
  setWeight('legal-creativity', weights.legal.creativity);
  setWeight('legal-utility', weights.legal.utility);
  setWeight('legal-stability', weights.legal.stability);

  // 技术价值二级指标
  setWeight('tech-advanced', weights.tech.advanced);
  setWeight('tech-complexity', weights.tech.complexity);
  setWeight('tech-maturity', weights.tech.maturity);
  setWeight('tech-replaceable', weights.tech.replaceable);

  // 经济价值二级指标
  setWeight('econ-market', weights.econ.market);
  setWeight('econ-cycle', weights.econ.cycle);
  setWeight('econ-benefit', weights.econ.benefit);
  setWeight('econ-advantage', weights.econ.advantage);

  // 更新总和显示
  updateSums();
}

function setWeight(id, value) {
  document.getElementById('weight-' + id).value = value;
  document.getElementById('value-' + id).textContent = value + '%';
}

function updateWeight(id) {
  const value = document.getElementById('weight-' + id).value;
  document.getElementById('value-' + id).textContent = value + '%';
  updateSums();
}

function updateSums() {
  // 计算一级指标总和
  const level1Sum =
    parseInt(document.getElementById('weight-legal-1').value) +
    parseInt(document.getElementById('weight-tech-1').value) +
    parseInt(document.getElementById('weight-econ-1').value);

  // 计算各二级指标总和
  const legalSum =
    parseInt(document.getElementById('weight-legal-novelty').value) +
    parseInt(document.getElementById('weight-legal-creativity').value) +
    parseInt(document.getElementById('weight-legal-utility').value) +
    parseInt(document.getElementById('weight-legal-stability').value);

  const techSum =
    parseInt(document.getElementById('weight-tech-advanced').value) +
    parseInt(document.getElementById('weight-tech-complexity').value) +
    parseInt(document.getElementById('weight-tech-maturity').value) +
    parseInt(document.getElementById('weight-tech-replaceable').value);

  const econSum =
    parseInt(document.getElementById('weight-econ-market').value) +
    parseInt(document.getElementById('weight-econ-cycle').value) +
    parseInt(document.getElementById('weight-econ-benefit').value) +
    parseInt(document.getElementById('weight-econ-advantage').value);

  // 更新显示
  updateSumDisplay('level1-sum', level1Sum);
  updateSumDisplay('legal-sum', legalSum);
  updateSumDisplay('tech-sum', techSum);
  updateSumDisplay('econ-sum', econSum);
}

function updateSumDisplay(id, sum) {
  const el = document.getElementById(id);
  if (!el) return;

  el.textContent = `总和: ${sum}%`;
  el.className = 'weight-sum';

  if (sum === 100) {
    el.classList.add('sum-ok');
  } else if (sum > 100) {
    el.classList.add('sum-over');
  } else {
    el.classList.add('sum-under');
  }
}

function saveWeights() {
  // 验证总和
  const level1Sum =
    parseInt(document.getElementById('weight-legal-1').value) +
    parseInt(document.getElementById('weight-tech-1').value) +
    parseInt(document.getElementById('weight-econ-1').value);

  const legalSum =
    parseInt(document.getElementById('weight-legal-novelty').value) +
    parseInt(document.getElementById('weight-legal-creativity').value) +
    parseInt(document.getElementById('weight-legal-utility').value) +
    parseInt(document.getElementById('weight-legal-stability').value);

  const techSum =
    parseInt(document.getElementById('weight-tech-advanced').value) +
    parseInt(document.getElementById('weight-tech-complexity').value) +
    parseInt(document.getElementById('weight-tech-maturity').value) +
    parseInt(document.getElementById('weight-tech-replaceable').value);

  const econSum =
    parseInt(document.getElementById('weight-econ-market').value) +
    parseInt(document.getElementById('weight-econ-cycle').value) +
    parseInt(document.getElementById('weight-econ-benefit').value) +
    parseInt(document.getElementById('weight-econ-advantage').value);

  // 检查是否所有总和都是100%
  const errors = [];
  if (level1Sum !== 100) errors.push(`一级指标总和为 ${level1Sum}%（应为100%）`);
  if (legalSum !== 100) errors.push(`法律价值二级指标总和为 ${legalSum}%（应为100%）`);
  if (techSum !== 100) errors.push(`技术价值二级指标总和为 ${techSum}%（应为100%）`);
  if (econSum !== 100) errors.push(`经济价值二级指标总和为 ${econSum}%（应为100%）`);

  if (errors.length > 0) {
    alert('权重配置不正确：\n\n' + errors.join('\n') + '\n\n请调整后再保存。');
    return;
  }

  const industry = document.getElementById('industrySelect').value;
  const allWeights = JSON.parse(localStorage.getItem('industryWeights'));

  allWeights[industry] = {
    level1: {
      legal: parseInt(document.getElementById('weight-legal-1').value),
      tech: parseInt(document.getElementById('weight-tech-1').value),
      econ: parseInt(document.getElementById('weight-econ-1').value)
    },
    legal: {
      novelty: parseInt(document.getElementById('weight-legal-novelty').value),
      creativity: parseInt(document.getElementById('weight-legal-creativity').value),
      utility: parseInt(document.getElementById('weight-legal-utility').value),
      stability: parseInt(document.getElementById('weight-legal-stability').value)
    },
    tech: {
      advanced: parseInt(document.getElementById('weight-tech-advanced').value),
      complexity: parseInt(document.getElementById('weight-tech-complexity').value),
      maturity: parseInt(document.getElementById('weight-tech-maturity').value),
      replaceable: parseInt(document.getElementById('weight-tech-replaceable').value)
    },
    econ: {
      market: parseInt(document.getElementById('weight-econ-market').value),
      cycle: parseInt(document.getElementById('weight-econ-cycle').value),
      benefit: parseInt(document.getElementById('weight-econ-benefit').value),
      advantage: parseInt(document.getElementById('weight-econ-advantage').value)
    }
  };

  localStorage.setItem('industryWeights', JSON.stringify(allWeights));
  alert('权重配置已保存');
}
