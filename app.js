// Common utilities & page wiring

// Mobile nav
const ham = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (ham && nav) ham.addEventListener('click', () => nav.classList.toggle('show'));

// Dynamic year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Include header/footer on subpages
document.querySelectorAll('[data-include="header"]').forEach(el=>{
  el.outerHTML = `
  <header class="header">
    <div class="container nav-wrap">
      <a class="logo" href="index.html"><svg viewBox="0 0 24 24" class="icon-md"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm1 17h-2v-2h2zm2.07-7.75-.9.92A3.49 3.49 0 0 0 13 14h-2v-.5a5.48 5.48 0 0 1 1.57-3.9l1.2-1.2A1.5 1.5 0 0 0 12.5 6 1.5 1.5 0 0 0 11 7.5H9a3.5 3.5 0 1 1 6.07 2.75z"/></svg><span>Healix Care</span></a>
      <nav class="nav" id="nav">
        <a href="index.html">Home</a>
        <a href="about.html">About</a>
        <a href="services.html">Services</a>
        <a href="doctors.html">Doctors</a>
        <a href="contact.html">Contact</a>
        <a href="auth.html" class="btn-sm">Login / Register</a>
      </nav>
      <button class="hamburger" id="hamburger" aria-label="Toggle menu"><span></span><span></span><span></span></button>
    </div>
    <div class="container header-tools">
      <form class="search" onsubmit="return handleGlobalSearch(event)">
        <input id="globalSearch" type="search" placeholder="Search doctors or services…" />
        <button class="btn" type="submit">Search</button>
      </form>
      <a class="btn-outline call-now" href="tel:+91108">🚑 Emergency</a>
    </div>
  </header>`;
});
document.querySelectorAll('[data-include="footer"]').forEach(el=>{
  el.outerHTML = `
  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <div class="logo footer-logo"><svg viewBox="0 0 24 24" class="icon-md"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm1 17h-2v-2h2zm2.07-7.75-.9.92A3.49 3.49 0 0 0 13 14h-2v-.5a5.48 5.48 0 0 1 1.57-3.9l1.2-1.2A1.5 1.5 0 0 0 12.5 6 1.5 1.5 0 0 0 11 7.5H9a3.5 3.5 0 1 1 6.07 2.75z"/></svg><span>Healix Care</span></div>
        <p>Integrated healthcare platform for India. Book doctors, order meds, and get lab tests from home.</p>
      </div>
      <div>
        <h4>Quick Links</h4>
        <ul class="footer-links">
          <li><a href="about.html">About</a></li>
          <li><a href="services.html">Services</a></li>
          <li><a href="doctors.html">Doctors</a></li>
          <li><a href="auth.html">Login / Register</a></li>
        </ul>
      </div>
      <div>
        <h4>Contact</h4>
        <ul class="footer-links">
          <li>📍 Delhi NCR, India</li>
          <li>📞 +91 98765 43210</li>
          <li>✉️ support@healixcare.in</li>
        </ul>
        <div class="socials">
          <a href="#" aria-label="Twitter">🐦</a>
          <a href="#" aria-label="Instagram">📸</a>
          <a href="#" aria-label="LinkedIn">💼</a>
        </div>
      </div>
    </div>
    <div class="copy">© <span id="year">${new Date().getFullYear()}</span> Healix Care. All rights reserved.</div>
  </footer>`;
});

// Global search (redirect to best page)
window.handleGlobalSearch = (e)=>{
  e.preventDefault();
  const q = (document.getElementById('globalSearch')?.value || '').toLowerCase();
  if(!q) return false;
  if(q.includes('cardio')||q.includes('derma')||q.includes('pedia')||q.includes('ortho')||q.includes('gyn')) {
    location.href='doctors.html';
  } else if(q.includes('lab')||q.includes('test')) {
    location.href='services.html#lab';
  } else if(q.includes('pharm')||q.includes('medicine')||q.includes('delivery')) {
    location.href='services.html#pharmacy';
  } else {
    location.href='services.html';
  }
  return false;
};

