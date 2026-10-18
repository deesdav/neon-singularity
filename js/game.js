/*************************************************************************
 * GAME.JS - CORE ENGINE, OVERCLOCK, MUTATORS, RUN SUMMARY & INPUT
 *************************************************************************/
const LEGACY_SAVE_KEY = "neon_singularity_ult_save_v1";
const META_KEY = "neon_singularity_ult_meta_v1";
const BEST_KEY = "neon_singularity_evo_best";

let currentSaveSlot = 1;

function getSaveKey(slot = currentSaveSlot) {
  return `neon_singularity_save_slot_${slot}_v1`;
}

function getSlotCustomName(slot = currentSaveSlot) {
  return localStorage.getItem(`neon_singularity_slot_name_${slot}`) || `Profil #${slot}`;
}

try {
  const legacyData = localStorage.getItem(LEGACY_SAVE_KEY);
  if (legacyData && !localStorage.getItem(getSaveKey(1))) {
    localStorage.setItem(getSaveKey(1), legacyData);
  }
} catch (e) { }

const meta = {
  shards: 0,
  selectedShip: "INTERCEPTOR",
  customColor: null,
  upgrades: {
    hullLvl: 0, dmgLvl: 0, magnetLvl: 0, novaLvl: 0,
    overdriveLvl: 0, critShopLvl: 0, dashCdLvl: 0, shardHunterLvl: 0,
    bombRadiusLvl: 0, xpTeleporterLvl: 0, rerollDiscountLvl: 0, thornsArmorLvl: 0
  },
  overclock: {
    dmgOc: 0,
    spdOc: 0,
    xpOc: 0,
    spent: 0
  },
  achievements: {},
  trophyMilestones: {},
  stats: {
    totalKillsLifetime: 0,
    totalBossKillsLifetime: 0,
    totalGemsLifetime: 0,
    burnedCount: 0,
    satelliteStrikes: 0,
    blackHolesUsed: 0,
    boomerangKills: 0,
    minesDropped: 0,
    kamikazeKills: 0,
    disruptorKills: 0,
    reflectedBullets: 0
  }
};

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
let W = window.innerWidth;
let H = window.innerHeight;
canvas.width = W;
canvas.height = H;

const grid = new SpringGrid(46);
const spaceBg = new DeepSpaceBackdrop(W, H);

function resizeGameView() {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
  grid.resize(W, H);
  spaceBg.init(W, H);
}

window.addEventListener("resize", resizeGameView);
window.addEventListener("orientationchange", () => setTimeout(resizeGameView, 200));

const state = {
  mode: "MENU",
  difficulty: "ARCADE",
  mutator: "NONE",
  firedAnyShot: false,
  score: 0,
  bestScore: parseInt(localStorage.getItem(BEST_KEY) || "0", 10),
  combo: 1.0,
  maxCombo: 1.0,
  comboTimer: 0,
  wave: 1,
  enemiesToSpawn: 0,
  spawnCooldown: 0,
  bossActive: false,
  overdrive: 0,
  overdriveTimer: 0,
  supplyTimer: 16,
  wormholeTimer: 48,
  shake: 0,
  chromatic: 0,
  hudVisible: true,
  fps: 60,
  runTimer: 0,
  runStats: {
    totalKills: 0,
    eliteKills: 0,
    bossKills: 0,
    blackHolesUsed: 0,
    gemsCollected: 0,
    weaponDmg: {}
  }
};

const player = {
  shipClass: "INTERCEPTOR",
  color: "#00f3ff",
  x: W / 2,
  y: H / 2,
  vx: 0,
  vy: 0,
  angle: 0,
  radius: 16,
  hp: 100,
  maxHp: 100,
  xp: 0,
  xpNext: 95,
  level: 1,
  speed: 365,
  dmgMult: 1.0,
  fireTimer: 0,
  dashCooldown: 0,
  dashMaxCooldown: 1.45,
  invulnTimer: 0,
  portalCooldown: 0,
  bombs: 2,
  maxBombs: 5,
  afterimages: [],
  unlockedSynergies: {},
  weapons: {
    barrels: 2, fireRateLvl: 1, ricochetLvl: 0, missilesLvl: 0,
    bladesLvl: 0, teslaLvl: 0, railgunLvl: 0, dronesLvl: 0,
    plasmaTrailLvl: 0, cryoNovaLvl: 0, aegisLvl: 0, critLvl: 0,
    flamethrowerLvl: 0, satelliteLvl: 0,
    boomerangLvl: 0, minesLvl: 0, shockwaveLvl: 0, gravityAmpLvl: 0, regenLvl: 0,
    solarHaloLvl: 0, swarmBotsLvl: 0, gravCannonLvl: 0, phaseMeltLvl: 0,
    whipLvl: 0, mortarLvl: 0, nanoShieldLvl: 0, decoyLvl: 0,
    lightningTrapLvl: 0, riftSlicerLvl: 0, prismLaserLvl: 0, overchargeCoreLvl: 0
  },
  missileTimer: 0, teslaTimer: 0, railgunTimer: 0, droneTimer: 0,
  trailTimer: 0, cryoTimer: 0, flameTickTimer: 0, satelliteTimer: 0,
  boomerangTimer: 0, mineTimer: 0, shockwaveTimer: 0,
  solarHaloTimer: 0, swarmBotsTimer: 0, gravCannonTimer: 0,
  whipTimer: 0, mortarTimer: 0, decoyTimer: 0, trapTimer: 0, slicerTimer: 0,
  aegisReady: false, aegisCooldown: 0, bladeAngle: 0, droneAngle: 0,
  voidLanceTimer: 0, stasisTimer: 0, flailAngle: 0, laserRingAngle: 0
};

const bullets = [];
const missiles = [];
const boomerangs = [];
const mines = [];
const railBeams = [];
const plasmaPools = [];
const orbitalStrikes = [];
const wormholes = [];
const lensFlares = [];
const enemyBullets = [];
const enemies = [];
const singularities = [];
const gems = [];
const supplyPods = [];
const particles = [];
const shockwaves = [];
const lightningArcs = [];
const floatingTexts = [];

const keys = { w: false, a: false, s: false, d: false };
const mouse = { x: W / 2, y: H / 2, down: false };
let currentUpgradeChoices = [];

// Rychlé O(1) odstranění prvku z neuspořádaného pole bez alokace a posouvání paměti (pro 60 FPS)
function fastRemove(arr, index) {
  const last = arr.length - 1;
  if (index !== last) arr[index] = arr[last];
  arr.pop();
}

function loadMetaProgression() {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      meta.shards = parsed.shards || 0;
      meta.selectedShip = parsed.selectedShip || "INTERCEPTOR";
      meta.customColor = parsed.customColor || null;
      meta.upgrades = { ...meta.upgrades, ...(parsed.upgrades || {}) };
      meta.overclock = { ...meta.overclock, ...(parsed.overclock || {}) };
      // Zpětná kompatibilita se staršími názvy klíčů Overclocku
      if (parsed.overclock) {
        if (parsed.overclock.dmgPct && !meta.overclock.dmgOc) meta.overclock.dmgOc = parsed.overclock.dmgPct;
        if (parsed.overclock.spdPct && !meta.overclock.spdOc) meta.overclock.spdOc = parsed.overclock.spdPct;
        if (parsed.overclock.xpBonus && !meta.overclock.xpOc) meta.overclock.xpOc = Math.floor(parsed.overclock.xpBonus / 35);
        if (parsed.overclock.spentShards && !meta.overclock.spent) meta.overclock.spent = parsed.overclock.spentShards;
      }
      meta.achievements = { ...(parsed.achievements || {}) };
      meta.trophyMilestones = { ...(parsed.trophyMilestones || {}) };
      meta.stats = { ...meta.stats, ...(parsed.stats || {}) };
    }
  } catch (e) { }
}

function getUnlockedAchievementCount() {
  if (typeof ACHIEVEMENTS_LIST === "undefined" || !Array.isArray(ACHIEVEMENTS_LIST)) return 0;
  return ACHIEVEMENTS_LIST.filter(ach => meta.achievements && meta.achievements[ach.id] === true).length;
}

const TROPHY_MILESTONES = [
  { id: "trophy_milestone_10", required: 10, reward: 50, name: "LOVEC TROFEJÍ I" },
  { id: "trophy_milestone_25", required: 25, reward: 100, name: "LOVEC TROFEJÍ II" },
  { id: "trophy_milestone_50", required: 50, reward: 250, name: "MISTR SÍNĚ SLÁVY" }
];

function syncTrophyMilestones() {
  const unlockedCount = getUnlockedAchievementCount();
  let changed = false;
  if (!meta.trophyMilestones || typeof meta.trophyMilestones !== "object") meta.trophyMilestones = {};
  for (const milestone of TROPHY_MILESTONES) {
    if (unlockedCount >= milestone.required && meta.trophyMilestones[milestone.id] !== true) {
      meta.trophyMilestones[milestone.id] = true;
      meta.shards += milestone.reward;
      changed = true;
    }
  }
  return changed;
}

function saveMetaProgression() {
  try {
    syncTrophyMilestones();
    localStorage.setItem(META_KEY, JSON.stringify(meta));
    const unlockedCount = getUnlockedAchievementCount();
    const menuShardsEl = document.getElementById("menu-shards-count");
    if (menuShardsEl) menuShardsEl.textContent = meta.shards;
    const shopShardsEl = document.getElementById("shop-shards-count");
    if (shopShardsEl) shopShardsEl.textContent = meta.shards;
    const hudShardsEl = document.getElementById("hud-shards");
    if (hudShardsEl) hudShardsEl.textContent = meta.shards;
    const menuAchEl = document.getElementById("menu-ach-count");
    if (menuAchEl) menuAchEl.textContent = `${unlockedCount}/${ACHIEVEMENTS_LIST.length}`;
    const hudAchEl = document.getElementById("hud-ach-count");
    if (hudAchEl) hudAchEl.textContent = `${unlockedCount}/${ACHIEVEMENTS_LIST.length}`;

    if (meta.shards >= 50) unlockAchievement("rich_cyber");
    if (meta.shards >= 150) unlockAchievement("chip_hoarder");
  } catch (e) { }
}

let achPopupTimer = null;
function showBannerPopup(title, subtitle, rewardText) {
  const banner = document.getElementById("achievement-popup");
  document.getElementById("ach-popup-subtitle").textContent = subtitle;
  document.getElementById("ach-popup-title").textContent = title;
  document.getElementById("ach-popup-reward").textContent = rewardText;
  banner.classList.remove("opacity-0", "-translate-y-4");
  banner.classList.add("opacity-100", "translate-y-0");

  if (achPopupTimer) clearTimeout(achPopupTimer);
  achPopupTimer = setTimeout(() => {
    banner.classList.add("opacity-0", "-translate-y-4");
    banner.classList.remove("opacity-100", "translate-y-0");
  }, 3400);
}

// STEAMWORKS API READY: Čistý bridge pro budoucí napojení na Steam (NW.js / Electron / Greenworks)
function syncSteamAchievement(achId) {
  try {
    if (window.steamworks && typeof window.steamworks.activateAchievement === "function") {
      window.steamworks.activateAchievement(achId.toUpperCase());
    } else if (window.greenworks && typeof window.greenworks.activateAchievement === "function") {
      window.greenworks.activateAchievement(achId.toUpperCase(), () => { }, () => { });
    }
  } catch (e) { }
}

function unlockAchievement(id) {
  if (meta.achievements[id] === true) return;
  const ach = ACHIEVEMENTS_LIST.find(a => a.id === id);
  if (!ach) return;

  meta.achievements[id] = true;
  meta.shards += ach.reward;
  syncSteamAchievement(id);
  saveMetaProgression();
  sfx.playLevelUp();
  showBannerPopup(ach.name, "TROFEJ ODEMČENA!", `+${ach.reward} ◈ KVANTOVÝCH ČIPŮ`);
}

function checkWeaponSynergies() {
  let activeCount = 0;
  SYNERGIES_LIST.forEach(syn => {
    if (syn.check(player.weapons)) {
      activeCount++;
      if (!player.unlockedSynergies[syn.id]) {
        player.unlockedSynergies[syn.id] = true;
        sfx.playLevelUp();
        spawnShockwave(player.x, player.y, 440, syn.color, 6, 620);
        addFloatingText(player.x, player.y - 55, syn.name, syn.color, 1.45);
        unlockAchievement("synergy_unlock");
        // Show the synergy after the trophy notification so it is not immediately overwritten.
        showBannerPopup(syn.name, "FÚZNÍ SYNERGIE AKTIVNÍ!", "ZBRANĚ SPOJENY DO SUPER-SYSTÉMU");
      }
    }
  });
  if (activeCount >= 3) unlockAchievement("all_synergies");
  if (activeCount >= 5) unlockAchievement("synergy_5");

  const installedCount = Object.values(player.weapons).filter(lvl => lvl > 0).length;
  if (installedCount >= 6) unlockAchievement("arsenal_expert");
}

// Progresivní vzorec pro XP: v rané fázi odsýpá svižně, ve vysokých levelech strměji zpomaluje, aby hra nebyla jen o vybírání karet.
function getXpThresholdForLevel(level) {
  const xpDiscount = 1 - Math.min(4, Math.max(0, meta.upgrades.rerollDiscountLvl || 0)) * 0.05;
  const lvlIndex = Math.max(0, level - 1);
  const dynamicBase = 1.34 + Math.min(0.14, lvlIndex * 0.008);
  return Math.max(1, Math.floor(95 * Math.pow(dynamicBase, lvlIndex) * xpDiscount));
}

function saveGameProgress(showNotification = false, slot = currentSaveSlot) {
  if (state.mode === "GAMEOVER" || state.mode === "MENU" || player.hp <= 0) return;
  currentSaveSlot = slot;
  try {
    const inputEl = document.querySelector(`[data-slot-input="${slot}"]`);
    const customName = inputEl ? inputEl.value : getSlotCustomName(slot);
    localStorage.setItem(`neon_singularity_slot_name_${slot}`, customName);

    const payload = {
      timestamp: Date.now(),
      slot: slot,
      customName: customName,
      state: {
        difficulty: state.difficulty,
        mutator: state.mutator,
        score: state.score, combo: state.combo, maxCombo: state.maxCombo,
        wave: state.wave, enemiesToSpawn: state.enemiesToSpawn,
        spawnCooldown: state.spawnCooldown,
        runTimer: state.runTimer,
        supplyTimer: state.supplyTimer, wormholeTimer: state.wormholeTimer,
        comboTimer: state.comboTimer, overdriveUses: state.overdriveUses || 0,
        firedAnyShot: state.firedAnyShot,
        bossActive: state.bossActive, overdrive: state.overdrive,
        overdriveTimer: state.overdriveTimer,
        runStats: { ...state.runStats, weaponDmg: { ...(state.runStats.weaponDmg || {}) } }
      },
      // Persist the complete player runtime state, including weapon cooldowns.
      player: {
        ...player,
        afterimages: [],
        unlockedSynergies: { ...player.unlockedSynergies },
        weapons: { ...player.weapons }
      },
      // Do not silently discard enemies or XP gems when a save is made mid-wave.
      enemies: enemies.map(e => ({
        ...e,
        // performance.now() resets on page reload; persist elapsed boss time instead.
        elapsedSinceSpawnMs: e.type === "BOSS" && Number.isFinite(e.spawnTime)
          ? Math.max(0, performance.now() - e.spawnTime) : undefined,
        spawnTime: e.type === "BOSS" ? undefined : e.spawnTime
      })),
      gems: gems.map(g => ({ ...g })),
      supplyPods: supplyPods.map(pod => ({ ...pod }))
    };
    localStorage.setItem(getSaveKey(slot), JSON.stringify(payload));
    saveMetaProgression();
    if (showNotification) showSaveToast(`⚡ ULOŽENO: ${customName} (SLOT #${slot})`);
    refreshMenuSaveUI();
    updateHUD();
  } catch (e) { }
}

function clearSavedGame(slot = currentSaveSlot) {
  localStorage.removeItem(getSaveKey(slot));
  refreshMenuSaveUI();
}

