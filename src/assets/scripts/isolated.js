function locationHashChanged() {
  const sg = document.querySelector('.sg');
  const link = document.querySelector('.sg-page-header__link');

  if (sg && link) {
    if (location.hash && location.hash === '#isolated') {
      sg.classList.add('sg--isolated');
      link.classList.add('sg-page-header__link--hide');
    } else {
      sg.classList.remove('sg--isolated');
      link.classList.remove('sg-page-header__link--hide');
    }
  }
}

export default () => {
  if ('onhashchange' in window) {
    window.onhashchange = locationHashChanged;
  }

  locationHashChanged();
};
