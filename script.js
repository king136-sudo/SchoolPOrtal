/*
 * ══════════════════════════════════════════════════
 *  EduPortal — School Management System
 *  Developed by: Salimu Nelson
 *  File: script.js
 *  Technologies: HTML5, CSS3, Vanilla JavaScript
 *  Year: 2025
 * ══════════════════════════════════════════════════
 */

// ══════════════════════════════════════════════════
//  STATE VARIABLES
// ══════════════════════════════════════════════════
let role        = '';
let currentUser = '';
let classFilter = '';
let attState    = {};
let attLogs     = [];
let nextStudId  = 6;
let nextTchId   = 5;

// ══════════════════════════════════════════════════
//  SAMPLE DATA
// ══════════════════════════════════════════════════
let students = [
  { id:'STU-001', name:'Amina Juma',     cls:'Form 2A', gender:'Female', parent:'Juma Hassan',   phone:'+255 712 111 111', status:'Active' },
  { id:'STU-002', name:'Brian Mwamba',   cls:'Form 1A', gender:'Male',   parent:'Peter Mwamba',  phone:'+255 713 222 222', status:'Active' },
  { id:'STU-003', name:'Catherine Osei', cls:'Form 3A', gender:'Female', parent:'Grace Osei',    phone:'+255 714 333 333', status:'Active' },
  { id:'STU-004', name:'David Kimani',   cls:'Form 2B', gender:'Male',   parent:'James Kimani',  phone:'+255 715 444 444', status:'Active' },
  { id:'STU-005', name:'Esther Diallo',  cls:'Form 4A', gender:'Female', parent:'Moussa Diallo', phone:'+255 716 555 555', status:'Active' },
];

let teachers = [
  { id:'TCH-001', name:'Mrs. Amina Hassan',  subject:'Mathematics', cls:'Form 2A', phone:'+255 720 001 001', qual:'B.Ed Mathematics',  status:'Active' },
  { id:'TCH-002', name:'Mr. John Mollel',    subject:'English',     cls:'Form 1A', phone:'+255 720 002 002', qual:'B.A. English Lit.', status:'Active' },
  { id:'TCH-003', name:'Ms. Fatuma Ally',    subject:'Biology',     cls:'Form 3A', phone:'+255 720 003 003', qual:'B.Sc. Biology',     status:'Active' },
  { id:'TCH-004', name:'Mr. George Mwangi', subject:'History',     cls:'Form 4A', phone:'+255 720 004 004', qual:'B.A. History',      status:'Active' },
];

let grades = [
  { student:'Amina Juma',     cls:'Form 2A', subject:'Mathematics', score:88, term:'Term 1' },
  { student:'Brian Mwamba',   cls:'Form 1A', subject:'English',     score:75, term:'Term 1' },
  { student:'Catherine Osei', cls:'Form 3A', subject:'Biology',     score:92, term:'Term 1' },
  { student:'David Kimani',   cls:'Form 2B', subject:'History',     score:61, term:'Term 1' },
  { student:'Esther Diallo',  cls:'Form 4A', subject:'Kiswahili',   score:55, term:'Term 1' },
];

let notices = [
  { title:'End of Term Exams',     body:'End of term examinations will begin on 15th July 2025. Students are advised to prepare well.',  type:'urgent',  date:'June 1, 2025',  by:'Admin' },
  { title:'Sports Day',             body:'Annual Sports Day is scheduled for 28th June 2025. All students must participate.',              type:'general', date:'May 28, 2025', by:'Admin' },
  { title:'School Fees Reminder',  body:'All students are reminded to clear school fees by end of June 2025.',                            type:'info',    date:'May 20, 2025', by:'Admin' },
];

// ══════════════════════════════════════════════════
//  NAV CONFIGURATION
// ══════════════════════════════════════════════════
const navConfig = [
  { id:'dashboard',  ic:'🏠', label:'Dashboard',   group:'Main'   },
  { id:'students',   ic:'👨‍🎓', label:'Students',    group:'Manage' },
  { id:'teachers',   ic:'👩‍🏫', label:'Teachers',    group:'Manage' },
  { id:'grades',     ic:'📝', label:'Grades',       group:'Manage' },
  { id:'attendance', ic:'📅', label:'Attendance',   group:'Manage' },
  { id:'notices',    ic:'📢', label:'Notice Board', group:'Admin'  },
  { id:'settings',   ic:'⚙️', label:'Settings',     group:'Admin'  },
];