// Reset only this game's progression keys; do not wipe unrelated localStorage data on the same origin.
function resetAllProgress() {
  const confirmed = window.confirm(
    "OPRAVDU SMAZAT VEŠKERÁ DATA HRY?\n\nPoužije se localStorage.clear(), takže se smažou všechny položky localStorage pro tento web, včetně postupu, profilů a nastavení. Tuto akci nelze vrátit."
  );
  if (!confirmed) return;

  try {
    localStorage.clear();
    if (localStorage.length !== 0) {
      window.alert("Reset se nepodařilo dokončit: část dat v localStorage zůstala zachována.");
      return;
    }
    window.location.reload();
  } catch (error) {
    window.alert("Reset se nepodařilo dokončit. Prohlížeč nedovolil vymazat localStorage.");
  }
}

function hasSavedGame(slot = currentSaveSlot) {
  return !!localStorage.getItem(getSaveKey(slot));
}

function refreshMenuSaveUI() {
  renderSaveSlotsUI();
  const raw = localStorage.getItem(getSaveKey(currentSaveSlot));
  const box = document.getElementById("resume-save-box");
  const metaText = document.getElementById("saved-meta-text");
  const startBtn = document.getElementById("btn-start");
  const slotTitle = getSlotCustomName(currentSaveSlot);

  if (startBtn) {
    startBtn.textContent = raw
      ? `PŘEPSAT ${slotTitle.toUpperCase()} NOVOU MISÍ [ENTER]`
      : `SPUSTIT NOVOU MISI (${slotTitle.toUpperCase()}) [ENTER]`;
  }

  if (!raw) {
    box.classList.add("hidden");
    box.classList.remove("flex");
    return;
  }
  try {
    const data = JSON.parse(raw);
    box.classList.remove("hidden");
    box.classList.add("flex");
    const sc = Math.floor(data.state.score).toLocaleString("cs-CZ");
    const diff = data.state.difficulty || "ARCADE";
    metaText.textContent = `${data.customName || slotTitle} (${data.player.shipClass || "INTERCEPTOR"} // ${diff}): VLNA ${data.state.wave} // LV ${data.player.level} // TRUP ${Math.ceil(data.player.hp)}/${data.player.maxHp} // SKÓRE: ${sc}`;
  } catch (e) {
    box.classList.add("hidden");
  }
}

function loadSavedGame(slot = currentSaveSlot) {
  const raw = localStorage.getItem(getSaveKey(slot));
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);
    currentSaveSlot = slot;
    sfx.init();
    if (sfx.ctx && sfx.ctx.state === "suspended") sfx.ctx.resume();

    bullets.length = 0; missiles.length = 0; boomerangs.length = 0; mines.length = 0;
    railBeams.length = 0; plasmaPools.length = 0; orbitalStrikes.length = 0; wormholes.length = 0;
    lensFlares.length = 0; enemyBullets.length = 0; enemies.length = 0;
    singularities.length = 0; gems.length = 0; supplyPods.length = 0;
    particles.length = 0; shockwaves.length = 0; lightningArcs.length = 0; floatingTexts.length = 0;
    decoys.length = 0;

    Object.assign(state, data.state);
    // Backward-compatible defaults for older save slots.
    state.runTimer = Number.isFinite(data.state.runTimer) ? data.state.runTimer : 0;
    state.spawnCooldown = Number.isFinite(data.state.spawnCooldown) ? data.state.spawnCooldown : 0.5;
    state.supplyTimer = Number.isFinite(data.state.supplyTimer) ? data.state.supplyTimer : 18;
    state.wormholeTimer = Number.isFinite(data.state.wormholeTimer) ? data.state.wormholeTimer : 48;
    state.comboTimer = Number.isFinite(data.state.comboTimer) ? data.state.comboTimer : 0;
    state.overdriveUses = Number.isFinite(data.state.overdriveUses) ? data.state.overdriveUses : 0;
    state.firedAnyShot = !!data.state.firedAnyShot;
    state.difficulty = data.state.difficulty || "ARCADE";
    state.mutator = data.state.mutator || "NONE";
    state.runStats = {
      totalKills: 0, eliteKills: 0, bossKills: 0, blackHolesUsed: 0,
      gemsCollected: 0, weaponDmg: {}, ...(data.state.runStats || {})
    };
    state.runStats.weaponDmg = { ...(state.runStats.weaponDmg || {}) };

    Object.assign(player, data.player);
    // Merge defaults first so saves created before new weapons existed remain upgrade-safe.
    player.weapons = { ...DEFAULT_WEAPONS_TEMPLATE, ...(data.player.weapons || {}) };
    player.unlockedSynergies = { ...(data.player.unlockedSynergies || {}) };
    player.afterimages = [];
    player.x = Math.max(40, Math.min(W - 40, player.x || W / 2));
    player.y = Math.max(40, Math.min(H - 40, player.y || H / 2));
    player.invulnTimer = 1.5;

    const dashBarEl = document.getElementById("dash-bar");
    if (dashBarEl) {
      dashBarEl.style.width = `${Math.max(0, Math.min(100, (1 - (player.dashCooldown || 0) / (player.dashMaxCooldown || 1.45)) * 100))}%`;
    }

    if (Array.isArray(data.enemies)) data.enemies.forEach(savedEnemy => {
      const enemy = { ...savedEnemy };
      if (enemy.type === "BOSS") {
        const elapsed = Number.isFinite(enemy.elapsedSinceSpawnMs) ? Math.max(0, enemy.elapsedSinceSpawnMs) : 0;
        enemy.spawnTime = performance.now() - elapsed;
        delete enemy.elapsedSinceSpawnMs;
      }
      enemies.push(enemy);
    });
    if (Array.isArray(data.gems)) data.gems.forEach(g => gems.push(g));
    if (Array.isArray(data.supplyPods)) data.supplyPods.forEach(sp => supplyPods.push(sp));

    const activeBoss = enemies.find(e => e.type === "BOSS");
    state.bossActive = !!activeBoss;
    if (activeBoss) {
      document.getElementById("boss-name").textContent = activeBoss.name || "OMEGA ARCHON";
      const gBossName = document.getElementById("ghost-boss-name");
      if (gBossName) gBossName.textContent = activeBoss.name || "OMEGA ARCHON";
      document.getElementById("boss-hud").classList.remove("hidden");
      document.getElementById("boss-hud").classList.add("flex");
      document.getElementById("ghost-boss-bar-wrap").classList.remove("hidden");
      document.getElementById("ghost-boss-bar-wrap").classList.add("flex");
    } else {
      document.getElementById("boss-hud").classList.add("hidden");
      document.getElementById("boss-hud").classList.remove("flex");
      document.getElementById("ghost-boss-bar-wrap").classList.add("hidden");
      document.getElementById("ghost-boss-bar-wrap").classList.remove("flex");
    }

    state.mode = "PLAYING";
    document.getElementById("start-modal").classList.add("hidden");
    document.getElementById("pause-modal").classList.add("hidden");
    document.getElementById("pause-modal").classList.remove("flex");
    document.getElementById("gameover-modal").classList.add("hidden");
    document.getElementById("gameover-modal").classList.remove("flex");
    syncHudVisibilityDOM();

    checkWeaponSynergies();
    updateHUD();
    const diffEl = document.getElementById("hud-difficulty");
    if (diffEl) diffEl.textContent = state.difficulty;

    spawnShockwave(player.x, player.y, 350, "#fcee09", 5, 550);
    grid.applyForce(player.x, player.y, 320, 45, false, true);
    addFloatingText(player.x, player.y - 40, `${getSlotCustomName(slot).toUpperCase()} OBNOVEN!`, "#fcee09", 1.35);
    return true;
  } catch (err) {
    return false;
  }
}

function togglePauseGame() {
  if (state.mode === "PLAYING") {
    state.mode = "PAUSED";
    keys.w = keys.a = keys.s = keys.d = false;
    mouse.down = false;
    saveGameProgress(true, currentSaveSlot);

    document.getElementById("pause-active-slot").textContent = `#${currentSaveSlot} (${getSlotCustomName(currentSaveSlot)})`;
    document.getElementById("pause-score").textContent = Math.floor(state.score).toLocaleString("cs-CZ");
    document.getElementById("pause-wave").textContent = `VLNA ${state.wave}`;
    document.getElementById("pause-level").textContent = `ÚROVEŇ ${player.level}`;
    document.getElementById("pause-arsenal-list").innerHTML = document.getElementById("arsenal-badges").innerHTML;

    document.getElementById("pause-modal").classList.remove("hidden");
    document.getElementById("pause-modal").classList.add("flex");
  } else if (state.mode === "PAUSED") {
    state.mode = "PLAYING";
    lastTime = performance.now();
    document.getElementById("pause-modal").classList.add("hidden");
    document.getElementById("pause-modal").classList.remove("flex");
  }
}

const MAX_PARTICLES = 500;
function spawnParticles(x, y, color, count = 20, speedMin = 80, speedMax = 420, size = 2.5, lifeMin = 0.35, lifeMax = 0.85) {
  // Pokud je aréna přehlcena, raději nové částice osekáme, aby hra nezamrzla
  if (particles.length > MAX_PARTICLES - 50) {
    particles.splice(0, 40); // Okamžitě smete nejstarší částice
  }
  const loadRatio = particles.length / MAX_PARTICLES;
  const effCount = loadRatio > 0.6 ? Math.max(1, Math.floor(count * 0.35)) : count;

  for (let i = 0; i < effCount && particles.length < MAX_PARTICLES; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = speedMin + Math.random() * (speedMax - speedMin);
    const life = lifeMin + Math.random() * (lifeMax - lifeMin);
    particles.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      color,
      size: size * (0.7 + Math.random() * 0.6),
      life,
      maxLife: life,
      drag: 0.94
    });
  }
}

function spawnLensFlare(x, y, color = "#00f3ff", width = 380) {
  if (lensFlares.length > 20) fastRemove(lensFlares, 0);
  lensFlares.push({ x, y, color, width, life: 0.32, maxLife: 0.32 });
}

function spawnShockwave(x, y, maxRadius, color = "#00f3ff", lineWidth = 4, speed = 420) {
  if (shockwaves.length > 35) fastRemove(shockwaves, 0);
  shockwaves.push({ x, y, radius: 4, maxRadius, color, lineWidth, speed });
}

function addFloatingText(x, y, text, color = "#00f3ff", scale = 1.0) {
  if (floatingTexts.length > 35) fastRemove(floatingTexts, 0);
  floatingTexts.push({ x, y, vy: -55, text, color, scale, life: 0.95, maxLife: 0.95 });
}

function startNewGame() {
  if (document.activeElement && typeof document.activeElement.blur === "function") {
    document.activeElement.blur();
  }
  clearSavedGame(currentSaveSlot);
  sfx.init();
  if (sfx.ctx && sfx.ctx.state === "suspended") sfx.ctx.resume();

  bullets.length = 0; missiles.length = 0; boomerangs.length = 0; mines.length = 0;
  railBeams.length = 0; plasmaPools.length = 0; orbitalStrikes.length = 0; wormholes.length = 0;
  lensFlares.length = 0; enemyBullets.length = 0; enemies.length = 0;
  singularities.length = 0; gems.length = 0; supplyPods.length = 0;
  particles.length = 0; shockwaves.length = 0; lightningArcs.length = 0; floatingTexts.length = 0;
  decoys.length = 0;

  const chosenShip = SHIP_CLASSES.find(s => s.id === meta.selectedShip) || SHIP_CLASSES[0];
  player.shipClass = chosenShip.id;
  player.color = meta.customColor || chosenShip.color;
  player.x = W / 2;
  player.y = H / 2;
  player.vx = 0;
  player.vy = 0;
  player.angle = 0;

  const ocHullBonus = (meta.overclock?.spdOc || 0) * 5;
  const baseHull = chosenShip.hp + (meta.upgrades.hullLvl || 0) * 25 + ocHullBonus;
  const diffHullMult = state.difficulty === "ULTRA" ? 0.35 : (state.difficulty === "HARDCORE" ? 0.7 : 1.0);
  player.maxHp = Math.max(1, Math.round(baseHull * diffHullMult));
  player.hp = player.maxHp;

  const startXpBonus = (meta.overclock?.xpOc || 0) * 35;
  player.level = 1;
  player.xpNext = getXpThresholdForLevel(player.level);
  player.xp = startXpBonus;

  const overclockSpd = 1 + (meta.overclock?.spdOc || 0) * 0.01;
  player.speed = Math.round(chosenShip.speed * overclockSpd);

  const overclockDmg = (meta.overclock?.dmgOc || 0) * 0.02;
  player.dmgMult = 1 + (meta.upgrades.dmgLvl || 0) * 0.12 + overclockDmg;

  const dashCdMult = 1 - (meta.upgrades.dashCdLvl || 0) * 0.08;
  player.dashMaxCooldown = Math.max(0.45, chosenShip.dashCd * dashCdMult);
  player.dashCooldown = 0;
  const dashBarEl = document.getElementById("dash-bar");
  if (dashBarEl) dashBarEl.style.width = "100%";

  player.portalCooldown = 0;
  player.maxBombs = 5 + (meta.upgrades.novaLvl || 0);
  player.bombs = Math.min(player.maxBombs, chosenShip.bombs + (meta.upgrades.novaLvl || 0));
  player.invulnTimer = 1.2;
  player.unlockedSynergies = {};

  player.weapons = {
    solarHaloLvl: 0, swarmBotsLvl: 0, gravCannonLvl: 0, phaseMeltLvl: 0,
    whipLvl: 0, mortarLvl: 0, nanoShieldLvl: 0, decoyLvl: 0,
    lightningTrapLvl: 0, riftSlicerLvl: 0, prismLaserLvl: 0, overchargeCoreLvl: 0,
    ...chosenShip.initWeapons
  };
  // Clear every run-specific weapon timer so a new run never inherits cooldowns or effects.
  [
    "fireTimer", "missileTimer", "teslaTimer", "railgunTimer", "droneTimer",
    "trailTimer", "cryoTimer", "flameTickTimer", "satelliteTimer", "boomerangTimer",
    "mineTimer", "shockwaveTimer", "solarHaloTimer", "swarmBotsTimer", "gravCannonTimer",
    "whipTimer", "mortarTimer", "decoyTimer", "trapTimer", "slicerTimer",
    "aegisCooldown", "bladeAngle", "droneAngle", "voidLanceTimer", "stasisTimer", "flailAngle", "laserRingAngle"
  ].forEach(key => { player[key] = 0; });
  player.afterimages = [];
  player.aegisReady = player.weapons.aegisLvl > 0;
  player.aegisCooldown = 0;

  document.getElementById("ship-hud-name").textContent = chosenShip.name;
  const diffEl = document.getElementById("hud-difficulty");
  if (diffEl) diffEl.textContent = state.difficulty;

  state.score = 0;
  state.combo = 1.0;
  state.maxCombo = 1.0;
  state.comboTimer = 0;
  state.overdriveUses = 0;
  state.shake = 0;
  state.chromatic = 0;
  state.wave = 1;
  state.firedAnyShot = false;
  state.enemiesToSpawn = state.mutator === "SWARM_CHAOS" ? 20 : 10;
  state.spawnCooldown = 0.5;
  state.bossActive = false;
  state.overdrive = (meta.upgrades.overdriveLvl || 0) * 25;
  state.overdriveTimer = 0;
  state.supplyTimer = 15;
  state.wormholeTimer = 45;
  state.runStats = {
    totalKills: 0,
    eliteKills: 0,
    bossKills: 0,
    blackHolesUsed: 0,
    gemsCollected: 0,
    weaponDmg: {}
  };
  state.runTimer = 0;
  state.mode = "PLAYING";

  document.getElementById("start-modal").classList.add("hidden");
  document.getElementById("pause-modal").classList.add("hidden");
  document.getElementById("pause-modal").classList.remove("flex");
  document.getElementById("gameover-modal").classList.add("hidden");
  document.getElementById("gameover-modal").classList.remove("flex");
  document.getElementById("upgrade-modal").classList.add("hidden");
  document.getElementById("upgrade-modal").classList.remove("flex");
  document.getElementById("boss-hud").classList.add("hidden");
  document.getElementById("ghost-boss-bar-wrap").classList.add("hidden");
  syncHudVisibilityDOM();

  checkWeaponSynergies();
  updateHUD();
  spawnShockwave(player.x, player.y, 380, player.color, 5, 580);
  spawnLensFlare(player.x, player.y, player.color, 550);
  grid.applyForce(player.x, player.y, 350, 45, false, true);
  addFloatingText(player.x, player.y - 40, `${chosenShip.name} // ${state.difficulty}`, player.color, 1.35);

  if (typeof sfx !== "undefined" && sfx.tracks && sfx.tracks.length > 1) {
    sfx.styleIndex = Math.floor(Math.random() * sfx.tracks.length);
    sfx.playCurrentTrack();
    const btn = document.getElementById("btn-track");
    if (btn) btn.textContent = `🎵 RÁDIO: ${sfx.tracks[sfx.styleIndex].label}`;
    const gTrack = document.getElementById("ghost-track");
    if (gTrack) gTrack.textContent = sfx.tracks[sfx.styleIndex].label;
  }

  if (window.matchMedia("(pointer: coarse)").matches) {
    toggleAppFullscreen();
  }
}

