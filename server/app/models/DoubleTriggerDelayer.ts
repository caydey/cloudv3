export class DoubleTriggerDelayer {
  private pendingTimer?: NodeJS.Timeout;
  private lastUpdate = 0;

  private readonly delay;

  constructor(delay: number) {
    this.delay = delay;
  }

  public start(action: () => void) {
    if (this.pendingTimer) clearTimeout(this.pendingTimer);

    const now = Date.now();
    const timeSinceLastTrigger = now - this.lastUpdate;
    if (timeSinceLastTrigger > this.delay) {
      this.lastUpdate = now;
      action();
      return;
    }

    this.pendingTimer = setTimeout(() => {
      this.lastUpdate = Date.now();
      action();
    }, this.delay - timeSinceLastTrigger);
  }
}