const roleNav = {
  admin:   ['dashboard','students','teachers','grades','attendance','notices','settings'],
  teacher: ['dashboard','students','grades','attendance','notices'],
  student: ['dashboard','grades','notices'],
};

// ══════════════════════════════════════════════════
//  AUTH — LOGIN & LOGOUT
// ══════════════════════════════════════════════════
function login() {
  const user = document.getElementById('userInput').value.trim() || 'User';
  const pass = document.getElementById('passInput').value;

  if (!pass) {
    showToast('Enter your password', 'bad');
    return;
  }

  role        = document.getElementById('roleSelect').value;
  currentUser = user;

  // Hide login, show app
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('app').style.display         = 'block';

  // Update sidebar user info
  document.getElementById('sbAv').textContent   = user[0].toUpperCase();
  document.getElementById('sbName').textContent = user;
  document.getElementById('sbRole').textContent = role.charAt(0).toUpperCase() + role.slice(1);

  // Set date in topbar
  document.getElementById('topDate').textContent = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  buildNav();
  showSection('dashboard');
}

function logout() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('app').style.display         = 'none';
  document.getElementById('passInput').value = '';
  document.getElementById('userInput').value = '';
}

// ══════════════════════════════════════════════════
//  NAVIGATION — BUILD & SWITCH
// ══════════════════════════════════════════════════
function buildNav() {
  const nav     = document.getElementById('sideNav');
  nav.innerHTML = '';
  let lastGroup = '';

  const allowed = roleNav[role] || [];

  navConfig
    .filter(n => allowed.includes(n.id))
    .forEach(n => {
      // Section group heading
      if (n.group !== lastGroup) {
        const g       = document.createElement('div');
        g.className   = 'sb-group';
        g.textContent = n.group;
        nav.appendChild(g);
        lastGroup = n.group;
      }

      // Nav button
      const b       = document.createElement('button');
      b.className   = 'sb-btn';
      b.id          = 'nav-' + n.id;
      b.innerHTML   = `<span class="ic">${n.ic}</span>${n.label}`;
      b.onclick     = () => showSection(n.id);
      nav.appendChild(b);
    });
}

function showSection(id) {
  // Deactivate all sections & buttons
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('active'));

  // Activate target
  const sec = document.getElementById('sec-' + id);
  if (sec) sec.classList.add('active');

  const btn = document.getElementById('nav-' + id);
  if (btn) btn.classList.add('active');

  // Update topbar title
  const found = navConfig.find(n => n.id === id);
  document.getElementById('pageTitle').textContent = found ? found.label : 'Dashboard';

  // Run the matching render function
  const renderMap = {
    dashboard:  renderDashboard,
    students:   () => renderStudents(''),
    teachers:   () => renderTeachers(''),
    grades:     () => { populateGradeDropdown(); renderGrades(''); },
    attendance: renderAttCards,
    notices:    renderNotices,
    settings:   () => {},
  };

  if (renderMap[id]) renderMap[id]();

  // Hide notice form for students
  if (id === 'notices') {
    const nf = document.getElementById('noticeFormCard');
    if (nf) nf.style.display = role === 'student' ? 'none' : 'block';
  }
}