function triggerGameOver(isVictory = false) {
  state.mode = "GAMEOVER";
  clearSavedGame(currentSaveSlot);
  syncHudVisibilityDOM();

  // VŽDY uložit celoživotní statistiky a nejvyšší rekord i při prohře!
  if (state.score > state.bestScore) {
    state.bestScore = Math.floor(state.score);
    localStorage.setItem(BEST_KEY, String(state.bestScore));
  }
  saveMetaProgression();
  if (typeof renderHallOfFame === "function") renderHallOfFame();

  const badgeEl = document.getElementById("go-badge");
  const titleEl = document.getElementById("go-title");
  if (isVictory) {
    let bonusShards = state.difficulty === "ULTRA" ? 100 : (state.difficulty === "HARDCORE" ? 60 : 25);
    if (state.difficulty === "HARDCORE" || state.difficulty === "ULTRA") unlockAchievement("hardcore_victor");
    if (state.mutator !== "NONE" && typeof window.DAILY_MUTATORS !== "undefined") {
      const mutObj = window.DAILY_MUTATORS.find(m => m.id === state.mutator);
      if (mutObj && mutObj.bonusChips) {
        const mutChipMult = state.difficulty === "ULTRA" ? 3 : (state.difficulty === "HARDCORE" ? 2 : 1);
        bonusShards += mutObj.bonusChips * mutChipMult;
      }
      unlockAchievement("mutator_win");
    }
    meta.shards += bonusShards;
    saveMetaProgression();
    if (badgeEl) {
      badgeEl.textContent = `🏆 KAMPAŇ DOKONČENA (${state.difficulty}) // BONUS +${bonusShards} ◈ ČIPŮ!`;
      badgeEl.className = "inline-block px-3 py-1 bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-orbitron text-xs tracking-widest uppercase mb-2 animate-pulse";
    }
    if (titleEl) titleEl.textContent = "MISE SPLNĚNA!";
  } else {
    if (badgeEl) {
      badgeEl.textContent = "KOLAPS JÁDRA // SYSTÉM ZNIČEN";
      badgeEl.className = "inline-block px-3 py-1 bg-red-500/20 border border-red-500 text-red-300 font-orbitron text-xs tracking-widest uppercase mb-2 animate-pulse";
    }
    if (titleEl) titleEl.textContent = "KONEC PŘENOSU";
  }

  document.getElementById("go-score").textContent = Math.floor(state.score).toLocaleString("cs-CZ");
  document.getElementById("go-best").textContent = state.bestScore.toLocaleString("cs-CZ");
  document.getElementById("go-wave").textContent = `VLNA ${state.wave}`;
  document.getElementById("go-shards").textContent = `◈ ${meta.shards}`;

  const telemetriBox = document.getElementById("telemetri-grid-box");
  if (state.runStats && telemetriBox) {
    let topWep = "PULZNÍ KANÓN";
    let maxD = 0;
    for (const [wName, dVal] of Object.entries(state.runStats.weaponDmg || {})) {
      if (dVal > maxD) {
        maxD = dVal;
        topWep = wName;
      }
    }
    const bestWepStr = maxD > 0 ? `${topWep} (${Math.floor(maxD).toLocaleString("cs-CZ")} DMG)` : "PULZNÍ KANÓN";
    const totalKillsStr = String(state.runStats.totalKills || 0);
    const elitesBossesStr = `${state.runStats.eliteKills || 0} / ${state.runStats.bossKills || 0}`;
    const bhUsedStr = String(state.runStats.blackHolesUsed || 0);
    const gemsStr = String(state.runStats.gemsCollected || 0);
    const maxComboStr = `x${(state.maxCombo || 1.0).toFixed(1)}`;

    telemetriBox.innerHTML = `
      <div class="cyber-box p-3 text-left">
        <div class="text-[10px] font-orbitron text-cyan-300 uppercase tracking-widest mb-2 font-bold border-b border-cyan-500/30 pb-1">
          📊 TELEMETRIE MISE (RUN SUMMARY):
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-orbitron">
          <div class="bg-slate-950/80 border border-slate-800 p-2">
            <div class="text-[9px] text-slate-400">ZNIČENÍ NEPŘÁTELÉ</div>
            <div class="text-sm font-black text-white mt-0.5">${totalKillsStr}</div>
          </div>
          <div class="bg-slate-950/80 border border-slate-800 p-2">
            <div class="text-[9px] text-slate-400">ELITY / BOSSOVÉ</div>
            <div class="text-sm font-black text-pink-400 mt-0.5">${elitesBossesStr}</div>
          </div>
          <div class="bg-slate-950/80 border border-slate-800 p-2">
            <div class="text-[9px] text-slate-400">NEJÚČINNĚJŠÍ ZBRAŇ</div>
            <div class="text-[10px] font-black text-yellow-300 mt-0.5 truncate" title="${bestWepStr}">${bestWepStr}</div>
          </div>
          <div class="bg-slate-950/80 border border-slate-800 p-2">
            <div class="text-[9px] text-slate-400">ČERNÉ DÍRY</div>
            <div class="text-sm font-black text-purple-300 mt-0.5">${bhUsedStr}</div>
          </div>
          <div class="bg-slate-950/80 border border-slate-800 p-2">
            <div class="text-[9px] text-slate-400">XP KRYSTALY</div>
            <div class="text-sm font-black text-emerald-300 mt-0.5">${gemsStr}</div>
          </div>
          <div class="bg-slate-950/80 border border-slate-800 p-2">
            <div class="text-[9px] text-slate-400">MAX KOMBO</div>
            <div class="text-sm font-black text-cyan-300 mt-0.5">${maxComboStr}</div>
          </div>
        </div>
      </div>
    `;
  }

  setTimeout(() => {
    if (state.mode === "GAMEOVER") {
      document.getElementById("gameover-modal").classList.remove("hidden");
      document.getElementById("gameover-modal").classList.add("flex");
      if (typeof currentLang !== "undefined" && currentLang === "en" && typeof applyDOMTranslations === "function") {
        setTimeout(applyDOMTranslations, 15);
      }
    }
  }, 650);
}

// VYLEPŠENÉ MAPOVÁNÍ PRO PLAYSTATION DUALSHOCK 4 (S DEBOUNCEM PRO MENU I UPGRADY)
let gamepadDashLock = false;
let gamepadBombLock = false;
let gamepadOverdriveLock = false;
let gamepadPauseLock = false;
let gamepadUpgradeLock = false;
let gamepadMenuNavCooldown = 0;

function pollGamepadInput(dt = 0.016) {
  if (gamepadMenuNavCooldown > 0) gamepadMenuNavCooldown -= dt;
  if (!navigator.getGamepads) return { moveX: 0, moveY: 0 };
  const pads = navigator.getGamepads();
  const gp = pads[0] || pads[1] || pads[2] || pads[3];
  if (!gp) {
    const badge = document.getElementById("gamepad-status-badge");
    if (badge && !badge.textContent.includes("NEPŘIPOJEN") && !badge.textContent.includes("DISCONNECTED")) {
      badge.textContent = "🎮 GAMEPAD: NEPŘIPOJEN";
      badge.className = "px-2.5 py-1 bg-slate-900 border border-slate-700 text-slate-400 font-orbitron text-[10px]";
    }
    return { moveX: 0, moveY: 0 };
  }

  const badge = document.getElementById("gamepad-status-badge");
  if (badge && !badge.textContent.includes("AKTIVNÍ") && !badge.textContent.includes("ACTIVE")) {
    badge.textContent = "🎮 DUALSHOCK / GAMEPAD: AKTIVNÍ";
    badge.className = "px-2.5 py-1 bg-cyan-950 border border-cyan-400 text-cyan-300 font-orbitron text-[10px] shadow-[0_0_10px_rgba(0,243,255,0.4)]";
  }

  const pausePressed = gp.buttons[9] && gp.buttons[9].pressed;
  if (pausePressed && !gamepadPauseLock) {
    if (state.mode === "PLAYING" || state.mode === "PAUSED") togglePauseGame();
    gamepadPauseLock = true;
  } else if (!pausePressed) {
    gamepadPauseLock = false;
  }

  const dpadLeft = (gp.buttons[14] && gp.buttons[14].pressed) || gp.axes[0] < -0.65;
  const dpadUp = (gp.buttons[12] && gp.buttons[12].pressed) || gp.axes[1] < -0.65;
  const dpadRight = (gp.buttons[15] && gp.buttons[15].pressed) || gp.axes[0] > 0.65;

  if (state.mode === "UPGRADE") {
    if (!gamepadUpgradeLock && gamepadMenuNavCooldown <= 0) {
      if (dpadLeft) { gamepadUpgradeLock = true; gamepadMenuNavCooldown = 0.28; selectUpgradeCard(0); }
      else if (dpadUp) { gamepadUpgradeLock = true; gamepadMenuNavCooldown = 0.28; selectUpgradeCard(1); }
      else if (dpadRight) { gamepadUpgradeLock = true; gamepadMenuNavCooldown = 0.28; selectUpgradeCard(2); }
    } else if (!dpadLeft && !dpadUp && !dpadRight) {
      gamepadUpgradeLock = false;
    }
    return { moveX: 0, moveY: 0 };
  }

  if (state.mode === "MENU" || state.mode === "GAMEOVER") {
    // Přepínání lodí v Hangáru šipkami na D-Padu
    if (state.mode === "MENU" && gamepadMenuNavCooldown <= 0 && (dpadLeft || dpadRight)) {
      const curIdx = SHIP_CLASSES.findIndex(s => s.id === meta.selectedShip);
      const nextIdx = (curIdx + (dpadRight ? 1 : -1) + SHIP_CLASSES.length) % SHIP_CLASSES.length;
      meta.selectedShip = SHIP_CLASSES[nextIdx].id;
      player.shipClass = meta.selectedShip;
      player.color = meta.customColor || SHIP_CLASSES[nextIdx].color;
      saveMetaProgression();
      renderShipSelector();
      gamepadMenuNavCooldown = 0.25;
    }

    if (gp.buttons[0] && gp.buttons[0].pressed && !gamepadDashLock) {
      gamepadDashLock = true;
      startNewGame();
    } else if (!(gp.buttons[0] && gp.buttons[0].pressed)) {
      gamepadDashLock = false;
    }
    return { moveX: 0, moveY: 0 };
  }

  const deadzone = 0.18;
  let lx = Math.abs(gp.axes[0]) > deadzone ? gp.axes[0] : 0;
  let ly = Math.abs(gp.axes[1]) > deadzone ? gp.axes[1] : 0;
  let rx = Math.abs(gp.axes[2]) > deadzone ? gp.axes[2] : 0;
  let ry = Math.abs(gp.axes[3]) > deadzone ? gp.axes[3] : 0;

  if (rx !== 0 || ry !== 0) {
    const aimAngle = Math.atan2(ry, rx);
    player.angle = aimAngle;
    mouse.x = player.x + Math.cos(aimAngle) * 180;
    mouse.y = player.y + Math.sin(aimAngle) * 180;
    mouse.down = true;
  } else {
    mouse.down = false;
  }

  const dashPressed = (gp.buttons[0] && gp.buttons[0].pressed) || (gp.buttons[5] && gp.buttons[5].pressed);
  if (dashPressed && !gamepadDashLock) {
    triggerHyperDash();
    gamepadDashLock = true;
  } else if (!dashPressed) {
    gamepadDashLock = false;
  }

  const bombPressed = (gp.buttons[2] && gp.buttons[2].pressed) || (gp.buttons[4] && gp.buttons[4].pressed);
  if (bombPressed && !gamepadBombLock) {
    deploySingularityBomb();
    gamepadBombLock = true;
  } else if (!bombPressed) {
    gamepadBombLock = false;
  }

  const odPressed = gp.buttons[3] && gp.buttons[3].pressed;
  if (odPressed && !gamepadOverdriveLock) {
    triggerQuantumOverdrive();
    gamepadOverdriveLock = true;
  } else if (!odPressed) {
    gamepadOverdriveLock = false;
  }

  return { moveX: lx, moveY: ly };
}

let lastTime = performance.now();
let frameCount = 0;
let fpsTimer = 0;

