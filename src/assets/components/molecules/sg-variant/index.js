function closeTabs(el) {
  const triggers = [...el.parentNode.querySelectorAll('.sg-variant__trigger')];
  const activeCode = document.querySelector(el.getAttribute('href'));

  if (activeCode) {
    const codes = [...activeCode.parentNode.querySelectorAll('.sg-variant__code')];

    triggers.forEach((trigger) => {
      trigger.classList.remove('sg-variant__trigger--active');
    });

    codes.forEach((code) => {
      code.classList.remove('sg-variant__code--active');
    });
  }
}

function openTab(el) {
  const code = document.querySelector(el.getAttribute('href'));

  closeTabs(el);

  el.classList.add('sg-variant__trigger--active');
  code.classList.add('sg-variant__code--active');
}

function toggleCode(e) {
  e.preventDefault();

  if (this.classList.contains('sg-variant__trigger--active')) {
    closeTabs(this);
  } else {
    openTab(this);
  }
}

export default function init() {
  [...document.querySelectorAll('.sg-variant__trigger')].forEach((trigger) => {
    trigger.addEventListener('click', toggleCode);
  });
}
