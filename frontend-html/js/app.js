const baseUrl = 'https://linkedin-clone-backendd.onrender.com/';

let authMode = true;
let usr = null;
let feed = [];
let editId = null;

document.addEventListener('DOMContentLoaded', () => {
  console.log('init ok');
  checkUser();
  bindUI();
});

function bindUI() {
  const pwEl = document.getElementById('passwordInput');
  if (pwEl) {
    pwEl.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter') handleAuth();
    });
  }

  const newC = document.getElementById('newPostContent');
  if (newC) {
    newC.addEventListener('keypress', (ev) => {
      if (ev.key === 'Enter' && ev.ctrlKey) createPost();
    });
  }
}

function checkUser() {
  const t = localStorage.getItem('token');
  const u = localStorage.getItem('user');

  if (t && u) {
    try {
      usr = JSON.parse(u);
      showMain();
      getFeed();
    } catch(e) {
      console.log('parse err', e);
      localStorage.clear();
    }
  }
}

function switchAuth() {
  authMode = !authMode;
  const nm = document.getElementById('nameField');
  const ttl = document.getElementById('authTitle');
  const sub = document.getElementById('authSubtitle');
  const btn = document.getElementById('authBtn');
  const tgl = document.getElementById('toggleAuthBtn');

  if (authMode) {
    nm.style.display = 'none';
    ttl.textContent = 'Welcome Back';
    sub.textContent = 'Sign in to continue';
    btn.textContent = 'Sign In';
    tgl.textContent = "Don't have an account? Sign Up";
  } else {
    nm.style.display = 'block';
    ttl.textContent = 'Join Us';
    sub.textContent = 'Create your account';
    btn.textContent = 'Sign Up';
    tgl.textContent = 'Already have an account? Sign In';
  }

  hideErr();
  resetForm();
}

async function handleAuth() {
  const nm = document.getElementById('nameInput').value.trim();
  const em = document.getElementById('emailInput').value.trim();
  const pw = document.getElementById('passwordInput').value;

  if (!em || !pw) { showErr('Please fill in all fields'); return; }
  if (!authMode && !nm) { showErr('Please enter your name'); return; }
  if (pw.length < 6) { showErr('Password must be at least 6 characters'); return; }

  const path = authMode ? '/api/auth/login' : '/api/auth/signup';
  const body = authMode ? { email: em, password: pw } : { name: nm, email: em, password: pw };

  const btn = document.getElementById('authBtn');
  btn.disabled = true;
  btn.textContent = 'Please wait...';

  try {
    const r = await fetch(baseUrl + path, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(body)
    });

    const res = await r.json();
    if (!r.ok) throw new Error(res.message || 'Auth failed');

    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    usr = res.user;

    resetForm();
    hideErr();
    showMain();
    getFeed();

  } catch(err) {
    console.log('auth err:', err);
    showErr(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = authMode ? 'Sign In' : 'Sign Up';
  }
}

