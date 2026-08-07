const fs = require('fs');
const path = require('path');

const appleDataPath = path.join(__dirname, '..', 'public', 'assets', 'mascots', 'apple_mascot.json');
const orangeDataPath = path.join(__dirname, '..', 'public', 'assets', 'mascots', 'orange_mascot.json');

const appleData = JSON.parse(fs.readFileSync(appleDataPath, 'utf8'));
const orangeData = JSON.parse(fs.readFileSync(orangeDataPath, 'utf8'));

const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>بلومي للأطفال - استعراض شخصيات لوتي (Lottie Animations)</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
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
      max-width: 650px;
      line-height: 1.6;
    }

    .playground {
      display: flex;
      gap: 100px;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      max-width: 900px;
      padding: 20px;
    }

    .mascot-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: white;
      border: 4px solid #4D2B82;
      border-radius: 35px;
      padding: 20px 40px;
      box-shadow: 0 10px 0px #4D2B82;
      transition: transform 0.2s ease;
      cursor: pointer;
    }

    .mascot-card:hover {
      transform: translateY(-8px);
    }

    .mascot-card:active {
      transform: translateY(2px);
    }

    .player-container {
      width: 180px;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .label {
      margin-top: 15px;
      font-size: 22px;
      font-weight: 900;
      color: #4D2B82;
      text-align: center;
    }

    .info-footer {
      margin-top: 60px;
      font-size: 14px;
      color: #9333EA;
      font-weight: bold;
      background: white;
      padding: 15px 30px;
      border-radius: 30px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      max-width: 700px;
      text-align: center;
      line-height: 1.6;
    }
  </style>
  <!-- Load the official Airbnb Lottie Web (Bodymovin) library (100% reliable) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
</head>
<body>

  <h1>استعراض شخصيات لوتي (Lottie Animation) 🎬🌟</h1>
  <p>قمت باستبدال المشغل بمشغل لوتي الرسمي والمستقر بالكامل ليعمل محلياً بدون أي تأخير أو مشاكل في المتصفح!</p>

  <div class="playground">
    <!-- Apple Card -->
    <div class="mascot-card" id="apple-card">
      <div class="player-container" id="apple-container"></div>
      <div class="label">البطل تفاحة 🍎</div>
    </div>

    <!-- Orange Card -->
    <div class="mascot-card" id="orange-card">
      <div class="player-container" id="orange-container"></div>
      <div class="label">البطل برتقالة 🍊</div>
    </div>
  </div>

  <div class="info-footer">
    يعمل الآن باستخدام المكتبة الرسمية المستقرة لوتي-ويب (Lottie-Web) مع حقن البيانات أوفلاين.
  </div>

  <script>
    const sound = new Audio('./public/excellent.mp3');
    sound.volume = 0.5;

    // Inline Lottie JSON data
    const appleAnimationData = ${JSON.stringify(appleData)};
    const orangeAnimationData = ${JSON.stringify(orangeData)};

    let appleAnim;
    let orangeAnim;

    window.addEventListener('load', () => {
      // Initialize Apple Animation
      appleAnim = lottie.loadAnimation({
        container: document.getElementById('apple-container'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: appleAnimationData
      });

      // Initialize Orange Animation
      orangeAnim = lottie.loadAnimation({
        container: document.getElementById('orange-container'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: orangeAnimationData
      });

      setupLottieClick('apple-card', appleAnim);
      setupLottieClick('orange-card', orangeAnim);
    });

    function setupLottieClick(cardId, animInstance) {
      const card = document.getElementById(cardId);

      card.addEventListener('click', () => {
        // Play sound
        try {
          sound.currentTime = 0;
          sound.play().catch(() => {});
        } catch(e){}

        // Temporarily speed up the animation to make it dynamic
        animInstance.setSpeed(2.0);
        card.style.transform = 'scale(1.1) translateY(-10px)';
        
        setTimeout(() => {
          animInstance.setSpeed(1.0);
          card.style.transform = '';
        }, 800);
      });
    }
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, '..', 'mascot-lottie-demo.html'), htmlContent, 'utf8');
console.log('Successfully updated mascot-lottie-demo.html with stable lottie-web player!');
