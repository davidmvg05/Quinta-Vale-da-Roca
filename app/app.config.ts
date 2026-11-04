export default defineAppConfig({
  ui: {
    colors: {
      primary: 'vine',
      neutral: 'stone',
    },
    button: {
      slots: {
        base: 'rounded-none',
      },
    },
    badge: {
      slots: {
        base: 'rounded-none',
      },
    },
    card: {
      slots: {
        root: 'rounded-none',
      },
    },
    modal: {
      slots: {
        content: 'rounded-none',
      },
    },
    carousel: {
      slots: {
        item: 'rounded-none',
        prev: 'rounded-none',
        next: 'rounded-none',
      },
    },
  },
})


