function locationHashChanged() {
  if (location.hash && location.hash === '#isolated') {
    document.querySelector('.sg').classList.add('sg--isolated');
    document.querySelector('.sg-page-header__link').classList.add('sg-page-header__link--hide');
  } else {
    document.querySelector('.sg').classList.remove('sg--isolated');
    document.querySelector('.sg-page-header__link').classList.remove('sg-page-header__link--hide');
  }
}

export default () => {
  if ('onhashchange' in window) {
    window.onhashchange = locationHashChanged;
  }

  locationHashChanged();
};
