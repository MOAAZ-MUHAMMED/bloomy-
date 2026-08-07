const fs = require('fs');
const path = require('path');

const svgDir = path.join(__dirname, '..', 'mascot_apple_v2');

// Read all SVG contents
const body = fs.readFileSync(path.join(svgDir, 'body.svg'), 'utf8');
const eyeLeft = fs.readFileSync(path.join(svgDir, 'eye_left.svg'), 'utf8');
const eyeRight = fs.readFileSync(path.join(svgDir, 'eye_right.svg'), 'utf8');
const pupilLeft = fs.readFileSync(path.join(svgDir, 'pupil_left.svg'), 'utf8');
const pupilRight = fs.readFileSync(path.join(svgDir, 'pupil_right.svg'), 'utf8');
const eyebrows = fs.readFileSync(path.join(svgDir, 'eyebrows.svg'), 'utf8');
const nose = fs.readFileSync(path.join(svgDir, 'nose.svg'), 'utf8');
const mouth = fs.readFileSync(path.join(svgDir, 'mouth.svg'), 'utf8');
const stem = fs.readFileSync(path.join(svgDir, 'stem.svg'), 'utf8');
const leaf = fs.readFileSync(path.join(svgDir, 'leaf.svg'), 'utf8');
const armLeft = fs.readFileSync(path.join(svgDir, 'arm_left.svg'), 'utf8');
const armRight = fs.readFileSync(path.join(svgDir, 'arm_right.svg'), 'utf8');
const gloveLeft = fs.readFileSync(path.join(svgDir, 'glove_left.svg'), 'utf8');
const gloveRight = fs.readFileSync(path.join(svgDir, 'glove_right.svg'), 'utf8');
const legLeft = fs.readFileSync(path.join(svgDir, 'leg_left.svg'), 'utf8');
const legRight = fs.readFileSync(path.join(svgDir, 'leg_right.svg'), 'utf8');

// Build the self-contained HTML page
const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>بلومي للأطفال - استعراض التفاحة المحدثة</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle, #FFECA1 0%, #FCD34D 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      overflow: hidden;
      direction: rtl;
    }

    h1 {
      color: #4D2B82;
      font-size: 32px;
      font-weight: 900;
      text-shadow: 0 4px 0px rgba(255, 255, 255, 0.8);
      margin-bottom: 5px;
      text-align: center;
    }

    p {
      color: #7C3AED;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 40px;
      text-align: center;
      max-width: 600px;
    }

    /* Container holding the layered apple mascot */
    .mascot-stage {
      position: relative;
      width: 450px;
      height: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    /* Base layer of the body that squashes and stretches (breathing) */
    .apple-body-group {
      position: absolute;
      width: 320px;
      height: 320px;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: breathe 3s ease-in-out infinite;
      transform-origin: bottom center;
      z-index: 5;
    }

    /* SVG Layer helper class */
    .layer {
      position: absolute;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    /* Individual layer positions relative to body */
    .body-bg { z-index: 1; }
    
    .stem-layer {
      position: absolute;
      width: 64px;
      height: 128px;
      top: -95px;
      left: 130px;
      z-index: 2;
    }

    .leaf-layer {
      position: absolute;
      width: 96px;
      height: 64px;
      top: -85px;
      left: 155px;
      z-index: 3;
    }

    /* Face features spaced out nicely and sitting inside red body */
    .eye-l-layer {
      position: absolute;
      width: 90px;
      height: 120px;
      top: 50px;
      left: 55px;
      z-index: 10;
    }
    
    .eye-r-layer {
      position: absolute;
      width: 90px;
      height: 120px;
      top: 50px;
      left: 175px;
      z-index: 10;
    }

    .pupil-l-layer {
      position: absolute;
      width: 60px;
      height: 90px;
      top: 65px;
      left: 78px;
      z-index: 11;
    }

    .pupil-r-layer {
      position: absolute;
      width: 60px;
      height: 90px;
      top: 65px;
      left: 182px;
      z-index: 11;
    }

    .eyebrows-layer {
      position: absolute;
      width: 190px;
      height: 64px;
      top: 15px;
      left: 65px;
      z-index: 12;
    }

    .nose-layer {
      position: absolute;
      width: 44px;
      height: 44px;
      top: 135px;
      left: 138px;
      z-index: 13;
    }

    .mouth-layer {
      position: absolute;
      width: 110px;
      height: 66px;
      top: 175px;
      left: 105px;
      z-index: 14;
    }

    /* Left Arm (Resting) */
    .arm-l-group {
      position: absolute;
      width: 96px;
      height: 96px;
      bottom: 125px;
      left: 20px;
      z-index: 4;
    }
    .glove-l-layer {
      position: absolute;
      width: 64px;
      height: 64px;
      bottom: -15px;
      left: -20px;
    }

    /* Right Arm (Waving) - Pivot at shoulder joint */
    .arm-r-group {
      position: absolute;
      width: 96px;
      height: 96px;
      bottom: 160px;
      right: 25px;
      transform-origin: bottom left;
      animation: wave 1.2s ease-in-out infinite;
      z-index: 4;
    }
    .glove-r-layer {
      position: absolute;
      width: 76px;
      height: 76px;
      top: -45px;
      right: -45px;
    }

    /* Legs and Shoes (Boots) positioned at the bottom */
    .leg-l-layer {
      position: absolute;
      width: 70px;
      height: 105px;
      bottom: 70px;
      left: 105px;
      z-index: 3;
    }

    .leg-r-layer {
      position: absolute;
      width: 70px;
      height: 105px;
      bottom: 70px;
      right: 105px;
      z-index: 3;
    }

    /* Eye Blinking Animation */
    .blink-eye {
      animation: blink 4s infinite;
      transform-origin: center;
    }

    /* --- ANIMATION KEYFRAMES --- */
    /* 1. Breathing (Squash & Stretch) */
    @keyframes breathe {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.02, 0.97);
      }
    }

    /* 2. Waving */
    @keyframes wave {
      0%, 100% {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(22deg);
      }
    }

    /* 3. Blinking */
    @keyframes blink {
      0%, 90%, 100% {
        transform: scaleY(1);
      }
      95% {
        transform: scaleY(0.05);
      }
    }

    .info-footer {
      margin-top: 30px;
      font-size: 15px;
      color: #9333EA;
      font-weight: bold;
      background: white;
      padding: 15px 30px;
      border-radius: 30px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      text-align: center;
      max-width: 650px;
      line-height: 1.6;
    }
  </style>
