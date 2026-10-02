const vis = () => $$('#nav a').filter(a => getComputedStyle(a).display !== 'none').map(a => a.dataset.v).join(',');
const nav = getComputedStyle($('#nav'));
info('innerWidth=' + innerWidth + ' nav position=' + nav.position + ' flexDir=' + nav.flexDirection + ' brand=' + getComputedStyle($('.brand')).display + ' visible tabs: ' + vis());
info('main padding-bottom=' + getComputedStyle($('#main')).paddingBottom + ' toast-bottom-rule=' + (matchMedia('(min-width:900px)').matches ? 'desktop' : 'phone') + ' modal-center=' + matchMedia('(min-width:620px)').matches);
