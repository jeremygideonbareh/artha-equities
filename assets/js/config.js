/* Artha site configuration.
   In production every value here comes from the admin dashboard; nothing is hard-coded in pages.
   Demo values only. */
window.ARTHA_CONFIG = {
  currency: '₹',
  products: {
    intelligence: {
      name: 'Portfolio Intelligence Report',
      short: 'the Intelligence Report',
      price: 2499,
      files: 'PDF report + PPTX slide deck',
      timing: 'Typically within 2 working days of upload',
    },
    strategy: {
      name: 'Portfolio Strategy Report',
      short: 'the Strategy Report',
      price: 6999,
      files: 'PDF report (deck to be confirmed)',
      timing: 'Typically within 5 working days of upload',
    },
  },
  upgrade: {
    windowHours: 12,
    startEvent: 'delivery', // 'delivery' | 'payment'
    oneTime: true,
  },
  upload: { maxMB: 25, types: ['CAS from a depository (NSDL / CDSL)', 'Broker holdings statement', 'Demat holdings statement'] },
  restrictedTerms: ['buy', 'sell', 'hold', 'trim', 'exit', 'accumulate', 'target price', 'recommend', 'recommended', 'recommendation', 'book profit', 'top picks', 'best stocks'],
};

window.formatINR = (n) => window.ARTHA_CONFIG.currency + Number(n).toLocaleString('en-IN');
