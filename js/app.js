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
    // 按评估维度 + 技术分支分组，计算 rowspan
    const grouped = [];
    let currentGroup = null;

    D.attach2.forEach(r => {
      const key = `${r.dim}|${r.branch}`;
      if (!currentGroup || currentGroup.key !== key) {
        currentGroup = { key, dim: r.dim, branch: r.branch, items: [] };
        grouped.push(currentGroup);
      }
      currentGroup.items.push(r);
    });

    // 渲染带 rowspan 的表格（纯信息展示，无校验）
    let rowIndex = 0;
    const rows = grouped.map(group => {
      return group.items.map((r, i) => {
        rowIndex++;
        const isFirstInGroup = i === 0;
        const rowspan = group.items.length;

        return `
        <tr>
          ${isFirstInGroup ? `<td class="mono" style="text-align:center;vertical-align:middle" rowspan="${rowspan}">${rowIndex}</td>` : ''}
          ${isFirstInGroup ? `<td style="text-align:center;vertical-align:middle" rowspan="${rowspan}">${group.dim}</td>` : ''}
          ${isFirstInGroup ? `<td style="vertical-align:middle" rowspan="${rowspan}">${group.branch}</td>` : ''}
          <td><div style="font-weight:600">${r.innovation || '<span class="text-muted">—</span>'}</div></td>
          <td><div style="font-size:13px">${r.subject || '—'}</div></td>
          <td><div style="font-size:13px;color:var(--color-text-muted)">${r.scheme || '—'}</div></td>
          <td class="mono" style="text-align:center">${r.count || 0}</td>
          <td style="text-align:center">${r.type || '—'}</td>
          <td>${(r.region || []).map(x => `<span class="chip">${x}</span>`).join("") || "—"}</td>
          <td class="mono" style="text-align:center">${r.timing || '—'}</td>
        </tr>`;
      }).join("");
    }).join("");

    $("a2Body").innerHTML = `
      <div style="overflow-x:auto">
        <table class="tbl">
          <thead>
            <tr>
              <th style="width:50px">序号</th>
              <th style="width:100px">评估维度</th>
              <th style="width:140px">技术分支</th>
              <th style="width:180px">创新点</th>
              <th style="width:200px">专利主题</th>
              <th style="width:180px">技术方案</th>
              <th style="width:60px">拟申请数量</th>
              <th style="width:80px">专利类型</th>
              <th style="width:140px">保护地域</th>
              <th style="width:100px">拟申请时间</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  }

  // ============ 附件3：FTO 检索报告基础信息（原文预览） ============
  function renderAttach3() {
    const a3 = D.attach3;
    $("a3Body").innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">
        <div class="info-item">
          <div class="info-label">报告编号</div>
          <div class="info-value mono">${a3.reportNo}</div>
        </div>
        <div class="info-item">
          <div class="info-label">检索日期</div>
          <div class="info-value">${a3.reportDate}</div>
        </div>
        <div class="info-item">
          <div class="info-label">检索机构</div>
          <div class="info-value">${a3.agency}</div>
        </div>
        <div class="info-item" style="grid-column:span 3">
          <div class="info-label">检索范围</div>
          <div class="info-value">${a3.scope}</div>
        </div>
        <div class="info-item" style="grid-column:span 3">
          <div class="info-label">检索关键词</div>
          <div class="info-value">${a3.keywords}</div>
        </div>
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

  // ============ FTO 检索结果分析（⑥ 和 ⑦ 之间） ============
  function renderFtoAnalysis() {
    const a3 = D.attach3;
    const riskRows = a3.riskPatents.map(p => {
      const levelClass = p.riskLevel === "高风险" ? "risk-high" : p.riskLevel === "中风险" ? "risk-mid" : "risk-low";
      return `
      <tr>
        <td class="mono" style="font-weight:600">${p.patentNo}</td>
        <td>${p.title}</td>
        <td>${p.applicant}</td>
        <td class="mono">${p.publicDate}</td>
        <td style="text-align:center"><span class="risk-tag ${levelClass}">${p.riskLevel}</span></td>
        <td style="font-size:12px;line-height:1.6">${p.analysis}</td>
      </tr>`;
    }).join("");

    $("ftoAnalysis").innerHTML = `
      <div style="margin-bottom:20px">
        <div style="font-weight:700;font-size:14px;margin-bottom:10px">检索结果统计</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">
          <div style="padding:16px;background:#F8FAFC;border-radius:10px;text-align:center;border:1px solid var(--color-border)">
            <div style="font-size:28px;font-weight:700;color:var(--color-primary);font-family:'Fira Code',monospace">${a3.searchResult.totalFound}</div>
            <div style="font-size:13px;color:var(--color-text-muted);margin-top:6px">检索总量</div>
          </div>
          <div style="padding:16px;background:#FEF2F2;border-radius:10px;text-align:center;border:1px solid #FECACA">
            <div style="font-size:28px;font-weight:700;color:#DC2626;font-family:'Fira Code',monospace">${a3.searchResult.relevantHigh}</div>
            <div style="font-size:13px;color:#991B1B;margin-top:6px">高相关</div>
          </div>
          <div style="padding:16px;background:#FFFBEB;border-radius:10px;text-align:center;border:1px solid #FDE68A">
            <div style="font-size:28px;font-weight:700;color:#F59E0B;font-family:'Fira Code',monospace">${a3.searchResult.relevantMid}</div>
            <div style="font-size:13px;color:#92400E;margin-top:6px">中相关</div>
          </div>
          <div style="padding:16px;background:#F0FDF4;border-radius:10px;text-align:center;border:1px solid #BBF7D0">
            <div style="font-size:28px;font-weight:700;color:#10B981;font-family:'Fira Code',monospace">${a3.searchResult.relevantLow}</div>
            <div style="font-size:13px;color:#065F46;margin-top:6px">低相关</div>
          </div>
        </div>
      </div>

      <div style="margin-bottom:20px">
        <div style="font-weight:700;font-size:14px;margin-bottom:10px">重点风险专利明细</div>
        <div style="overflow-x:auto">
          <table class="tbl">
            <thead>
              <tr>
                <th style="width:140px">专利号</th>
                <th style="width:280px">专利名称</th>
                <th style="width:180px">申请人</th>
                <th style="width:100px">公开日期</th>
                <th style="width:90px">风险等级</th>
                <th>风险分析与建议</th>
              </tr>
            </thead>
            <tbody>${riskRows}</tbody>
          </table>
        </div>
      </div>

      <div style="padding:16px;background:#FFFBEB;border-left:4px solid #F59E0B;border-radius:8px;margin-bottom:16px">
        <div style="font-weight:700;font-size:14px;margin-bottom:8px;color:#92400E">📋 检索结论</div>
        <div style="font-size:13px;line-height:1.8;color:var(--color-text)">${a3.conclusion}</div>
      </div>

      <div style="padding:16px;background:#EFF6FF;border-left:4px solid var(--color-primary);border-radius:8px">
        <div style="font-weight:700;font-size:14px;margin-bottom:8px;color:var(--color-primary-dark)">🔜 后续计划</div>
        <div style="font-size:13px;line-height:1.8;color:var(--color-text)">${a3.nextStep}</div>
      </div>
    `;
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

  // 导出按钮：直接触发 PNG 下载
  ["btnExport", "btnExportBottom"].forEach(id => {
    const btn = $(id);
    if (btn) btn.addEventListener("click", () => handleExport());
  });

  // 导出处理（仅 PNG）
  async function handleExport() {
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
    renderAttach3();
    renderScores();
    renderIssues();
    renderConclusion();
    renderLayout();
    renderFtoAnalysis();
    renderRisks();
    initAnchors();
    $("genTime").textContent = new Date().toLocaleString("zh-CN");
  }
  document.addEventListener("DOMContentLoaded", init);
})();