function logoutNow() {
  if (confirm('Logout?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    usr = null;
    feed = [];
    editId = null;
    showAuthUI();
  }
}

function resetForm() {
  document.getElementById('nameInput').value = '';
  document.getElementById('emailInput').value = '';
  document.getElementById('passwordInput').value = '';
}

async function getFeed() {
  try {
    const r = await fetch(baseUrl + '/api/posts');
    if (!r.ok) throw new Error('fetch failed');

    const data = await r.json();
    feed = data.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
    drawFeed();
  } catch(e) {
    console.log('feed err', e);
    document.getElementById('postsContainer').innerHTML = `
      <div class="empty-state">
        <p>Unable to load posts. Please refresh.</p>
      </div>
    `;
  }
}

async function createPost() {
  const c = document.getElementById('newPostContent').value.trim();
  if (!c) { alert('Write something.'); return; }

  try {
    const t = localStorage.getItem('token');
    const r = await fetch(baseUrl+'/api/posts', {
      method:'POST',
      headers:{ 'Content-Type':'application/json','Authorization':`Bearer ${t}` },
      body: JSON.stringify({ content:c })
    });

    if (!r.ok) throw new Error('create fail');
    const np = await r.json();
    feed.unshift(np);
    document.getElementById('newPostContent').value='';
    drawFeed();
  } catch(e) {
    console.log('create err', e);
    alert('Try again.');
  }
}

async function toggleLike(id) {
  try {
    const t = localStorage.getItem('token');
    const r = await fetch(baseUrl+`/api/posts/${id}/like`, {
      method:'POST',
      headers:{'Authorization':`Bearer ${t}`}
    });

    if (!r.ok) throw new Error();
    const up = await r.json();
    feed = feed.map(x => x._id === id ? up : x);
    drawFeed();
  } catch(e){
    console.log('like err', e);
  }
}

function startEdit(id) {
  editId = id;
  drawFeed();
  setTimeout(()=>{
    const tx = document.getElementById(`edit-${id}`);
    if (tx) {
      tx.focus();
      tx.setSelectionRange(tx.value.length, tx.value.length);
    }
  }, 80);
}

function cancelEdit() {
  editId = null;
  drawFeed();
}

async function saveEdit(id) {
  const c = document.getElementById(`edit-${id}`).value.trim();
  if (!c) { alert('Empty not allowed'); return; }

  try {
    const t = localStorage.getItem('token');
    const r = await fetch(baseUrl+`/api/posts/${id}`, {
      method:'PUT',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${t}`},
      body: JSON.stringify({ content:c })
    });

    if (!r.ok) throw new Error();
    const up = await r.json();
    feed = feed.map(x => x._id === id ? up : x);
    editId = null;
    drawFeed();
  } catch(e){
    console.log('upd err', e);
    alert('Try again.');
  }
}

async function deletePost(id) {
  if (!confirm('Delete?')) return;

  try {
    const t = localStorage.getItem('token');
    const r = await fetch(baseUrl+`/api/posts/${id}`, {
      method:'DELETE',
      headers:{'Authorization':`Bearer ${t}`}
    });

    if (!r.ok) throw new Error();
    feed = feed.filter(x => x._id !== id);
    drawFeed();
  } catch(e){
    console.log('del err', e);
  }
}

function drawFeed() {
  const c = document.getElementById('postsContainer');

  if (feed.length === 0) {
    c.innerHTML = `
      <div class="empty-state">
        <p>No posts yet.</p>
      </div>
    `;
    return;
  }

  c.innerHTML = feed.map(p=>{
    const own = p.author._id === usr._id;
    const lk = p.likes.includes(usr._id);
    const ed = editId === p._id;

    return `
    <div class="post-card">
      <div class="post-header">
        <div class="post-author">
          <div class="post-avatar">${p.author.name.charAt(0).toUpperCase()}</div>
          <div>
            <h3>${escapeHtml(p.author.name)}</h3>
            <p>${fmtDate(p.createdAt)}</p>
          </div>
        </div>
        ${own?`
          <div class="post-actions-top">
            <button onclick="startEdit('${p._id}')">✏️</button>
            <button onclick="deletePost('${p._id}')">🗑️</button>
          </div>`:``}
      </div>

      ${ed?`
        <textarea id="edit-${p._id}" rows="3">${escapeHtml(p.content)}</textarea>
        <div>
          <button onclick="saveEdit('${p._id}')">Save</button>
          <button onclick="cancelEdit()">Cancel</button>
        </div>
      `:`
        <div class="post-content">${escapeHtml(p.content)}</div>
      `}

      <div class="post-actions-bottom">
        <button onclick="toggleLike('${p._id}')" class="${lk?'liked':''}">
          ${lk?'❤️':'🤍'} ${p.likes.length}
        </button>
        <button>💬 Comment</button>
      </div>
    </div>
    `;
  }).join('');
}

function fmtDate(d) {
  const dt = new Date(d), now = new Date();
  const s = Math.floor((now-dt)/1000);
  if (s<60) return 'Just now';
  if (s<3600) return `${Math.floor(s/60)}m ago`;
  if (s<86400) return `${Math.floor(s/3600)}h ago`;
  if (s<604800) return `${Math.floor(s/86400)}d ago`;
  return dt.toLocaleDateString();
}

function escapeHtml(t) {
  const div = document.createElement('div');
  div.textContent = t;
  return div.innerHTML;
}

function showAuthUI() {
  document.getElementById('authPage').style.display='flex';
  document.getElementById('appPage').style.display='none';
}

function showMain() {
  document.getElementById('authPage').style.display='none';
  document.getElementById('appPage').style.display='block';

  if (usr) {
    document.getElementById('userAvatar').textContent = usr.name.charAt(0).toUpperCase();
    document.getElementById('userName').textContent = usr.name;
    document.getElementById('userEmail').textContent = usr.email;
  }
}

function showErr(msg){
  const el = document.getElementById('errorMessage');
  el.textContent = msg;
  el.classList.remove('hidden');
}

function hideErr(){
  const el = document.getElementById('errorMessage');
  el.classList.add('hidden');
}

console.log('app ok');
console.log('api:', baseUrl);