function update(dt) {
  // Tvrdý bezpečnostní limit proti přehlcení paměti a lagům
  if (particles.length > MAX_PARTICLES) particles.splice(0, particles.length - MAX_PARTICLES);
  if (bullets.length > 300) bullets.splice(0, 100);
  if (enemyBullets.length > 200) enemyBullets.splice(0, 80);
  sfx.updateAudioAnalysis(dt);

  // V menu necháme hvězdné pozadí plynule plout vesmírem, v boji reaguje na pohyb lodi
  grid.update();
  const bgVx = state.mode === "MENU" ? 95 : player.vx;
  const bgVy = state.mode === "MENU" ? 45 : player.vy;
  spaceBg.update(dt, bgVx, bgVy, W, H);
  const gpMove = pollGamepadInput(dt);

  if (sfx.justBeat && state.mode === "PLAYING") {
    grid.triggerBeatWave(player.x, player.y, 1.15);
    spawnShockwave(player.x, player.y, 85, player.color, 2.2, 460);

    if (sfx.justBarDrop) {
      triggerKineticShockwave(175, 22 * player.dmgMult, "#ff007f");
      state.chromatic = Math.max(state.chromatic, 0.25);

      // Audio-reaktivní sonický pulz bosse na každý 4. beat
      for (const e of enemies) {
        if (e.type === "BOSS") {
          spawnShockwave(e.x, e.y, 160, e.color, 3.5, 480);
          // Vystřelí 4 hudební pulzy do kříže přesně v momentě dropu
          for (let k = 0; k < 4; k++) {
            const ba = e.angle + (k * Math.PI) / 2;
            enemyBullets.push({
              x: e.x,
              y: e.y,
              vx: Math.cos(ba) * 260,
              vy: Math.sin(ba) * 260,
              radius: 5.5,
              color: e.color
            });
          }
        }
      }
    }

    for (const e of enemies) {
      if (e.type === "BOSS") {
        grid.applyForce(e.x, e.y, 280, 22, false, true);
      }
    }
  }

  if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 28);
  if (state.chromatic > 0) state.chromatic = Math.max(0, state.chromatic - dt * 2.4);

  // ŽIVÉ INTERAKTIVNÍ POZADÍ V HANGÁRU (MENU)
  if (state.mode === "MENU") {
    const t = performance.now() * 0.001;
    // Loď v pozadí jemně krouží a natáčí se
    player.x = W / 2 + Math.cos(t * 0.6) * 140;
    player.y = H / 2 + Math.sin(t * 0.9) * 90;
    player.angle = t * 0.7;

    // 1. Plynulá gravitační stopa kolem lodi a kurzoru myši
    if (Math.random() < 0.35) {
      grid.applyForce(player.x, player.y, 170, 14, false, true);
    }
    if (Math.random() < 0.25) {
      grid.applyForce(mouse.x, mouse.y, 130, 10, false, false);
    }

    // 2. Náhodné neonové šokové vlny a gejzíry částic na pozadí
    if (Math.random() < 0.045) {
      const rx = Math.random() * W;
      const ry = Math.random() * H;
      const cols = ["#00f3ff", "#ff007f", "#fcee09", "#bc13fe", "#00ffaa"];
      const col = cols[Math.floor(Math.random() * cols.length)];
      grid.applyForce(rx, ry, 280, 42, Math.random() < 0.35, true);
      spawnShockwave(rx, ry, 180 + Math.random() * 140, col, 3, 360);
      spawnParticles(rx, ry, col, 14, 50, 220, 2.2);
    }

    // 3. Aktualizace dohasínání částic a šokových vln i v menu
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vx *= p.drag; p.vy *= p.drag;
      p.life -= dt;
      if (p.life <= 0) fastRemove(particles, i);
    }
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += sw.speed * dt;
      if (sw.radius >= sw.maxRadius) fastRemove(shockwaves, i);
    }
    return;
  }

  if (state.mode !== "PLAYING") return;

  state.runTimer += dt;
  const mins = String(Math.floor(state.runTimer / 60)).padStart(2, "0");
  const secs = String(Math.floor(state.runTimer % 60)).padStart(2, "0");
  const timeStr = `${mins}:${secs}`;

  const t1 = document.getElementById("hud-run-timer");
  if (t1) t1.textContent = timeStr;
  const t2 = document.getElementById("ghost-run-timer");
  if (t2) t2.textContent = timeStr;

  // Pokud hráč odstartoval s vysokým startovním XP z Overclocku, vyvolá vylepšení
  if (player.xp >= player.xpNext) {
    player.xp -= player.xpNext;
    player.level++;
    player.xpNext = getXpThresholdForLevel(player.level);
    triggerUpgradeSelection();
    updateHUD();
    return;
  }

  if (player.portalCooldown > 0) player.portalCooldown -= dt;

  if (player.weapons.regenLvl > 0 && player.hp < player.maxHp) {
    player.hp = Math.min(player.maxHp, player.hp + player.weapons.regenLvl * 3.5 * dt);
    if (Math.random() < 0.25) updateHUD();
  }

  if (player.weapons.solarHaloLvl > 0) {
    const haloR = 95 + player.weapons.solarHaloLvl * 28 + (player.weapons.overchargeCoreLvl > 0 ? 35 : 0);
    player.solarHaloTimer -= dt;
    if (player.solarHaloTimer <= 0) {
      player.solarHaloTimer = 0.15;
      for (const e of enemies) {
        if (Math.hypot(e.x - player.x, e.y - player.y) <= haloR + e.radius) {
          e.burnTimer = 2.0;
          e.slowTimer = Math.max(e.slowTimer || 0, 0.6);
          damageEnemy(e, (14 + player.weapons.solarHaloLvl * 8) * player.dmgMult, "#fb923c", false, false, "SLUNEČNÍ AURA");
        }
      }
    }
  }

  let enemyTimeScale = 1.0;
  if (state.overdriveTimer > 0) {
    state.overdriveTimer = Math.max(0, state.overdriveTimer - dt);
    enemyTimeScale = 0.42;
    updateHUD();
  }
  const enemyDt = dt * enemyTimeScale;

  state.supplyTimer -= dt;
  if (state.supplyTimer <= 0) {
    state.supplyTimer = 18 + Math.random() * 8;
    if (supplyPods.length < 2) spawnSupplyPod();
  }

  if (state.wave >= 2) {
    state.wormholeTimer -= dt;
    if (state.wormholeTimer <= 0) {
      state.wormholeTimer = 48 + Math.random() * 20;
      if (wormholes.length === 0) spawnRareWormholePair();
    }
  }

  for (let i = wormholes.length - 1; i >= 0; i--) {
    const wh = wormholes[i];
    wh.life -= dt;
    wh.angle += dt * 4.5;

    if (player.portalCooldown <= 0) {
      if (Math.hypot(player.x - wh.x1, player.y - wh.y1) < wh.radius + player.radius) {
        player.x = wh.x2; player.y = wh.y2;
        player.portalCooldown = 1.6;
        player.invulnTimer = Math.max(player.invulnTimer, 0.6);
        unlockAchievement("wormhole_jump");
        sfx.playDash();
        spawnShockwave(wh.x2, wh.y2, 220, "#ff6600", 4, 520);
        addFloatingText(wh.x2, wh.y2 - 30, "🌀 HYPER-TELEPORT!", "#ff6600", 1.25);
      } else if (Math.hypot(player.x - wh.x2, player.y - wh.y2) < wh.radius + player.radius) {
        player.x = wh.x1; player.y = wh.y1;
        player.portalCooldown = 1.6;
        player.invulnTimer = Math.max(player.invulnTimer, 0.6);
        unlockAchievement("wormhole_jump");
        sfx.playDash();
        spawnShockwave(wh.x1, wh.y1, 220, "#00f3ff", 4, 520);
        addFloatingText(wh.x1, wh.y1 - 30, "🌀 HYPER-TELEPORT!", "#00f3ff", 1.25);
      }
    }

    if (wh.life <= 0) fastRemove(wormholes, i);
  }

  if (state.combo > 1.0) {
    state.comboTimer -= dt;
    if (state.comboTimer <= 0) {
      state.combo = Math.max(1.0, +(state.combo - dt * 0.8).toFixed(2));
      updateHUD();
    }
  }

  if (player.weapons.aegisLvl > 0 && !player.aegisReady) {
    player.aegisCooldown -= dt;
    if (player.aegisCooldown <= 0) {
      player.aegisReady = true;
      spawnShockwave(player.x, player.y, 110, "#60a5fa", 3, 420);
      addFloatingText(player.x, player.y - 25, "AEGIS ŠTÍT NABIT!", "#60a5fa", 1.05);
    }
    updateHUD();
  }

  if (state.enemiesToSpawn > 0) {
    state.spawnCooldown -= enemyDt;
    if (state.spawnCooldown <= 0) {
      spawnEnemy();
      state.enemiesToSpawn--;
      const mutMult = state.mutator === "SWARM_CHAOS" ? 0.55 : 1.0;
      const hcMult = state.difficulty === "ULTRA" ? 0.72 : (state.difficulty === "HARDCORE" ? 0.85 : 1.0);
      state.spawnCooldown = Math.max(0.12, (0.90 - state.wave * 0.045) * mutMult * hcMult);
    }
  } else if (enemies.length === 0) {
    if (player.shipClass === "STALKER") unlockAchievement("stalker_master");
    state.wave++;
    if (state.wave >= 6) {
      unlockAchievement("wave_6");
      if (state.mutator !== "NONE") unlockAchievement("mutator_win");
      if (state.difficulty === "ULTRA") unlockAchievement("ultra_survivor");
    }
    if (state.wave >= 10) unlockAchievement("wave_10");
    if (state.wave >= 15) unlockAchievement("wave_15");
    if (state.wave >= 20) unlockAchievement("wave_20");
    if (state.difficulty === "ENDLESS" && state.wave >= 30) unlockAchievement("endless_30");
    if (state.difficulty === "ENDLESS" && state.wave >= 50) unlockAchievement("endless_50");

    const baseCount = 10 + state.wave * 4;
    state.enemiesToSpawn = state.mutator === "SWARM_CHAOS" ? Math.round(baseCount * 2.0) : baseCount;
    const tierRoman = ["I", "II", "III", "IV"][getAITier() - 1];
    addFloatingText(W / 2, H / 2 - 60, `VLNA ${state.wave} // AI TIER ${tierRoman}`, "#fcee09", 1.45);
    spawnShockwave(player.x, player.y, 320, "#fcee09", 3, 480);

    if (state.wave % 3 === 0) spawnEnemy("BOSS");
    updateHUD();
    saveGameProgress(false, currentSaveSlot);
  }

  let moveX = ((keys.d ? 1 : 0) - (keys.a ? 1 : 0)) + gpMove.moveX;
  let moveY = ((keys.s ? 1 : 0) - (keys.w ? 1 : 0)) + gpMove.moveY;
  const moveMag = Math.hypot(moveX, moveY);
  if (moveMag > 1) {
    moveX /= moveMag;
    moveY /= moveMag;
  }

  const spdBoost = state.overdriveTimer > 0 ? 1.25 : 1.0;
  player.vx = player.vx * 0.82 + moveX * player.speed * spdBoost * 0.18;
  player.vy = player.vy * 0.82 + moveY * player.speed * spdBoost * 0.18;
  player.x = Math.max(player.radius, Math.min(W - player.radius, player.x + player.vx * dt));
  player.y = Math.max(player.radius, Math.min(H - player.radius, player.y + player.vy * dt));

  if (gpMove.moveX === 0 && gpMove.moveY === 0) {
    // Pokud je na mobilu (touch controls aktivní), zaměří nejbližšího nepřítele
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice && enemies.length > 0) {
      let nearest = null;
      let minD = Infinity;
      for (const e of enemies) {
        const d = Math.hypot(e.x - player.x, e.y - player.y);
        if (d < minD) { minD = d; nearest = e; }
      }
      if (nearest) {
        player.angle = Math.atan2(nearest.y - player.y, nearest.x - player.x);
        mouse.x = nearest.x;
        mouse.y = nearest.y;
      }
    } else if (!isTouchDevice) {
      player.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    }
  }

  if (Math.hypot(player.vx, player.vy) > 120) {
    if (Math.random() < 0.45) grid.applyForce(player.x, player.y, 65, 3.2, false);
    if (player.weapons.plasmaTrailLvl > 0) {
      player.trailTimer -= dt;
      if (player.trailTimer <= 0) {
        player.trailTimer = 0.14;
        plasmaPools.push({
          x: player.x, y: player.y,
          radius: 26 + player.weapons.plasmaTrailLvl * 5,
          dmg: (52 + player.weapons.plasmaTrailLvl * 22) * player.dmgMult,
          life: 1.6, maxLife: 1.6
        });
      }
    }
  }

  if (player.dashCooldown > 0) {
    player.dashCooldown = Math.max(0, player.dashCooldown - dt);
    document.getElementById("dash-bar").style.width = `${(1 - player.dashCooldown / player.dashMaxCooldown) * 100}%`;
  }
  if (player.invulnTimer > 0) player.invulnTimer -= dt;

  for (let i = player.afterimages.length - 1; i >= 0; i--) {
    player.afterimages[i].alpha -= dt * 2.6;
    if (player.afterimages[i].alpha <= 0) fastRemove(player.afterimages, i);
  }

  const odFireMult = state.overdriveTimer > 0 ? 0.5 : 1.0;
  player.fireTimer -= dt;
  const fireInterval = Math.max(0.035, 0.142 * Math.pow(0.85, player.weapons.fireRateLvl - 1) * odFireMult);
  if (player.fireTimer <= 0) {
    firePrimaryWeapons();
    player.fireTimer = fireInterval;
  }

  updateFlamethrower(dt);

  if (player.weapons.whipLvl > 0) {
    player.whipTimer -= dt;
    if (player.whipTimer <= 0 && enemies.length > 0) {
      firePlasmaWhip();
      player.whipTimer = Math.max(0.65, (1.45 - player.weapons.whipLvl * 0.15) * odFireMult);
    }
  }

  if (player.weapons.mortarLvl > 0) {
    player.mortarTimer -= dt;
    if (player.mortarTimer <= 0 && enemies.length > 0) {
      fireQuantumMortar();
      player.mortarTimer = Math.max(1.1, (2.6 - player.weapons.mortarLvl * 0.25) * odFireMult);
    }
  }

  if (player.weapons.decoyLvl > 0) {
    player.decoyTimer -= dt;
    if (player.decoyTimer <= 0 && enemies.length > 0) {
      spawnHoloDecoy();
      player.decoyTimer = Math.max(3.5, 6.5 - player.weapons.decoyLvl * 0.6);
    }
  }

  for (let i = decoys.length - 1; i >= 0; i--) {
    const dec = decoys[i];
    dec.life -= dt;
    for (const e of enemies) {
      if (Math.hypot(e.x - dec.x, e.y - dec.y) < e.radius + 20) {
        dec.life = 0;
        break;
      }
    }
    if (dec.life <= 0) {
      sfx.playExplosion(1.4);
      spawnShockwave(dec.x, dec.y, 160, "#a855f7", 4, 520);
      spawnParticles(dec.x, dec.y, "#a855f7", 30, 80, 380, 2.8);
      for (let j = enemies.length - 1; j >= 0; j--) {
        const e = enemies[j];
        if (Math.hypot(e.x - dec.x, e.y - dec.y) <= 160 + e.radius) {
          damageEnemy(e, dec.blastDmg, "#a855f7", true, false, "HOLO-NÁVNADA");
        }
      }
      fastRemove(decoys, i);
    }
  }

  if (player.weapons.lightningTrapLvl > 0) {
    player.trapTimer -= dt;
    if (player.trapTimer <= 0) {
      dropLightningTrap();
      player.trapTimer = Math.max(1.6, 3.4 - player.weapons.lightningTrapLvl * 0.35);
    }
  }

  if (player.weapons.riftSlicerLvl > 0) {
    player.slicerTimer -= dt;
    if (player.slicerTimer <= 0 && enemies.length > 0) {
      fireRiftSlicer();
      player.slicerTimer = Math.max(0.7, (1.6 - player.weapons.riftSlicerLvl * 0.16) * odFireMult);
    }
  }

  if (player.weapons.boomerangLvl > 0) {
    player.boomerangTimer -= dt;
    if (player.boomerangTimer <= 0 && enemies.length > 0) {
      firePhotonBoomerangs();
      player.boomerangTimer = Math.max(0.75, (1.65 - player.weapons.boomerangLvl * 0.18) * odFireMult);
    }
  }

  for (let i = boomerangs.length - 1; i >= 0; i--) {
    const bm = boomerangs[i];
    bm.life -= dt;
    bm.spinAngle += dt * 16;

    if (!bm.returning) {
      bm.vx *= 0.96;
      bm.vy *= 0.96;
      if (Math.hypot(bm.vx, bm.vy) < 90 || bm.life < 1.35) bm.returning = true;
    } else {
      const dx = player.x - bm.x;
      const dy = player.y - bm.y;
      const d = Math.hypot(dx, dy) || 1;
      bm.vx = (dx / d) * 760;
      bm.vy = (dy / d) * 760;
      if (d < player.radius + 18) {
        fastRemove(boomerangs, i);
        continue;
      }
    }

    bm.x += bm.vx * dt;
    bm.y += bm.vy * dt;

    if (bm.isSupernova && Math.random() < 0.35) {
      plasmaPools.push({
        x: bm.x, y: bm.y, radius: 22,
        dmg: 45 * player.dmgMult, life: 0.9, maxLife: 0.9
      });
    }

    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (Math.hypot(e.x - bm.x, e.y - bm.y) < e.radius + 18) {
        if (bm.isSupernova) e.burnTimer = 2.5;
        damageEnemy(e, bm.dmg * dt * 5.5, bm.color, false, true);
      }
    }
    if (bm.life <= 0) fastRemove(boomerangs, i);
  }

  if (player.weapons.minesLvl > 0) {
    player.mineTimer -= dt;
    if (player.mineTimer <= 0 && mines.length < 12) {
      dropQuantumMine();
      player.mineTimer = Math.max(1.2, 2.8 - player.weapons.minesLvl * 0.35);
    }
  }

  for (let i = mines.length - 1; i >= 0; i--) {
    const mn = mines[i];
    mn.life -= dt;
    mn.pulse += dt * 6;

    let triggered = false;
    for (const e of enemies) {
      const d = Math.hypot(e.x - mn.x, e.y - mn.y);
      if (d < mn.triggerRadius) {
        mn.x += ((e.x - mn.x) / (d || 1)) * 280 * dt;
        mn.y += ((e.y - mn.y) / (d || 1)) * 280 * dt;
        if (d < e.radius + mn.radius + 6) {
          triggered = true;
          break;
        }
      }
    }

    if (triggered || mn.life <= 0) {
      if (triggered) {
        sfx.playExplosion(1.6);
        spawnShockwave(mn.x, mn.y, mn.blastRadius, "#fcee09", 4.5, 520);
        spawnParticles(mn.x, mn.y, "#fcee09", 36, 90, 420, 3.0);
        grid.applyForce(mn.x, mn.y, mn.blastRadius * 1.3, 45, false, true);
        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          if (Math.hypot(e.x - mn.x, e.y - mn.y) <= mn.blastRadius + e.radius) {
            damageEnemy(e, mn.dmg, "#fcee09", true, false, "KVANTOVÉ MINY");
          }
        }
      }
      fastRemove(mines, i);
    }
  }

  if (player.weapons.shockwaveLvl > 0) {
    player.shockwaveTimer -= dt;
    if (player.shockwaveTimer <= 0 && enemies.length > 0) {
      triggerKineticShockwave();
      player.shockwaveTimer = Math.max(2.2, 4.5 - player.weapons.shockwaveLvl * 0.5);
    }
  }

  if (player.weapons.satelliteLvl > 0) {
    player.satelliteTimer -= dt;
    if (player.satelliteTimer <= 0 && enemies.length > 0) {
      triggerOrbitalSatelliteLock();
      player.satelliteTimer = Math.max(1.8, (3.8 - player.weapons.satelliteLvl * 0.45) * odFireMult);
    }
  }

  for (let i = orbitalStrikes.length - 1; i >= 0; i--) {
    const st = orbitalStrikes[i];
    if (st.phase === "LOCK") {
      if (st.targetRef && !st.targetRef.dead) {
        st.x = st.targetRef.x;
        st.y = st.targetRef.y;
      }
      st.timer -= dt;
      if (st.timer <= 0) {
        st.phase = "BEAM";
        sfx.playExplosion(2.0);
        state.shake = Math.max(state.shake, 15);
        state.chromatic = Math.max(state.chromatic, 0.7);
        spawnShockwave(st.x, st.y, st.radius * 1.4, "#ff0055", 6, 580);
        spawnLensFlare(st.x, st.y, "#ff0055", 560);
        spawnParticles(st.x, st.y, "#ff0055", 60, 120, 520, 3.2);
        grid.applyForce(st.x, st.y, st.radius * 1.8, 75, false, true);

        meta.stats.satelliteStrikes = (meta.stats.satelliteStrikes || 0) + 1;
        if (meta.stats.satelliteStrikes >= 5) unlockAchievement("orbital_god");

        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          if (Math.hypot(e.x - st.x, e.y - st.y) <= st.radius + e.radius) {
            damageEnemy(e, st.dmg, "#ff0055", true, false, "ION-SATELIT");
          }
        }
      }
    } else {
      st.beamLife -= dt;
      if (st.beamLife <= 0) fastRemove(orbitalStrikes, i);
    }
  }

  if (player.weapons.missilesLvl > 0) {
    player.missileTimer -= dt;
    if (player.missileTimer <= 0 && enemies.length > 0) {
      fireHomingMissiles();
      player.missileTimer = Math.max(0.40, (1.40 - player.weapons.missilesLvl * 0.16) * odFireMult);
    }
  }

  if (player.weapons.swarmBotsLvl > 0) {
    player.swarmBotsTimer -= dt;
    if (player.swarmBotsTimer <= 0 && enemies.length > 0) {
      fireSwarmNanobots();
      player.swarmBotsTimer = Math.max(0.45, (1.35 - player.weapons.swarmBotsLvl * 0.15) * odFireMult);
    }
  }

  if (player.weapons.gravCannonLvl > 0) {
    player.gravCannonTimer -= dt;
    if (player.gravCannonTimer <= 0 && enemies.length > 0) {
      fireGravityCannon();
      player.gravCannonTimer = Math.max(0.95, (2.2 - player.weapons.gravCannonLvl * 0.25) * odFireMult);
    }
  }

  if (player.weapons.teslaLvl > 0) {
    player.teslaTimer -= dt;
    if (player.teslaTimer <= 0 && enemies.length > 0) {
      fireTeslaLightning();
      player.teslaTimer = Math.max(0.35, (1.10 - player.weapons.teslaLvl * 0.12) * odFireMult);
    }
  }

  if (player.weapons.railgunLvl > 0) {
    player.railgunTimer -= dt;
    if (player.railgunTimer <= 0 && enemies.length > 0) {
      fireQuantumRailgun();
      player.railgunTimer = Math.max(0.85, (2.7 - player.weapons.railgunLvl * 0.32) * odFireMult);
    }
  }

  if (player.weapons.dronesLvl > 0) {
    player.droneAngle += dt * 2.6;
    player.droneTimer -= dt;
    if (player.droneTimer <= 0 && enemies.length > 0) {
      fireDroneProjectiles();
      player.droneTimer = 0.34 * odFireMult;
    }
  }

  if (player.weapons.cryoNovaLvl > 0) {
    player.cryoTimer -= dt;
    if (player.cryoTimer <= 0 && enemies.length > 0) {
      triggerCryoNova();
      player.cryoTimer = Math.max(2.6, 5.2 - player.weapons.cryoNovaLvl * 0.55);
    }
  }

  if (player.weapons.bladesLvl > 0) {
    player.bladeAngle += dt * 4.9;
    const bCount = player.weapons.bladesLvl;
    const orbitR = 58;
    for (let i = 0; i < bCount; i++) {
      const ba = player.bladeAngle + (i * Math.PI * 2) / bCount;
      const bx = player.x + Math.cos(ba) * orbitR;
      const by = player.y + Math.sin(ba) * orbitR;
      for (const e of enemies) {
        if (Math.hypot(e.x - bx, e.y - by) < e.radius + 14) {
          damageEnemy(e, 150 * player.dmgMult * dt, "#bc13fe", false, false, "ORBITÁLNÍ ČEPELE");
        }
      }
      for (let j = enemyBullets.length - 1; j >= 0; j--) {
        if (Math.hypot(enemyBullets[j].x - bx, enemyBullets[j].y - by) < 15) {
          fastRemove(enemyBullets, j);
        }
      }
    }
  }

  if (player.weapons.voidLanceLvl > 0) {
    player.voidLanceTimer = (player.voidLanceTimer || 0) - dt;
    if (player.voidLanceTimer <= 0 && enemies.length > 0) {
      fireVoidLance();
      player.voidLanceTimer = Math.max(0.45, (1.15 - player.weapons.voidLanceLvl * 0.12) * odFireMult);
    }
  }

  if (player.weapons.stasisFieldLvl > 0) {
    player.stasisTimer = (player.stasisTimer || 0) - dt;
    if (player.stasisTimer <= 0) {
      dropStasisField();
      player.stasisTimer = Math.max(1.8, 3.8 - player.weapons.stasisFieldLvl * 0.35);
    }
  }

  if (player.weapons.laserRingLvl > 0) {
    player.laserRingAngle = (player.laserRingAngle || 0) + dt * 3.4;
    const beamCount = 1 + player.weapons.laserRingLvl;
    const ringRadius = 115 + (player.weapons.solarHaloLvl > 0 ? 35 : 0);
    for (let i = 0; i < beamCount; i++) {
      const ba = player.laserRingAngle + (i * Math.PI * 2) / beamCount;
      const bx = player.x + Math.cos(ba) * ringRadius;
      const by = player.y + Math.sin(ba) * ringRadius;
      for (const e of enemies) {
        if (Math.hypot(e.x - bx, e.y - by) < e.radius + 24) {
          damageEnemy(e, (135 + player.weapons.laserRingLvl * 35) * player.dmgMult * dt, "#ff0055", false, false, "LASEROVÝ PRSTENEC");
        }
      }
    }
  }

  if (player.weapons.chainFlailLvl > 0) {
    player.flailAngle = (player.flailAngle || 0) + dt * 4.2;
    const flailCount = Math.min(3, player.weapons.chainFlailLvl);
    const orbitR = 96;
    for (let i = 0; i < flailCount; i++) {
      const fa = player.flailAngle + (i * Math.PI * 2) / flailCount;
      const fx = player.x + Math.cos(fa) * orbitR;
      const fy = player.y + Math.sin(fa) * orbitR;
      for (const e of enemies) {
        const d = Math.hypot(e.x - fx, e.y - fy);
        if (d < e.radius + 20) {
          damageEnemy(e, (195 + player.weapons.chainFlailLvl * 45) * player.dmgMult * dt, "#fcee09", true, false, "ŘETĚZOVÝ DRTIČ");
          if (e.type !== "BOSS") {
            e.x += Math.cos(fa) * 140 * dt;
            e.y += Math.sin(fa) * 140 * dt;
          }
        }
      }
    }
  }
  for (let i = supplyPods.length - 1; i >= 0; i--) {
    const sp = supplyPods[i];
    sp.angle += dt * 3.2;
    sp.life -= dt;
    if (Math.hypot(player.x - sp.x, player.y - sp.y) < player.radius + sp.radius + 6) {
      sfx.playLevelUp();
      spawnShockwave(sp.x, sp.y, 260, sp.color, 4, 520);
      addFloatingText(sp.x, sp.y - 20, sp.label, sp.color, 1.3);
      if (sp.kind === "HEAL") player.hp = Math.min(player.maxHp, player.hp + 45);
      else if (sp.kind === "MAGNET") gems.forEach(g => { g.magnetized = true; });
      else if (sp.kind === "NOVA") {
        player.bombs = Math.min(player.maxBombs, player.bombs + 1);
        const prevOd = state.overdrive;
        state.overdrive = Math.min(100, state.overdrive + 45);
        if (prevOd < 100 && state.overdrive >= 100) unleashQuantumExplosion(true);
      }
      updateHUD();
      fastRemove(supplyPods, i);
      continue;
    }
    if (sp.life <= 0) fastRemove(supplyPods, i);
  }

  for (let i = plasmaPools.length - 1; i >= 0; i--) {
    const pool = plasmaPools[i];
    pool.life -= dt;
    for (const e of enemies) {
      if (Math.hypot(e.x - pool.x, e.y - pool.y) < e.radius + pool.radius) {
        if (pool.isTrap) e.slowTimer = Math.max(e.slowTimer || 0, 0.8);
        const weaponName = pool.weaponName || (pool.isTrap ? "BLESKOVÁ PAST" : "PLAZMOVÁ STOPA");
        damageEnemy(e, pool.dmg * dt, pool.color || "#fb923c", false, false, weaponName);
      }
    }
    if (pool.life <= 0) fastRemove(plasmaPools, i);
  }

  for (let i = railBeams.length - 1; i >= 0; i--) {
    railBeams[i].life -= dt;
    if (railBeams[i].life <= 0) fastRemove(railBeams, i);
  }

  for (let i = lensFlares.length - 1; i >= 0; i--) {
    lensFlares[i].life -= dt;
    if (lensFlares[i].life <= 0) fastRemove(lensFlares, i);
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.px = b.x; b.py = b.y;
    b.x += b.vx * dt; b.y += b.vy * dt;
    b.life -= dt;

    for (const wh of wormholes) {
      if (!b.teleported && Math.hypot(b.x - wh.x1, b.y - wh.y1) < wh.radius) {
        b.x = wh.x2; b.y = wh.y2; b.teleported = true;
      } else if (!b.teleported && Math.hypot(b.x - wh.x2, b.y - wh.y2) < wh.radius) {
        b.x = wh.x1; b.y = wh.y1; b.teleported = true;
      }
    }

    let bounced = false;
    if (b.x <= 6 || b.x >= W - 6) {
      if (b.bounces > 0) { b.vx *= -1; b.bounces--; bounced = true; }
      else b.life = 0;
    }
    if (b.y <= 6 || b.y >= H - 6) {
      if (b.bounces > 0) { b.vy *= -1; b.bounces--; bounced = true; }
      else b.life = 0;
    }
    if (bounced) {
      spawnParticles(b.x, b.y, b.color, 5, 50, 180, 1.8, 0.1, 0.25);
      grid.applyForce(b.x, b.y, 60, 6, false);
    }

    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (Math.hypot(e.x - b.x, e.y - b.y) < e.radius + (b.radius || 6)) {
        if (e.type === "JUGGERNAUT") {
          const incomingAngle = Math.atan2(b.y - e.y, b.x - e.x);
          const angleDiff = Math.abs(Math.atan2(Math.sin(incomingAngle - e.angle), Math.cos(incomingAngle - e.angle)));
          if (angleDiff < 1.0 && b.pierce <= 0) {
            b.vx *= -0.9; b.vy *= -0.9; b.color = "#fcee09";
            spawnParticles(b.x, b.y, "#fcee09", 5, 80, 220, 2.0);
            break;
          }
        }
        damageEnemy(e, b.dmg, b.color, false, false, b.weaponName || "PULZNÍ KANÓN");
        if (b.stormArc && Math.random() < 0.45) {
          fireTeslaLightning(e.x, e.y, 2);
        }
        if (b.gravImplode) {
          spawnShockwave(b.x, b.y, 130, "#c084fc", 3, 420);
          grid.applyForce(b.x, b.y, 160, 28, true, true);
          for (const other of enemies) {
            const d = Math.hypot(b.x - other.x, b.y - other.y);
            if (d < 150 && d > 5) {
              other.x += ((b.x - other.x) / d) * 38;
              other.y += ((b.y - other.y) / d) * 38;
            }
          }
        }
        if (b.pierce > 0) b.pierce--;
        else b.life = 0;
        break;
      }
    }
    if (b.life <= 0) fastRemove(bullets, i);
  }

  for (let i = missiles.length - 1; i >= 0; i--) {
    const m = missiles[i];
    m.life -= dt;

    let target = null;
    let bestD = Infinity;
    for (const e of enemies) {
      const d = Math.hypot(e.x - m.x, e.y - m.y);
      if (d < bestD) { bestD = d; target = e; }
    }
    if (target) {
      const desiredA = Math.atan2(target.y - m.y, target.x - m.x);
      const currA = Math.atan2(m.vy, m.vx);
      const diff = Math.atan2(Math.sin(desiredA - currA), Math.cos(desiredA - currA));
      const newA = currA + diff * Math.min(1, dt * 11);
      m.vx = Math.cos(newA) * m.speed;
      m.vy = Math.sin(newA) * m.speed;
    }

    m.x += m.vx * dt;
    m.y += m.vy * dt;
    if (Math.random() < 0.6) spawnParticles(m.x, m.y, m.color, 1, 10, 40, 2.0, 0.12, 0.22);

    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (Math.hypot(e.x - m.x, e.y - m.y) < e.radius + 10) {
        damageEnemy(e, m.dmg, m.color, true, false, m.weaponName || "MIKRORAKETY");
        spawnShockwave(m.x, m.y, 65, m.color, 2.5, 380);
        grid.applyForce(m.x, m.y, 110, 16, false);
        m.life = 0;
        break;
      }
    }
    if (m.life <= 0) fastRemove(missiles, i);
  }

  for (let i = singularities.length - 1; i >= 0; i--) {
    const s = singularities[i];
    s.life -= dt;
    s.angle += dt * 8;

    grid.applyForce(s.x, s.y, s.pullRadius * 0.85, 22, true, true);

    if (s.isStarSingularity) {
      s.strikeTimer -= dt;
      if (s.strikeTimer <= 0) {
        s.strikeTimer = 0.65;
        triggerOrbitalSatelliteLock({ x: s.x, y: s.y, dead: false });
      }
    }

    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      const dx = s.x - e.x;
      const dy = s.y - e.y;
      const dist = Math.hypot(dx, dy);
      if (dist < s.pullRadius && dist > 1) {
        const pullForce = (1 - dist / s.pullRadius) * (e.type === "BOSS" ? 165 : 620);
        e.x += (dx / dist) * pullForce * dt;
        e.y += (dy / dist) * pullForce * dt;
        if (dist < s.radius * 2.3) damageEnemy(e, 125 * (s.amp || 1) * player.dmgMult * dt, "#ff007f", true, false, "ČERNÁ DÍRA");
      }
    }

    if (s.life <= 0) {
      sfx.playExplosion(2.5);
      spawnShockwave(s.x, s.y, 480 * (s.amp || 1), "#00f3ff", 7, 720);
      spawnShockwave(s.x, s.y, 340 * (s.amp || 1), "#ff007f", 5, 520);
      spawnLensFlare(s.x, s.y, "#00f3ff", 750);
      spawnParticles(s.x, s.y, "#00f3ff", 95, 150, 680, 3.5);
      spawnParticles(s.x, s.y, "#ff007f", 75, 120, 560, 3.0);
      grid.applyForce(s.x, s.y, 520, 95, false, true);
      state.shake = 22;
      state.chromatic = 1.0;

      for (let j = enemies.length - 1; j >= 0; j--) {
        const e = enemies[j];
        if (Math.hypot(e.x - s.x, e.y - s.y) < 380 * (s.amp || 1)) {
          damageEnemy(e, 290 * (s.amp || 1) * player.dmgMult, "#00f3ff", true, false, "ČERNÁ DÍRA");
        }
      }
      fastRemove(singularities, i);
    }
  }

  const aiTier = getAITier();
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    if (e.dead) {
      fastRemove(enemies, i);
      continue;
    }

    if (e.burnTimer && e.burnTimer > 0) {
      e.burnTimer -= dt;
      damageEnemy(e, (28 + player.weapons.flamethrowerLvl * 12) * dt, "#ff5500", false, false, "PLAMENOMET");
      if (e.dead) {
        fastRemove(enemies, i);
        continue;
      }
    }

    if (e.slowTimer > 0) e.slowTimer -= dt;
    const spdMult = e.slowTimer > 0 ? 0.45 : 1.0;
    const effSpeed = e.speed * spdMult * (1 + (sfx.beatPulse || 0) * 0.15);

    if (e.maxShield > 0 && e.shield > 0 && e.shield < e.maxShield) {
      e.shield = Math.min(e.maxShield, e.shield + e.maxShield * 0.05 * enemyDt);
    }

    const targetObj = decoys.length > 0 ? decoys[0] : player;
    const dx = targetObj.x - e.x;
    const dy = targetObj.y - e.y;
    const dist = Math.hypot(dx, dy) || 1;
    const dirX = dx / dist;
    const dirY = dy / dist;

    if (e.type === "KAMIKAZE") {
      e.angle = Math.atan2(dy, dx);
      e.x += dirX * effSpeed * enemyDt;
      e.y += dirY * effSpeed * enemyDt;
    } else if (e.type === "DISRUPTOR") {
      e.angle += e.spin * enemyDt;
      const targetDist = 290;
      if (dist > targetDist + 30) {
        e.x += dirX * effSpeed * enemyDt;
        e.y += dirY * effSpeed * enemyDt;
      } else if (dist < targetDist - 30) {
        e.x -= dirX * effSpeed * enemyDt;
        e.y -= dirY * effSpeed * enemyDt;
      }
      e.shootTimer -= enemyDt * spdMult;
      if (e.shootTimer <= 0) {
        e.shootTimer = state.difficulty === "ULTRA" ? 2.1 : (state.difficulty === "HARDCORE" ? 2.6 : 3.2);
        spawnEnemy("ENERGY_ORB", e.x, e.y);
      }
    } else if (e.type === "SNIPER") {
      e.angle = Math.atan2(dy, dx);
      if (dist > 380) {
        e.x += dirX * effSpeed * enemyDt;
        e.y += dirY * effSpeed * enemyDt;
      } else if (dist < 240) {
        e.x -= dirX * effSpeed * enemyDt;
        e.y -= dirY * effSpeed * enemyDt;
      }
      e.shootTimer -= enemyDt * spdMult;
      e.aiming = e.shootTimer < 0.85;
      if (e.shootTimer <= 0) {
        e.shootTimer = 2.6;
        enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(e.angle) * 620, vy: Math.sin(e.angle) * 620, radius: 6, color: "#ff0055" });
      }
    } else if (e.type === "WARP_MINER") {
      e.angle += Math.sin(performance.now() * 0.002 + i) * 0.8 * enemyDt;
      e.x += Math.cos(e.angle) * effSpeed * enemyDt;
      e.y += Math.sin(e.angle) * effSpeed * enemyDt;
      if (e.x < 60 || e.x > W - 60) e.angle = Math.PI - e.angle;
      if (e.y < 60 || e.y > H - 60) e.angle = -e.angle;
      e.mineTimer = (e.mineTimer || 2.2) - enemyDt;
      if (e.mineTimer <= 0) {
        e.mineTimer = 2.8;
        if (enemies.length < 35) spawnEnemy("ENERGY_ORB", e.x, e.y);
      }
    } else if (e.type === "ENERGY_ORB") {
      e.angle += e.spin * enemyDt;
      e.x += dirX * effSpeed * enemyDt;
      e.y += dirY * effSpeed * enemyDt;
    } else if (e.type === "CHASER") {
      let moveDirX = dirX;
      let moveDirY = dirY;
      if (aiTier >= 2) {
        e.strafeTimer -= enemyDt;
        if (e.strafeTimer <= 0) {
          e.strafeDir *= -1;
          e.strafeTimer = 0.65 + Math.random() * 0.5;
        }
        moveDirX += -dirY * e.strafeDir * 0.55;
        moveDirY += dirX * e.strafeDir * 0.55;
      }
      e.x += moveDirX * effSpeed * enemyDt;
      e.y += moveDirY * effSpeed * enemyDt;
      e.angle += e.spin * enemyDt;
    } else if (e.type === "SPLITTER" || e.type === "MINI_SWARM") {
      e.x += dirX * effSpeed * enemyDt;
      e.y += dirY * effSpeed * enemyDt;
      e.angle += e.spin * enemyDt;
    } else if (e.type === "WEAVER") {
      const perpX = -dirY;
      const perpY = dirX;
      e.x += (dirX * 0.52 + perpX * 0.82) * effSpeed * enemyDt;
      e.y += (dirY * 0.52 + perpY * 0.82) * effSpeed * enemyDt;
      e.angle += e.spin * enemyDt;

      e.shootTimer -= enemyDt * spdMult;
      if (e.shootTimer <= 0) {
        e.shootTimer = aiTier >= 3 ? 1.55 : 2.0;
        const leadX = player.x + (aiTier >= 2 ? player.vx * 0.35 : 0);
        const leadY = player.y + (aiTier >= 2 ? player.vy * 0.35 : 0);
        const aimA = Math.atan2(leadY - e.y, leadX - e.x);
        const count = aiTier >= 3 ? 3 : 1;
        for (let k = 0; k < count; k++) {
          const ba = aimA + (k - (count - 1) / 2) * 0.28;
          enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(ba) * 285, vy: Math.sin(ba) * 285, radius: 5.5, color: "#bc13fe" });
        }
      }
    } else if (e.type === "JUGGERNAUT") {
      const desiredA = Math.atan2(dy, dx);
      const diff = Math.atan2(Math.sin(desiredA - e.angle), Math.cos(desiredA - e.angle));
      e.angle += diff * Math.min(1, enemyDt * 2.6);
      e.x += Math.cos(e.angle) * effSpeed * enemyDt;
      e.y += Math.sin(e.angle) * effSpeed * enemyDt;

      if (aiTier >= 2) {
        e.shootTimer -= enemyDt * spdMult;
        if (e.shootTimer <= 0) {
          e.shootTimer = 2.3;
          enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(e.angle) * 320, vy: Math.sin(e.angle) * 320, radius: 7, color: "#fcee09" });
        }
      }
    } else if (e.type === "PHANTOM") {
      e.angle = Math.atan2(dy, dx);
      e.teleportTimer -= enemyDt;
      if (e.teleportTimer <= 0) {
        e.teleportTimer = 3.6;
        spawnShockwave(e.x, e.y, 55, "#ff2a85", 2, 350);
        const jumpA = Math.random() * Math.PI * 2;
        e.x = Math.max(60, Math.min(W - 60, player.x + Math.cos(jumpA) * 290));
        e.y = Math.max(60, Math.min(H - 60, player.y + Math.sin(jumpA) * 290));
        spawnShockwave(e.x, e.y, 55, "#ff2a85", 2, 350);
      }

      e.shootTimer -= enemyDt * spdMult;
      e.aiming = e.shootTimer < 0.65;
      if (e.shootTimer <= 0) {
        e.shootTimer = 2.3;
        enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(e.angle) * 470, vy: Math.sin(e.angle) * 470, radius: 6, color: "#ff2a85" });
      }
    } else if (e.type === "GUARDIAN") {
      e.angle += e.spin * enemyDt;
      const targetDist = 260;
      if (dist > targetDist + 30) {
        e.x += dirX * effSpeed * enemyDt;
        e.y += dirY * effSpeed * enemyDt;
      } else if (dist < targetDist - 30) {
        e.x -= dirX * effSpeed * enemyDt;
        e.y -= dirY * effSpeed * enemyDt;
      }
      e.pulseTimer -= enemyDt;
      if (e.pulseTimer <= 0) {
        e.pulseTimer = 2.0;
        spawnShockwave(e.x, e.y, 170, "#38bdf8", 2.5, 360);
        for (const ally of enemies) {
          if (ally !== e && Math.hypot(ally.x - e.x, ally.y - e.y) < 170) {
            ally.maxShield = Math.max(ally.maxShield, ally.maxHp * 0.4);
            ally.shield = Math.min(ally.maxShield, (ally.shield || 0) + ally.maxHp * 0.25);
          }
        }
      }
    } else if (e.type === "BOSS") {
      const isEnraged = e.hp < e.maxHp * 0.5;
      const enrageMult = isEnraged ? 1.35 : 1.0;

      // Jednorázový efekt při přechodu Bosse do Enrage fáze (pod 50 % HP)
      if (isEnraged && !e.enrageTriggered) {
        e.enrageTriggered = true;
        sfx.playExplosion(2.0);
        spawnShockwave(e.x, e.y, 480, "#ff0055", 7, 650);
        spawnLensFlare(e.x, e.y, "#ff0055", 650);
        state.shake = Math.max(state.shake, 16);
        addFloatingText(e.x, e.y - 60, `⚠️ ${e.name}: FÁZE ZUŘIVOSTI!`, "#ff0055", 1.35);
      }

      e.phaseTimer += enemyDt * spdMult * enrageMult;
      e.angle += e.spin * enemyDt * enrageMult;
      const hcCdMult = (state.difficulty === "ULTRA" ? 0.68 : (state.difficulty === "HARDCORE" ? 0.82 : 1.0)) / enrageMult;

      if (e.subtype === "ARCHON") {
        // 1. OMEGA ARCHON: Spirálové salvy + gravitační přitahování
        e.x = W / 2 + Math.cos(e.phaseTimer * 0.85) * (W * 0.3);
        e.y = 140 + Math.sin(e.phaseTimer * 1.4) * 60;
        grid.applyForce(e.x, e.y, 260, 14, true, true);

        // Jemný gravitační tah na hráče v Enrage fázi
        if (isEnraged && dist < 480) {
          player.x -= dirX * 55 * enemyDt;
          player.y -= dirY * 55 * enemyDt;
        }

        e.shootTimer -= enemyDt * spdMult;
        if (e.shootTimer <= 0) {
          e.shootTimer = 1.15 * hcCdMult;
          const spokes = state.difficulty === "ULTRA" ? 14 : (state.difficulty === "HARDCORE" ? 12 : 10);
          for (let k = 0; k < spokes; k++) {
            const ba = e.angle + (k * Math.PI * 2) / spokes;
            enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(ba) * 290, vy: Math.sin(ba) * 290, radius: 6.5, color: "#ff0055" });
            if (isEnraged && k % 2 === 0) {
              const ba2 = -e.angle + (k * Math.PI * 2) / spokes;
              enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(ba2) * 220, vy: Math.sin(ba2) * 220, radius: 5.5, color: "#00f3ff" });
            }
          }
        }

      } else if (e.subtype === "SERAPH") {
        // 2. CHRONO SERAPH: Rychlé nálety (Hyper-Lunges) a světelné oštěpy
        e.angle = Math.atan2(dy, dx);
        const dashWave = Math.sin(e.phaseTimer * 2.2) > 0.65 ? 2.4 : 0.85;
        e.x += dirX * effSpeed * dashWave * enemyDt;
        e.y += dirY * effSpeed * dashWave * enemyDt;

        e.shootTimer -= enemyDt * spdMult;
        if (e.shootTimer <= 0) {
          e.shootTimer = 0.92 * hcCdMult;
          const aimA = Math.atan2(player.y - e.y, player.x - e.x);
          const count = isEnraged ? 3 : 2;
          for (let k = -count; k <= count; k++) {
            const ba = aimA + k * 0.15;
            enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(ba) * 380, vy: Math.sin(ba) * 380, radius: 6, color: "#fcee09" });
          }
        }

      } else if (e.subtype === "HYDRA") {
        // 3. NEXUS HYDRA: Kroužící 3 uzly pálící na hráče + spawnování Mini-Swarmů
        e.x = W / 2 + Math.sin(e.phaseTimer * 0.7) * (W * 0.25);
        e.y = H * 0.3 + Math.cos(e.phaseTimer * 1.1) * 90;
        e.shootTimer -= enemyDt * spdMult;
        if (e.shootTimer <= 0) {
          e.shootTimer = 1.25 * hcCdMult;
          for (let node = 0; node < 3; node++) {
            const na = e.angle + (node * Math.PI * 2) / 3;
            const nx = e.x + Math.cos(na) * 48;
            const ny = e.y + Math.sin(na) * 48;
            const aimA = Math.atan2(player.y - ny, player.x - nx);
            enemyBullets.push({ x: nx, y: ny, vx: Math.cos(aimA) * 320, vy: Math.sin(aimA) * 320, radius: 6.5, color: "#00ffaa" });
          }
          if (isEnraged && enemies.length < 25 && Math.random() < 0.35) {
            spawnEnemy("MINI_SWARM", e.x, e.y);
          }
        }

      } else if (e.subtype === "LEVIATHAN") {
        // 4. VOID LEVIATHAN: Kyber-had útočící hlavou i ocasem
        const targetA = Math.atan2(dy, dx) + Math.sin(e.phaseTimer * 3.0) * 0.65;
        e.angle = targetA;
        e.x += Math.cos(targetA) * 195 * spdMult * enrageMult * enemyDt;
        e.y += Math.sin(targetA) * 195 * spdMult * enrageMult * enemyDt;

        let prevX = e.x, prevY = e.y;
        for (const seg of (e.segments || [])) {
          const sdx = prevX - seg.x;
          const sdy = prevY - seg.y;
          const sd = Math.hypot(sdx, sdy) || 1;
          seg.angle = Math.atan2(sdy, sdx);
          const spacing = 28;
          if (sd > spacing) {
            seg.x = prevX - (sdx / sd) * spacing;
            seg.y = prevY - (sdy / sd) * spacing;
          }
          prevX = seg.x;
          prevY = seg.y;
        }

        e.shootTimer -= enemyDt * spdMult;
        if (e.shootTimer <= 0) {
          e.shootTimer = 1.2 * hcCdMult;
          const segs = e.segments || [];
          const tail = segs[segs.length - 1] || e;
          for (let k = 0; k < 6; k++) {
            const ba = e.phaseTimer + (k * Math.PI) / 3;
            enemyBullets.push({ x: tail.x, y: tail.y, vx: Math.cos(ba) * 270, vy: Math.sin(ba) * 270, radius: 6, color: "#bc13fe" });
          }
          if (isEnraged) {
            const headAim = Math.atan2(dy, dx);
            enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(headAim) * 370, vy: Math.sin(headAim) * 370, radius: 7.5, color: "#00f3ff" });
          }
        }

      } else if (e.subtype === "NEMESIS") {
        // 5. AETHER NEMESIS: Fázové teleporty + křížové šokové vlny
        e.x += Math.cos(e.phaseTimer * 1.5) * 160 * enemyDt;
        e.y += Math.sin(e.phaseTimer * 2.2) * 120 * enemyDt;

        e.teleportTimer = (e.teleportTimer || 4.2) - enemyDt;
        if (e.teleportTimer <= 0) {
          e.teleportTimer = isEnraged ? 2.8 : 4.2;
          spawnShockwave(e.x, e.y, 160, "#38bdf8", 4, 480);
          const jumpA = Math.random() * Math.PI * 2;
          e.x = Math.max(90, Math.min(W - 90, player.x + Math.cos(jumpA) * 320));
          e.y = Math.max(90, Math.min(H - 90, player.y + Math.sin(jumpA) * 320));
          spawnShockwave(e.x, e.y, 200, "#ff007f", 4, 520);
          grid.applyForce(e.x, e.y, 260, 45, false, true);
        }

        e.shootTimer -= enemyDt * spdMult;
        if (e.shootTimer <= 0) {
          e.shootTimer = 1.05 * hcCdMult;
          const aimA = Math.atan2(player.y - e.y, player.x - e.x);
          for (let k = -1; k <= 1; k++) {
            const ba = aimA + k * 0.22;
            enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(ba) * 395, vy: Math.sin(ba) * 395, radius: 6, color: "#38bdf8" });
          }
          for (let k = 0; k < 8; k++) {
            const ba = e.angle + (k * Math.PI) / 4;
            enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(ba) * 255, vy: Math.sin(ba) * 255, radius: 5.5, color: "#ff007f" });
          }
        }

      } else if (e.subtype === "COLOSSUS") {
        // 6. SOLARIS COLOSSUS: Neúprosná sluneční tvrz + Energy Orby
        e.x += dirX * (effSpeed * 0.65) * enemyDt;
        e.y += dirY * (effSpeed * 0.65) * enemyDt;
        e.shootTimer -= enemyDt * spdMult;
        if (e.shootTimer <= 0) {
          e.shootTimer = 1.3 * hcCdMult;
          const arms = state.difficulty === "ULTRA" ? 16 : (isEnraged ? 14 : 12);
          for (let k = 0; k < arms; k++) {
            const ba = e.angle * 0.5 + (k * Math.PI * 2) / arms;
            enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(ba) * 300, vy: Math.sin(ba) * 300, radius: 7, color: "#fb923c" });
          }
          if (enemies.length < 30 && Math.random() < (isEnraged ? 0.75 : 0.45)) {
            spawnEnemy("ENERGY_ORB", e.x + (Math.random() - 0.5) * 60, e.y + (Math.random() - 0.5) * 60);
          }
        }
      } else if (e.subtype === "PRISM") {
        // 7. QUANTUM PRISM: Krystalický hranol pálící paprsky a geometrické vlny
        e.x = W / 2 + Math.sin(e.phaseTimer * 0.9) * (W * 0.28);
        e.y = H * 0.28 + Math.cos(e.phaseTimer * 1.3) * 80;
        e.shootTimer -= enemyDt * spdMult;
        if (e.shootTimer <= 0) {
          e.shootTimer = 1.15 * hcCdMult;
          const beams = isEnraged ? 6 : 4;
          for (let k = 0; k < beams; k++) {
            const ba = e.angle + (k * Math.PI * 2) / beams;
            railBeams.push({
              x1: e.x, y1: e.y,
              x2: e.x + Math.cos(ba) * 900, y2: e.y + Math.sin(ba) * 900,
              color: k % 2 === 0 ? "#00f3ff" : "#ff007f", life: 0.22, maxLife: 0.22
            });
            enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(ba) * 340, vy: Math.sin(ba) * 340, radius: 6.5, color: "#00f3ff" });
          }
        }

      } else if (e.subtype === "TITAN") {
        // 8. GRAVITY TITAN: Gravitační přitahování + rotující prstence střel
        e.x += dirX * (effSpeed * 0.55) * enemyDt;
        e.y += dirY * (effSpeed * 0.55) * enemyDt;
        if (dist < 520) {
          const pullStrength = isEnraged ? 95 : 60;
          player.x -= dirX * pullStrength * enemyDt;
          player.y -= dirY * pullStrength * enemyDt;
        }
        e.shootTimer -= enemyDt * spdMult;
        if (e.shootTimer <= 0) {
          e.shootTimer = 1.1 * hcCdMult;
          const count = isEnraged ? 12 : 8;
          for (let k = 0; k < count; k++) {
            const ba = -e.angle + (k * Math.PI * 2) / count;
            enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(ba) * 265, vy: Math.sin(ba) * 265, radius: 6.5, color: "#a855f7" });
          }
        }

      } else if (e.subtype === "ARACHNID") {
        // 9. CYBER ARACHNID: Agresivní skoky na hráče a jedovaté salvy
        const lunge = Math.sin(e.phaseTimer * 2.8) > 0.7 ? 2.6 : 0.75;
        e.x += dirX * effSpeed * lunge * enemyDt;
        e.y += dirY * effSpeed * lunge * enemyDt;
        e.shootTimer -= enemyDt * spdMult;
        if (e.shootTimer <= 0) {
          e.shootTimer = 0.95 * hcCdMult;
          const aimA = Math.atan2(dy, dx);
          const spreadCount = isEnraged ? 3 : 2;
          for (let k = -spreadCount; k <= spreadCount; k++) {
            const ba = aimA + k * 0.18;
            enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(ba) * 365, vy: Math.sin(ba) * 365, radius: 6, color: "#a3e635" });
          }
        }

      } else if (e.subtype === "VALKYRIE") {
        // 10. OMEGA VALKYRIE: Rychlý oblet kolem hráče + křížové salvy
        const orbitA = e.phaseTimer * (isEnraged ? 1.8 : 1.2);
        const targetX = Math.max(90, Math.min(W - 90, player.x + Math.cos(orbitA) * 270));
        const targetY = Math.max(90, Math.min(H - 90, player.y + Math.sin(orbitA) * 220));
        e.x += (targetX - e.x) * 2.5 * enemyDt;
        e.y += (targetY - e.y) * 2.5 * enemyDt;
        e.angle = Math.atan2(dy, dx);
        e.shootTimer -= enemyDt * spdMult;
        if (e.shootTimer <= 0) {
          e.shootTimer = 0.88 * hcCdMult;
          const aimA = Math.atan2(dy, dx);
          for (let k = -1; k <= 1; k++) {
            const ba = aimA + k * 0.14;
            enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(ba) * 410, vy: Math.sin(ba) * 410, radius: 6, color: "#f43f5e" });
          }
        }
      }

      grid.applyForce(e.x, e.y, 220, 9, false);
      const pct = Math.max(0, Math.ceil((e.hp / e.maxHp) * 100));
      document.getElementById("boss-hp-pct").textContent = `${pct}%`;
      document.getElementById("boss-hp-bar").style.width = `${pct}%`;
      document.getElementById("ghost-boss-pct").textContent = `${pct}%`;
      document.getElementById("ghost-boss-bar").style.width = `${pct}%`;
    }

    e.x = Math.max(e.radius, Math.min(W - e.radius, e.x));
    e.y = Math.max(e.radius, Math.min(H - e.radius, e.y));

    const playerDist = Math.hypot(player.x - e.x, player.y - e.y);
    if (playerDist < e.radius + player.radius - 2) {
      if (player.invulnTimer > 0) damageEnemy(e, 95, "#00f3ff", false, false, "HYPER-SKOK");
      else {
        damagePlayer(e.type === "KAMIKAZE" ? 28 : 20);
        if (e.type !== "BOSS") damageEnemy(e, 999, "#ff0055", false, false, "KOLIZE TRUPU");
      }
    }
  }

  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const eb = enemyBullets[i];
    eb.x += eb.vx * enemyDt;
    eb.y += eb.vy * enemyDt;

    if (Math.hypot(eb.x - player.x, eb.y - player.y) < eb.radius + player.radius - 3) {
      // The Juggernaut and the Nano+Aegis fusion actually deflect the projectile instead of also taking its hit.
      const canReflectProjectile = player.shipClass === "JUGGERNAUT_SHIP"
        || (player.weapons.nanoShieldLvl > 0 && player.weapons.aegisLvl > 0);
      if (canReflectProjectile) {
        bullets.push({
          x: eb.x, y: eb.y, px: eb.x, py: eb.y,
          vx: -eb.vx * 2.2, vy: -eb.vy * 2.2,
          dmg: 65 * player.dmgMult,
          bounces: 0, pierce: 1,
          weaponName: "ODRAZ PANCÍŘE",
          color: "#38bdf8", life: 1.2
        });
        meta.stats.reflectedBullets = (meta.stats.reflectedBullets || 0) + 1;
        if (meta.stats.reflectedBullets >= 15) unlockAchievement("juggernaut_master");
      } else {
        damagePlayer(15);
      }
      fastRemove(enemyBullets, i);
      continue;
    }
    if (eb.x < -20 || eb.x > W + 20 || eb.y < -20 || eb.y > H + 20) {
      fastRemove(enemyBullets, i);
    }
  }

  // Kvantový teleportér XP (xpTeleporterLvl) přitahuje krystaly i mimo magnetický dosah
  const baseMagnetRange = 245 + (meta.upgrades.magnetLvl || 0) * 60;
  const teleporterPull = (meta.upgrades.xpTeleporterLvl || 0) * 85;

  for (let i = gems.length - 1; i >= 0; i--) {
    const g = gems[i];
    g.vx *= 0.92; g.vy *= 0.92;

    const dx = player.x - g.x;
    const dy = player.y - g.y;
    const d = Math.hypot(dx, dy) || 1;
    const magnetRange = g.magnetized ? 4000 : baseMagnetRange;
    if (d < magnetRange) {
      const pull = g.magnetized ? 980 : (1 - d / magnetRange) * 820;
      g.vx += (dx / d) * pull * dt * 8;
      g.vy += (dy / d) * pull * dt * 8;
    } else if (teleporterPull > 0) {
      g.x += (dx / d) * teleporterPull * dt;
      g.y += (dy / d) * teleporterPull * dt;
    }

    g.x += g.vx * dt;
    g.y += g.vy * dt;
    g.angle += dt * 5;

    if (d < player.radius + 14) {
      player.xp += g.val;
      meta.stats.totalGemsLifetime = (meta.stats.totalGemsLifetime || 0) + 1;
      if (state.runStats) state.runStats.gemsCollected++;
      state.score += Math.floor(25 * state.combo);
      if (state.score >= 100000) unlockAchievement("score_100k");
      if (state.score >= 500000) unlockAchievement("score_500k");
      if (state.score >= 1000000) unlockAchievement("score_1m");
      sfx.playGem();
      fastRemove(gems, i);

      if (player.xp >= player.xpNext) {
        player.xp -= player.xpNext;
        player.level++;
        if (player.level >= 10) unlockAchievement("level_10");
        if (player.level >= 15) unlockAchievement("level_15");
        player.xpNext = getXpThresholdForLevel(player.level);
        triggerUpgradeSelection();
      }
      updateHUD();
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt; p.y += p.vy * dt;
    p.vx *= p.drag; p.vy *= p.drag;
    p.life -= dt;
    if (p.life <= 0) fastRemove(particles, i);
  }

  for (let i = shockwaves.length - 1; i >= 0; i--) {
    const sw = shockwaves[i];
    sw.radius += sw.speed * dt;
    if (sw.radius >= sw.maxRadius) fastRemove(shockwaves, i);
  }

  for (let i = lightningArcs.length - 1; i >= 0; i--) {
    lightningArcs[i].life -= dt;
    if (lightningArcs[i].life <= 0) fastRemove(lightningArcs, i);
  }

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.y += ft.vy * dt;
    ft.life -= dt;
    if (ft.life <= 0) fastRemove(floatingTexts, i);
  }
}

