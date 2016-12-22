function closeTabs() {
  const triggers = [...document.querySelectorAll('.sg-variant__trigger')];
  const codes = [...document.querySelectorAll('.sg-variant__code')];

  triggers.forEach((trigger) => {
    trigger.classList.remove('sg-variant__trigger--active');
  });

  codes.forEach((code) => {
    code.classList.remove('sg-variant__code--active');
  });
}

function openTab(trigger) {
  const codeSelector = trigger.getAttribute('href');
  const code = document.querySelector(codeSelector);

  closeTabs();

  trigger.classList.add('sg-variant__trigger--active');
  code.classList.add('sg-variant__code--active');
}

function toggleCode(e) {
  e.preventDefault();

  if (this.classList.contains('sg-variant__trigger--active')) {
    closeTabs();
  } else {
    openTab(this);
  }
}

export default function init() {
  [...document.querySelectorAll('.sg-variant__trigger')].forEach((trigger) => {
    trigger.addEventListener('click', toggleCode);
  });
}
