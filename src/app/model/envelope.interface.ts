export interface Envelope {
  attack: { value: number; time: number };
  decay?: { value: number; time: number };
  sustain?: { value: number; time: number };
  release: { value: number; time: number };
}