function gameLoop(now) {
  requestAnimationFrame(gameLoop);
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  frameCount++;
  fpsTimer += dt;
  if (fpsTimer >= 0.4) {
    state.fps = Math.round(frameCount / fpsTimer);
    document.getElementById("fps-counter").textContent = state.fps;
    document.getElementById("particle-counter").textContent = particles.length + bullets.length + enemies.length;
    frameCount = 0;
    fpsTimer = 0;
  }

  update(dt);
  render();
}

/*************************************************************************
 * INPUT LISTENERS, HANGAR TABS, COLOR PICKER & INITIALIZATION
 *************************************************************************/
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mousedown", (e) => {
  if (e.button === 0) mouse.down = true;
  if (e.button === 1) { e.preventDefault(); deploySingularityBomb(); }
  if (e.button === 2) { e.preventDefault(); triggerHyperDash(); }
});

window.addEventListener("mouseup", (e) => {
  if (e.button === 0) mouse.down = false;
});

window.addEventListener("contextmenu", (e) => e.preventDefault());

window.addEventListener("keydown", (e) => {
  if (document.activeElement && document.activeElement.tagName === "INPUT") return;
  // Prevent browser key-repeat from retriggering one-shot actions (dash, bombs, pause, etc.).
  if (e.repeat) return;

  if (e.code === "KeyW" || e.code === "ArrowUp") keys.w = true;
  if (e.code === "KeyA" || e.code === "ArrowLeft") keys.a = true;
  if (e.code === "KeyS" || e.code === "ArrowDown") keys.s = true;
  if (e.code === "KeyD" || e.code === "ArrowRight") keys.d = true;

  if (e.code === "Escape" || e.code === "KeyP") {
    if (state.mode === "PLAYING" || state.mode === "PAUSED") {
      e.preventDefault();
      togglePauseGame();
    }
  }

  if (e.code === "KeyH") {
    if (state.mode === "PLAYING" || state.mode === "PAUSED") {
      e.preventDefault();
      toggleHudVisibility();
    }
  }

  if (state.mode === "UPGRADE") {
    if (e.code === "Digit1" || e.code === "Numpad1") selectUpgradeCard(0);
    if (e.code === "Digit2" || e.code === "Numpad2") selectUpgradeCard(1);
    if (e.code === "Digit3" || e.code === "Numpad3") selectUpgradeCard(2);
    // Ignore auto-repeat so holding R cannot spend multiple rerolls unintentionally.
    if (e.code === "KeyR" && !e.repeat) {
      const rerollBtn = document.getElementById("btn-reroll-upgrades");
      if (rerollBtn) rerollBtn.click();
    }
  }

  if (e.code === "Space") {
    e.preventDefault();
    if (state.mode === "MENU") {
      if (hasSavedGame(currentSaveSlot)) loadSavedGame(currentSaveSlot);
      else startNewGame();
    } else if (state.mode === "GAMEOVER") {
      startNewGame();
    } else if (state.mode === "PLAYING") {
      triggerHyperDash();
    }
  }
  if (e.code === "Enter" && state.mode === "MENU") startNewGame();
  if (e.code === "KeyR" && state.mode === "GAMEOVER") startNewGame();
  if (e.code === "KeyQ" || e.code === "KeyE") deploySingularityBomb();
  if (e.code === "KeyF") triggerQuantumOverdrive();

  if (e.code === "KeyM") {
    sfx.muted = !sfx.muted;
    document.getElementById("btn-audio").textContent = `🔊 ZVUK: ${sfx.muted ? "OFF" : "ON"}`;
  }
  if (e.code === "KeyN") {
    const label = sfx.cycleStyle();
    document.getElementById("btn-track").textContent = `🎵 RÁDIO: ${label}`;
    const gTrack = document.getElementById("ghost-track");
    if (gTrack) gTrack.textContent = label;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "Space" && document.activeElement && document.activeElement.tagName === "BUTTON") {
    e.preventDefault();
  }
  if (e.code === "KeyW" || e.code === "ArrowUp") keys.w = false;
  if (e.code === "KeyA" || e.code === "ArrowLeft") keys.a = false;
  if (e.code === "KeyS" || e.code === "ArrowDown") keys.s = false;
  if (e.code === "KeyD" || e.code === "ArrowRight") keys.d = false;
});

