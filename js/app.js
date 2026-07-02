/* 专利评估结果渲染逻辑 */
(function () {
  const D = window.EVAL_DATA;
  const $ = id => document.getElementById(id);

  // ============ 板块 1：项目档案头部 ============
  function renderHeader() {
    $("hProject").textContent = D.meta.projectName;
    $("hApplicant").textContent = D.meta.applicant;
    $("hEvalNo").textContent = D.meta.evalNo;
    $("hConclusion").textContent = D.meta.conclusion;
    $("hScore").textContent = D.meta.totalScore;

    // 标签
    const tags = [];
    tags.push({ text: D.meta.field, cls: "" });
    D.meta.sources.forEach(s => tags.push({ text: s, cls: "" }));
    if (D.meta.isSecret) tags.push({ text: "涉密项目", cls: "tag-danger" });
    else tags.push({ text: "非涉密", cls: "" });
    if (D.meta.totalScore < 60) tags.push({ text: "综合评分偏低", cls: "tag-danger" });
    else if (D.meta.totalScore < 80) tags.push({ text: "综合评分待优化", cls: "tag-warn" });

    $("hTags").innerHTML = tags
      .map(t => `<span class="hero-tag ${t.cls}">${t.text}</span>`)
      .join("");

    // 基础信息网格
    const items = [
      { label: "评估单号", value: D.meta.evalNo, mono: true },
      { label: "评估日期", value: D.meta.evalDate, mono: true },
      { label: "拟申请专利时间", value: D.meta.intendApplyDate, mono: true },
      { label: "评估机构", value: D.meta.evalOrg },
      { label: "申请人单位", value: D.meta.applicant },
      { label: "发明人", value: D.meta.inventors },
      { label: "联系电话", value: D.meta.phone, mono: true },
      { label: "电子邮箱", value: D.meta.email, mono: true }
    ];
    $("hInfoGrid").innerHTML = items
      .map(
        i => `
      <div class="info-item">
        <span class="info-label">${i.label}</span>
        <span class="info-value ${i.mono ? "mono" : ""}">${i.value}</span>
      </div>`
      )
      .join("");
  }

  // ============ KPI 摘要 ============
  function renderKpi() {
    const cLen = D.issuesC.length;
    const hardFail = D.hardRules.filter(r => !r.ok).length;
    const layoutMiss = D.attach2.filter(r => r.issue).length;
    const highRisk = D.risks.filter(r => r.level === "high").length;

    const kpis = [
      {
        label: "C 级不达标指标",
        value: cLen,
        unit: "项",
        cls: cLen > 0 ? "kpi-danger" : "kpi-ok",
        delta: "跨 3 大维度归类展示"
      },
      {
        label: "硬性规则未通过",
        value: hardFail,
        unit: "项",
        cls: hardFail > 0 ? "kpi-danger" : "kpi-ok",
        delta: hardFail > 0 ? "存在一票否决风险" : "全部通过"
      },
      {
        label: "布局明细瑕疵",
        value: layoutMiss,
        unit: "处",
        cls: layoutMiss > 0 ? "kpi-warn" : "kpi-ok",
        delta: "附件2 校验命中"
      },
      {
        label: "高风险项",
        value: highRisk,
        unit: "项",
        cls: highRisk > 0 ? "kpi-danger" : "kpi-ok",
        delta: "涉及 FTO / IP 风控等"
      }
    ];

    $("kpiRow").innerHTML = kpis
      .map(
        k => `
      <div class="kpi-card ${k.cls}">
        <div class="kpi-label">${k.label}</div>
        <div class="kpi-value mono">${k.value}<span class="kpi-unit">${k.unit}</span></div>
        <div class="kpi-delta">${k.delta}</div>
      </div>`
      )
      .join("");
  }

  // ============ 板块 2：附件1、附件2 原文 ============
  function renderAttach1() {
    const a = D.attach1;
    $("a1Body").innerHTML = `
      <div class="data-grid">
        <div class="data-item" style="grid-column: 1 / -1">
          <span class="data-label">背景技术</span>
          <span class="data-value">${a.background}</span>
        </div>
        <div class="data-item" style="grid-column: 1 / -1">
          <span class="data-label">待解决技术问题</span>
          <span class="data-value">${a.problem}</span>
        </div>
        <div class="data-item" style="grid-column: 1 / -1">
          <span class="data-label">技术优势</span>
          <span class="data-value" style="white-space:pre-line">${a.advantage}</span>
        </div>
        <div class="data-item" style="grid-column: 1 / -1">
          <span class="data-label">完整技术方案</span>
          <span class="data-value">${a.scheme}</span>
        </div>
        <div class="data-item">
          <span class="data-label">应用领域</span>
          <span class="data-value">${a.apps.area}</span>
        </div>
        <div class="data-item">
          <span class="data-label">合作客户</span>
          <span class="data-value">${a.apps.clients}</span>
        </div>
        <div class="data-item">
          <span class="data-label">预期效益</span>
          <span class="data-value">${a.apps.benefit}</span>
        </div>
        <div class="data-item">
          <span class="data-label">产业化周期</span>
          <span class="data-value">${a.apps.cycle}</span>
        </div>
        <div class="data-item" style="grid-column: 1 / -1">
          <span class="data-label">FTO 检索</span>
          <span class="data-value">${a.risk.fto}</span>
        </div>
        <div class="data-item" style="grid-column: 1 / -1">
          <span class="data-label">专利导航</span>
          <span class="data-value">${a.risk.navigation}</span>
        </div>
        <div class="data-item" style="grid-column: 1 / -1">
          <span class="data-label">知识产权风控机制</span>
          <span class="data-value text-danger">${a.risk.rmSystem}</span>
        </div>
        <div class="data-item" style="grid-column: 1 / -1">
          <span class="data-label">拟转化方式</span>
          <span class="data-value">
            ${a.conversion.map(c => `<span class="chip">${c}</span>`).join("")}
          </span>
        </div>
      </div>
    `;
  }

  function renderAttach2() {
    const rows = D.attach2
      .map(r => {
        const rowCls = r.issue ? "row-danger" : "";
        const issue = r.issue
          ? `<div class="text-danger" style="font-size:12px;margin-top:4px">⚠ ${r.issue}</div>`
          : "";
        return `
        <tr class="${rowCls}">
          <td class="mono">${r.no}</td>
          <td>${r.dim}</td>
          <td>${r.branch}</td>
          <td>
            <div style="font-weight:600">${r.innovation || '<span class="text-danger">未填写</span>'}</div>
            <div class="text-muted" style="font-size:12px">${r.subject || "—"}</div>
            ${issue}
          </td>
          <td class="mono">${r.count}</td>
          <td>${r.type}</td>
          <td>${(r.region || []).map(x => `<span class="chip">${x}</span>`).join("") || "—"}</td>
          <td class="mono">${r.timing}</td>
          <td>
            ${
              r.issue
                ? '<span class="risk-tag risk-high">存在瑕疵</span>'
                : '<span class="risk-tag risk-low">通过</span>'
            }
          </td>
        </tr>`;
      })
      .join("");

    $("a2Body").innerHTML = `
      <div style="overflow-x:auto">
        <table class="tbl">
          <thead>
            <tr>
              <th>序号</th>
              <th>评估维度</th>
              <th>技术分支</th>
              <th>创新点 / 专利主题</th>
              <th>数量</th>
              <th>类型</th>
              <th>保护地域</th>
              <th>拟申请</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  // ============ 板块 3：三维度打分 + 雷达 ============
  function renderScores() {
    const cats = [D.scores.legal, D.scores.tech, D.scores.econ];
    const html = cats
      .map(cat => {
        const cCount = cat.items.filter(i => i.grade === "C").length;
        const cWarn = cCount > 0 ? `<span class="badge-count" style="background:${cCount ? '#DC2626' : '#10B981'}">${cCount} 项 C</span>` : "";
        const rows = cat.items
          .map(it => {
            const rowCls = it.grade === "C" ? "row-danger" : it.grade === "B" ? "row-warn" : "";
            const gCls = it.grade === "A" ? "grade-a" : it.grade === "B" ? "grade-b" : "grade-c";
            const ded = it.deduction
              ? `<div class="text-danger" style="font-size:12px;margin-top:3px"><b>扣分说明：</b>${it.deduction}</div>`
              : "";
            return `
            <tr class="${rowCls}">
              <td style="width:120px;font-weight:600">${it.name}</td>
              <td>${it.note}${ded}</td>
              <td style="text-align:center;width:56px"><span class="grade ${gCls}">${it.grade}</span></td>
            </tr>`;
          })
          .join("");
        return `
        <div class="cat-card">
          <div class="cat-head">
            <div class="cat-name">
              <svg class="icon" viewBox="0 0 24 24"><path d="m12 2 3 6 6 1-4.5 4 1 6-5.5-3-5.5 3 1-6L3 9l6-1 3-6z"/></svg>
              ${cat.name}
              ${cWarn}
            </div>
            <div class="cat-score mono">${cat.score}<span style="font-size:12px;font-weight:400;color:var(--color-text-muted)">/100</span></div>
          </div>
          <table class="tbl">
            <thead>
              <tr>
                <th>二级指标</th>
                <th>指标说明</th>
                <th style="width:56px;text-align:center">等级</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>`;
      })
      .join("");

    $("scoreCats").innerHTML = html;

    // 雷达图
    const chart = echarts.init($("radarChart"));
    const scoreArr = [D.scores.legal.score, D.scores.tech.score, D.scores.econ.score];
    chart.setOption({
      color: ["#1E40AF", "#F59E0B"],
      tooltip: { trigger: "item" },
      legend: {
        bottom: 0,
        icon: "roundRect",
        textStyle: { fontSize: 12 }
      },
      radar: {
        indicator: [
          { name: "法律价值", max: 100 },
          { name: "技术价值", max: 100 },
          { name: "经济价值", max: 100 }
        ],
        radius: "62%",
        splitNumber: 4,
        axisName: { color: "#1E3A8A", fontSize: 13, fontWeight: 600 },
        splitLine: { lineStyle: { color: "#CBD5E1" } },
        splitArea: {
          areaStyle: {
            color: ["#EFF6FF", "#F8FAFC", "#EFF6FF", "#F8FAFC"]
          }
        },
        axisLine: { lineStyle: { color: "#CBD5E1" } }
      },
      series: [
        {
          type: "radar",
          data: [
            {
              value: scoreArr,
              name: "本次评估得分",
              areaStyle: { color: "rgba(30, 64, 175, 0.28)" },
              lineStyle: { color: "#1E40AF", width: 2 },
              itemStyle: { color: "#1E40AF" },
              label: { show: true, fontSize: 12, fontFamily: "Fira Code", color: "#1E3A8A", fontWeight: 700 }
            },
            {
              value: [80, 80, 80],
              name: "达标基准线",
              areaStyle: { color: "rgba(245, 158, 11, 0.12)" },
              lineStyle: { color: "#F59E0B", width: 1, type: "dashed" },
              itemStyle: { color: "#F59E0B" }
            }
          ]
        }
      ]
    });
    window.addEventListener("resize", () => chart.resize());
  }

  // ============ 板块 4：不达标项 & 硬性规则 ============
  function renderIssues() {
    // 硬性规则
    $("hardRules").innerHTML = D.hardRules
      .map(r => `
        <div class="hard-rule ${r.ok ? "ok" : ""}">
          <div class="hard-icon">
            ${r.ok
              ? '<svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>'
              : '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/></svg>'}
          </div>
          <div class="hard-content">
            <div class="hard-title">${r.title}
              <span class="risk-tag ${r.ok ? "risk-low" : "risk-high"}" style="margin-left:8px">
                ${r.ok ? "通过" : "未通过"}
              </span>
            </div>
            <div class="hard-desc">${r.desc}</div>
          </div>
        </div>
      `)
      .join("");

    // C 级不达标项列表
    const total = D.issuesC.length;
    $("issueCount").textContent = `${total} 项 C 级`;
    $("issueList").innerHTML = D.issuesC
      .map(it => {
        const riskCls = it.risk === "high" ? "risk-high" : it.risk === "mid" ? "risk-mid" : "risk-low";
        const cardCls = it.risk === "mid" ? "issue-card mid" : "issue-card";
        return `
        <div class="${cardCls}">
          <div class="issue-head">
            <div>
              <span class="grade grade-c">C</span>
              <span class="issue-title">${it.cat} · ${it.indicator}<span class="path">/ ${it.risk === "high" ? "高风险" : "中风险"}</span></span>
            </div>
            <span class="risk-tag ${riskCls}">${it.risk === "high" ? "高风险" : "中风险"}</span>
          </div>
          <div class="issue-body"><strong>问题：</strong>${it.desc}</div>
          <div class="issue-trace"><span class="trace-label">📎 溯源：</span>${it.trace}</div>
          <div class="issue-fix"><span class="fix-label">✓ 整改建议：</span>${it.fix}</div>
        </div>`;
      })
      .join("");
  }

  // ============ 板块 5：结论 & 建议 ============
  function renderConclusion() {
    const opts = ["积极申请", "建议申请", "暂缓申请", "不支持申请"];
    const descs = [
      "综合评分高，具备高价值专利特征",
      "整体达标，存在优化空间，建议按建议整改后申请",
      "存在重大缺陷，建议整改到位后重新评估",
      "综合评估不通过，建议放弃或彻底重构"
    ];
    $("conclusionRow").innerHTML = opts
      .map((o, i) => {
        const sel = D.meta.conclusion === o ? "selected" : "";
        return `
        <div class="conclusion-opt ${sel}">
          <div class="co-name">${o}</div>
          <div class="co-desc">${descs[i]}</div>
        </div>`;
      })
      .join("");

    const listHTML = arr => arr.map(v => `<li>${v}</li>`).join("");
    $("adviceLegal").innerHTML = listHTML(D.advice.legal);
    $("adviceTech").innerHTML = listHTML(D.advice.tech);
    $("adviceEcon").innerHTML = listHTML(D.advice.econ);
    $("adviceLong").innerHTML = listHTML(D.advice.longTerm);
  }

  // ============ 板块 6：布局明细 ============
  function renderLayout() {
    const tbody = document.querySelector("#layoutTbl tbody");
    tbody.innerHTML = D.attach2
      .map(r => {
        const rowCls = r.issue ? "row-danger" : "";
        const status = r.issue
          ? `<span class="risk-tag risk-high">瑕疵</span><div class="text-danger" style="font-size:12px;margin-top:4px">${r.issue}</div>`
          : `<span class="risk-tag risk-low">通过</span>`;
        return `
        <tr class="${rowCls}">
          <td class="mono">${r.no}</td>
          <td>${r.dim}</td>
          <td>${r.branch}</td>
          <td>
            <div style="font-weight:600">${r.innovation || '<span class="text-danger">未填写创新点</span>'}</div>
            <div class="text-muted" style="font-size:12px;margin-top:2px">${r.subject || "无有效专利主题"}</div>
          </td>
          <td class="mono" style="text-align:center">${r.count}</td>
          <td>${r.type}</td>
          <td>${(r.region || []).map(x => `<span class="chip">${x}</span>`).join("") || "—"}</td>
          <td class="mono">${r.timing}</td>
          <td>${status}</td>
        </tr>`;
      })
      .join("");
  }

  // ============ 板块 7：风险专项 ============
  function renderRisks() {
    $("riskPanel").innerHTML = D.risks
      .map(r => {
        const cls = "level-" + r.level;
        const lvlText = r.level === "high" ? "高风险" : r.level === "mid" ? "中风险" : "低风险";
        return `
        <div class="risk-card ${cls}">
          <div class="rc-title">${r.name}</div>
          <div class="rc-level">${lvlText}</div>
          <div class="rc-desc">${r.desc}</div>
        </div>`;
      })
      .join("");
  }

  // ============ 板块 8：签字表 ============
  function renderSign() {
    const rows = D.meta.evaluators
      .map(name => `
        <tr>
          <td>${name}</td>
          <td class="mono">${D.meta.phone}</td>
          <td>${D.meta.evalOrg}</td>
          <td><div class="sign-slot">（待签字 · 电子签章）</div></td>
          <td class="mono">${D.meta.evalDate}</td>
        </tr>
      `)
      .join("");
    $("signTbody").innerHTML = rows;
  }

  // ============ 折叠区块 ============
  window.toggleCollapse = function (head) {
    head.parentElement.classList.toggle("open");
  };
  window.toggleAll = function (open) {
    document.querySelectorAll("[data-collapse]").forEach(el => {
      el.classList.toggle("open", open);
    });
  };

  // ============ 锚点导航滚动高亮 ============
  function initAnchors() {
    const links = document.querySelectorAll("#anchorNav a");
    const secs = [...links].map(a => document.querySelector(a.getAttribute("href")));
    window.addEventListener("scroll", () => {
      const y = window.scrollY + 140;
      let cur = 0;
      secs.forEach((s, i) => { if (s && s.offsetTop <= y) cur = i; });
      links.forEach((l, i) => l.classList.toggle("active", i === cur));
    });
  }

  // ============ 导出功能 ============
  const mask = $("exportMask");
  const maskText = $("exportLoadingText");

  // 下拉菜单切换
  function setupExportMenu(btnId, dropdownId) {
    const btn = $(btnId);
    const dropdown = $(dropdownId);
    let isOpen = false;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      isOpen = !isOpen;
      dropdown.classList.toggle("show", isOpen);
      // 关闭另一个下拉
      const otherId = dropdownId === "exportDropdown" ? "exportDropdownBottom" : "exportDropdown";
      $(otherId).classList.remove("show");
    });

    // 点击外部关闭
    document.addEventListener("click", () => {
      if (isOpen) {
        dropdown.classList.remove("show");
        isOpen = false;
      }
    });

    // 导出选项点击
    dropdown.querySelectorAll(".export-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const type = item.getAttribute("data-export");
        dropdown.classList.remove("show");
        isOpen = false;
        handleExport(type);
      });
    });
  }

  setupExportMenu("btnExport", "exportDropdown");
  setupExportMenu("btnExportBottom", "exportDropdownBottom");

  // 导出处理
  async function handleExport(type) {
    if (type === "pdf") {
      window.print();
      return;
    }

    // PNG 导出
    mask.classList.add("show");
    maskText.textContent = "正在生成长图…";

    try {
      // 等待 DOM 完全渲染
      await new Promise(resolve => setTimeout(resolve, 300));

      const target = document.querySelector(".page");
      const canvas = await html2canvas(target, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#F8FAFC",
        windowWidth: target.scrollWidth,
        windowHeight: target.scrollHeight,
        onclone: (clonedDoc) => {
          // 确保克隆文档中 ECharts 图表可见
          const charts = clonedDoc.querySelectorAll("#radarChart");
          charts.forEach(c => {
            c.style.minHeight = "400px";
            c.style.height = "400px";
          });
        }
      });

      maskText.textContent = "生成完成，准备下载…";
      await new Promise(resolve => setTimeout(resolve, 200));

      // 下载图片
      const link = document.createElement("a");
      link.download = `专利评估报告-${D.meta.evalNo}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      mask.classList.remove("show");
    } catch (err) {
      console.error("导出失败", err);
      mask.classList.remove("show");
      alert("导出失败，请重试或使用打印功能导出 PDF。");
    }
  }

  // ============ 初始化 ============
  function init() {
    renderHeader();
    renderKpi();
    renderAttach1();
    renderAttach2();
    renderScores();
    renderIssues();
    renderConclusion();
    renderLayout();
    renderRisks();
    renderSign();
    initAnchors();
    $("genTime").textContent = new Date().toLocaleString("zh-CN");
  }
  document.addEventListener("DOMContentLoaded", init);
})();
