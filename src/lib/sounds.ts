const SOUNDS = {
  tap: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  fail: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  start: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3',
  raban_low: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  raban_high: 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3',
};

export const playSound = (soundName: keyof typeof SOUNDS, enabled: boolean) => {
  if (!enabled) return;
  const audio = new Audio(SOUNDS[soundName]);
  audio.volume = 0.5;
  audio.play().catch(e => console.log('Audio play failed:', e));
};
