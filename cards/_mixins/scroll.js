export default {
  data () {
    return {
      card: {
        shadowElement: null,
        lockLoading: false,
        shouldShadow: false
      }
    }
  },
  methods: {
    checkScrollPosition(elementId) {
      if (! this.card.lockLoading ) {
        this.card.lockLoading = true;
        setTimeout(() => {
          this.card.shouldShadow = document.getElementById(this.card.shadowElement).scrollTop > 0;
          this.card.lockLoading = false;
        }, 50);
      }
    }
  }
}