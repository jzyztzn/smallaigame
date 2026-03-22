#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 游戏配置
const CONFIG = {
  minRange: 1,
  maxRange: 100,
  maxAttempts: 10
};

// 多样化的提示语言
const HINTS = {
  veryClose: [
    "哇！太接近了！只差一丁点儿~",
    "就差一点点！再仔细想想！",
    "近在咫尺啊！再猜一次！",
    "叮咚~ 答案就在旁边哦！",
    "太棒了，超级接近了！",
    "哇哦！几乎猜到了呢！",
    "好厉害！就差最后一步了！",
    "就在附近啦，加油！"
  ],
  close: [
    "不错不错，比较接近了！",
    "有进步！再接再厉！",
    "挺近的了，继续努力！",
    "方向对了！再来一次！",
    "嗯，这个距离差不多了~",
    "猜得不错，越来越近了！",
    "对头对头，就是这个方向！",
    "有感觉了吧？继续猜！"
  ],
  medium: [
    "还差一点距离，加油！",
    "嗯...不算太远，再想想！",
    "中等距离，还要继续努力！",
    "有点感觉了，但还差点~",
    "方向差不多，但距离还远！",
    "比上次好一点点啦！",
    "别急，慢慢缩小范围~",
    "继续保持，这个思路没错！"
  ],
  far: [
    "嗯...差得有点远哦！",
    "有点跑偏了，再想想！",
    "猜得有点离谱，再来！",
    "哎呀，偏离目标啦~",
    "方向不太对呢！",
    "这个距离...emm...再大胆点试试？",
    "跑远了！换个思路吧！",
    "不太对哦，要不要再考虑下？"
  ],
  veryFar: [
    "哈哈，差得老远了！",
    "这...有点太离谱了吧！",
    "完全不对方向呢~",
    "晕，猜到外太空去了！",
    "emmm...建议换个思路？",
    "是不是在故意逗我玩？😄",
    "这个差距...有点大哦！",
    "走错片场了吧这是！"
  ],
  tooHigh: [
    "猜得太大了，往小一点试试！",
    "哎呀，这个数太大了~",
    "太大啦！往小的方向猜！",
    "高了高了，要降降温！",
    "数字太大了，猜小一点！",
    "别那么激进，降一降~",
    "高了高了，猜个更小的！",
    "往下降降，别那么冲！"
  ],
  tooLow: [
    "猜得太小啦，往大一点试试！",
    "这个数有点小，往上走走~",
    "太小了！猜个更大的！",
    "低了低了，要升温！",
    "往大点猜，别那么保守！",
    "数字太小啦，大胆点！",
    "低了低了，往上涨涨~",
    "太小了，猜个更大的数！"
  ]
};

const VICTORY_MESSAGES = [
  "🎉 恭喜你！猜对了！你就是预言家！",
  "🏆 太厉害了！答案就是 {number}！你是天才！",
  "✨ 命中注定！就是 {number}！太棒了！",
  "🎊 猜对啦！{number} 就是正确答案！完美！",
  "🌟 神机妙算！答案 {number} 被你猜到了！",
  "🎯 一击即中！就是 {number}！大吉大利！",
  "🎁 恭喜发财！答案是 {number}！你是赢家！",
  "🔮 未卜先知！{number} 就是答案！你赢了！"
];

const DEFEAT_MESSAGES = [
  "😅 哎呀，次数用完了！答案是 {number}，下次再来！",
  "🤔 可惜啦！正确答案是 {number}，要再来一局吗？",
  "😢 游戏结束！答案是 {number}，别灰心！",
  "🎲 遗憾！正确答案是 {number}，运气不好哦~",
  "💔 太可惜了！答案是 {number}，下次一定行！"
];

function getRandomHint(category) {
  const hints = HINTS[category];
  return hints[Math.floor(Math.random() * hints.length)];
}

function getVictoryMessage(number) {
  const msg = VICTORY_MESSAGES[Math.floor(Math.random() * VICTORY_MESSAGES.length)];
  return msg.replace('{number}', number);
}

function getDefeatMessage(number) {
  const msg = DEFEAT_MESSAGES[Math.floor(Math.random() * DEFEAT_MESSAGES.length)];
  return msg.replace('{number}', number);
}

function getHint(guess, target) {
  const diff = Math.abs(guess - target);
  const range = CONFIG.maxRange - CONFIG.minRange;

  let distanceHint;
  if (diff === 0) return null;
  else if (diff === 1) distanceHint = 'veryClose';
  else if (diff <= 5) distanceHint = 'close';
  else if (diff <= 15) distanceHint = 'medium';
  else if (diff <= 30) distanceHint = 'far';
  else distanceHint = 'veryFar';

  const directionHint = guess > target ? 'tooHigh' : 'tooLow';

  return `${getRandomHint(directionHint)} ${getRandomHint(distanceHint)}`;
}

