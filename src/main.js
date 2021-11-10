var title = new Vue({
  el: "#title",
  data:{
    seen: true
  },
  methods:{
    start: function(){
      gameStart();
    }
  }
})

var game = new Vue({
  el: "#game",
  data: {
    seen: false,
    remaining: 100,
    cursorImage: "figs/hakkekyu.png",
    image: "figs/boss.png",
    bgm: new Audio("figs/Astronomia.mp3"),
    times: [],
    animateFrame: 0,
    nowTime: 0,
    diffTime: 0,
    highScore: localStorage.diffTime,
    startTime: 0,
    isTitle: true,
    isRunning: false,
    isResult: false,
  },
  methods:{
    decrementTotalCount: function(){
      var sound = new Audio("sounds/deleteVirusSE.mp3");
      sound.volume = 0.5;
      sound.play();
      this.remaining--;
      console.log(this.remaining);
      if (this.remaining <= 0) {
        sound = new Audio("sounds/clearSE.mp3");
        sound.volume = 0.3;
        sound.play();
        showResult();
      }
    },
    start: function(){
      this.isTitle = false;
      gameStart();
    },
    restart: function(){
      game.seen = false;
      sleep(1, gameStart);
    },
    setSubtractStartTime: function (time) {
      var time = typeof time !== 'undefined' ? time : 0;
      this.startTime = Math.floor(performance.now() - time);
    },
    startTimer: function () {
      var vm = this;
      vm.setSubtractStartTime(vm.diffTime);
      (function loop(){
        vm.nowTime = Math.floor(performance.now());
        vm.diffTime = vm.nowTime - vm.startTime;
        vm.animateFrame = requestAnimationFrame(loop);
      }());
      vm.isRunning = true;
    },
    stopTimer: function () {
      this.isRunning = false;
      cancelAnimationFrame(this.animateFrame);
    },
    pushTime: function () {
      this.times.push({
        hours: this.hours,
        minutes: this.minutes,
        seconds: this.seconds,
        milliSeconds: this.milliSeconds
      });
    },
    clearAll: function () {
      this.startTime = 0;
      this.nowTime = 0;
      this.diffTime = 0;
      this.times = [];
      this.stopTimer();
      this.animateFrame = 0;
    }
  },
  computed: {
    minutes: function () {
      return Math.floor(this.diffTime / 1000 / 60) % 60;
    },
    seconds: function () {
      return Math.floor(this.diffTime / 1000) % 60;
    },
    milliSeconds: function () {
      return Math.floor(this.diffTime % 1000);
    },
    storageMinutes: function () {
      if(!this.highScore){
        return "99";
      }
      return Math.floor(this.highScore / 1000 / 60) % 60;
    },
    storageSeconds: function () {
      if(!this.highScore){
        return "99";
      }
      return Math.floor(this.highScore / 1000) % 60;
    },
    storageMilliSeconds: function () {
      if(!this.highScore){
        return "999";
      }
      return Math.floor(this.highScore % 1000);
    },
  },
  filters: {
    zeroPad: function(value, num){
      var num = typeof num !== 'undefined' ? num : 2;
      return value.toString().padStart(num,"0");
    }
  }
})

function gameStart(){
  game.bgm.loop = true;
  game.bgm.volume = 0.5;
  game.bgm.play();
  title.seen = false;
  game.isResult = false;
  game.remaining = 200;
  game.seen = true;
  saveData();
  game.clearAll();
  game.startTimer();
}

function showTitle(){
  title.seen = true;
  game.seen = false;
}

function showResult(){
  game.bgm.pause();
  game.bgm.currentTime = 0;
  game.stopTimer();
  game.isResult = true;
}

function sleep(waitSec, callbackFunc) {
  var spanedSec = 0;
  var id = setInterval(function () {
      spanedSec++;
      if (spanedSec >= waitSec) {
          clearInterval(id);
          if (callbackFunc) callbackFunc();
      }
  }, 100);
}

function saveData(){
  if(game.diffTime == 0){
    return
  }
  if (localStorage.diffTime > game.diffTime || !localStorage.diffTime){
    localStorage.diffTime = game.diffTime;
    game.highScore = game.diffTime;
  }
}