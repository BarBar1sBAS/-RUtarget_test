import '../styles/main.scss';
import { initCursorDrop } from './cursor-drop.js';

initCursorDrop();

/* ——— Nav ——— */
const nav = document.querySelector('[data-nav]');
const burger = document.querySelector('[data-burger]');
burger?.addEventListener('click', () => {
  const open = nav?.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.classList.toggle('nav-open', !!open);
});

nav?.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  });
});

/* ——— Team accordion ——— */
document.querySelectorAll('[data-team-item]').forEach((item) => {
  const btn = item.querySelector('button');
  btn?.addEventListener('click', () => {
    const was = item.classList.contains('is-open');
    document.querySelectorAll('[data-team-item].is-open').forEach((el) => {
      el.classList.remove('is-open');
      el.querySelector('button')?.setAttribute('aria-expanded', 'false');
    });
    if (!was) {
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ——— Cookie banner ——— */
const cookieKey = 'rt_cookies_ok';
const cookieBanner = document.querySelector('[data-cookie]');
if (cookieBanner && !localStorage.getItem(cookieKey)) {
  cookieBanner.hidden = false;
  cookieBanner.querySelector('[data-cookie-ok]')?.addEventListener('click', () => {
    localStorage.setItem(cookieKey, '1');
    cookieBanner.hidden = true;
  });
} else if (cookieBanner) {
  cookieBanner.hidden = true;
}

/* ——— Multi-step brief (demo only) ——— */
const form = document.querySelector('[data-brief]');
if (form) {
  const steps = [...form.querySelectorAll('[data-step]')];
  const counter = form.querySelector('[data-step-count]');
  const prevBtn = form.querySelector('[data-step-prev]');
  const nextBtn = form.querySelector('[data-step-next]');
  const submitBtn = form.querySelector('[data-step-submit]');
  const toast = document.querySelector('[data-toast]');
  let step = 0;

  function showStep(i) {
    step = Math.max(0, Math.min(i, steps.length - 1));
    steps.forEach((s, idx) => s.hidden = idx !== step);
    if (counter) counter.textContent = `${step + 1}/${steps.length}`;
    if (prevBtn) prevBtn.disabled = step === 0;
    if (nextBtn) nextBtn.hidden = step === steps.length - 1;
    if (submitBtn) submitBtn.hidden = step !== steps.length - 1;
  }

  function validateStep() {
    const current = steps[step];
    const required = [...current.querySelectorAll('[required]')];
    for (const field of required) {
      if (field.type === 'checkbox' || field.type === 'radio') {
        const name = field.name;
        const group = current.querySelectorAll(`[name="${name}"]`);
        if (![...group].some((g) => g.checked)) {
          group[0]?.focus();
          return false;
        }
      } else if (!field.value.trim()) {
        field.reportValidity();
        return false;
      }
    }
    const checks = current.querySelectorAll('[data-require-one]');
    for (const box of checks) {
      const name = box.getAttribute('data-require-one');
      if (![...current.querySelectorAll(`[name="${name}"]`)].some((c) => c.checked)) {
        box.classList.add('is-invalid');
        return false;
      }
      box.classList.remove('is-invalid');
    }
    return true;
  }

  prevBtn?.addEventListener('click', () => showStep(step - 1));
  nextBtn?.addEventListener('click', () => {
    if (validateStep()) showStep(step + 1);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    toast?.classList.add('is-show');
    setTimeout(() => toast?.classList.remove('is-show'), 3200);
    form.reset();
    showStep(0);
  });

  showStep(0);
}