function showWelcome() {
  console.log('\n');
  console.log('╔════════════════════════════════════════╗');
  console.log('║       🎯 猜 数 字 小 游 戏 🎯        ║');
  console.log('╠════════════════════════════════════════╣');
  console.log('║  我在想一个 ' + CONFIG.minRange + ' 到 ' + CONFIG.maxRange + ' 之间的数字！  ║');
  console.log('║  你有 ' + CONFIG.maxAttempts + ' 次机会来猜中它~      ║');
  console.log('║                                        ║');
  console.log('║  提示：每次猜完后我会告诉你            ║');
  console.log('║  ① 数字是大了还是小了                 ║');
  console.log('║  ② 距离正确答案有多远                  ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('\n');
}

function showPrompt(attempt) {
  const remaining = CONFIG.maxAttempts - attempt + 1;
  console.log(`📝 第 ${attempt} 次尝试 (还剩 ${remaining} 次机会):`);
  process.stdout.write('请输入你的猜测: ');
}

function validateInput(input) {
  const num = parseInt(input, 10);
  if (isNaN(num)) {
    console.log('⚠️  请输入一个有效的数字！');
    return null;
  }
  if (num < CONFIG.minRange || num > CONFIG.maxRange) {
    console.log(`⚠️  请输入 ${CONFIG.minRange} 到 ${CONFIG.maxRange} 之间的数字！`);
    return null;
  }
  return num;
}

function showHint(guess, target, attempt) {
  const diff = Math.abs(guess - target);
  const percent = Math.round((diff / CONFIG.maxRange) * 100);

  console.log('\n┌─────────────────────────────────────┐');

  if (guess > target) {
    console.log('│  ⬇️  猜得太大了！                    │');
  } else {
    console.log('│  ⬆️  猜得太小了！                    │');
  }

  if (diff === 1) {
    console.log('│  🔥 就在旁边了！就差一点点！         │');
  } else if (diff <= 5) {
    console.log('│  😊 非常接近了！                     │');
  } else if (diff <= 15) {
    console.log('│  🤔 还算接近，继续努力！             │');
  } else if (diff <= 30) {
    console.log('│  😅 差得有点远呢...                  │');
  } else {
    console.log('│  😂 差得老远了！                     │');
  }

  console.log(`│  📊 误差: 约 ${percent}% 的范围           │`);
  console.log('└─────────────────────────────────────┘');

  console.log(`\n💬 ${getHint(guess, target)}`);
}

function showVictory(attempts, number) {
  console.log('\n');
  console.log('╔════════════════════════════════════════╗');
  console.log('║          🎊 恭 喜 猜 对 了！🎊         ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║  答案是: ${number}                        ║`);
  console.log(`║  你用了 ${attempts} 次就猜到了！            ║`);
  if (attempts <= 3) {
    console.log('║  🌟 太厉害了！你是天才！              ║');
  } else if (attempts <= 6) {
    console.log('║  👍 很棒！运气不错！                  ║');
  } else {
    console.log('║  🎉 险胜！运气还行！                 ║');
  }
  console.log('╚════════════════════════════════════════╝');
  console.log('\n');
}

function showDefeat(number) {
  console.log('\n');
  console.log('╔════════════════════════════════════════╗');
  console.log('║            😢 遗 憾 ！😢               ║');
  console.log('╠════════════════════════════════════════╣');
  console.log('║  正确答案是: ' + number + '                     ║');
  console.log('║  次数用完了，下次再来挑战吧！          ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('\n');
}

async function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function playGame() {
  const target = Math.floor(Math.random() * (CONFIG.maxRange - CONFIG.minRange + 1)) + CONFIG.minRange;
  let attempts = 0;
  let guessed = false;

  showWelcome();

  while (attempts < CONFIG.maxAttempts && !guessed) {
    attempts++;
    showPrompt(attempts);

    const input = await ask('');
    const guess = validateInput(input);

    if (guess === null) {
      attempts--;
      continue;
    }

    if (guess === target) {
      guessed = true;
      showVictory(attempts, target);
    } else {
      showHint(guess, target, attempts);
    }
  }

  if (!guessed) {
    showDefeat(target);
  }

  const playAgain = await ask('要不要再来一局？(y/n): ');

  if (playAgain.toLowerCase() === 'y' || playAgain.toLowerCase() === '是') {
    console.clear();
    await playGame();
  } else {
    console.log('\n👋 感谢游玩！下次再见！\n');
    rl.close();
  }
}

console.log('\n🎮 欢迎来到猜数字游戏！\n');
playGame();
