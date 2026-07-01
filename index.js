System.register(["./application.js"], function (_export, _context) {
  "use strict";

  var Application, canvas, $p, bcr, application;
  function topLevelImport(url) {
    return System["import"](url);
  }

  // === PC / 横屏 9:16 竖屏适配 ===
  // 强制 #Cocos3dGameContainer 和 canvas 保持 9:16 比例居中
  function applyRatio() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var RATIO = 9 / 16; // 宽/高
    var w, h;
    if (vw > vh * RATIO) {
      // 屏幕偏宽（PC/横屏）：以高度为准，宽度收窄
      w = Math.floor(vh * RATIO);
      h = vh;
    } else {
      // 屏幕偏窄（手机竖屏）：以宽度为准，高度超出
      w = vw;
      h = Math.floor(vw / RATIO);
    }
    var container = document.getElementById('Cocos3dGameContainer');
    if (container) {
      container.style.width = w + 'px';
      container.style.height = h + 'px';
      container.style.position = 'absolute';
      container.style.left = '50%';
      container.style.top = '50%';
      container.style.transform = 'translate(-50%, -50%)';
    }
    var cv = document.getElementById('GameCanvas');
    if (cv) {
      cv.style.width = w + 'px';
      cv.style.height = h + 'px';
      cv.width = w;
      cv.height = h;
    }
    return { w: w, h: h };
  }

  return {
    setters: [function (_applicationJs) {
      Application = _applicationJs.Application;
    }],
    execute: function () {
      // 先约束尺寸，再读给 Cocos
      var size = applyRatio();
      canvas = document.getElementById('GameCanvas');
      $p = canvas.parentElement;
      bcr = $p.getBoundingClientRect();
      canvas.width = Math.round(bcr.width);
      canvas.height = Math.round(bcr.height);

      // 窗口变化时重新约束
      window.addEventListener('resize', function() {
        applyRatio();
      });

      application = new Application();
      topLevelImport('cc').then(function (engine) {
        return application.init(engine);
      }).then(function () {
        return application.start();
      })["catch"](function (err) {
        console.error(err);
      });
    }
  };
});