// ══════════════════════════════════════════════════
//  DASHBOARD
// ══════════════════════════════════════════════════
function renderDashboard() {
  document.getElementById('dStudents').textContent = students.length;
  document.getElementById('dTeachers').textContent = teachers.length;
  document.getElementById('dNotices').textContent  = notices.length;

  // Recent students table
  document.getElementById('dashStudents').innerHTML = students.slice(0, 5).map(s =>
    `<tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="av">${s.name[0]}</div>${s.name}
        </div>
      </td>
      <td>${s.cls}</td>
      <td><span class="badge ok">${s.status}</span></td>
    </tr>`
  ).join('');

  // Latest notices preview
  document.getElementById('dashNotices').innerHTML = notices.slice(0, 3).map(n =>
    `<div class="notice-card ${n.type}">
      <div class="n-title">${n.title}</div>
      <div class="n-meta">${n.date}</div>
    </div>`
  ).join('');

  // Attendance overview per class
  const classes = ['Form 1A','Form 1B','Form 2A','Form 2B','Form 3A','Form 4A'];

  document.getElementById('attOverview').innerHTML = classes.map(cls => {
    const total = students.filter(s => s.cls === cls).length;
    const pct   = total > 0 ? Math.floor(Math.random() * 30 + 70) : 0;
    const color = pct >= 80 ? 'var(--green)' : pct >= 60 ? 'var(--yellow)' : 'var(--red)';

    return `<div>
      <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px;">
        <span style="font-weight:600;">${cls}</span>
        <span style="color:var(--muted)">${pct}% present · ${total} students</span>
      </div>
      <div class="prog">
        <div class="prog-fill" style="width:${pct}%;background:${color}"></div>
      </div>
    </div>`;
  }).join('');
}

// ══════════════════════════════════════════════════
//  STUDENTS
// ══════════════════════════════════════════════════
function renderStudents(query, cls = '') {
  const f    = (query || '').toLowerCase();
  let list   = students.filter(s =>
    s.name.toLowerCase().includes(f) || s.id.toLowerCase().includes(f)
  );
  if (cls) list = list.filter(s => s.cls === cls);

  document.getElementById('studentsTable').innerHTML = list.length
    ? list.map(s =>
        `<tr>
          <td>
            <div style="display:flex;align-items:center;gap:9px;">
              <div class="av">${s.name[0]}</div><b>${s.name}</b>
            </div>
          </td>
          <td>${s.id}</td>
          <td>${s.cls}</td>
          <td>${s.gender}</td>
          <td>${s.parent}</td>
          <td>${s.phone}</td>
          <td><span class="badge ok">${s.status}</span></td>
          <td>
            ${role !== 'student'
              ? `<button class="btn-sm btn-danger" onclick="removeStudent('${s.id}')">Remove</button>`
              : '—'}
          </td>
        </tr>`
      ).join('')
    : '<tr><td colspan="8" style="color:var(--muted);text-align:center;padding:20px;">No students found.</td></tr>';
}

function filterStudentClass(cls) {
  classFilter = cls;
  const searchVal = document.querySelector('#sec-students .search-bar')?.value || '';
  renderStudents(searchVal, cls);
}

function addStudent() {
  const name   = document.getElementById('sName').value.trim();
  const sid    = document.getElementById('sId').value.trim() || `STU-${String(nextStudId).padStart(3, '0')}`;
  const cls    = document.getElementById('sClass').value;
  const gender = document.getElementById('sGender').value;
  const parent = document.getElementById('sParent').value.trim() || '—';
  const phone  = document.getElementById('sPhone').value.trim() || '—';

  if (!name) { showToast('Enter student name', 'bad'); return; }

  students.push({ id: sid, name, cls, gender, parent, phone, status: 'Active' });
  nextStudId++;

  ['sName','sId','sParent','sPhone'].forEach(id => {
    document.getElementById(id).value = '';
  });

  renderStudents('');
  showToast(`${name} enrolled successfully!`, 'ok');
}

function removeStudent(id) {
  const s = students.find(x => x.id === id);
  if (!confirm(`Remove ${s?.name}?`)) return;
  students = students.filter(x => x.id !== id);
  renderStudents('');
  showToast('Student removed.', 'bad');
}

// ══════════════════════════════════════════════════
//  TEACHERS
// ══════════════════════════════════════════════════
function renderTeachers(query) {
  const f    = (query || '').toLowerCase();
  const list = teachers.filter(t =>
    t.name.toLowerCase().includes(f) || t.subject.toLowerCase().includes(f)
  );

  document.getElementById('teachersTable').innerHTML = list.length
    ? list.map(t =>
        `<tr>
          <td>
            <div style="display:flex;align-items:center;gap:9px;">
              <div class="av" style="background:#d4f5e9;color:var(--green)">
                ${t.name[4] || t.name[0]}
              </div>
              <b>${t.name}</b>
            </div>
          </td>
          <td>${t.id}</td>
          <td>${t.subject}</td>
          <td>${t.cls}</td>
          <td>${t.phone}</td>
          <td>${t.qual}</td>
          <td><span class="badge ok">${t.status}</span></td>
          <td>
            ${role === 'admin'
              ? `<button class="btn-sm btn-danger" onclick="removeTeacher('${t.id}')">Remove</button>`
              : '—'}
          </td>
        </tr>`
      ).join('')
    : '<tr><td colspan="8" style="color:var(--muted);text-align:center;padding:20px;">No teachers found.</td></tr>';
}

