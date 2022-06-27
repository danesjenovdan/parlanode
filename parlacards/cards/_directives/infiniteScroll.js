export default {
  mounted(el, binding) {
    const onScroll = () => {
      // Round up because this can be a fraction in some cases (e.g. browser zoom not 100%)
      // and you can scroll to bottom and still be scrolled only to 285.7px of a 286px high container
      const scrollTop = Math.ceil(el.scrollTop);
      // Trigger within 4px of the bottom in case the scroll doesn't hit bottom pixel perfect.
      const scroll = el.scrollHeight - el.clientHeight - 4;
      if (scrollTop >= scroll) {
        binding.value();
      }
    };
    el.vis_onScroll = onScroll;
    el.addEventListener('scroll', onScroll);
  },
  beforeUnmount(el) {
    el.removeEventListener('scroll', el.vis_onScroll);
    el.vis_onScroll = undefined;
  },
};
