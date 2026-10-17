/*************************************************************************
 * AUDIO.JS - ADAPTIVE SUNO MP3 ANALYSER (16-BAND SPECTRUM + BAR DROPS)
 *************************************************************************/
class DarksynthSoundtrackEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.analyser = null;
    this.freqData = null;
    this.mediaSource = null;
    this.muted = false;
    this.styleIndex = 0;
    this.listenedTracks = new Set([0]);

    // Audio-reaktivní telemetrie pro grafiku, 360° halo a hratelnost
    this.beatPulse = 0; // 0.0 až 1.0 (okamžitý úder beatu)
    this.bassEnergy = 0; // 0.0 až 1.0 (hluboké basy)
    this.midEnergy = 0; // 0.0 až 1.0 (středy / syntezátory)
    this.highEnergy = 0; // 0.0 až 1.0 (výšky / činely)
    this.bassAvg = 0.5; // Plovoucí průměr pro detekci dropů u zkomprimovaných MP3
    this.justBeat = false; // true v momentě úderu bubnu
    this.justBarDrop = false; // true každý 4. úder (velký sonický pulz lodi)
    this.beatCount = 0;
    this.beatPhase = 0;
    this.lastBeatCooldown = 0;
    this.bands = new Array(16).fill(0); // 16 pásem pro kruhový ekvalizér kolem lodi

    this.bgmVolume = parseFloat(localStorage.getItem("neon_bgm_vol") || "0.55");
    this.sfxVolume = parseFloat(localStorage.getItem("neon_sfx_vol") || "0.8");

    this.tracks = [
      {
        label: "NEON JUMP",
        name: "TRACK 01 // NEON JUMP (145 BPM)",
        bpm: 145,
        url: "audio/neon_jump.mp3",
      },
      {
        label: "CYBERNETIC ANNIHILATION",
        name: "TRACK 02 // CYBERNETIC ANNIHILATION (150 BPM)",
        bpm: 150,
        url: "audio/cybernetic_annihilation.mp3",
      },
      {
        label: "HYPER GLITCH",
        name: "TRACK 03 // HYPER GLITCH (138 BPM)",
        bpm: 138,
        url: "audio/hyper_glitch.mp3",
      },
      {
        label: "CYBER OVERLOAD",
        name: "TRACK 04 // CYBER OVERLOAD (155 BPM)",
        bpm: 155,
        url: "audio/cyber_overload.mp3",
      },
      {
        label: "VOID RUNNER",
        name: "TRACK 05 // VOID RUNNER (142 BPM)",
        bpm: 142,
        url: "audio/void_runner.mp3",
      },
      {
        label: "DARKSYNTH FURY",
        name: "TRACK 06 // DARKSYNTH FURY (160 BPM)",
        bpm: 160,
        url: "audio/darksynth_fury.mp3",
      },
    ];

    this.styles = this.tracks.map((t) => t.label);

    this.bgm = new Audio();
    this.bgm.crossOrigin = "anonymous";
    this.bgm.loop = true;
    this.bgm.volume = this.bgmVolume;
    this.bgm.src = this.tracks[0].url;

    this.useRealtimeFFT = false;
    this.setupCustomMp3Loader();
  }

  setBgmVolume(val) {
    this.bgmVolume = Math.max(0, Math.min(1, val));
    if (this.bgm) {
      this.bgm.volume = this.muted ? 0 : this.bgmVolume;
    }
    localStorage.setItem("neon_bgm_vol", String(this.bgmVolume));
  }
  setSfxVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (this.master && this.ctx) {
      this.master.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
    localStorage.setItem("neon_sfx_vol", String(this.sfxVolume));
  }

  setupCustomMp3Loader() {
    this.fileInput = document.createElement("input");
    this.fileInput.type = "file";
    this.fileInput.accept = "audio/*";
    this.fileInput.style.display = "none";
    document.body.appendChild(this.fileInput);

    this.fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const objectUrl = URL.createObjectURL(file);
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .toUpperCase()
        .slice(0, 14);

      this.tracks.unshift({
        label: cleanName,
        name: `VLASTNÍ MP3 // ${cleanName}`,
        bpm: 145,
        url: objectUrl,
        isBlob: true,
      });
      this.styles = this.tracks.map((t) => t.label);
      this.styleIndex = 0;
      this.playCurrentTrack();
      this.tryConnectRealtimeAnalyser();

      const btn = document.getElementById("btn-track");
      if (btn) btn.textContent = `🎵 RÁDIO: ${cleanName}`;
      const gTrack = document.getElementById("ghost-track");
      if (gTrack) gTrack.textContent = cleanName;
      if (typeof showSaveToast === "function") {
        showSaveToast(`🎵 NAHRÁNA AUDIO-REAKTIVNÍ SKLADBA: ${cleanName}`);
      }
    });

    window.addEventListener("keydown", (e) => {
      if (
        e.code === "KeyO" &&
        (state.mode === "PLAYING" ||
          state.mode === "PAUSED" ||
          state.mode === "MENU")
      ) {
        this.fileInput.click();
      }
    });
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.master = this.ctx.createGain();
      this.master.gain.setValueAtTime(this.sfxVolume !== undefined ? this.sfxVolume : 0.8, this.ctx.currentTime);
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    this.tryConnectRealtimeAnalyser();
    this.playCurrentTrack();
  }

  tryConnectRealtimeAnalyser() {
    if (!this.ctx || this.mediaSource) return;
    const currentTrack = this.tracks[this.styleIndex];
    const canUseFFT =
      window.location.protocol !== "file:" ||
      (currentTrack && currentTrack.isBlob);

    if (canUseFFT) {
      try {
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyser.smoothingTimeConstant = 0.65;
        this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

        this.mediaSource = this.ctx.createMediaElementSource(this.bgm);
        this.mediaSource.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
        this.useRealtimeFFT = true;
      } catch (err) {
        this.useRealtimeFFT = false;
      }
    }
  }

  updateAudioAnalysis(dt) {
    this.justBeat = false;
    this.justBarDrop = false;
    if (this.lastBeatCooldown > 0) this.lastBeatCooldown -= dt;

    if (this.muted || state.mode !== "PLAYING") {
      if (!this.bgm.paused) this.bgm.pause();
      this.beatPulse = Math.max(0, this.beatPulse - dt * 5);
      this.bassEnergy *= 0.9;
      this.midEnergy *= 0.9;
      this.highEnergy *= 0.9;
      for (let i = 0; i < 16; i++) this.bands[i] *= 0.85;
      return;
    }

    if (this.bgm.paused) {
      this.bgm.play().catch(() => { });
    }

    // BPM synchronizátor běží vždy na pozadí jako garant rytmu
    const bpm = this.tracks[this.styleIndex].bpm || 145;
    const beatsPerSec = bpm / 60;
    const prevPhase = this.beatPhase;
    this.beatPhase = (this.beatPhase + dt * beatsPerSec) % 1.0;
    const bpmTriggered = this.beatPhase < prevPhase;

    let fftTriggered = false;

    // A) SKUTEČNÁ FREKVENČNÍ ANALÝZA (FFT) S ADAPTIVNÍM PRAHEM PRO SUNO MP3
    if (this.useRealtimeFFT && this.analyser && this.freqData) {
      this.analyser.getByteFrequencyData(this.freqData);

      let bassSum = 0,
        midSum = 0,
        highSum = 0;
      for (let i = 0; i < 5; i++) bassSum += this.freqData[i];
      for (let i = 5; i < 22; i++) midSum += this.freqData[i];
      for (let i = 22; i < 48; i++) highSum += this.freqData[i];

      const rawBass = bassSum / (5 * 255);
      this.midEnergy = Math.min(1.0, (midSum / (17 * 255)) * 1.25);
      this.highEnergy = Math.min(1.0, (highSum / (26 * 255)) * 1.45);

      // Naplnění 16 pásem pro kruhový ekvalizér
      for (let b = 0; b < 16; b++) {
        const val = this.freqData[b * 2] / 255;
        this.bands[b] = this.bands[b] * 0.4 + Math.pow(val, 1.4) * 0.6;
      }

      // Adaptivní detekce špičky oproti plovoucímu průměru
      this.bassAvg = this.bassAvg * 0.92 + rawBass * 0.08;
      if (
        rawBass > this.bassAvg * 1.09 &&
        rawBass > 0.45 &&
        this.lastBeatCooldown <= 0
      ) {
        fftTriggered = true;
      }
      this.bassEnergy = Math.min(
        1.0,
        Math.max(rawBass, Math.pow(1.0 - this.beatPhase, 1.8) * 0.85),
      );
    } else {
      // B) DYNAMICKÝ BPM SPEKTRÁLNÍ GENERÁTOR (když běží z file://)
      const env = Math.pow(1.0 - this.beatPhase, 1.7);
      this.bassEnergy = env * 0.95;
      this.midEnergy =
        0.35 + 0.55 * Math.abs(Math.sin(this.beatPhase * Math.PI * 2));
      this.highEnergy =
        0.25 + 0.65 * Math.abs(Math.cos(this.beatPhase * Math.PI * 4));

      const t = performance.now() * 0.012;
      for (let b = 0; b < 16; b++) {
        const wave = Math.abs(Math.sin(t + b * 0.55)) * 0.55;
        this.bands[b] = Math.min(1.0, env * (b < 5 ? 0.85 : 0.4) + wave);
      }
    }

    // Spuštění úderu (buď z FFT špičky, nebo přesného BPM)
    if ((fftTriggered || bpmTriggered) && this.lastBeatCooldown <= 0) {
      this.beatPulse = 1.0;
      this.justBeat = true;
      this.beatCount++;
      this.lastBeatCooldown = 0.24;
      if (this.beatCount % 4 === 0) {
        this.justBarDrop = true;
      }
    }

    if (this.beatPulse > 0) {
      this.beatPulse = Math.max(0, this.beatPulse - dt * 3.6);
    }
  }

  playCurrentTrack() {
    if (this.muted) return;
    const track = this.tracks[this.styleIndex];
    if (!this.bgm.src.endsWith(track.url)) {
      this.bgm.src = track.url;
    }
    this.bgm.volume = this.bgmVolume;
    this.bgm.play().catch(() => { });
  }

  cycleStyle() {
    this.styleIndex = (this.styleIndex + 1) % this.tracks.length;
    this.listenedTracks.add(this.styleIndex);
    if (this.listenedTracks.size >= 6 && typeof unlockAchievement === "function") {
      unlockAchievement("audiophile");
    }
    const track = this.tracks[this.styleIndex];
    this.bgm.src = track.url;
    this.bgm.volume = this.bgmVolume;
    if (!this.muted && state.mode === "PLAYING") {
      this.bgm.play().catch(() => { });
    }
    if (typeof showSaveToast === "function") {
      showSaveToast(`🎵 ${track.name} (STISKNI [O] PRO VLASTNÍ MP3)`);
    }
    return track.label;
  }

  playLaser(pitchMod = 1) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(840 * pitchMod, now);
    osc.frequency.exponentialRampToValueAtTime(145, now + 0.065);
    gain.gain.setValueAtTime(0.032, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  playRailgun() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.28);
    gain.gain.setValueAtTime(0.13, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.32);
  }

  playDash() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(960, now + 0.17);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.19);
  }

  playExplosion(intensity = 1) {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const dur = Math.min(0.65, 0.22 * intensity);
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] =
        (Math.random() * 2 - 1) * Math.exp(-i / ((bufferSize || 1000) * 0.45));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(980, now);
    filter.frequency.exponentialRampToValueAtTime(55, now + dur);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(Math.min(0.24, 0.1 * intensity), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    noise.start(now);
  }

  playSingularity() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(40, now + 1.2);
    osc.frequency.exponentialRampToValueAtTime(520, now + 1.85);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + 1.95);
  }

  playGem() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    const base = 780 + Math.min(800, state.combo * 35);
    osc.frequency.setValueAtTime(base, now);
    osc.frequency.exponentialRampToValueAtTime(base * 1.45, now + 0.065);
    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  playLevelUp() {
    if (!this.ctx || this.muted) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now + idx * 0.06);
      gain.gain.setValueAtTime(0.11, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.35);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.36);
    });
  }
}

const sfx = new DarksynthSoundtrackEngine();