function addTeacher() {
  const name = document.getElementById('tName').value.trim();
  const tid  = document.getElementById('tId').value.trim() || `TCH-${String(nextTchId).padStart(3, '0')}`;
  const sub  = document.getElementById('tSubject').value.trim();
  const cls  = document.getElementById('tClass').value;
  const phone= document.getElementById('tPhone').value.trim() || '—';
  const qual = document.getElementById('tQual').value.trim() || '—';

  if (!name || !sub) { showToast('Fill in name and subject', 'bad'); return; }

  teachers.push({ id: tid, name, subject: sub, cls, phone, qual, status: 'Active' });
  nextTchId++;

  ['tName','tId','tSubject','tPhone','tQual'].forEach(id => {
    document.getElementById(id).value = '';
  });

  renderTeachers('');
  showToast(`${name} added!`, 'ok');
}

function removeTeacher(id) {
  const t = teachers.find(x => x.id === id);
  if (!confirm(`Remove ${t?.name}?`)) return;
  teachers = teachers.filter(x => x.id !== id);
  renderTeachers('');
  showToast('Teacher removed.', 'bad');
}

// ══════════════════════════════════════════════════
//  GRADES
// ══════════════════════════════════════════════════
function populateGradeDropdown() {
  document.getElementById('gStudent').innerHTML = students.map(s =>
    `<option value="${s.name}">${s.name} (${s.cls})</option>`
  ).join('');
}

function gradeInfo(score) {
  if (score >= 80) return { grade: 'A', remarks: 'Excellent',      cls: 'grade-A' };
  if (score >= 65) return { grade: 'B', remarks: 'Good',           cls: 'grade-B' };
  if (score >= 50) return { grade: 'C', remarks: 'Average',        cls: 'grade-C' };
  if (score >= 40) return { grade: 'D', remarks: 'Below Average',  cls: 'grade-D' };
  return                  { grade: 'F', remarks: 'Fail',           cls: 'grade-D' };
}

function renderGrades(query) {
  const f    = (query || '').toLowerCase();
  const list = grades.filter(g =>
    g.student.toLowerCase().includes(f) || g.subject.toLowerCase().includes(f)
  );

  document.getElementById('gradesTable').innerHTML = list.length
    ? list.map(g => {
        const { grade, remarks, cls } = gradeInfo(g.score);
        return `<tr>
          <td><b>${g.student}</b></td>
          <td>${g.cls}</td>
          <td>${g.subject}</td>
          <td><b>${g.score}/100</b></td>
          <td><span class="${cls}">${grade}</span></td>
          <td>${g.term}</td>
          <td>
            <span class="badge ${grade === 'A' ? 'ok' : grade === 'F' ? 'err' : 'warn'}">
              ${remarks}
            </span>
          </td>
        </tr>`;
      }).join('')
    : '<tr><td colspan="7" style="color:var(--muted);text-align:center;padding:20px;">No grade records found.</td></tr>';
}

function addGrade() {
  const student = document.getElementById('gStudent').value;
  const subject = document.getElementById('gSubject').value;
  const score   = parseInt(document.getElementById('gScore').value);
  const term    = document.getElementById('gTerm').value;

  if (!student || isNaN(score) || score < 0 || score > 100) {
    showToast('Enter a valid score (0–100)', 'bad');
    return;
  }

  const cls = students.find(s => s.name === student)?.cls || '—';
  grades.push({ student, cls, subject, score, term });

  document.getElementById('gScore').value = '';
  renderGrades('');
  showToast('Grade saved!', 'ok');
}