window.addEventListener("beforeunload", () => {
  saveMetaProgression();
  if (state.mode === "PLAYING" || state.mode === "PAUSED") {
    saveGameProgress(false, currentSaveSlot);
  }
});

document.getElementById("btn-start").addEventListener("click", startNewGame);
document.getElementById("btn-resume-saved").addEventListener("click", () => loadSavedGame(currentSaveSlot));
document.getElementById("btn-restart").addEventListener("click", startNewGame);

document.getElementById("btn-open-shop").addEventListener("click", () => {
  renderCyberShop();
  document.getElementById("shop-modal").classList.remove("hidden");
  document.getElementById("shop-modal").classList.add("flex");
});
document.getElementById("btn-close-shop").addEventListener("click", () => {
  document.getElementById("shop-modal").classList.add("hidden");
  document.getElementById("shop-modal").classList.remove("flex");
});

document.getElementById("btn-open-achievements").addEventListener("click", () => {
  renderAchievementsModal();
  document.getElementById("achievements-modal").classList.remove("hidden");
  document.getElementById("achievements-modal").classList.add("flex");
});
document.getElementById("btn-close-achievements").addEventListener("click", () => {
  document.getElementById("achievements-modal").classList.add("hidden");
  document.getElementById("achievements-modal").classList.remove("flex");
});