// Filtering helpers
window.filterCards = (inputId, gridId)=>{
  const term = document.getElementById(inputId).value.toLowerCase();
  document.querySelectorAll(`#${gridId} > *`).forEach(card=>{
    const t = (card.dataset.text || card.textContent).toLowerCase();
    card.style.display = t.includes(term) ? '' : 'none';
  });
};

window.filterDoctorsBySpecialty = ()=>{
  const sel = document.getElementById('specialtyFilter');
  const v = sel ? sel.value.toLowerCase() : '';
  document.querySelectorAll('#doctorsGrid .doc-card').forEach(card=>{
    const t = (card.dataset.text || '').toLowerCase();
    card.style.display = v==='' || t.includes(v) ? '' : 'none';
  });
};

// Testimonials carousel
(function(){
  const track = document.querySelector('.carousel-track');
  const dots = document.querySelector('.carousel-dots');
  if(!track || !dots) return;
  const slides = [...track.children];
  let idx = 0;
  slides.forEach((_,i)=>{
    const b=document.createElement('button');
    if(i===0) b.classList.add('active');
    b.addEventListener('click',()=>go(i));
    dots.appendChild(b);
  });
  const go = (i)=>{
    idx = i % slides.length;
    track.style.transform = `translateX(-${idx*100}%)`;
    [...dots.children].forEach((d,k)=>d.classList.toggle('active',k===idx));
  };
  setInterval(()=>go((idx+1)%slides.length), 4500);
})();

// Order sheet
const orderSheet = document.getElementById('orderSheet');
window.openOrderSheet = ()=> orderSheet?.setAttribute('aria-hidden','false');
window.closeOrderSheet = ()=> orderSheet?.setAttribute('aria-hidden','true');
window.submitOrder = (e)=>{
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());
  const orders = JSON.parse(localStorage.getItem('orders')||'[]');
  orders.push({...data, ts: Date.now()});
  localStorage.setItem('orders', JSON.stringify(orders));
  alert('✅ Order placed! Tracking ID: ORD'+(1000+orders.length));
  closeOrderSheet();
  form.reset();
  return false;
};

// Appointment sheet (doctors)
const apptSheet = document.getElementById('apptSheet');
window.openAppointment = (doc, spec)=>{
  apptSheet?.setAttribute('aria-hidden','false');
  const d = document.getElementById('doctorField');
  const s = document.getElementById('specialtyField');
  if(d) d.value = doc;
  if(s) s.value = spec;
};
window.closeAppointment = ()=> apptSheet?.setAttribute('aria-hidden','true');
window.submitAppointment = (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const appts = JSON.parse(localStorage.getItem('appts')||'[]');
  appts.push({...data, ts: Date.now()});
  localStorage.setItem('appts', JSON.stringify(appts));
  alert(`✅ Appointment booked with ${data.doctor} on ${data.date} at ${data.slot}.`);
  closeAppointment();
  e.target.reset();
  return false;
};

// Contact form
window.submitContact = (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const msgs = JSON.parse(localStorage.getItem('messages')||'[]');
  msgs.push({...data, ts: Date.now()});
  localStorage.setItem('messages', JSON.stringify(msgs));
  alert('📩 Thanks! We will get back to you soon.');
  e.target.reset();
  return false;
};

// Auth (demo only)
window.demoRegister = (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const users = JSON.parse(localStorage.getItem('users')||'[]');
  if(users.find(u=>u.email===data.email)) return alert('User already exists.');
  users.push(data);
  localStorage.setItem('users', JSON.stringify(users));
  alert('🎉 Account created! You can login now.');
  e.target.reset();
  return false;
};
window.demoLogin = (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target).entries());
  const users = JSON.parse(localStorage.getItem('users')||'[]');
  const ok = users.find(u=>u.email===data.email && u.password===data.password);
  if(!ok) return alert('Invalid credentials');
  localStorage.setItem('session', JSON.stringify({email:data.email, ts:Date.now()}));
  alert('✅ Logged in!');
  location.href='index.html';
  return false;
};
