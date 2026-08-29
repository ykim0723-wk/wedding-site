// ---------- Config ----------
const WEDDING_DATE = new Date('2026-12-18T15:00:00-08:00'); // 3:00 PM PT
// To wire the RSVP form up to a real backend, create a free form at
// https://formspree.io, then paste the endpoint URL below.
const RSVP_ENDPOINT = 'https://formspree.io/f/mbgjlpdg'; // e.g. 'https://formspree.io/f/xxxxxxx'

// ---------- Mobile nav ----------
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
navToggle?.addEventListener('click', () => {
  const open = navList.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
navList?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navList.classList.remove('open'));
});

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll('.section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      active?.classList.add('active');
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach(s => navObserver.observe(s));

// ---------- Reveal on scroll ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---------- Countdown ----------
function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
  };

  if (diff <= 0) {
    els.days.textContent = '0';
    els.hours.textContent = '0';
    els.mins.textContent = '0';
    els.secs.textContent = '0';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  els.days.textContent = days;
  els.hours.textContent = String(hours).padStart(2, '0');
  els.mins.textContent = String(mins).padStart(2, '0');
  els.secs.textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ---------- Accordion ----------
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  const panel = trigger.nextElementSibling;
  trigger.addEventListener('click', () => {
    const item = trigger.parentElement;
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.accordion-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.accordion-panel').style.maxHeight = null;
    });

    if (!isOpen) {
      item.classList.add('open');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});

// ---------- Add to calendar (.ics download) ----------
document.getElementById('addToCalendar')?.addEventListener('click', (e) => {
  e.preventDefault();
  const start = '20261218T230000Z'; // 3:00 PM PST = 23:00 UTC
  const end = '20261219T070000Z';   // 11:00 PM PST = 07:00 UTC next day
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    'SUMMARY:Ashley & Paul\'s Wedding',
    'LOCATION:Rancho Las Lomas\\, 19191 Lawrence Canyon\\, Silverado\\, CA 92676',
    'DESCRIPTION:Ceremony & Reception',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ashley-and-paul-wedding.ics';
  a.click();
  URL.revokeObjectURL(url);
});

// ---------- RSVP form ----------
const rsvpForm = document.getElementById('rsvpForm');
rsvpForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = rsvpForm.querySelector('button[type="submit"]');
  const originalLabel = btn.textContent;

  if (!RSVP_ENDPOINT) {
    alert('RSVP form is not yet connected. Add a Formspree (or similar) endpoint in script.js to start collecting responses.');
    return;
  }

  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const formData = new FormData(rsvpForm);
    const res = await fetch(RSVP_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      rsvpForm.innerHTML = '<p style="text-align:center; color: var(--muted);">Thank you — your RSVP has been received.</p>';
    } else {
      throw new Error('Submission failed');
    }
  } catch (err) {
    btn.textContent = originalLabel;
    btn.disabled = false;
    alert('Something went wrong sending your RSVP. Please try again.');
  }
});