document.getElementById("btn-go-menu").addEventListener("click", () => {
  state.mode = "MENU";
  if (typeof sfx !== "undefined") {
    if (sfx.bgm && !sfx.bgm.paused) sfx.bgm.pause();
    sfx.startMenuAmbient();
  }
  document.getElementById("gameover-modal").classList.add("hidden");
  document.getElementById("gameover-modal").classList.remove("flex");
  syncHudVisibilityDOM();
  document.getElementById("start-modal").classList.remove("hidden");
  renderShipSelector();
  refreshMenuSaveUI();
  renderHallOfFame();
  const toastEl = document.getElementById("save-toast");
  if (toastEl) toastEl.style.opacity = "0";
});

document.getElementById("btn-pause-hud").addEventListener("click", togglePauseGame);
document.getElementById("btn-hide-hud").addEventListener("click", toggleHudVisibility);
document.getElementById("btn-resume-play").addEventListener("click", togglePauseGame);
document.getElementById("btn-manual-save").addEventListener("click", () => saveGameProgress(true, currentSaveSlot));

[1, 2, 3].forEach(slotNum => {
  const btn = document.getElementById(`btn-save-slot-${slotNum}`);
  if (btn) {
    btn.addEventListener("click", () => {
      saveGameProgress(true, slotNum);
      document.getElementById("pause-active-slot").textContent = `#${slotNum} (${getSlotCustomName(slotNum)})`;
    });
  }
});

