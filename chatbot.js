// Very simple rule-based chatbot with quick replies + appointment assist

(function initBot(){
  const mount = document.getElementById('chatbot');
  if(!mount) return;

  mount.innerHTML = `
  <div class="bot-fab" id="botFab" title="Chat with us">💬</div>
  <div class="bot-panel" id="botPanel" aria-hidden="true">
    <div class="bot-header">
      <strong>Healix Assistant</strong>
      <button id="botClose" aria-label="Close">×</button>
    </div>
    <div class="bot-body" id="botBody"></div>
    <div class="bot-quick">
      <button data-q="Book Appointment">Book Appointment</button>
      <button data-q="Order Medicine">Order Medicine</button>
      <button data-q="Services">Services</button>
      <button data-q="Contact Support">Contact Support</button>
    </div>
    <form id="botForm" class="bot-input">
      <input id="botText" placeholder="Type your message..." autocomplete="off"/>
      <button class="btn" type="submit">Send</button>
    </form>
  </div>`;

  const fab = document.getElementById('botFab');
  const panel = document.getElementById('botPanel');
  const close = document.getElementById('botClose');
  const body = document.getElementById('botBody');
  const form = document.getElementById('botForm');
  const text = document.getElementById('botText');

  const open = ()=> panel.setAttribute('aria-hidden','false');
  const hide = ()=> panel.setAttribute('aria-hidden','true');

  fab.addEventListener('click', open);
  close.addEventListener('click', hide);

  const say = (from, msg)=>{
    const b = document.createElement('div');
    b.className = 'bot-bubble '+(from==='you'?'you':'');
    b.innerHTML = msg;
    body.appendChild(b);
    body.scrollTop = body.scrollHeight;
  };

  const greet = ()=> say('bot', `Hi! I can help with <b>appointments</b>, <b>services</b>, and <b>10-min delivery</b>.`);

  // Quick replies
  document.querySelectorAll('.bot-quick button').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      text.value = btn.dataset.q;
      form.requestSubmit();
    });
  });

  // Simple intent detection
  const handle = (q)=>{
    const s = q.toLowerCase();

    if (/(book|appointment|doctor)/.test(s)) {
      say('bot', `Great! Which specialty? <i>(Cardiology, Dermatology, Pediatrics, Orthopedics, Gynecology)</i>`);
      botState.intent = 'appointment';
      return;
    }

    if (/(order|medicine|pharmacy|deliver)/.test(s)) {
      say('bot', `To place a quick order, tap <b>Order Now</b> on the home section, or I can open it for you.`);
      say('bot', `<button class="btn" onclick="openOrderSheet()">Open Order Sheet</button>`);
      botState.intent = null;
      return;
    }

    if (/service|lab|test|pricing/.test(s)) {
      say('bot', `We offer <b>Doctor Consults</b>, <b>Lab Tests</b>, <b>Pharmacy (10-min)</b>, <b>Physiotherapy</b>, <b>Dental</b>, <b>Mental Health</b>. See <a href="services.html">Services</a>.`);
      botState.intent = null;
      return;
    }

    if (/contact|support|help|phone/.test(s)) {
      say('bot', `You can reach us at <b>+91 98765 43210</b> or <a href="contact.html">contact page</a>. For emergencies dial <b>108</b>.`);
      botState.intent = null;
      return;
    }

    // Follow-up for appointment
    if (botState.intent === 'appointment') {
      const spec = s.match(/cardio|derma|pedia|ortho|gyne|cardiology|dermatology|pediatrics|orthopedics|gynecology/);
      if (spec) {
        const map = {
          cardio: 'Cardiology', cardiology: 'Cardiology',
          derma: 'Dermatology', dermatology: 'Dermatology',
          pedia: 'Pediatrics', pediatrics:'Pediatrics',
          ortho:'Orthopedics', orthopedics:'Orthopedics',
          gyne:'Gynecology', gynecology:'Gynecology'
        };
        const specialty = map[spec[0]] || 'General Medicine';
        say('bot', `Got it — <b>${specialty}</b>. Opening available doctors…`);
        say('bot', `<a class="btn" href="doctors.html">See Doctors</a>`);
        botState.intent = null;
        return;
      }
    }

    say('bot', `I didn’t get that. Try “Book Appointment”, “Order Medicine”, “Services”, or “Contact Support”.`);
  };

  const botState = { intent:null };
  greet();

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const q = text.value.trim();
    if(!q) return;
    say('you', q);
    text.value = '';
    setTimeout(()=>handle(q), 300);
  });
})();

// Styles injected (scoped to chatbot)
const botStyle = document.createElement('style');
botStyle.textContent = `
.bot-fab{position:fixed;right:18px;bottom:18px;background:var(--grad);color:#0b0f16;height:56px;width:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:var(--shadow);font-size:22px;z-index:70;transition:transform .2s}
.bot-fab:hover{transform:translateY(-2px)}
.bot-panel{position:fixed;right:18px;bottom:86px;width:min(360px,94%);background:var(--card);border:1px solid rgba(255,255,255,.08);border-radius:16px;box-shadow:var(--shadow);display:flex;flex-direction:column;max-height:70vh;overflow:hidden;z-index:70}
.bot-panel[aria-hidden="true"]{display:none}
.bot-header{display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.08)}
#botClose{background:transparent;border:0;color:var(--text);font-size:22px;cursor:pointer}
.bot-body{padding:12px;overflow:auto;display:flex;flex-direction:column;gap:10px}
.bot-bubble{align-self:flex-start;background:#0f1623;border:1px solid rgba(255,255,255,.08);padding:10px 12px;border-radius:12px;max-width:85%}
.bot-bubble.you{align-self:flex-end;background:linear-gradient(135deg, rgba(110,231,249,.25), rgba(139,92,246,.25))}
.bot-input{display:flex;gap:8px;border-top:1px solid rgba(255,255,255,.08);padding:10px}
.bot-input input{flex:1}
.bot-quick{display:flex;gap:6px;flex-wrap:wrap;padding:8px;border-top:1px solid rgba(255,255,255,.08)}
.bot-quick button{border:1px solid rgba(255,255,255,.15);background:#0f1623;color:var(--text);padding:6px 10px;border-radius:999px;cursor:pointer}
@media(max-width:480px){.bot-panel{right:10px;left:10px;width:auto}}
`;
document.head.appendChild(botStyle);
