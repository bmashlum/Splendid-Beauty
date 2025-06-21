const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to iPhone 14 Pro dimensions
  await page.setViewport({
    width: 393,
    height: 852,
    deviceScaleFactor: 3,
  });
  
  // Navigate to localhost
  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle2',
    timeout: 30000
  });
  
  // Wait for hero section to load
  await page.waitForSelector('#hero', { timeout: 10000 });
  
  // Get hero section dimensions
  const heroDimensions = await page.evaluate(() => {
    const hero = document.querySelector('#hero');
    const rect = hero.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height
    };
  });
  
  console.log('Hero Section Dimensions:');
  console.log(`Width: ${heroDimensions.width}px`);
  console.log(`Height: ${heroDimensions.height}px`);
  
  // Calculate aspect ratio
  const aspectRatio = heroDimensions.width / heroDimensions.height;
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const divisor = gcd(heroDimensions.width, heroDimensions.height);
  const simplifiedWidth = heroDimensions.width / divisor;
  const simplifiedHeight = heroDimensions.height / divisor;
  
  console.log(`\nAspect Ratio: ${aspectRatio.toFixed(3)}`);
  console.log(`Simplified: ${Math.round(simplifiedWidth)}:${Math.round(simplifiedHeight)}`);
  
  // Common aspect ratio approximations
  const commonRatios = [
    { name: '16:9', value: 16/9 },
    { name: '4:3', value: 4/3 },
    { name: '3:2', value: 3/2 },
    { name: '9:16', value: 9/16 },
    { name: '3:4', value: 3/4 },
    { name: '2:3', value: 2/3 },
    { name: '1:1', value: 1 },
    { name: '5:4', value: 5/4 },
    { name: '4:5', value: 4/5 }
  ];
  
  // Find closest common ratio
  let closest = commonRatios[0];
  let minDiff = Math.abs(aspectRatio - closest.value);
  
  for (const ratio of commonRatios) {
    const diff = Math.abs(aspectRatio - ratio.value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = ratio;
    }
  }
  
  console.log(`\nClosest common aspect ratio: ${closest.name}`);
  
  // Calculate recommended dimensions for mobile hero image
  console.log('\nRecommended mobile hero image dimensions:');
  console.log(`For exact fit: ${Math.round(heroDimensions.width)}x${Math.round(heroDimensions.height)}px`);
  
  // Double for retina
  console.log(`For retina (2x): ${Math.round(heroDimensions.width * 2)}x${Math.round(heroDimensions.height * 2)}px`);
  
  await browser.close();
})();