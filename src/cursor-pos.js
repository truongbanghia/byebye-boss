Vue.directive('cursor-pos', {
  bind(el){
      el.style.position = "absolute";
      var top = "0.0";
      var left = "0.0";
      el.style.top = top + "px";
      el.style.left = left + "px";
  },

})