document.getElementById("btn-save-exit").addEventListener("click", () => {
  saveGameProgress(false, currentSaveSlot);
  state.mode = "MENU";
  if (typeof sfx !== "undefined") {
    if (sfx.bgm && !sfx.bgm.paused) sfx.bgm.pause();
    sfx.startMenuAmbient();
  }
  document.getElementById("pause-modal").classList.add("hidden");
  document.getElementById("pause-modal").classList.remove("flex");
  syncHudVisibilityDOM();
  document.getElementById("start-modal").classList.remove("hidden");
  renderShipSelector();
  refreshMenuSaveUI();
  renderHallOfFame();
  const toastEl = document.getElementById("save-toast");
  if (toastEl) toastEl.style.opacity = "0";
});
document.getElementById("btn-pause-restart").addEventListener("click", startNewGame);

document.getElementById("btn-audio").addEventListener("click", () => {
  sfx.muted = !sfx.muted;
  document.getElementById("btn-audio").textContent = `🔊 ZVUK: ${sfx.muted ? "OFF" : "ON"}`;
});
document.getElementById("btn-track").addEventListener("click", () => {
  const label = sfx.cycleStyle();
  document.getElementById("btn-track").textContent = `🎵 RÁDIO: ${label}`;
  const gTrack = document.getElementById("ghost-track");
  if (gTrack) gTrack.textContent = label;
});

function renderHallOfFame() {
  const container = document.getElementById("hall-of-fame-grid");
  if (!container) return;
  const s = meta.stats || {};
  const items = [
    { label: "CELKEM ELIMINACÍ", val: (s.totalKillsLifetime || 0).toLocaleString("cs-CZ"), col: "text-white" },
    { label: "ZNIČENÝCH BOSSŮ", val: (s.totalBossKillsLifetime || 0).toLocaleString("cs-CZ"), col: "text-pink-400" },
    { label: "SEBRANÝCH XP", val: (s.totalGemsLifetime || 0).toLocaleString("cs-CZ"), col: "text-emerald-300" },
    { label: "ČERNÝCH DĚR", val: (s.blackHolesUsed || 0).toLocaleString("cs-CZ"), col: "text-purple-300" },
    { label: "MIN POLOŽENO", val: (s.minesDropped || 0).toLocaleString("cs-CZ"), col: "text-yellow-300" },
    { label: "ODRAŽENÝCH STŘEL", val: (s.reflectedBullets || 0).toLocaleString("cs-CZ"), col: "text-sky-300" },
    { label: "NEJVYŠŠÍ REKORD", val: (state.bestScore || 0).toLocaleString("cs-CZ"), col: "text-cyan-300" },
    { label: "AKTIVNÍCH TROFEJÍ", val: `${Object.keys(meta.achievements || {}).length} / 50`, col: "text-yellow-400" }
  ];
  container.innerHTML = items.map(it => `
    <div class="bg-slate-950/80 border border-slate-800 p-2.5">
      <div class="text-[9px] text-slate-400">${it.label}</div>
      <div class="text-base font-black ${it.col} mt-0.5">${it.val}</div>
    </div>
  `).join("");
}

function exportSaveProfile() {
  const backup = {
    meta: meta,
    slots: {
      slot1: localStorage.getItem(getSaveKey(1)),
      slot2: localStorage.getItem(getSaveKey(2)),
      slot3: localStorage.getItem(getSaveKey(3)),
      name1: localStorage.getItem("neon_singularity_slot_name_1"),
      name2: localStorage.getItem("neon_singularity_slot_name_2"),
      name3: localStorage.getItem("neon_singularity_slot_name_3")
    }
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `neon_singularity_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  showSaveToast("📤 PROFIL BYL EXPORTOVÁN DO SOUBORU");
}

function setupProfileExportImport() {
  const btnExp = document.getElementById("btn-export-profile");
  const btnImp = document.getElementById("btn-import-profile");
  const inputImp = document.getElementById("import-profile-input");

  if (btnExp) btnExp.addEventListener("click", exportSaveProfile);
  if (btnImp && inputImp) {
    btnImp.addEventListener("click", () => inputImp.click());
    inputImp.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.meta) {
            Object.assign(meta, parsed.meta);
            saveMetaProgression();
          }
          if (parsed.slots) {
            [1, 2, 3].forEach(s => {
              if (parsed.slots[`slot${s}`]) localStorage.setItem(getSaveKey(s), parsed.slots[`slot${s}`]);
              if (parsed.slots[`name${s}`]) localStorage.setItem(`neon_singularity_slot_name_${s}`, parsed.slots[`name${s}`]);
            });
          }
          refreshMenuSaveUI();
          renderShipSelector();
          showSaveToast("📥 PROFIL A SLOTY BYLY ÚSPĚŠNĚ NAČTENY!");
        } catch (err) {
          showSaveToast("❌ CHYBA PŘI NAČÍTÁNÍ ZÁLOHY!");
        }
      };
      reader.readAsText(file);
    });
  }
}

function setupHangarInterface() {
  const tabs = [
    { btn: document.getElementById("tab-btn-ships"), panel: document.getElementById("menu-tab-ships") },
    { btn: document.getElementById("tab-btn-slots"), panel: document.getElementById("menu-tab-slots") },
    { btn: document.getElementById("tab-btn-hall"), panel: document.getElementById("menu-tab-hall") },
    { btn: document.getElementById("tab-btn-settings"), panel: document.getElementById("menu-tab-settings") }
  ];

  tabs.forEach((t, idx) => {
    if (!t.btn || !t.panel) return;
    t.btn.addEventListener("click", () => {
      tabs.forEach(other => {
        if (!other.btn || !other.panel) return;
        other.panel.classList.add("hidden");
        other.btn.className = "px-3.5 py-1.5 font-orbitron text-xs font-bold bg-slate-950/60 border-t border-x border-slate-800 text-slate-400 hover:text-white";
      });
      t.panel.classList.remove("hidden");
      t.btn.className = "px-3.5 py-1.5 font-orbitron text-xs font-black bg-cyan-500/20 border-t border-x border-cyan-400 text-white";
      if (idx === 1) renderSaveSlotsUI();
      if (idx === 2 && typeof renderHallOfFame === "function") renderHallOfFame();
    });
  });

  // POSUVNÍKY HLASITOSTI - PŘÍMÉ NAPOJENÍ NA AUDIO.JS
  const sliderBgm = document.getElementById("slider-bgm-vol");
  const labelBgm = document.getElementById("label-bgm-vol");
  const sliderSfx = document.getElementById("slider-sfx-vol");
  const labelSfx = document.getElementById("label-sfx-vol");

  if (sliderBgm && labelBgm) {
    sliderBgm.value = sfx.bgmVolume !== undefined ? sfx.bgmVolume : 0.55;
    labelBgm.textContent = `${Math.round(sliderBgm.value * 100)}%`;
    sliderBgm.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      sfx.setBgmVolume(val);
      labelBgm.textContent = `${Math.round(val * 100)}%`;
    });
  }

  if (sliderSfx && labelSfx) {
    sliderSfx.value = sfx.sfxVolume !== undefined ? sfx.sfxVolume : 0.8;
    labelSfx.textContent = `${Math.round(sliderSfx.value * 100)}%`;
    sliderSfx.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      sfx.setSfxVolume(val);
      labelSfx.textContent = `${Math.round(val * 100)}%`;
    });
  }

  if (typeof setupProfileExportImport === "function") {
    setupProfileExportImport();
  }

  const diffDescriptions = {
    ARCADE: "100 % HP // Běžné čipy // Cíl: 12. vlna",
    HARDCORE: "70 % HP // Silnější AI // 2x Čipy ◈ & +35 % Skóre",
    ULTRA: "35 % HP // Extrémní AI // 3x Čipy ◈ & +75 % Skóre",
    ENDLESS: "Nekonečné vlny // Stupňující se Bossové"
  };

  const descElInit = document.getElementById("difficulty-desc-text");
  if (descElInit) {
    descElInit.classList.remove("truncate", "max-w-[240px]", "max-w-xs");
    descElInit.textContent = diffDescriptions[state.difficulty] || diffDescriptions.ARCADE;
  }

  document.querySelectorAll("#difficulty-selector-grid button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll("#difficulty-selector-grid button").forEach(b => {
        b.className = "cyber-btn-outline py-1.5 text-[10px] font-bold text-slate-400 border-slate-700";
      });
      const chosenDiff = e.currentTarget.getAttribute("data-diff");
      state.difficulty = chosenDiff;
      e.currentTarget.className = "cyber-btn-outline py-1.5 text-[10px] font-bold border-cyan-400 bg-cyan-500/20 text-white";

      const descEl = document.getElementById("difficulty-desc-text");
      if (descEl && diffDescriptions[chosenDiff]) {
        descEl.textContent = diffDescriptions[chosenDiff];
      }
    });
  });
}

/*************************************************************************
 * KOMPLETNÍ OBSLUHA MUTÁTORŮ (SPODNÍ TLAČÍTKA I HORNÍ KARTY)
 *************************************************************************/
if (typeof window.DAILY_MUTATORS === "undefined") {
  window.DAILY_MUTATORS = [
    {
      id: "NONE",
      name: "STANDARDNÍ PROTOKOL",
      subtitle: "BEZ MODIFIKÁTORU",
      desc: "Standardní fyzika arény bez dodatečných modifikátorů.",
      shortDesc: "STANDARD: Běžná pravidla bez mutace",
      color: "#00f3ff",
      bonusChips: 0
    },
    {
      id: "GLASS_CANNON",
      name: "SKLENĚNÁ DĚLA",
      subtitle: "2x POŠKOZENÍ PRO VŠECHNY",
      desc: "Tvé zbraně způsobují dvojnásobné poškození, ale nepřátelé dávají 2x větší rány!",
      shortDesc: "SKLENĚNÁ DĚLA: 2x poškození pro tebe i nepřátele (+30 ◈)",
      color: "#ff0055",
      bonusChips: 30
    },
    {
      id: "INFINITE_DASH",
      name: "NEKONEČNÝ HYPER-SKOK",
      subtitle: "0.18s COOLDOWN SKOKU",
      desc: "Hyper-Skok se nabíjí téměř okamžitě. Ideální pro čistě kinetický průlet arénou!",
      shortDesc: "NEKONEČNÝ SKOK: Cooldown skoku jen 0.18s (+25 ◈)",
      color: "#fcee09",
      bonusChips: 25
    },
    {
      id: "SWARM_CHAOS",
      name: "ROJOVÝ CHAOS",
      subtitle: "2x VÍCE NEPŘÁTEL V ARÉNĚ",
      desc: "Dvojnásobný počet nepřátel v každé vlně, ale mají o 28 % méně životů.",
      shortDesc: "ROJE CHAOSU: 2x více nepřátel s nižším HP (+35 ◈)",
      color: "#00ffaa",
      bonusChips: 35
    }
  ];
}

function selectMutatorMode(mutId) {
  state.mutator = mutId;
  const mutObj = window.DAILY_MUTATORS.find(m => m.id === mutId) || window.DAILY_MUTATORS[0];

  if (typeof sfx !== "undefined" && sfx.playGem) sfx.playGem();

  const mutDescEl = document.getElementById("mutator-desc-text");
  if (mutDescEl) {
    mutDescEl.classList.remove("truncate");
    mutDescEl.textContent = mutObj.shortDesc;
    mutDescEl.style.color = mutObj.color;
  }

  const allBtns = Array.from(document.querySelectorAll("#mutator-selector-grid button"));
  allBtns.forEach(btn => {
    const cleanTxt = btn.textContent.replace(/\s+/g, " ").trim().toUpperCase();
    let btnMutId = null;

    if (cleanTxt === "STANDARD" || cleanTxt === "STANDARDNÍ") btnMutId = "NONE";
    else if (cleanTxt.includes("SKLENĚNÁ") || cleanTxt.includes("GLASS")) btnMutId = "GLASS_CANNON";
    else if ((cleanTxt.includes("NEKONEČNÝ") || cleanTxt.includes("INFINITE")) && !cleanTxt.includes("ENDLESS")) btnMutId = "INFINITE_DASH";
    else if (cleanTxt.includes("ROJE") || cleanTxt.includes("ROJOVÝ") || cleanTxt.includes("SWARM")) btnMutId = "SWARM_CHAOS";

    if (btnMutId) {
      if (btnMutId === mutId) {
        btn.className = "cyber-btn-outline py-1.5 text-[10px] font-bold border-cyan-400 bg-cyan-500/20 text-white";
      } else {
        btn.className = "cyber-btn-outline py-1.5 text-[10px] font-bold text-slate-400 border-slate-700";
      }
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const allBtns = Array.from(document.querySelectorAll("#mutator-selector-grid button, #start-modal button"));
  allBtns.forEach(btn => {
    const cleanTxt = btn.textContent.replace(/\s+/g, " ").trim().toUpperCase();
    let targetId = null;

    if (cleanTxt === "STANDARD" || cleanTxt === "STANDARDNÍ") targetId = "NONE";
    else if (cleanTxt.includes("SKLENĚNÁ") || cleanTxt.includes("GLASS")) targetId = "GLASS_CANNON";
    else if ((cleanTxt.includes("NEKONEČNÝ") || cleanTxt.includes("INFINITE")) && !cleanTxt.includes("ENDLESS")) targetId = "INFINITE_DASH";
    else if (cleanTxt.includes("ROJE") || cleanTxt.includes("ROJOVÝ") || cleanTxt.includes("SWARM")) targetId = "SWARM_CHAOS";

    if (targetId) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        selectMutatorMode(targetId);
      });
    }
  });
});

function toggleAppFullscreen() {
  const doc = window.document;
  const docEl = doc.documentElement;

  const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  const cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    if (requestFullScreen) requestFullScreen.call(docEl).catch(() => { });
  } else {
    if (cancelFullScreen) cancelFullScreen.call(doc);
  }
}

const fsBtn = document.getElementById("btn-fullscreen-toggle");
if (fsBtn) {
  fsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleAppFullscreen();
  });
}

// Bind the reset control independently of the menu setup/onload flow.
document.addEventListener("DOMContentLoaded", () => {
  const resetProgressBtn = document.getElementById("btn-reset-progress");
  if (resetProgressBtn) {
    resetProgressBtn.addEventListener("click", (event) => {
      event.preventDefault();
      resetAllProgress();
    });
  }
});

window.onload = () => {
  loadMetaProgression();
  saveMetaProgression();
  renderShipSelector();
  setupHangarInterface();
  renderHallOfFame();
  document.getElementById("best-score-display").textContent = String(state.bestScore).padStart(7, "0");
  refreshMenuSaveUI();
  requestAnimationFrame(gameLoop);
};

document.addEventListener("click", (e) => {
  const target = e.target.closest("button, .ship-card, .cyber-card, input[type='range']");
  if (target && typeof sfx !== "undefined") {
    // Prohlížeče vyžadují první interakci pro odemknutí zvuku
    if (state.mode === "MENU" && !sfx.menuBgmActive) {
      sfx.startMenuAmbient();
    }
    sfx.playButtonClick();
  }
});