import { getSettings, setSetting, subscribe } from '../settings';

describe('settings store', () => {
  it('defaults everything on', () => {
    const s = getSettings();
    expect(s.sound).toBe(true);
    expect(s.haptics).toBe(true);
    expect(s.particles).toBe(true);
  });

  it('updates values and notifies subscribers', () => {
    let notified = 0;
    const unsub = subscribe(() => notified++);
    setSetting('sound', false);
    expect(getSettings().sound).toBe(false);
    expect(notified).toBe(1);
    unsub();
    setSetting('sound', true);
    expect(notified).toBe(1);
  });
});
