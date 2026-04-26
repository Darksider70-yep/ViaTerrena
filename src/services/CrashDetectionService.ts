import { Accelerometer } from 'expo-sensors';
import { Subscription } from 'expo-sensors/build/Subscription';

// Tuning constants
const CRASH_THRESHOLD_G = 2.5;       // G-force to trigger (2.5 = hard impact)
const CONSECUTIVE_HITS_REQUIRED = 2;  // readings above threshold before alert
const SAMPLING_INTERVAL_MS = 100;     // read accelerometer every 100ms
const COOLDOWN_MS = 30000;           // ignore further crashes for 30s after one

export type CrashCallback = () => void;

class CrashDetectionService {
  private subscription: Subscription | null = null;
  private consecutiveHits = 0;
  private lastCrashTime = 0;
  private onCrashDetected: CrashCallback | null = null;
  private isArmed = false;

  start(onCrash: CrashCallback) {
    if (this.subscription) return;  // already running

    this.onCrashDetected = onCrash;
    this.isArmed = true;
    this.consecutiveHits = 0;

    Accelerometer.setUpdateInterval(SAMPLING_INTERVAL_MS);

    this.subscription = Accelerometer.addListener(({ x, y, z }) => {
      if (!this.isArmed) return;

      // In expo-sensors, G-force is already normalized where 1 = gravity
      const totalForce = Math.sqrt(x * x + y * y + z * z);

      if (totalForce > CRASH_THRESHOLD_G) {
        this.consecutiveHits++;
        if (this.consecutiveHits >= CONSECUTIVE_HITS_REQUIRED) {
          this.handleCrash();
        }
      } else {
        this.consecutiveHits = 0;  // reset if spike didn't sustain
      }
    });
  }

  stop() {
    this.subscription?.remove();
    this.subscription = null;
    this.isArmed = false;
    this.consecutiveHits = 0;
  }

  arm() { this.isArmed = true; }
  disarm() { this.isArmed = false; }

  private handleCrash() {
    const now = Date.now();
    if (now - this.lastCrashTime < COOLDOWN_MS) return;  // cooldown active

    this.lastCrashTime = now;
    this.consecutiveHits = 0;
    this.disarm();  // prevent repeated triggers

    this.onCrashDetected?.();
  }
}

export const crashDetectionService = new CrashDetectionService();
