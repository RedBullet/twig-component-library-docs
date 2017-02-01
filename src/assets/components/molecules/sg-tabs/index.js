import closest from 'closest';

function openTab(trigger, target) {
  trigger.parentNode.classList.add('sg-tabs__item--active');
  target.classList.add('sg-tabs__pane--active');
}

function closeTabs() {
  const triggers = [...document.querySelectorAll('.sg-tabs__button')];
  const targets = [...document.querySelectorAll('.sg-tabs__pane')];

  triggers.forEach((item) => {
    item.parentNode.classList.remove('sg-tabs__item--active');
  });

  targets.forEach((item) => {
    item.classList.remove('sg-tabs__pane--active');
  });
}

function toggleTab(e) {
  e.preventDefault();

  const trigger = this;
  const targetSelector = this.getAttribute('href');

  const target = document.querySelector(targetSelector);

  const largeScreen = window.matchMedia('(min-width: 50em)').matches;
  const noActive = !target.classList.contains('sg-tabs__pane--active');

  const shouldOpen = (largeScreen || noActive);

  closeTabs();

  if (shouldOpen) {
    openTab(trigger, target);
  }
}

function testResize() {
  if (window.matchMedia('(min-width: 50em)').matches) {
    const activeTrigger = document.querySelector('.sg-tabs__item--active');

    if (!activeTrigger) {
      const tabs = document.querySelector('.sg-tabs');
      const activeComponentSelector = tabs.getAttribute('data-active');
      let activeComponent = false;

      if (activeComponentSelector) {
        activeComponent = document.querySelector(`#${activeComponentSelector}`);
      }

      let trigger;
      let target;
      if (activeComponent) {
        target = closest(activeComponent, '.sg-tabs__pane');
        const paneId = target.getAttribute('id');
        trigger = document.querySelector(`[href='#${paneId}']`);
      } else {
        trigger = document.querySelector('.sg-tabs__button');
        target = document.querySelector('.sg-tabs__pane');
      }

      openTab(trigger, target);
    }
  } else {
    closeTabs();
  }
}

export default function init() {
  if (document.querySelectorAll('.sg-tabs').length > 0) {
    const tabTriggers = [...document.querySelectorAll('.sg-tabs__button')];

    if (tabTriggers) {
      tabTriggers.forEach((item) => {
        item.addEventListener('click', toggleTab);
      });
    }

    const activeTab = document.querySelector(`.sg-tabs__button[href="${location.hash}"]`);

    if (activeTab) {
      activeTab.click();
    }

    window.addEventListener('resize', testResize);
    testResize();
  }
}
