export const triggerPopUnder = () => {
  console.log('Triggering Monetag Pop-under Ad...');
  // In a real implementation, this would be handled by the script in index.html
  // or by a specific function provided by the Monetag SDK.
};

export const triggerVignette = () => {
  console.log('Triggering Monetag Vignette Ad...');
  // In a real implementation, this would be handled by the script in index.html
  // or by a specific function provided by the Monetag SDK.
};

export const triggerRewardAd = (onReward: () => void) => {
  console.log('Triggering Monetag Reward Ad...');
  // Simulate ad completion and reward
  setTimeout(() => {
    onReward();
  }, 2000);
};