</head>
<body>

  <h1>بطل بلومي الكارتوني الجديد 🍎🌟</h1>
  <p>أضفنا الأرجل والأحذية البنية، وأعدنا توزيع ملامح الوجه لتتباعد وتتزن بشكل مبهج واحترافي!</p>

  <!-- Mascot Stage -->
  <div class="mascot-stage" id="mascot-card">
    
    <!-- Legs and Shoes (Boots) -->
    <div class="leg-l-layer">${legLeft}</div>
    <div class="leg-r-layer">${legRight}</div>

    <!-- Left Arm Group -->
    <div class="arm-l-group">
      <div class="layer">${armLeft}</div>
      <div class="layer glove-l-layer">${gloveLeft}</div>
    </div>

    <!-- Right Arm Group (Waving) -->
    <div class="arm-r-group">
      <div class="layer">${armRight}</div>
      <div class="layer glove-r-layer">${gloveRight}</div>
    </div>

    <!-- Waving/Breathing Body Group -->
    <div class="apple-body-group">
      <!-- Body Background -->
      <div class="layer body-bg">${body}</div>
      
      <!-- Stem and Leaf -->
      <div class="stem-layer">${stem}</div>
      <div class="leaf-layer">${leaf}</div>
      
      <!-- Eyes Group with blinking -->
      <div class="eye-l-layer blink-eye">${eyeLeft}</div>
      <div class="pupil-l-layer blink-eye">${pupilLeft}</div>
      
      <div class="eye-r-layer blink-eye">${eyeRight}</div>
      <div class="pupil-r-layer blink-eye">${pupilRight}</div>

      <!-- Nose, eyebrows, mouth -->
      <div class="eyebrows-layer">${eyebrows}</div>
      <div class="nose-layer">${nose}</div>
      <div class="mouth-layer">${mouth}</div>
    </div>

  </div>

  <div class="info-footer">
    تظهر التفاحة الآن بكامل هيئتها. انقر عليها لسماع صوت التميز!
  </div>

  <script>
    const sound = new Audio('./public/excellent.mp3');
    sound.volume = 0.5;

    const card = document.getElementById('mascot-card');
    card.addEventListener('click', () => {
      try {
        sound.currentTime = 0;
        sound.play().catch(() => {});
      } catch(e){}

      card.style.transform = 'scale(1.08)';
      setTimeout(() => {
        card.style.transform = '';
      }, 200);
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '..', 'mascot-interactive-demo.html'), htmlContent, 'utf8');
console.log('Successfully updated mascot-interactive-demo.html with leg layers and face adjustments!');
