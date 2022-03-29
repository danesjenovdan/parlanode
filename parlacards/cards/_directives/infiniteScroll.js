export default {
  beforeMount(el, binding) {
    el.addEventListener('scroll', () => {
      const scroll = el.scrollHeight - el.clientHeight;
      if (el.scrollTop >= scroll) {
        binding.value();
      }
    });
  },
};
