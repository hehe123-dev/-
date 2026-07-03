// 用户管理JS
function initUsers() {
  if (!localStorage.getItem('accounts')) {
    const defaultAccounts = [
      { username: 'admin', password: 'admin123', name: '系统管理员', role: 'admin', createdAt: '2026-01-01' },
      { username: 'evaluator', password: '123456', name: '张评估', role: 'evaluator', createdAt: '2026-01-15' }
    ];
    localStorage.setItem('accounts', JSON.stringify(defaultAccounts));
  }
}

function loadUsers() {
  initUsers();
  const accounts = JSON.parse(localStorage.getItem('accounts'));
  const tbody = document.getElementById('userTableBody');

  tbody.innerHTML = accounts.map((acc, index) => `
    <tr>
      <td>${index + 1}</td>
      <td class="mono">${acc.username}</td>
      <td>${acc.name}</td>
      <td><span class="badge ${acc.role === 'admin' ? 'badge-admin' : 'badge-evaluator'}">${acc.role === 'admin' ? '管理员' : '用户'}</span></td>
      <td class="mono">${acc.createdAt}</td>
      <td>
        ${acc.username === 'admin' ? '<span style="color: #94a3b8;">系统账号</span>' : `
          <button class="action-btn action-btn-edit" onclick="editUser('${acc.username}')">编辑</button>
          <button class="action-btn action-btn-delete" onclick="deleteUser('${acc.username}')">删除</button>
        `}
      </td>
    </tr>
  `).join('');
}

let editingUser = null;

function openAddUserModal() {
  editingUser = null;
  document.getElementById('modalTitle').textContent = '添加账号';
  document.getElementById('userForm').reset();
  document.getElementById('userModal').classList.add('show');
}

function editUser(username) {
  const accounts = JSON.parse(localStorage.getItem('accounts'));
  const user = accounts.find(a => a.username === username);
  if (!user) return;

  editingUser = username;
  document.getElementById('modalTitle').textContent = '编辑账号';
  document.getElementById('inputUsername').value = user.username;
  document.getElementById('inputName').value = user.name;
  document.getElementById('inputPassword').value = user.password;
  document.getElementById('inputRole').value = user.role;
  document.getElementById('userModal').classList.add('show');
}

function closeUserModal() {
  document.getElementById('userModal').classList.remove('show');
}

function deleteUser(username) {
  if (!confirm('确定要删除该账号吗？删除后无法恢复。')) return;

  let accounts = JSON.parse(localStorage.getItem('accounts'));
  accounts = accounts.filter(a => a.username !== username);
  localStorage.setItem('accounts', JSON.stringify(accounts));
  loadUsers();
  alert('删除成功');
}

document.addEventListener('DOMContentLoaded', function() {
  const userForm = document.getElementById('userForm');
  if (userForm) {
    userForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const username = document.getElementById('inputUsername').value.trim();
      const name = document.getElementById('inputName').value.trim();
      const password = document.getElementById('inputPassword').value.trim();
      const role = document.getElementById('inputRole').value;

      if (!username || !name || !password) {
        alert('请填写完整信息');
        return;
      }

      let accounts = JSON.parse(localStorage.getItem('accounts'));

      if (editingUser) {
        const index = accounts.findIndex(a => a.username === editingUser);
        if (index !== -1) {
          accounts[index] = { ...accounts[index], username, name, password, role };
        }
      } else {
        if (accounts.find(a => a.username === username)) {
          alert('该账号已存在');
          return;
        }
        accounts.push({
          username,
          password,
          name,
          role,
          createdAt: new Date().toISOString().split('T')[0]
        });
      }

      localStorage.setItem('accounts', JSON.stringify(accounts));
      closeUserModal();
      loadUsers();
      alert(editingUser ? '编辑成功' : '添加成功');
    });
  }
});