// ══════════════════════════════════════════════════
//  ATTENDANCE
// ══════════════════════════════════════════════════
function renderAttCards() {
  const cls  = document.getElementById('attClass').value;
  const list = students.filter(s => s.cls === cls);

  // Default to today's date
  if (!document.getElementById('attDate').value) {
    document.getElementById('attDate').value = new Date().toISOString().split('T')[0];
  }

  document.getElementById('attCards').innerHTML = list.length
    ? list.map(s =>
        `<div class="att-card">
          <div class="av">${s.name[0]}</div>
          <div>
            <div class="att-name">${s.name}</div>
            <div class="att-id">${s.id}</div>
          </div>
          <div class="att-toggle">
            <button
              class="toggle-btn ${attState[s.id] !== false ? 'on' : ''}"
              id="tog-${s.id}"
              onclick="toggleAtt('${s.id}')">
            </button>
          </div>
        </div>`
      ).join('')
    : '<p style="color:var(--muted);font-size:13px">No students in this class.</p>';
}

function toggleAtt(id) {
  attState[id] = attState[id] === false ? true : false;
  const btn = document.getElementById('tog-' + id);
  if (btn) btn.classList.toggle('on', attState[id] !== false);
}

function saveAttendance() {
  const cls   = document.getElementById('attClass').value;
  const date  = document.getElementById('attDate').value || new Date().toISOString().split('T')[0];
  const list  = students.filter(s => s.cls === cls);

  const present = list.filter(s => attState[s.id] !== false).length;
  const absent  = list.length - present;
  const rate    = list.length ? Math.round((present / list.length) * 100) : 0;

  attLogs.unshift({ date, cls, present, absent, rate });

  document.getElementById('attLog').innerHTML = attLogs.map(a =>
    `<tr>
      <td>${a.date}</td>
      <td>${a.cls}</td>
      <td style="color:var(--green);font-weight:700">${a.present}</td>
      <td style="color:var(--red);font-weight:700">${a.absent}</td>
      <td>
        <span class="badge ${a.rate >= 80 ? 'ok' : a.rate >= 60 ? 'warn' : 'err'}">${a.rate}%</span>
      </td>
    </tr>`
  ).join('');

  showToast(`Attendance saved for ${cls}!`, 'ok');
}

// ══════════════════════════════════════════════════
//  NOTICE BOARD
// ══════════════════════════════════════════════════
function renderNotices() {
  document.getElementById('noticeList').innerHTML = notices.length
    ? notices.map((n, i) =>
        `<div class="notice-card ${n.type}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
            <div>
              <div class="n-title">${n.title}</div>
              <div class="n-body">${n.body}</div>
              <div class="n-meta">📅 ${n.date} &nbsp;·&nbsp; Posted by ${n.by}</div>
            </div>
            <div style="display:flex;gap:6px;align-items:center;">
              <span class="badge ${n.type === 'urgent' ? 'err' : n.type === 'general' ? 'ok' : 'info'}">${n.type}</span>
              ${role !== 'student'
                ? `<button class="btn-sm btn-danger" onclick="removeNotice(${i})">×</button>`
                : ''}
            </div>
          </div>
        </div>`
      ).join('')
    : '<p style="color:var(--muted);font-size:13px">No notices posted yet.</p>';
}

function addNotice() {
  const title = document.getElementById('nTitle').value.trim();
  const body  = document.getElementById('nBody').value.trim();
  const type  = document.getElementById('nType').value;

  if (!title || !body) { showToast('Fill in title and message', 'bad'); return; }

  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  notices.unshift({ title, body, type, date, by: currentUser || role });

  document.getElementById('nTitle').value = '';
  document.getElementById('nBody').value  = '';

  renderNotices();
  showToast('Notice posted!', 'ok');
}

function removeNotice(i) {
  notices.splice(i, 1);
  renderNotices();
  showToast('Notice removed.', 'bad');
}

// ══════════════════════════════════════════════════
//  SETTINGS
// ══════════════════════════════════════════════════
function saveSettings() {
  showToast('Settings saved successfully!', 'ok');
}

// ══════════════════════════════════════════════════
//  HELPER — TOAST NOTIFICATION
// ══════════════════════════════════════════════════
function showToast(message, type = 'ok') {
  const toast       = document.getElementById('toast');
  toast.textContent = message;
  toast.className   = type;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 2800);
}

// ══════════════════════════════════════════════════
//  INIT — Set default attendance date on page load
// ══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('attDate');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
});
