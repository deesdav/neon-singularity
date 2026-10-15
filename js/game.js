/*************************************************************************
 * GAME.JS - 24 WEAPONS, 3 SYNERGIES, RARE WORMHOLES & GAMEPAD SUPPORT
 *************************************************************************/
const LEGACY_SAVE_KEY = "neon_singularity_ult_save_v1";
const META_KEY = "neon_singularity_ult_meta_v1";
const BEST_KEY = "neon_singularity_evo_best";

let currentSaveSlot = 1;

function getSaveKey(slot = currentSaveSlot) {
  return `neon_singularity_save_slot_${slot}_v1`;
}

try {
  const legacyData = localStorage.getItem(LEGACY_SAVE_KEY);
  if (legacyData && !localStorage.getItem(getSaveKey(1))) {
    localStorage.setItem(getSaveKey(1), legacyData);
  }
} catch (e) {}

const meta = {
  shards: 0,
  selectedShip: "INTERCEPTOR",
  upgrades: {
    hullLvl: 0,
    dmgLvl: 0,
    magnetLvl: 0,
    novaLvl: 0,
    overdriveLvl: 0,
    critShopLvl: 0,
    dashCdLvl: 0,
    shardHunterLvl: 0,
  },
  achievements: {},
  stats: {
    burnedCount: 0,
    satelliteStrikes: 0,
    blackHolesUsed: 0,
    boomerangKills: 0,
    minesDropped: 0,
  },
};

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
let W = window.innerWidth;
let H = window.innerHeight;
canvas.width = W;
canvas.height = H;

const grid = new SpringGrid(46);
const spaceBg = new DeepSpaceBackdrop(W, H);

window.addEventListener("resize", () => {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
  grid.resize(W, H);
  spaceBg.init(W, H);
});

const state = {
  mode: "MENU",
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
  wormholeTimer: 48, // Vzácné Červí díry (cca jednou za minutu)
  shake: 0,
  chromatic: 0,
  hudVisible: true,
  fps: 60,
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
    barrels: 2,
    fireRateLvl: 1,
    ricochetLvl: 0,
    missilesLvl: 0,
    bladesLvl: 0,
    teslaLvl: 0,
    railgunLvl: 0,
    dronesLvl: 0,
    plasmaTrailLvl: 0,
    cryoNovaLvl: 0,
    aegisLvl: 0,
    critLvl: 0,
    flamethrowerLvl: 0,
    satelliteLvl: 0,
    boomerangLvl: 0,
    minesLvl: 0,
    shockwaveLvl: 0,
    gravityAmpLvl: 0,
    regenLvl: 0,
    solarHaloLvl: 0,
    swarmBotsLvl: 0,
    gravCannonLvl: 0,
    phaseMeltLvl: 0,
  },
  missileTimer: 0,
  teslaTimer: 0,
  railgunTimer: 0,
  droneTimer: 0,
  trailTimer: 0,
  cryoTimer: 0,
  flameTickTimer: 0,
  satelliteTimer: 0,
  boomerangTimer: 0,
  mineTimer: 0,
  shockwaveTimer: 0,
  solarHaloTimer: 0,
  swarmBotsTimer: 0,
  gravCannonTimer: 0,
  aegisReady: false,
  aegisCooldown: 0,
  bladeAngle: 0,
  droneAngle: 0,
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

function loadMetaProgression() {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      meta.shards = parsed.shards || 0;
      meta.selectedShip = parsed.selectedShip || "INTERCEPTOR";
      meta.upgrades = { ...meta.upgrades, ...(parsed.upgrades || {}) };
      meta.achievements = { ...(parsed.achievements || {}) };
      meta.stats = { ...meta.stats, ...(parsed.stats || {}) };
    }
  } catch (e) {}
}

function saveMetaProgression() {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
    const unlockedCount = Object.keys(meta.achievements).length;
    document.getElementById("menu-shards-count").textContent = meta.shards;
    document.getElementById("shop-shards-count").textContent = meta.shards;
    document.getElementById("hud-shards").textContent = meta.shards;
    document.getElementById("menu-ach-count").textContent =
      `${unlockedCount}/${ACHIEVEMENTS_LIST.length}`;
    document.getElementById("hud-ach-count").textContent =
      `${unlockedCount}/${ACHIEVEMENTS_LIST.length}`;
    if (meta.shards >= 50) unlockAchievement("rich_cyber");
  } catch (e) {}
}

let achPopupTimer = null;
function showBannerPopup(title, subtitle, rewardText) {
  const banner = document.getElementById("achievement-popup");
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

function unlockAchievement(id) {
  if (meta.achievements[id]) return;
  const ach = ACHIEVEMENTS_LIST.find((a) => a.id === id);
  if (!ach) return;

  meta.achievements[id] = true;
  meta.shards += ach.reward;
  saveMetaProgression();
  sfx.playLevelUp();
  showBannerPopup(
    ach.name,
    "TROFEJ ODEMČENA!",
    `+${ach.reward} ◈ KVANTOVÝCH ČIPŮ`,
  );
}

function checkWeaponSynergies() {
  let activeCount = 0;
  SYNERGIES_LIST.forEach((syn) => {
    if (syn.check(player.weapons)) {
      activeCount++;
      if (!player.unlockedSynergies[syn.id]) {
        player.unlockedSynergies[syn.id] = true;
        sfx.playLevelUp();
        spawnShockwave(player.x, player.y, 440, syn.color, 6, 620);
        addFloatingText(player.x, player.y - 55, syn.name, syn.color, 1.45);
        showBannerPopup(
          syn.name,
          "FÚZNÍ SYNERGIE AKTIVNÍ!",
          "ZBRANĚ SPOJENY DO SUPER-SYSTÉMU",
        );
        unlockAchievement("synergy_unlock");
      }
    }
  });
  if (activeCount >= 3) unlockAchievement("all_synergies");
}

function saveGameProgress(showNotification = false, slot = currentSaveSlot) {
  if (state.mode === "GAMEOVER" || state.mode === "MENU" || player.hp <= 0)
    return;
  currentSaveSlot = slot;
  try {
    const payload = {
      timestamp: Date.now(),
      slot: slot,
      state: {
        score: state.score,
        combo: state.combo,
        maxCombo: state.maxCombo,
        wave: state.wave,
        enemiesToSpawn: state.enemiesToSpawn,
        bossActive: state.bossActive,
        overdrive: state.overdrive,
        overdriveTimer: state.overdriveTimer,
      },
      player: {
        shipClass: player.shipClass,
        color: player.color,
        x: player.x,
        y: player.y,
        hp: player.hp,
        maxHp: player.maxHp,
        xp: player.xp,
        xpNext: player.xpNext,
        level: player.level,
        speed: player.speed,
        dmgMult: player.dmgMult,
        dashMaxCooldown: player.dashMaxCooldown,
        bombs: player.bombs,
        maxBombs: player.maxBombs,
        aegisReady: player.aegisReady,
        aegisCooldown: player.aegisCooldown,
        unlockedSynergies: { ...player.unlockedSynergies },
        weapons: { ...player.weapons },
      },
      enemies: enemies.slice(0, 60),
      gems: gems.slice(0, 120),
      supplyPods: supplyPods.slice(0, 10),
    };
    localStorage.setItem(getSaveKey(slot), JSON.stringify(payload));
    saveMetaProgression();
    if (showNotification) showSaveToast(`⚡ POZICE ULOŽENA DO SLOTU #${slot}`);
    refreshMenuSaveUI();
    updateHUD();
  } catch (e) {}
}

function clearSavedGame(slot = currentSaveSlot) {
  localStorage.removeItem(getSaveKey(slot));
  refreshMenuSaveUI();
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

  if (startBtn) {
    startBtn.textContent = raw
      ? `PŘEPSAT SLOT #${currentSaveSlot} NOVOU MISÍ [ENTER]`
      : `SPUSTIT NOVOU MISI DO SLOTU #${currentSaveSlot} [ENTER]`;
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
    metaText.textContent = `SLOT #${currentSaveSlot} (${data.player.shipClass || "INTERCEPTOR"}): VLNA ${data.state.wave} // LV ${data.player.level} // TRUP ${Math.ceil(data.player.hp)}/${data.player.maxHp} // SKÓRE: ${sc}`;
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

    bullets.length = 0;
    missiles.length = 0;
    boomerangs.length = 0;
    mines.length = 0;
    railBeams.length = 0;
    plasmaPools.length = 0;
    orbitalStrikes.length = 0;
    wormholes.length = 0;
    lensFlares.length = 0;
    enemyBullets.length = 0;
    enemies.length = 0;
    singularities.length = 0;
    gems.length = 0;
    supplyPods.length = 0;
    particles.length = 0;
    shockwaves.length = 0;
    lightningArcs.length = 0;
    floatingTexts.length = 0;

    Object.assign(state, data.state);
    Object.assign(player, data.player);
    player.weapons = { ...player.weapons, ...(data.player.weapons || {}) };
    player.unlockedSynergies = { ...(data.player.unlockedSynergies || {}) };
    player.x = Math.max(40, Math.min(W - 40, player.x || W / 2));
    player.y = Math.max(40, Math.min(H - 40, player.y || H / 2));
    player.invulnTimer = 1.5;

    if (Array.isArray(data.enemies))
      data.enemies.forEach((e) => enemies.push(e));
    if (Array.isArray(data.gems)) data.gems.forEach((g) => gems.push(g));
    if (Array.isArray(data.supplyPods))
      data.supplyPods.forEach((sp) => supplyPods.push(sp));

    const activeBoss = enemies.find((e) => e.type === "BOSS");
    state.bossActive = !!activeBoss;
    if (activeBoss) {
      document.getElementById("boss-name").textContent =
        activeBoss.name || "OMEGA ARCHON";
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
    spawnShockwave(player.x, player.y, 350, "#fcee09", 5, 550);
    grid.applyForce(player.x, player.y, 320, 45, false, true);
    addFloatingText(
      player.x,
      player.y - 40,
      `SLOT #${slot} OBNOVEN!`,
      "#fcee09",
      1.35,
    );
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

    document.getElementById("pause-active-slot").textContent =
      `#${currentSaveSlot}`;
    document.getElementById("pause-score").textContent = Math.floor(
      state.score,
    ).toLocaleString("cs-CZ");
    document.getElementById("pause-wave").textContent = `VLNA ${state.wave}`;
    document.getElementById("pause-level").textContent =
      `ÚROVEŇ ${player.level}`;
    document.getElementById("pause-arsenal-list").innerHTML =
      document.getElementById("arsenal-badges").innerHTML;

    document.getElementById("pause-modal").classList.remove("hidden");
    document.getElementById("pause-modal").classList.add("flex");
  } else if (state.mode === "PAUSED") {
    state.mode = "PLAYING";
    lastTime = performance.now();
    document.getElementById("pause-modal").classList.add("hidden");
    document.getElementById("pause-modal").classList.remove("flex");
  }
}

function spawnParticles(
  x,
  y,
  color,
  count = 20,
  speedMin = 80,
  speedMax = 420,
  size = 2.5,
  lifeMin = 0.35,
  lifeMax = 0.85,
) {
  for (let i = 0; i < count; i++) {
    if (particles.length > 1800) particles.shift();
    const angle = Math.random() * Math.PI * 2;
    const spd = speedMin + Math.random() * (speedMax - speedMin);
    const life = lifeMin + Math.random() * (lifeMax - lifeMin);
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      color,
      size: size * (0.7 + Math.random() * 0.6),
      life,
      maxLife: life,
      drag: 0.94,
    });
  }
}

function spawnLensFlare(x, y, color = "#00f3ff", width = 380) {
  lensFlares.push({ x, y, color, width, life: 0.32, maxLife: 0.32 });
}

function spawnShockwave(
  x,
  y,
  maxRadius,
  color = "#00f3ff",
  lineWidth = 4,
  speed = 420,
) {
  shockwaves.push({ x, y, radius: 4, maxRadius, color, lineWidth, speed });
}

function addFloatingText(x, y, text, color = "#00f3ff", scale = 1.0) {
  floatingTexts.push({
    x,
    y,
    vy: -55,
    text,
    color,
    scale,
    life: 0.95,
    maxLife: 0.95,
  });
}

// 24 ROGUELITE UPGRADE MODULES
const UPGRADE_POOL = [
  {
    id: "solar_halo",
    name: "SLUNEČNÍ AURA",
    subtitle: "PERMANENTNÍ ŽHNOUCÍ PRSTENEC",
    desc: "Kolem lodi pulzuje žhnoucí sluneční koróna, která automaticky spaluje a zpomaluje blízké nepřátele.",
    color: "#fb923c",
    apply: () => {
      player.weapons.solarHaloLvl++;
    },
  },
  {
    id: "swarm_bots",
    name: "ROJ LOVECKÝCH NANOBOTŮ",
    subtitle: "SAMONAVÁDĚCÍ KYBER-HMYZ",
    desc: "Vypouští rychlé zeleno-zlaté nanoboty, kteří vyhledávají oslabené cíle a rozkládají jejich štíty.",
    color: "#a3e635",
    apply: () => {
      player.weapons.swarmBotsLvl++;
    },
  },
  {
    id: "grav_cannon",
    name: "GRAVITAČNÍ DĚLO",
    subtitle: "TĚŽKÉIMPLODUJÍCÍ KULE",
    desc: "Střílí pomalé temné sféry, které po nárazu přitáhnou okolní nepřátele do jednoho bodu.",
    color: "#c084fc",
    apply: () => {
      player.weapons.gravCannonLvl++;
    },
  },
  {
    id: "phase_melt",
    name: "FÁZOVÝ ROZKLAD PANCÍŘE",
    subtitle: "+25 % POŠKOZENÍ DO BOSSŮ & ELIT",
    desc: "Střely narušují molekulární vazby – Elity a Bossové dostávají o +25 % vyšší poškození ze všech zdrojů.",
    color: "#f43f5e",
    apply: () => {
      player.weapons.phaseMeltLvl++;
    },
  },
  {
    id: "boomerang",
    name: "FOTONOVÉ BUMERANGY",
    subtitle: "VRACEJÍCÍ SE ENERGETICKÉ SRPY",
    desc: "Vypouští rotující fotonové bumerangy. (Synergie s Plamenometem -> Sluneční Supernova!)",
    color: "#00ffaa",
    apply: () => {
      player.weapons.boomerangLvl++;
    },
  },
  {
    id: "mines",
    name: "ROJ KVANTOVÝCH MIN",
    subtitle: "MAGNETICKÉ PROSTOROVÉ MINY",
    desc: "Loď za sebou klade pulzující kvantové miny, které se přitáhnou k blízkým nepřátelům a vybuchnou.",
    color: "#fcee09",
    apply: () => {
      player.weapons.minesLvl++;
    },
  },
  {
    id: "shockwave",
    name: "KINETICKÁ TLAKOVÁ VLNA",
    subtitle: "ODRAZOVÝ PULZ KOLEM LODI",
    desc: "Periodicky vysílá prstencovou rázovou vlnu, která odhodí nepřátele, smaže blízké střely a nabije mřížku.",
    color: "#38bdf8",
    apply: () => {
      player.weapons.shockwaveLvl++;
    },
  },
  {
    id: "gravity_amp",
    name: "DRTIČ GRAVITACE",
    subtitle: "+35 % DOSAH & SÍLA ČERNÉ DÍRY",
    desc: "Zvětšuje Černé díry o +35 % a přidá +1 nálož. (Synergie se Satelitem -> Hvězdná Singularita!)",
    color: "#bc13fe",
    apply: () => {
      player.weapons.gravityAmpLvl++;
      player.bombs = Math.min(player.maxBombs, player.bombs + 1);
    },
  },
  {
    id: "regen",
    name: "NANOBOTNÍ REGENERACE",
    subtitle: "AUTOMATICKÁ OPRAVA TRUPU V BOJI",
    desc: "Nanoboty plynule opravují trup lodi (+3.5 HP/s za úroveň) a zvýší Max HP o +15.",
    color: "#10b981",
    apply: () => {
      player.weapons.regenLvl++;
      player.maxHp += 15;
      player.hp = Math.min(player.maxHp, player.hp + 25);
    },
  },
  {
    id: "flamethrower",
    name: "PLAZMOVÝ PLAMENOMET",
    subtitle: "KUŽEL PLAZMATU & ZAPÁLENÍ",
    desc: "Chrlí žhnoucí proud plazmatu. (Synergie s Bumerangy -> Sluneční Supernova!)",
    color: "#ff5500",
    apply: () => {
      player.weapons.flamethrowerLvl++;
    },
  },
  {
    id: "satellite",
    name: "ORBITÁLNÍ ION-SATELIT",
    subtitle: "ORBITÁLNÍ LASEROVÝ ÚDER",
    desc: "Satelit sesílá ničivé iontové sloupy energie. (Synergie s Drtičem Gravitace -> Hvězdná Singularita!)",
    color: "#ff0055",
    apply: () => {
      player.weapons.satelliteLvl++;
    },
  },
  {
    id: "barrels",
    name: "KVANTOVÉ HLAVNĚ",
    subtitle: "+1 PLAZMOVÝ PROUD",
    desc: "Přidá další hlaveň k primárnímu pulznímu kanónu a rozšíří zbraňové věže na trupu lodi.",
    color: "#00f3ff",
    apply: () => {
      player.weapons.barrels = Math.min(7, player.weapons.barrels + 1);
      if (player.weapons.barrels >= 6) unlockAchievement("max_barrels");
    },
  },
  {
    id: "firerate",
    name: "HYPER-KONDENZÁTOR",
    subtitle: "+22 % KADENCE & POHYB",
    desc: "Zvyšuje rychlost nabíjení zbraní a zrychluje trysky vznášedla.",
    color: "#fcee09",
    apply: () => {
      player.weapons.fireRateLvl++;
      player.speed += 22;
    },
  },
  {
    id: "ricochet",
    name: "ODRAZOVÉ FOTONY",
    subtitle: "+1 ODRAZ & PRŮRAZNOST",
    desc: "Střely se odrážejí od stěn arény a pronikají skrz pancíře více nepřátel.",
    color: "#00ffaa",
    apply: () => {
      player.weapons.ricochetLvl++;
    },
  },
  {
    id: "missiles",
    name: "ROJ MIKRORAKET",
    subtitle: "NAVÁDĚNÁ SALVA",
    desc: "Vypouští salvu kybernetických mikroraket, které samy pronásledují cíle.",
    color: "#ff007f",
    apply: () => {
      player.weapons.missilesLvl++;
    },
  },
  {
    id: "railgun",
    name: "KVANTOVÝ RAILGUN",
    subtitle: "PRŮRAZNÝ HYPER-PAPRSEK",
    desc: "Namontuje na příď lodi dlouhý Railgun, který vystřeluje okamžitý paprsek přes celou arénu.",
    color: "#ff0055",
    apply: () => {
      player.weapons.railgunLvl++;
    },
  },
  {
    id: "drones",
    name: "AUTONOMNÍ DRONY",
    subtitle: "+1 ÚTOČNÝ WINGMAN DRON",
    desc: "Kolem lodi krouží bojové drony. (Synergie s Teslou -> Bouřková Matrice!)",
    color: "#38bdf8",
    apply: () => {
      player.weapons.dronesLvl = Math.min(4, player.weapons.dronesLvl + 1);
    },
  },
  {
    id: "blades",
    name: "ORBITÁLNÍ ČEPELE",
    subtitle: "ROTUJÍCÍ PLAZMOVÉ KOTOUČE",
    desc: "Energetické disky drtící nepřátele i nepřátelské projektily v těsné blízkosti.",
    color: "#bc13fe",
    apply: () => {
      player.weapons.bladesLvl = Math.min(6, player.weapons.bladesLvl + 1);
    },
  },
  {
    id: "tesla",
    name: "TESLŮV OBLOUK",
    subtitle: "ŘETĚZOVÝ BLESK",
    desc: "Vysokonapěťový výboj přeskakující mezi nepřáteli. (Synergie s Drony -> Bouřková Matrice!)",
    color: "#5ffbff",
    apply: () => {
      player.weapons.teslaLvl++;
    },
  },
  {
    id: "trail",
    name: "PLAZMOVÁ STOPA",
    subtitle: "HOŘÍCÍ STOPA ZA LODÍ",
    desc: "Při pohybu a Hyper-Skoku zanechává loď žhnoucí plazmové zóny, které taví pronásledovatele.",
    color: "#fb923c",
    apply: () => {
      player.weapons.plasmaTrailLvl++;
    },
  },
  {
    id: "cryo",
    name: "KRYO-PULZNÍ POLE",
    subtitle: "MRAZIVÁ TLAKOVÁ VLNA",
    desc: "Vysílá sub-nulový pulz, který zpomalí okolní nepřátele na 45 % rychlosti.",
    color: "#67e8f9",
    apply: () => {
      player.weapons.cryoNovaLvl++;
    },
  },
  {
    id: "aegis",
    name: "ENERGETICKÝ ŠTÍT AEGIS",
    subtitle: "AUTOMATICKÁ BARIÉRA",
    desc: "Vytvoří dobíjecí silové pole, které plně pohltí zásah a vyvolá odrazovou vlnu.",
    color: "#60a5fa",
    apply: () => {
      player.weapons.aegisLvl++;
      player.aegisReady = true;
      player.aegisCooldown = 0;
    },
  },
  {
    id: "crit",
    name: "KRITICKÝ PŘETAKTOVAČ",
    subtitle: "2.4x KRITICKÉ ZÁSAHY & OPRAVY",
    desc: "Zvyšuje šanci na kritické poškození o +15 % a zničení Elit/Bossů opravuje trup.",
    color: "#f43f5e",
    apply: () => {
      player.weapons.critLvl++;
    },
  },
  {
    id: "nova_core",
    name: "JÁDRO SINGULARITY",
    subtitle: "+1 ČERNÁ DÍRA & +30 MAX TRUP",
    desc: "Doplní +1 nálož Černé díry, zvýší maximální integritu trupu o +30 a opraví 60 HP.",
    color: "#ff9900",
    apply: () => {
      player.maxHp += 30;
      player.hp = Math.min(player.maxHp, player.hp + 60);
      player.bombs = Math.min(player.maxBombs, player.bombs + 1);
    },
  },
];

function selectUpgradeCard(index) {
  if (state.mode !== "UPGRADE" || !currentUpgradeChoices[index]) return;
  const upg = currentUpgradeChoices[index];
  upg.apply();
  checkWeaponSynergies();
  updateHUD();
  document.getElementById("upgrade-modal").classList.add("hidden");
  document.getElementById("upgrade-modal").classList.remove("flex");
  state.mode = "PLAYING";
  saveGameProgress(true, currentSaveSlot);
  spawnShockwave(player.x, player.y, 340, upg.color, 5, 560);
  spawnLensFlare(player.x, player.y, upg.color, 450);
  grid.applyForce(player.x, player.y, 300, 40, false, true);
  addFloatingText(
    player.x,
    player.y - 30,
    `${upg.name} AKTIVNÍ!`,
    upg.color,
    1.3,
  );
}

function triggerUpgradeSelection() {
  state.mode = "UPGRADE";
  sfx.playLevelUp();

  const container = document.getElementById("upgrade-cards-container");
  container.innerHTML = "";
  currentUpgradeChoices = [...UPGRADE_POOL]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  currentUpgradeChoices.forEach((upg, idx) => {
    const card = document.createElement("div");
    card.className = "cyber-card p-6 flex flex-col justify-between";
    card.innerHTML = `
            <div>
                <div class="flex justify-between items-center mb-1">
                    <span class="text-xs font-orbitron tracking-widest uppercase" style="color: ${upg.color}">${upg.subtitle}</span>
                    <span class="px-2 py-0.5 bg-slate-900 border border-slate-700 font-orbitron text-[10px] text-slate-300">[KLÁVESA ${idx + 1}]</span>
                </div>
                <h3 class="font-orbitron text-2xl font-black text-white mb-3">${upg.name}</h3>
                <p class="text-sm text-slate-300 leading-relaxed mb-5">${upg.desc}</p>
            </div>
            <div class="pt-3 border-t border-cyan-500/20 flex justify-between items-center">
                <span class="font-orbitron text-xs text-cyan-300 font-bold">INSTALOVAT MODUL</span>
                <span class="font-orbitron text-lg font-black" style="color: ${upg.color}">→</span>
            </div>
        `;
    card.addEventListener("click", () => selectUpgradeCard(idx));
    container.appendChild(card);
  });

  document.getElementById("upgrade-modal").classList.remove("hidden");
  document.getElementById("upgrade-modal").classList.add("flex");
}

function getAITier() {
  if (state.wave >= 10) return 4;
  if (state.wave >= 6) return 3;
  if (state.wave >= 3) return 2;
  return 1;
}

// VZÁCNÁ PROSTOROVÁ ANOMÁLIE (DVOJICE PROPOJENÝCH ČERVÍCH DĚR)
function spawnRareWormholePair() {
  const margin = 140;
  const x1 = margin + Math.random() * (W * 0.35 - margin);
  const y1 = margin + Math.random() * (H - margin * 2);
  const x2 = W * 0.65 + Math.random() * (W * 0.35 - margin);
  const y2 = margin + Math.random() * (H - margin * 2);

  wormholes.push({
    x1,
    y1,
    x2,
    y2,
    radius: 30,
    angle: 0,
    life: 24.0,
  });
  spawnShockwave(x1, y1, 140, "#00f3ff", 3, 400);
  spawnShockwave(x2, y2, 140, "#ff6600", 3, 400);
  addFloatingText(
    W / 2,
    110,
    "🌀 ANOMÁLIE DETEKOVÁNA: PROSTOROVÁ ČERVÍ DÍRA!",
    "#00f3ff",
    1.25,
  );
}

function spawnSupplyPod() {
  const margin = 90;
  const x = margin + Math.random() * (W - margin * 2);
  const y = margin + Math.random() * (H - margin * 2);
  const types = [
    { kind: "HEAL", label: "OPRAVNÝ NANOBOT (+45 HP)", color: "#00ffaa" },
    { kind: "MAGNET", label: "KVANTOVÝ MAGNET XP!", color: "#fcee09" },
    { kind: "NOVA", label: "+1 ČERNÁ DÍRA & PŘETLAK", color: "#ff007f" },
  ];
  const chosen = types[Math.floor(Math.random() * types.length)];
  supplyPods.push({
    x,
    y,
    kind: chosen.kind,
    label: chosen.label,
    color: chosen.color,
    radius: 18,
    angle: 0,
    life: 14.0,
  });
  spawnShockwave(x, y, 90, chosen.color, 2.5, 340);
  addFloatingText(x, y - 24, "ZÁSOBOVACÍ POD VYSÁZEN!", chosen.color, 1.0);
}

function spawnEnemy(forcedType = null, xOverride = null, yOverride = null) {
  let x = xOverride,
    y = yOverride;
  if (x === null || y === null) {
    const margin = 55;
    for (let tries = 0; tries < 12; tries++) {
      x = margin + Math.random() * (W - margin * 2);
      y = margin + Math.random() * (H - margin * 2);
      if (Math.hypot(x - player.x, y - player.y) > 290) break;
    }
  }

  const tier = getAITier();
  const playerPowerFactor = 1 + (player.level - 1) * 0.16;
  const waveScale = (1 + (state.wave - 1) * 0.28) * playerPowerFactor;

  let type = forcedType;
  if (!type) {
    const r = Math.random();
    if (r < 0.34) type = "CHASER";
    else if (r < 0.56) type = "WEAVER";
    else if (r < 0.72) type = "SPLITTER";
    else if (r < 0.85) type = "JUGGERNAUT";
    else if (r < 0.94 && state.wave >= 2) type = "PHANTOM";
    else type = state.wave >= 3 ? "GUARDIAN" : "JUGGERNAUT";
  }

  const eliteChance = Math.min(0.65, (state.wave - 1) * 0.08);
  const isElite = Math.random() < eliteChance && type !== "MINI_SWARM";
  const shieldMult = isElite ? 0.55 : tier >= 3 ? 0.25 : 0;

  if (type === "CHASER") {
    const baseHp = 38 * waveScale;
    enemies.push({
      type,
      x,
      y,
      vx: 0,
      vy: 0,
      radius: isElite ? 18 : 15,
      hp: baseHp,
      maxHp: baseHp,
      shield: baseHp * shieldMult,
      maxShield: baseHp * shieldMult,
      speed: 205 + Math.min(115, state.wave * 7),
      color: "#ff007f",
      score: 140,
      angle: 0,
      spin: 5.5,
      strafeDir: Math.random() < 0.5 ? 1 : -1,
      strafeTimer: 0.8,
      slowTimer: 0,
      burnTimer: 0,
      isElite,
    });
  } else if (type === "WEAVER") {
    const baseHp = 68 * waveScale;
    enemies.push({
      type,
      x,
      y,
      vx: 0,
      vy: 0,
      radius: 20,
      hp: baseHp,
      maxHp: baseHp,
      shield: baseHp * shieldMult,
      maxShield: baseHp * shieldMult,
      speed: 140,
      color: "#bc13fe",
      score: 260,
      angle: 0,
      spin: 2.6,
      shootTimer: 1.4 + Math.random(),
      slowTimer: 0,
      burnTimer: 0,
      isElite,
    });
  } else if (type === "SPLITTER") {
    const baseHp = 92 * waveScale;
    enemies.push({
      type,
      x,
      y,
      vx: 0,
      vy: 0,
      radius: 23,
      hp: baseHp,
      maxHp: baseHp,
      shield: baseHp * shieldMult,
      maxShield: baseHp * shieldMult,
      speed: 145,
      color: "#fcee09",
      score: 310,
      angle: 0,
      spin: 3.2,
      slowTimer: 0,
      burnTimer: 0,
      isElite,
    });
  } else if (type === "MINI_SWARM") {
    const baseHp = 22 * waveScale;
    enemies.push({
      type,
      x,
      y,
      vx: (Math.random() - 0.5) * 260,
      vy: (Math.random() - 0.5) * 260,
      radius: 10,
      hp: baseHp,
      maxHp: baseHp,
      shield: 0,
      maxShield: 0,
      speed: 285,
      color: "#00ffaa",
      score: 85,
      angle: 0,
      spin: 9.0,
      slowTimer: 0,
      burnTimer: 0,
      isElite: false,
    });
  } else if (type === "JUGGERNAUT") {
    const baseHp = 175 * waveScale;
    enemies.push({
      type,
      x,
      y,
      vx: 0,
      vy: 0,
      radius: 27,
      hp: baseHp,
      maxHp: baseHp,
      shield: baseHp * 0.4,
      maxShield: baseHp * 0.4,
      speed: 108,
      color: "#00f3ff",
      score: 460,
      angle: Math.atan2(player.y - y, player.x - x),
      spin: 0,
      shootTimer: 2.2,
      slowTimer: 0,
      burnTimer: 0,
      isElite: true,
    });
  } else if (type === "PHANTOM") {
    const baseHp = 82 * waveScale;
    enemies.push({
      type,
      x,
      y,
      vx: 0,
      vy: 0,
      radius: 18,
      hp: baseHp,
      maxHp: baseHp,
      shield: baseHp * 0.5,
      maxShield: baseHp * 0.5,
      speed: 110,
      color: "#ff2a85",
      score: 380,
      angle: 0,
      spin: 4.0,
      shootTimer: 2.2,
      teleportTimer: 3.5,
      aiming: false,
      slowTimer: 0,
      burnTimer: 0,
      isElite: true,
    });
  } else if (type === "GUARDIAN") {
    const baseHp = 135 * waveScale;
    enemies.push({
      type,
      x,
      y,
      vx: 0,
      vy: 0,
      radius: 22,
      hp: baseHp,
      maxHp: baseHp,
      shield: baseHp * 0.6,
      maxShield: baseHp * 0.6,
      speed: 85,
      color: "#38bdf8",
      score: 420,
      angle: 0,
      spin: 1.8,
      pulseTimer: 1.6,
      slowTimer: 0,
      burnTimer: 0,
      isElite: true,
    });
  } else if (type === "BOSS") {
    state.bossActive = true;
    const bossIndex = Math.floor((state.wave / 3 - 1) % 4);
    const bossProfiles = [
      {
        subtype: "ARCHON",
        name: "OMEGA ARCHON // SINGULARITA",
        color: "#ff0055",
        hpMult: 1.0,
        radius: 56,
      },
      {
        subtype: "SERAPH",
        name: "CHRONO SERAPH // VALKÝRA",
        color: "#fcee09",
        hpMult: 0.92,
        radius: 52,
      },
      {
        subtype: "HYDRA",
        name: "NEXUS HYDRA // TRI-CORE MATRIX",
        color: "#00ffaa",
        hpMult: 1.15,
        radius: 58,
      },
      {
        subtype: "LEVIATHAN",
        name: "VOID LEVIATHAN // KYBER-HAD",
        color: "#bc13fe",
        hpMult: 1.25,
        radius: 54,
      },
    ];
    const profile = bossProfiles[bossIndex];
    const bossHp = 2100 * waveScale * profile.hpMult;

    const bossObj = {
      type: "BOSS",
      subtype: profile.subtype,
      name: profile.name,
      x: W / 2,
      y: 130,
      vx: 0,
      vy: 0,
      radius: profile.radius,
      hp: bossHp,
      maxHp: bossHp,
      shield: bossHp * 0.25,
      maxShield: bossHp * 0.25,
      speed: 115,
      color: profile.color,
      score: 6500,
      angle: 0,
      spin: 1.3,
      shootTimer: 1.1,
      phaseTimer: 0,
      slowTimer: 0,
      burnTimer: 0,
      isElite: true,
      segments: [],
    };

    if (profile.subtype === "LEVIATHAN") {
      for (let s = 0; s < 8; s++)
        bossObj.segments.push({
          x: W / 2,
          y: 130 - s * 28,
          angle: Math.PI / 2,
        });
    }

    enemies.push(bossObj);
    document.getElementById("boss-name").textContent = profile.name;
    document.getElementById("boss-hud").classList.remove("hidden");
    document.getElementById("boss-hud").classList.add("flex");
    document.getElementById("ghost-boss-bar-wrap").classList.remove("hidden");
    document.getElementById("ghost-boss-bar-wrap").classList.add("flex");
    addFloatingText(
      W / 2,
      H / 2 - 80,
      `VAROVÁNÍ: ${profile.name}!`,
      profile.color,
      1.45,
    );
    spawnShockwave(W / 2, 130, 460, profile.color, 6, 520);
    spawnLensFlare(W / 2, 130, profile.color, 700);
    grid.applyForce(W / 2, 130, 440, 70, false, true);
    state.chromatic = 1.0;
  }

  spawnShockwave(x, y, 48, "#ffffff", 2, 260);
  grid.applyForce(x, y, 110, 14, false);
}

function triggerQuantumOverdrive() {
  if (
    state.mode !== "PLAYING" ||
    state.overdrive < 100 ||
    state.overdriveTimer > 0
  )
    return;
  state.overdrive = 0;
  state.overdriveTimer = 5.5 + (meta.upgrades.overdriveLvl || 0) * 0.8;
  state.chromatic = 0.85;
  unlockAchievement("overdrive_use");
  sfx.playLevelUp();
  spawnShockwave(player.x, player.y, 520, "#fcee09", 6, 700);
  spawnLensFlare(player.x, player.y, "#fcee09", 650);
  grid.applyForce(player.x, player.y, 480, 75, false, true);
  addFloatingText(
    player.x,
    player.y - 38,
    "⚡ KVANTOVÝ PŘETLAK: ČAS ZPOMALEN & 2x PALBA!",
    "#fcee09",
    1.4,
  );
  state.shake = 14;
  updateHUD();
}

function firePhotonBoomerangs() {
  const count = player.weapons.boomerangLvl;
  const isSupernova = player.weapons.flamethrowerLvl > 0;
  for (let i = 0; i < count; i++) {
    const a = player.angle + (i - (count - 1) / 2) * 0.4;
    boomerangs.push({
      x: player.x,
      y: player.y,
      vx: Math.cos(a) * 680,
      vy: Math.sin(a) * 680,
      returning: false,
      spinAngle: 0,
      life: 2.2,
      isSupernova,
      dmg:
        (52 + player.weapons.boomerangLvl * 20) *
        player.dmgMult *
        (isSupernova ? 1.35 : 1.0),
      color: isSupernova ? "#ff6600" : "#00ffaa",
    });
  }
  sfx.playLaser(0.75);
}

function dropQuantumMine() {
  mines.push({
    x: player.x,
    y: player.y,
    radius: 14,
    triggerRadius: 95 + player.weapons.minesLvl * 15,
    blastRadius: 145 + player.weapons.minesLvl * 20,
    dmg: (110 + player.weapons.minesLvl * 40) * player.dmgMult,
    pulse: 0,
    life: 14.0,
  });
  meta.stats.minesDropped = (meta.stats.minesDropped || 0) + 1;
  if (meta.stats.minesDropped >= 20) unlockAchievement("mine_master");
}

function triggerKineticShockwave(
  customRadius = null,
  customDmg = null,
  customCol = "#38bdf8",
) {
  const radius = customRadius || 210 + player.weapons.shockwaveLvl * 45;
  spawnShockwave(player.x, player.y, radius, customCol, 4.5, 580);
  grid.applyForce(player.x, player.y, radius, 42, false, true);

  for (const e of enemies) {
    const dx = e.x - player.x;
    const dy = e.y - player.y;
    const d = Math.hypot(dx, dy) || 1;
    if (d <= radius) {
      const push = (1 - d / radius) * (e.type === "BOSS" ? 35 : 165);
      e.x += (dx / d) * push;
      e.y += (dy / d) * push;
      const dmg =
        customDmg || (35 + player.weapons.shockwaveLvl * 18) * player.dmgMult;
      damageEnemy(e, dmg, customCol, true);
    }
  }
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    if (
      Math.hypot(enemyBullets[i].x - player.x, enemyBullets[i].y - player.y) <=
      radius * 0.85
    ) {
      enemyBullets.splice(i, 1);
    }
  }
}

function updateFlamethrower(dt) {
  if (player.weapons.flamethrowerLvl <= 0 || enemies.length === 0) return;
  const range = 195 + player.weapons.flamethrowerLvl * 28;
  const coneHalfAngle = 0.42;

  for (let i = 0; i < 3; i++) {
    const a = player.angle + (Math.random() - 0.5) * coneHalfAngle * 1.8;
    const spd = 280 + Math.random() * 240;
    const cols = ["#ff3300", "#ff8800", "#fcee09"];
    particles.push({
      x: player.x + Math.cos(player.angle) * 18,
      y: player.y + Math.sin(player.angle) * 18,
      vx: Math.cos(a) * spd,
      vy: Math.sin(a) * spd,
      color: cols[Math.floor(Math.random() * cols.length)],
      size: 3.5 + Math.random() * 2.5,
      life: 0.28 + Math.random() * 0.16,
      maxLife: 0.42,
      drag: 0.92,
    });
  }

  player.flameTickTimer -= dt;
  if (player.flameTickTimer <= 0) {
    player.flameTickTimer = 0.09;
    const dmg = (11 + player.weapons.flamethrowerLvl * 5.5) * player.dmgMult;

    for (const e of enemies) {
      const dx = e.x - player.x;
      const dy = e.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= range + e.radius) {
        const angleToEnemy = Math.atan2(dy, dx);
        const diff = Math.abs(
          Math.atan2(
            Math.sin(angleToEnemy - player.angle),
            Math.cos(angleToEnemy - player.angle),
          ),
        );
        if (diff <= coneHalfAngle) {
          if (!e.burnTimer || e.burnTimer <= 0) {
            meta.stats.burnedCount = (meta.stats.burnedCount || 0) + 1;
            if (meta.stats.burnedCount >= 15) unlockAchievement("pyromancer");
          }
          e.burnTimer = 2.6;
          damageEnemy(e, dmg, "#ff6600", true);
        }
      }
    }
  }
}

function triggerOrbitalSatelliteLock(overrideTarget = null) {
  if (enemies.length === 0 && !overrideTarget) return;
  let target = overrideTarget || enemies[0];
  if (!overrideTarget) {
    for (const e of enemies) {
      if (e.hp > target.hp) target = e;
    }
  }
  const radius = 125 + player.weapons.satelliteLvl * 20;
  orbitalStrikes.push({
    x: target.x,
    y: target.y,
    targetRef: target,
    radius,
    phase: "LOCK",
    timer: 0.75,
    maxTimer: 0.75,
    beamLife: 0.45,
    dmg:
      (165 + player.weapons.satelliteLvl * 75 + player.level * 10) *
      player.dmgMult,
  });
}

function firePrimaryWeapons() {
  const barrels = player.weapons.barrels;
  const spread = 0.105;
  const baseAngle = player.angle;
  const isBassShot =
    (sfx.beatPulse || 0) > 0.45 || (sfx.bassEnergy || 0) > 0.65;
  const bassDmgMult = isBassShot ? 1.25 : 1.0;

  for (let i = 0; i < barrels; i++) {
    const offsetIndex = i - (barrels - 1) / 2;
    const a = baseAngle + offsetIndex * spread;
    const muzzleX = player.x + Math.cos(a) * 18;
    const muzzleY = player.y + Math.sin(a) * 18;

    bullets.push({
      x: muzzleX,
      y: muzzleY,
      px: muzzleX,
      py: muzzleY,
      vx: Math.cos(a) * 940,
      vy: Math.sin(a) * 940,
      dmg: (24 + player.level * 3.2) * player.dmgMult * bassDmgMult,
      bounces: player.weapons.ricochetLvl,
      pierce: Math.floor(player.weapons.ricochetLvl / 2),
      bassBoosted: isBassShot,
      color:
        state.overdriveTimer > 0
          ? "#fcee09"
          : isBassShot
            ? "#ff007f"
            : player.weapons.ricochetLvl > 0
              ? "#00ffaa"
              : player.color,
      life: 1.35,
    });
  }

  grid.applyForce(
    player.x + Math.cos(baseAngle) * 24,
    player.y + Math.sin(baseAngle) * 24,
    75,
    5.5,
    false,
  );
  sfx.playLaser(
    state.overdriveTimer > 0
      ? 1.25
      : isBassShot
        ? 1.12
        : 0.95 + Math.random() * 0.15,
  );
}

function fireQuantumRailgun() {
  const a = player.angle;
  const len = Math.hypot(W, H);
  const x2 = player.x + Math.cos(a) * len;
  const y2 = player.y + Math.sin(a) * len;

  railBeams.push({
    x1: player.x,
    y1: player.y,
    x2,
    y2,
    color: "#ff0055",
    life: 0.28,
    maxLife: 0.28,
  });
  sfx.playRailgun();
  state.shake = Math.max(state.shake, 9);
  state.chromatic = Math.max(state.chromatic, 0.45);
  spawnLensFlare(player.x, player.y, "#ff0055", 420);

  for (let d = 60; d < 900; d += 90) {
    const gx = player.x + Math.cos(a) * d;
    const gy = player.y + Math.sin(a) * d;
    if (gx > 0 && gx < W && gy > 0 && gy < H)
      grid.applyForce(gx, gy, 130, 24, false, true);
  }

  const dx = Math.cos(a);
  const dy = Math.sin(a);
  const dmg =
    (95 + player.weapons.railgunLvl * 45 + player.level * 6) * player.dmgMult;

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    const ex = e.x - player.x;
    const ey = e.y - player.y;
    const proj = ex * dx + ey * dy;
    if (proj > 0) {
      const perpDist = Math.abs(ex * dy - ey * dx);
      if (perpDist < e.radius + 16) {
        damageEnemy(e, dmg, "#ff0055", true);
        spawnShockwave(e.x, e.y, 75, "#ff0055", 3, 420);
      }
    }
  }
}

function fireDroneProjectiles() {
  const count = player.weapons.dronesLvl;
  const orbitR = 44;
  const hasStormSynergy = player.weapons.teslaLvl > 0;
  for (let i = 0; i < count; i++) {
    const da = player.droneAngle + (i * Math.PI * 2) / count;
    const dx = player.x + Math.cos(da) * orbitR;
    const dy = player.y + Math.sin(da) * orbitR;

    let nearest = null;
    let bestD = Infinity;
    for (const e of enemies) {
      const dist = Math.hypot(e.x - dx, e.y - dy);
      if (dist < bestD) {
        bestD = dist;
        nearest = e;
      }
    }
    const aimA = nearest
      ? Math.atan2(nearest.y - dy, nearest.x - dx)
      : player.angle;
    bullets.push({
      x: dx,
      y: dy,
      px: dx,
      py: dy,
      vx: Math.cos(aimA) * 860,
      vy: Math.sin(aimA) * 860,
      dmg: (18 + player.level * 2) * player.dmgMult,
      bounces: 0,
      pierce: 0,
      stormArc: hasStormSynergy,
      color: hasStormSynergy ? "#5ffbff" : "#38bdf8",
      life: 1.1,
    });
  }
}

function triggerCryoNova() {
  const radius = 260 + player.weapons.cryoNovaLvl * 45;
  spawnShockwave(player.x, player.y, radius, "#67e8f9", 5, 520);
  grid.applyForce(player.x, player.y, radius, 26, false);

  for (const e of enemies) {
    if (Math.hypot(e.x - player.x, e.y - player.y) <= radius) {
      e.slowTimer = 3.2;
      damageEnemy(
        e,
        (28 + player.weapons.cryoNovaLvl * 14) * player.dmgMult,
        "#67e8f9",
      );
    }
  }
}

function fireHomingMissiles() {
  const count = 1 + player.weapons.missilesLvl;
  for (let i = 0; i < count; i++) {
    const a = player.angle + (i - (count - 1) / 2) * 0.45;
    missiles.push({
      x: player.x,
      y: player.y,
      vx: Math.cos(a) * 320,
      vy: Math.sin(a) * 320,
      speed: 550,
      dmg: (46 + player.weapons.missilesLvl * 16) * player.dmgMult,
      life: 3.0,
      color: "#ff007f",
    });
  }
}

function fireSwarmNanobots() {
  const count = 2 + player.weapons.swarmBotsLvl;
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    missiles.push({
      x: player.x,
      y: player.y,
      vx: Math.cos(a) * 420,
      vy: Math.sin(a) * 420,
      speed: 680,
      dmg: (28 + player.weapons.swarmBotsLvl * 12) * player.dmgMult,
      life: 2.5,
      color: "#a3e635",
    });
  }
}

function fireGravityCannon() {
  const a = player.angle;
  bullets.push({
    x: player.x + Math.cos(a) * 20,
    y: player.y + Math.sin(a) * 20,
    px: player.x,
    py: player.y,
    vx: Math.cos(a) * 460,
    vy: Math.sin(a) * 460,
    dmg: (75 + player.weapons.gravCannonLvl * 35) * player.dmgMult,
    bounces: 0,
    pierce: 2,
    radius: 7,
    gravImplode: true,
    color: "#c084fc",
    life: 1.8,
  });
}

function fireTeslaLightning(
  originX = player.x,
  originY = player.y,
  maxTargetsOverride = null,
) {
  if (enemies.length === 0) return;
  const maxTargets = maxTargetsOverride || 2 + player.weapons.teslaLvl * 2;
  const range = 290;
  let currX = originX;
  let currY = originY;
  const hitSet = new Set();

  for (let step = 0; step < maxTargets; step++) {
    let nearest = null;
    let minDist = range;
    for (const e of enemies) {
      if (hitSet.has(e)) continue;
      const d = Math.hypot(e.x - currX, e.y - currY);
      if (d < minDist) {
        minDist = d;
        nearest = e;
      }
    }
    if (!nearest) break;

    hitSet.add(nearest);
    grid.applyForce(nearest.x, nearest.y, 90, 12, false, true);
    damageEnemy(
      nearest,
      (38 + player.weapons.teslaLvl * 14) * player.dmgMult,
      "#5ffbff",
      true,
    );
    lightningArcs.push({
      x1: currX,
      y1: currY,
      x2: nearest.x,
      y2: nearest.y,
      life: 0.18,
      color: "#5ffbff",
    });
    currX = nearest.x;
    currY = nearest.y;
  }
}

function triggerHyperDash() {
  if (state.mode !== "PLAYING" || player.dashCooldown > 0) return;
  player.dashCooldown = player.dashMaxCooldown;
  player.invulnTimer = 0.45;

  let dx = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
  let dy = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
  let dashAngle = player.angle;
  if (dx !== 0 || dy !== 0) dashAngle = Math.atan2(dy, dx);

  const dashDist = 185;
  const steps = 7;
  for (let i = 1; i <= steps; i++) {
    const ix = player.x + Math.cos(dashAngle) * (dashDist * (i / steps));
    const iy = player.y + Math.sin(dashAngle) * (dashDist * (i / steps));
    player.afterimages.push({ x: ix, y: iy, angle: player.angle, alpha: 0.85 });
    if (player.weapons.plasmaTrailLvl > 0 && i % 2 === 0) {
      plasmaPools.push({
        x: ix,
        y: iy,
        radius: 34,
        dmg: (65 + player.weapons.plasmaTrailLvl * 25) * player.dmgMult,
        life: 2.2,
        maxLife: 2.2,
      });
    }
  }

  player.x = Math.max(
    25,
    Math.min(W - 25, player.x + Math.cos(dashAngle) * dashDist),
  );
  player.y = Math.max(
    25,
    Math.min(H - 25, player.y + Math.sin(dashAngle) * dashDist),
  );

  sfx.playDash();
  spawnShockwave(player.x, player.y, 185, player.color, 4, 520);
  spawnParticles(player.x, player.y, player.color, 28, 120, 420, 2.8);
  grid.applyForce(player.x, player.y, 240, 42, false, true);
  state.shake = Math.max(state.shake, 7);
}

function deploySingularityBomb() {
  if (state.mode !== "PLAYING" || player.bombs <= 0) return;
  player.bombs--;
  meta.stats.blackHolesUsed = (meta.stats.blackHolesUsed || 0) + 1;
  if (meta.stats.blackHolesUsed >= 5) unlockAchievement("black_hole_5");
  updateHUD();

  const amp = 1 + (player.weapons.gravityAmpLvl || 0) * 0.35;
  const isStarSingularity =
    player.weapons.satelliteLvl > 0 && player.weapons.gravityAmpLvl > 0;
  const dist = Math.min(
    280,
    Math.hypot(mouse.x - player.x, mouse.y - player.y),
  );
  const a = Math.atan2(mouse.y - player.y, mouse.x - player.x);
  const sx = Math.max(80, Math.min(W - 80, player.x + Math.cos(a) * dist));
  const sy = Math.max(80, Math.min(H - 80, player.y + Math.sin(a) * dist));

  singularities.push({
    x: sx,
    y: sy,
    radius: 36 * amp,
    pullRadius: 430 * amp,
    amp,
    isStarSingularity,
    strikeTimer: 0.45,
    life: 2.5,
    maxLife: 2.5,
    angle: 0,
  });
  sfx.playSingularity();
  spawnLensFlare(sx, sy, isStarSingularity ? "#fcee09" : "#ff007f", 520);
  addFloatingText(
    sx,
    sy - 40,
    isStarSingularity ? "🌟 HVĚZDNÁ SINGULARITA!" : "KVANTOVÁ ČERNÁ DÍRA!",
    isStarSingularity ? "#fcee09" : "#ff007f",
    1.35,
  );
  state.shake = 12;
  state.chromatic = 0.9;
}

function damageEnemy(
  e,
  dmg,
  hitColor = "#00f3ff",
  shieldBonus = false,
  fromBoomerang = false,
) {
  let finalDmg = dmg;
  if (player.weapons.phaseMeltLvl > 0 && (e.isElite || e.type === "BOSS")) {
    finalDmg *= 1 + player.weapons.phaseMeltLvl * 0.25;
  }

  let isCrit = false;
  const totalCritChance =
    (player.weapons.critLvl || 0) * 0.14 +
    (meta.upgrades.critShopLvl || 0) * 0.06;
  if (totalCritChance > 0 && Math.random() < totalCritChance) {
    finalDmg *= 2.4;
    isCrit = true;
    hitColor = "#fcee09";
  }

  if (e.shield && e.shield > 0) {
    const shieldDmg = shieldBonus ? finalDmg * 1.6 : finalDmg;
    if (e.shield >= shieldDmg) {
      e.shield -= shieldDmg;
      spawnParticles(e.x, e.y, "#38bdf8", 4, 60, 200, 2.0, 0.12, 0.25);
      return;
    } else {
      const leftover = shieldDmg - e.shield;
      e.shield = 0;
      e.hp -= leftover;
      spawnShockwave(e.x, e.y, e.radius * 2.2, "#38bdf8", 2.5, 360);
    }
  } else {
    e.hp -= finalDmg;
  }

  if (isCrit && Math.random() < 0.35) {
    addFloatingText(
      e.x,
      e.y - 18,
      `KRIT ${Math.floor(finalDmg)}!`,
      "#fcee09",
      0.95,
    );
  }
  spawnParticles(e.x, e.y, hitColor, 4, 60, 240, 2.0, 0.15, 0.32);

  if (e.hp <= 0 && !e.dead) {
    e.dead = true;
    unlockAchievement("first_blood");
    if (fromBoomerang) {
      meta.stats.boomerangKills = (meta.stats.boomerangKills || 0) + 1;
      if (meta.stats.boomerangKills >= 25) unlockAchievement("boomerang_pro");
    }

    state.combo = Math.min(20.0, +(state.combo + 0.25).toFixed(2));
    if (state.combo > state.maxCombo) state.maxCombo = state.combo;
    if (state.combo >= 10.0) unlockAchievement("combo_10");
    if (state.combo >= 20.0) unlockAchievement("combo_20");
    state.comboTimer = 3.8;

    if (state.overdriveTimer <= 0) {
      state.overdrive = Math.min(
        100,
        state.overdrive + (e.type === "BOSS" ? 40 : e.isElite ? 8 : 4.5),
      );
    }

    const gainedScore = Math.floor(e.score * state.combo);
    state.score += gainedScore;
    if (state.score >= 100000) unlockAchievement("score_100k");
    if (state.score >= 500000) unlockAchievement("score_500k");

    const isBoss = e.type === "BOSS";
    const pCount = isBoss ? 160 : 32;
    spawnParticles(
      e.x,
      e.y,
      e.color,
      pCount,
      90,
      isBoss ? 680 : 450,
      isBoss ? 4.0 : 2.8,
    );
    spawnParticles(
      e.x,
      e.y,
      "#ffffff",
      Math.floor(pCount * 0.35),
      120,
      520,
      2.2,
    );
    spawnShockwave(
      e.x,
      e.y,
      isBoss ? 540 : 125,
      e.color,
      isBoss ? 7 : 3.5,
      isBoss ? 620 : 420,
    );
    if (isBoss || e.isElite)
      spawnLensFlare(e.x, e.y, e.color, isBoss ? 800 : 340);
    grid.applyForce(
      e.x,
      e.y,
      isBoss ? 480 : 195,
      isBoss ? 85 : 28,
      false,
      isBoss,
    );

    state.shake = Math.max(state.shake, isBoss ? 25 : 6.5);
    if (isBoss) state.chromatic = 1.0;
    sfx.playExplosion(isBoss ? 2.4 : 1.0);

    const shardHunterBonus = meta.upgrades.shardHunterLvl || 0;
    if (isBoss) {
      unlockAchievement("boss_slayer");
      const rewardShards = 8 + shardHunterBonus * 2;
      meta.shards += rewardShards;
      saveMetaProgression();
      addFloatingText(
        e.x,
        e.y - 55,
        `+${rewardShards} ◈ KVANTOVÝCH ČIPŮ!`,
        "#fcee09",
        1.4,
      );
    } else if (e.isElite && Math.random() < 0.35 + shardHunterBonus * 0.1) {
      meta.shards += 1;
      saveMetaProgression();
      addFloatingText(e.x, e.y - 22, "+1 ◈ ČIP", "#fcee09", 1.05);
    }

    if (player.weapons.critLvl > 0 && (e.isElite || isBoss)) {
      const heal = isBoss ? 25 : 4;
      player.hp = Math.min(player.maxHp, player.hp + heal);
    }

    if (e.type === "SPLITTER") {
      for (let k = 0; k < 3; k++) {
        spawnEnemy(
          "MINI_SWARM",
          e.x + (Math.random() - 0.5) * 24,
          e.y + (Math.random() - 0.5) * 24,
        );
      }
    }

    if (isBoss) {
      state.bossActive = false;
      document.getElementById("boss-hud").classList.add("hidden");
      document.getElementById("boss-hud").classList.remove("flex");
      document.getElementById("ghost-boss-bar-wrap").classList.add("hidden");
      document.getElementById("ghost-boss-bar-wrap").classList.remove("flex");
      player.bombs = Math.min(player.maxBombs, player.bombs + 1);
      addFloatingText(
        e.x,
        e.y - 30,
        `${e.name} ZNIČEN! +1 ČERNÁ DÍRA`,
        "#fcee09",
        1.45,
      );
      saveGameProgress(true, currentSaveSlot);
    }

    const gemCount = isBoss ? 20 : e.isElite ? 4 : 2;
    const xpBonus = 1 + meta.upgrades.magnetLvl * 0.12;
    for (let g = 0; g < gemCount; g++) {
      const ga = Math.random() * Math.PI * 2;
      const gs = 60 + Math.random() * 140;
      gems.push({
        x: e.x,
        y: e.y,
        vx: Math.cos(ga) * gs,
        vy: Math.sin(ga) * gs,
        val: Math.round((isBoss ? 20 : 13) * xpBonus),
        angle: Math.random() * 6,
        magnetized: false,
      });
    }
  }
}

function damagePlayer(amount) {
  if (player.invulnTimer > 0 || state.mode !== "PLAYING") return;

  if (player.weapons.aegisLvl > 0 && player.aegisReady) {
    player.aegisReady = false;
    player.aegisCooldown = Math.max(4.5, 11.0 - player.weapons.aegisLvl * 1.8);
    player.invulnTimer = 0.9;
    state.chromatic = 0.65;
    spawnShockwave(player.x, player.y, 290, "#60a5fa", 6, 580);
    spawnLensFlare(player.x, player.y, "#60a5fa", 480);
    grid.applyForce(player.x, player.y, 320, 55, false, true);
    addFloatingText(
      player.x,
      player.y - 28,
      "AEGIS ŠTÍT POHLTIL ZÁSAH!",
      "#60a5fa",
      1.25,
    );
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      if (
        Math.hypot(enemyBullets[i].x - player.x, enemyBullets[i].y - player.y) <
        260
      ) {
        enemyBullets.splice(i, 1);
      }
    }
    updateHUD();
    return;
  }

  player.hp -= amount;
  player.invulnTimer = 0.85;
  state.combo = Math.max(1.0, +(state.combo * 0.55).toFixed(1));
  state.shake = 18;
  state.chromatic = 1.0;

  sfx.playExplosion(1.7);
  spawnShockwave(player.x, player.y, 260, "#ff0055", 5, 550);
  spawnParticles(player.x, player.y, "#ff0055", 45, 120, 480, 3.2);
  grid.applyForce(player.x, player.y, 320, 52, false, true);
  addFloatingText(
    player.x,
    player.y - 25,
    `-${Math.floor(amount)} TRUP!`,
    "#ff0055",
    1.25,
  );

  updateHUD();
  if (player.hp <= 0) triggerGameOver();
}

function startNewGame() {
  clearSavedGame(currentSaveSlot);
  sfx.init();
  if (sfx.ctx && sfx.ctx.state === "suspended") sfx.ctx.resume();

  bullets.length = 0;
  missiles.length = 0;
  boomerangs.length = 0;
  mines.length = 0;
  railBeams.length = 0;
  plasmaPools.length = 0;
  orbitalStrikes.length = 0;
  wormholes.length = 0;
  lensFlares.length = 0;
  enemyBullets.length = 0;
  enemies.length = 0;
  singularities.length = 0;
  gems.length = 0;
  supplyPods.length = 0;
  particles.length = 0;
  shockwaves.length = 0;
  lightningArcs.length = 0;
  floatingTexts.length = 0;

  const chosenShip =
    SHIP_CLASSES.find((s) => s.id === meta.selectedShip) || SHIP_CLASSES[0];
  player.shipClass = chosenShip.id;
  player.color = chosenShip.color;
  player.x = W / 2;
  player.y = H / 2;
  player.vx = 0;
  player.vy = 0;
  player.maxHp = chosenShip.hp + (meta.upgrades.hullLvl || 0) * 25;
  player.hp = player.maxHp;
  player.xp = 0;
  player.xpNext = 95;
  player.level = 1;
  player.speed = chosenShip.speed;
  player.dmgMult = 1 + (meta.upgrades.dmgLvl || 0) * 0.12;
  const dashCdMult = 1 - (meta.upgrades.dashCdLvl || 0) * 0.08;
  player.dashMaxCooldown = Math.max(0.45, chosenShip.dashCd * dashCdMult);
  player.dashCooldown = 0;
  player.portalCooldown = 0;
  player.maxBombs = 5 + (meta.upgrades.novaLvl || 0);
  player.bombs = chosenShip.bombs + (meta.upgrades.novaLvl || 0);
  player.invulnTimer = 1.2;
  player.unlockedSynergies = {};
  player.weapons = {
    solarHaloLvl: 0,
    swarmBotsLvl: 0,
    gravCannonLvl: 0,
    phaseMeltLvl: 0,
    ...chosenShip.initWeapons,
  };
  player.aegisReady = player.weapons.aegisLvl > 0;
  player.aegisCooldown = 0;

  document.getElementById("ship-hud-name").textContent = chosenShip.name;

  state.score = 0;
  state.combo = 1.0;
  state.maxCombo = 1.0;
  state.wave = 1;
  state.enemiesToSpawn = 10;
  state.spawnCooldown = 0.5;
  state.bossActive = false;
  state.overdrive = (meta.upgrades.overdriveLvl || 0) * 25;
  state.overdriveTimer = 0;
  state.supplyTimer = 15;
  state.wormholeTimer = 45;
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

  updateHUD();
  spawnShockwave(player.x, player.y, 380, player.color, 5, 580);
  spawnLensFlare(player.x, player.y, player.color, 550);
  grid.applyForce(player.x, player.y, 350, 45, false, true);
  addFloatingText(
    player.x,
    player.y - 40,
    `${chosenShip.name} // SLOT #${currentSaveSlot}`,
    player.color,
    1.35,
  );
}

function triggerGameOver() {
  state.mode = "GAMEOVER";
  clearSavedGame(currentSaveSlot);
  syncHudVisibilityDOM();
  document.getElementById("go-score").textContent = Math.floor(
    state.score,
  ).toLocaleString("cs-CZ");
  document.getElementById("go-best").textContent =
    state.bestScore.toLocaleString("cs-CZ");
  document.getElementById("go-wave").textContent = `VLNA ${state.wave}`;
  document.getElementById("go-shards").textContent = `◈ ${meta.shards}`;

  setTimeout(() => {
    if (state.mode === "GAMEOVER") {
      document.getElementById("gameover-modal").classList.remove("hidden");
      document.getElementById("gameover-modal").classList.add("flex");
    }
  }, 650);
}

// PODPORA PRO GAMEPAD (XBOX / PLAYSTATION OVLADAČ)
let gamepadDashLock = false;
let gamepadBombLock = false;
let gamepadOverdriveLock = false;

function pollGamepadInput() {
  if (!navigator.getGamepads) return { moveX: 0, moveY: 0 };
  const pads = navigator.getGamepads();
  const gp = pads[0] || pads[1] || pads[2] || pads[3];
  if (!gp) return { moveX: 0, moveY: 0 };

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
  }

  // L1/LB nebo A (0) nebo RT (7) -> Hyper-Skok
  const dashPressed =
    (gp.buttons[0] && gp.buttons[0].pressed) ||
    (gp.buttons[4] && gp.buttons[4].pressed) ||
    (gp.buttons[7] && gp.buttons[7].pressed);
  if (dashPressed && !gamepadDashLock) {
    triggerHyperDash();
    gamepadDashLock = true;
  } else if (!dashPressed) {
    gamepadDashLock = false;
  }

  // R1/RB nebo B (1) nebo LT (6) -> Černá díra
  const bombPressed =
    (gp.buttons[1] && gp.buttons[1].pressed) ||
    (gp.buttons[5] && gp.buttons[5].pressed) ||
    (gp.buttons[6] && gp.buttons[6].pressed);
  if (bombPressed && !gamepadBombLock) {
    deploySingularityBomb();
    gamepadBombLock = true;
  } else if (!bombPressed) {
    gamepadBombLock = false;
  }

  // Y (3) nebo X (2) -> Kvantový Přetlak [F]
  const odPressed =
    (gp.buttons[2] && gp.buttons[2].pressed) ||
    (gp.buttons[3] && gp.buttons[3].pressed);
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
  sfx.updateAudioAnalysis(dt);
  grid.update();
  spaceBg.update(dt, player.vx, player.vy, W, H);

  if (sfx.justBeat && state.mode === "PLAYING") {
    grid.triggerBeatWave(player.x, player.y, 1.15);
    spawnShockwave(player.x, player.y, 85, player.color, 2.2, 460);

    if (sfx.justBarDrop) {
      triggerKineticShockwave(175, 22 * player.dmgMult, "#ff007f");
      state.chromatic = Math.max(state.chromatic, 0.25);
    }

    for (const e of enemies) {
      if (e.type === "BOSS") {
        grid.applyForce(e.x, e.y, 280, 22, false, true);
      }
    }
  }

  if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 28);
  if (state.chromatic > 0)
    state.chromatic = Math.max(0, state.chromatic - dt * 2.4);
  if (state.mode !== "PLAYING") return;

  if (player.portalCooldown > 0) player.portalCooldown -= dt;

  if (player.weapons.regenLvl > 0 && player.hp < player.maxHp) {
    player.hp = Math.min(
      player.maxHp,
      player.hp + player.weapons.regenLvl * 3.5 * dt,
    );
    if (Math.random() < 0.25) updateHUD();
  }

  // Sluneční Aura (Solar Halo)
  if (player.weapons.solarHaloLvl > 0) {
    const haloR = 95 + player.weapons.solarHaloLvl * 28;
    player.solarHaloTimer -= dt;
    if (player.solarHaloTimer <= 0) {
      player.solarHaloTimer = 0.15;
      for (const e of enemies) {
        if (Math.hypot(e.x - player.x, e.y - player.y) <= haloR + e.radius) {
          e.burnTimer = 2.0;
          e.slowTimer = Math.max(e.slowTimer || 0, 0.6);
          damageEnemy(
            e,
            (14 + player.weapons.solarHaloLvl * 8) * player.dmgMult,
            "#fb923c",
          );
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

  // Vzácné Červí díry (jednou za ~50 sekund od 2. vlny)
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
      if (
        Math.hypot(player.x - wh.x1, player.y - wh.y1) <
        wh.radius + player.radius
      ) {
        player.x = wh.x2;
        player.y = wh.y2;
        player.portalCooldown = 1.6;
        player.invulnTimer = Math.max(player.invulnTimer, 0.6);
        unlockAchievement("wormhole_rider");
        sfx.playDash();
        spawnShockwave(wh.x2, wh.y2, 220, "#ff6600", 4, 520);
        addFloatingText(
          wh.x2,
          wh.y2 - 30,
          "🌀 HYPER-TELEPORT!",
          "#ff6600",
          1.25,
        );
      } else if (
        Math.hypot(player.x - wh.x2, player.y - wh.y2) <
        wh.radius + player.radius
      ) {
        player.x = wh.x1;
        player.y = wh.y1;
        player.portalCooldown = 1.6;
        player.invulnTimer = Math.max(player.invulnTimer, 0.6);
        unlockAchievement("wormhole_rider");
        sfx.playDash();
        spawnShockwave(wh.x1, wh.y1, 220, "#00f3ff", 4, 520);
        addFloatingText(
          wh.x1,
          wh.y1 - 30,
          "🌀 HYPER-TELEPORT!",
          "#00f3ff",
          1.25,
        );
      }
    }

    if (wh.life <= 0) wormholes.splice(i, 1);
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
      addFloatingText(
        player.x,
        player.y - 25,
        "AEGIS ŠTÍT NABIT!",
        "#60a5fa",
        1.05,
      );
    }
    updateHUD();
  }

  if (state.enemiesToSpawn > 0) {
    state.spawnCooldown -= enemyDt;
    if (state.spawnCooldown <= 0) {
      spawnEnemy();
      state.enemiesToSpawn--;
      state.spawnCooldown = Math.max(0.22, 0.9 - state.wave * 0.045);
    }
  } else if (enemies.length === 0) {
    state.wave++;
    if (state.wave >= 6) unlockAchievement("wave_6");
    if (state.wave >= 10) unlockAchievement("wave_10");
    if (state.wave >= 15) unlockAchievement("wave_15");

    state.enemiesToSpawn = 10 + state.wave * 4;
    const tierRoman = ["I", "II", "III", "IV"][getAITier() - 1];
    addFloatingText(
      W / 2,
      H / 2 - 60,
      `VLNA ${state.wave} // AI TIER ${tierRoman}`,
      "#fcee09",
      1.45,
    );
    spawnShockwave(player.x, player.y, 320, "#fcee09", 3, 480);

    if (state.wave % 3 === 0) spawnEnemy("BOSS");
    updateHUD();
    saveGameProgress(true, currentSaveSlot);
  }

  const gpMove = pollGamepadInput();
  let moveX = (keys.d ? 1 : 0) - (keys.a ? 1 : 0) + gpMove.moveX;
  let moveY = (keys.s ? 1 : 0) - (keys.w ? 1 : 0) + gpMove.moveY;
  const moveMag = Math.hypot(moveX, moveY);
  if (moveMag > 1) {
    moveX /= moveMag;
    moveY /= moveMag;
  }

  const spdBoost = state.overdriveTimer > 0 ? 1.25 : 1.0;
  player.vx = player.vx * 0.82 + moveX * player.speed * spdBoost * 0.18;
  player.vy = player.vy * 0.82 + moveY * player.speed * spdBoost * 0.18;
  player.x = Math.max(
    player.radius,
    Math.min(W - player.radius, player.x + player.vx * dt),
  );
  player.y = Math.max(
    player.radius,
    Math.min(H - player.radius, player.y + player.vy * dt),
  );
  if (gpMove.moveX === 0 && gpMove.moveY === 0) {
    player.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
  }

  if (Math.hypot(player.vx, player.vy) > 120) {
    if (Math.random() < 0.45)
      grid.applyForce(player.x, player.y, 65, 3.2, false);
    if (player.weapons.plasmaTrailLvl > 0) {
      player.trailTimer -= dt;
      if (player.trailTimer <= 0) {
        player.trailTimer = 0.14;
        plasmaPools.push({
          x: player.x,
          y: player.y,
          radius: 26 + player.weapons.plasmaTrailLvl * 5,
          dmg: (52 + player.weapons.plasmaTrailLvl * 22) * player.dmgMult,
          life: 1.6,
          maxLife: 1.6,
        });
      }
    }
  }

  if (player.dashCooldown > 0) {
    player.dashCooldown = Math.max(0, player.dashCooldown - dt);
    document.getElementById("dash-bar").style.width =
      `${(1 - player.dashCooldown / player.dashMaxCooldown) * 100}%`;
  }
  if (player.invulnTimer > 0) player.invulnTimer -= dt;

  for (let i = player.afterimages.length - 1; i >= 0; i--) {
    player.afterimages[i].alpha -= dt * 2.6;
    if (player.afterimages[i].alpha <= 0) player.afterimages.splice(i, 1);
  }

  const odFireMult = state.overdriveTimer > 0 ? 0.5 : 1.0;
  player.fireTimer -= dt;
  const fireInterval = Math.max(
    0.035,
    0.142 * Math.pow(0.85, player.weapons.fireRateLvl - 1) * odFireMult,
  );
  if (player.fireTimer <= 0) {
    firePrimaryWeapons();
    player.fireTimer = fireInterval;
  }

  updateFlamethrower(dt);

  if (player.weapons.boomerangLvl > 0) {
    player.boomerangTimer -= dt;
    if (player.boomerangTimer <= 0 && enemies.length > 0) {
      firePhotonBoomerangs();
      player.boomerangTimer = Math.max(
        0.75,
        (1.65 - player.weapons.boomerangLvl * 0.18) * odFireMult,
      );
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
        boomerangs.splice(i, 1);
        continue;
      }
    }

    bm.x += bm.vx * dt;
    bm.y += bm.vy * dt;

    // Synergie Sluneční Supernova: Bumerangy zanechávají plazmové ohnivé stopy
    if (bm.isSupernova && Math.random() < 0.35) {
      plasmaPools.push({
        x: bm.x,
        y: bm.y,
        radius: 22,
        dmg: 45 * player.dmgMult,
        life: 0.9,
        maxLife: 0.9,
      });
    }

    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (Math.hypot(e.x - bm.x, e.y - bm.y) < e.radius + 18) {
        if (bm.isSupernova) e.burnTimer = 2.5;
        damageEnemy(e, bm.dmg * dt * 5.5, bm.color, false, true);
      }
    }
    if (bm.life <= 0) boomerangs.splice(i, 1);
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
            damageEnemy(e, mn.dmg, "#fcee09", true);
          }
        }
      }
      mines.splice(i, 1);
    }
  }

  if (player.weapons.shockwaveLvl > 0) {
    player.shockwaveTimer -= dt;
    if (player.shockwaveTimer <= 0 && enemies.length > 0) {
      triggerKineticShockwave();
      player.shockwaveTimer = Math.max(
        2.2,
        4.5 - player.weapons.shockwaveLvl * 0.5,
      );
    }
  }

  if (player.weapons.satelliteLvl > 0) {
    player.satelliteTimer -= dt;
    if (player.satelliteTimer <= 0 && enemies.length > 0) {
      triggerOrbitalSatelliteLock();
      player.satelliteTimer = Math.max(
        1.8,
        (3.8 - player.weapons.satelliteLvl * 0.45) * odFireMult,
      );
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
            damageEnemy(e, st.dmg, "#ff0055", true);
          }
        }
      }
    } else {
      st.beamLife -= dt;
      if (st.beamLife <= 0) orbitalStrikes.splice(i, 1);
    }
  }

  if (player.weapons.missilesLvl > 0) {
    player.missileTimer -= dt;
    if (player.missileTimer <= 0 && enemies.length > 0) {
      fireHomingMissiles();
      player.missileTimer = Math.max(
        0.4,
        (1.4 - player.weapons.missilesLvl * 0.16) * odFireMult,
      );
    }
  }

  if (player.weapons.swarmBotsLvl > 0) {
    player.swarmBotsTimer -= dt;
    if (player.swarmBotsTimer <= 0 && enemies.length > 0) {
      fireSwarmNanobots();
      player.swarmBotsTimer = Math.max(
        0.45,
        (1.35 - player.weapons.swarmBotsLvl * 0.15) * odFireMult,
      );
    }
  }

  if (player.weapons.gravCannonLvl > 0) {
    player.gravCannonTimer -= dt;
    if (player.gravCannonTimer <= 0 && enemies.length > 0) {
      fireGravityCannon();
      player.gravCannonTimer = Math.max(
        0.95,
        (2.2 - player.weapons.gravCannonLvl * 0.25) * odFireMult,
      );
    }
  }

  if (player.weapons.teslaLvl > 0) {
    player.teslaTimer -= dt;
    if (player.teslaTimer <= 0 && enemies.length > 0) {
      fireTeslaLightning();
      player.teslaTimer = Math.max(
        0.35,
        (1.1 - player.weapons.teslaLvl * 0.12) * odFireMult,
      );
    }
  }

  if (player.weapons.railgunLvl > 0) {
    player.railgunTimer -= dt;
    if (player.railgunTimer <= 0 && enemies.length > 0) {
      fireQuantumRailgun();
      player.railgunTimer = Math.max(
        0.85,
        (2.7 - player.weapons.railgunLvl * 0.32) * odFireMult,
      );
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
          damageEnemy(e, 150 * player.dmgMult * dt, "#bc13fe");
        }
      }
      for (let j = enemyBullets.length - 1; j >= 0; j--) {
        if (Math.hypot(enemyBullets[j].x - bx, enemyBullets[j].y - by) < 15) {
          enemyBullets.splice(j, 1);
        }
      }
    }
  }

  for (let i = supplyPods.length - 1; i >= 0; i--) {
    const sp = supplyPods[i];
    sp.angle += dt * 3.2;
    sp.life -= dt;
    if (
      Math.hypot(player.x - sp.x, player.y - sp.y) <
      player.radius + sp.radius + 6
    ) {
      sfx.playLevelUp();
      spawnShockwave(sp.x, sp.y, 260, sp.color, 4, 520);
      addFloatingText(sp.x, sp.y - 20, sp.label, sp.color, 1.3);
      if (sp.kind === "HEAL")
        player.hp = Math.min(player.maxHp, player.hp + 45);
      else if (sp.kind === "MAGNET")
        gems.forEach((g) => {
          g.magnetized = true;
        });
      else if (sp.kind === "NOVA") {
        player.bombs = Math.min(player.maxBombs, player.bombs + 1);
        state.overdrive = Math.min(100, state.overdrive + 45);
      }
      updateHUD();
      supplyPods.splice(i, 1);
      continue;
    }
    if (sp.life <= 0) supplyPods.splice(i, 1);
  }

  for (let i = plasmaPools.length - 1; i >= 0; i--) {
    const pool = plasmaPools[i];
    pool.life -= dt;
    for (const e of enemies) {
      if (Math.hypot(e.x - pool.x, e.y - pool.y) < e.radius + pool.radius) {
        damageEnemy(e, pool.dmg * dt, "#fb923c");
      }
    }
    if (pool.life <= 0) plasmaPools.splice(i, 1);
  }

  for (let i = railBeams.length - 1; i >= 0; i--) {
    railBeams[i].life -= dt;
    if (railBeams[i].life <= 0) railBeams.splice(i, 1);
  }

  for (let i = lensFlares.length - 1; i >= 0; i--) {
    lensFlares[i].life -= dt;
    if (lensFlares[i].life <= 0) lensFlares.splice(i, 1);
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.px = b.x;
    b.py = b.y;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;

    // Teleportace střel skrz Červí díru
    for (const wh of wormholes) {
      if (!b.teleported && Math.hypot(b.x - wh.x1, b.y - wh.y1) < wh.radius) {
        b.x = wh.x2;
        b.y = wh.y2;
        b.teleported = true;
      } else if (
        !b.teleported &&
        Math.hypot(b.x - wh.x2, b.y - wh.y2) < wh.radius
      ) {
        b.x = wh.x1;
        b.y = wh.y1;
        b.teleported = true;
      }
    }

    let bounced = false;
    if (b.x <= 6 || b.x >= W - 6) {
      if (b.bounces > 0) {
        b.vx *= -1;
        b.bounces--;
        bounced = true;
      } else b.life = 0;
    }
    if (b.y <= 6 || b.y >= H - 6) {
      if (b.bounces > 0) {
        b.vy *= -1;
        b.bounces--;
        bounced = true;
      } else b.life = 0;
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
          const angleDiff = Math.abs(
            Math.atan2(
              Math.sin(incomingAngle - e.angle),
              Math.cos(incomingAngle - e.angle),
            ),
          );
          if (angleDiff < 1.0 && b.pierce <= 0) {
            b.vx *= -0.9;
            b.vy *= -0.9;
            b.color = "#fcee09";
            spawnParticles(b.x, b.y, "#fcee09", 5, 80, 220, 2.0);
            break;
          }
        }
        damageEnemy(e, b.dmg, b.color);

        // Synergie Bouřková Matrice (Drony + Tesla)
        if (b.stormArc && Math.random() < 0.45) {
          fireTeslaLightning(e.x, e.y, 2);
        }

        // Gravitační dělo (přitáhne okolní nepřátele k místu zásahu)
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
    if (b.life <= 0) bullets.splice(i, 1);
  }

  for (let i = missiles.length - 1; i >= 0; i--) {
    const m = missiles[i];
    m.life -= dt;

    let target = null;
    let bestD = Infinity;
    for (const e of enemies) {
      const d = Math.hypot(e.x - m.x, e.y - m.y);
      if (d < bestD) {
        bestD = d;
        target = e;
      }
    }
    if (target) {
      const desiredA = Math.atan2(target.y - m.y, target.x - m.x);
      const currA = Math.atan2(m.vy, m.vx);
      const diff = Math.atan2(
        Math.sin(desiredA - currA),
        Math.cos(desiredA - currA),
      );
      const newA = currA + diff * Math.min(1, dt * 11);
      m.vx = Math.cos(newA) * m.speed;
      m.vy = Math.sin(newA) * m.speed;
    }

    m.x += m.vx * dt;
    m.y += m.vy * dt;
    if (Math.random() < 0.6)
      spawnParticles(m.x, m.y, m.color, 1, 10, 40, 2.0, 0.12, 0.22);

    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (Math.hypot(e.x - m.x, e.y - m.y) < e.radius + 10) {
        damageEnemy(e, m.dmg, m.color, true);
        spawnShockwave(m.x, m.y, 65, m.color, 2.5, 380);
        grid.applyForce(m.x, m.y, 110, 16, false);
        m.life = 0;
        break;
      }
    }
    if (m.life <= 0) missiles.splice(i, 1);
  }

  for (let i = singularities.length - 1; i >= 0; i--) {
    const s = singularities[i];
    s.life -= dt;
    s.angle += dt * 8;

    grid.applyForce(s.x, s.y, s.pullRadius * 0.85, 22, true, true);

    // Synergie Hvězdná Singularita: automatické orbitální lasery do středu černé díry
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
        const pullForce =
          (1 - dist / s.pullRadius) * (e.type === "BOSS" ? 165 : 620);
        e.x += (dx / dist) * pullForce * dt;
        e.y += (dy / dist) * pullForce * dt;
        if (dist < s.radius * 2.3)
          damageEnemy(
            e,
            125 * (s.amp || 1) * player.dmgMult * dt,
            "#ff007f",
            true,
          );
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
          damageEnemy(e, 290 * (s.amp || 1) * player.dmgMult, "#00f3ff", true);
        }
      }
      singularities.splice(i, 1);
    }
  }

  const aiTier = getAITier();
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    if (e.dead) {
      enemies.splice(i, 1);
      continue;
    }

    if (e.burnTimer && e.burnTimer > 0) {
      e.burnTimer -= dt;
      damageEnemy(
        e,
        (28 + player.weapons.flamethrowerLvl * 12) * dt,
        "#ff5500",
      );
      if (e.dead) {
        enemies.splice(i, 1);
        continue;
      }
    }

    if (e.slowTimer > 0) e.slowTimer -= dt;
    const spdMult = e.slowTimer > 0 ? 0.45 : 1.0;
    const effSpeed = e.speed * spdMult * (1 + (sfx.beatPulse || 0) * 0.15);

    if (e.maxShield > 0 && e.shield > 0 && e.shield < e.maxShield) {
      e.shield = Math.min(e.maxShield, e.shield + e.maxShield * 0.05 * enemyDt);
    }

    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const dist = Math.hypot(dx, dy) || 1;
    const dirX = dx / dist;
    const dirY = dy / dist;

    if (e.type === "CHASER") {
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
        e.shootTimer = aiTier >= 3 ? 1.65 : 2.1;
        const leadX = player.x + (aiTier >= 2 ? player.vx * 0.35 : 0);
        const leadY = player.y + (aiTier >= 2 ? player.vy * 0.35 : 0);
        const aimA = Math.atan2(leadY - e.y, leadX - e.x);
        const count = aiTier >= 3 ? 3 : 1;
        for (let k = 0; k < count; k++) {
          const ba = aimA + (k - (count - 1) / 2) * 0.28;
          enemyBullets.push({
            x: e.x,
            y: e.y,
            vx: Math.cos(ba) * 275,
            vy: Math.sin(ba) * 275,
            radius: 5.5,
            color: "#bc13fe",
          });
        }
      }
    } else if (e.type === "JUGGERNAUT") {
      const desiredA = Math.atan2(dy, dx);
      const diff = Math.atan2(
        Math.sin(desiredA - e.angle),
        Math.cos(desiredA - e.angle),
      );
      e.angle += diff * Math.min(1, enemyDt * 2.6);
      e.x += Math.cos(e.angle) * effSpeed * enemyDt;
      e.y += Math.sin(e.angle) * effSpeed * enemyDt;

      if (aiTier >= 2) {
        e.shootTimer -= enemyDt * spdMult;
        if (e.shootTimer <= 0) {
          e.shootTimer = 2.4;
          enemyBullets.push({
            x: e.x,
            y: e.y,
            vx: Math.cos(e.angle) * 310,
            vy: Math.sin(e.angle) * 310,
            radius: 7,
            color: "#fcee09",
          });
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
        e.shootTimer = 2.4;
        enemyBullets.push({
          x: e.x,
          y: e.y,
          vx: Math.cos(e.angle) * 460,
          vy: Math.sin(e.angle) * 460,
          radius: 6,
          color: "#ff2a85",
        });
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
            ally.shield = Math.min(
              ally.maxShield,
              (ally.shield || 0) + ally.maxHp * 0.25,
            );
          }
        }
      }
    } else if (e.type === "BOSS") {
      e.phaseTimer += enemyDt * spdMult;
      e.angle += e.spin * enemyDt;

      if (e.subtype === "ARCHON") {
        e.x = W / 2 + Math.cos(e.phaseTimer * 0.85) * (W * 0.3);
        e.y = 140 + Math.sin(e.phaseTimer * 1.4) * 60;
        e.shootTimer -= enemyDt * spdMult;
        if (e.shootTimer <= 0) {
          e.shootTimer = 1.15;
          const spokes = 10;
          for (let k = 0; k < spokes; k++) {
            const ba = e.angle + (k * Math.PI * 2) / spokes;
            enemyBullets.push({
              x: e.x,
              y: e.y,
              vx: Math.cos(ba) * 290,
              vy: Math.sin(ba) * 290,
              radius: 6.5,
              color: "#ff0055",
            });
          }
        }
      } else if (e.subtype === "SERAPH") {
        e.x += Math.cos(e.phaseTimer * 1.6) * 240 * enemyDt;
        e.y += Math.sin(e.phaseTimer * 2.1) * 140 * enemyDt;
        e.shootTimer -= enemyDt * spdMult;
        if (e.shootTimer <= 0) {
          e.shootTimer = 0.95;
          const aimA = Math.atan2(player.y - e.y, player.x - e.x);
          for (let k = -2; k <= 2; k++) {
            const ba = aimA + k * 0.18;
            enemyBullets.push({
              x: e.x,
              y: e.y,
              vx: Math.cos(ba) * 350,
              vy: Math.sin(ba) * 350,
              radius: 6,
              color: "#fcee09",
            });
          }
        }
      } else if (e.subtype === "HYDRA") {
        e.x = W / 2 + Math.sin(e.phaseTimer * 0.7) * (W * 0.25);
        e.y = H * 0.3 + Math.cos(e.phaseTimer * 1.1) * 90;
        e.shootTimer -= enemyDt * spdMult;
        if (e.shootTimer <= 0) {
          e.shootTimer = 1.3;
          for (let node = 0; node < 3; node++) {
            const na = e.angle + (node * Math.PI * 2) / 3;
            const nx = e.x + Math.cos(na) * 48;
            const ny = e.y + Math.sin(na) * 48;
            const aimA = Math.atan2(player.y - ny, player.x - nx);
            enemyBullets.push({
              x: nx,
              y: ny,
              vx: Math.cos(aimA) * 310,
              vy: Math.sin(aimA) * 310,
              radius: 6.5,
              color: "#00ffaa",
            });
          }
        }
      } else if (e.subtype === "LEVIATHAN") {
        const targetA =
          Math.atan2(dy, dx) + Math.sin(e.phaseTimer * 3.0) * 0.65;
        e.x += Math.cos(targetA) * 185 * spdMult * enemyDt;
        e.y += Math.sin(targetA) * 185 * spdMult * enemyDt;

        let prevX = e.x,
          prevY = e.y;
        for (const seg of e.segments || []) {
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
          e.shootTimer = 1.25;
          const segs = e.segments || [];
          const tail = segs[segs.length - 1] || e;
          for (let k = 0; k < 6; k++) {
            const ba = e.angle + (k * Math.PI) / 3;
            enemyBullets.push({
              x: tail.x,
              y: tail.y,
              vx: Math.cos(ba) * 270,
              vy: Math.sin(ba) * 270,
              radius: 6,
              color: "#bc13fe",
            });
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

    if (dist < e.radius + player.radius - 2) {
      if (player.invulnTimer > 0) damageEnemy(e, 95, "#00f3ff");
      else {
        damagePlayer(20);
        if (e.type !== "BOSS") damageEnemy(e, 999, "#ff0055");
      }
    }
  }

  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const eb = enemyBullets[i];
    eb.x += eb.vx * enemyDt;
    eb.y += eb.vy * enemyDt;

    if (
      Math.hypot(eb.x - player.x, eb.y - player.y) <
      eb.radius + player.radius - 3
    ) {
      damagePlayer(15);
      enemyBullets.splice(i, 1);
      continue;
    }
    if (eb.x < -20 || eb.x > W + 20 || eb.y < -20 || eb.y > H + 20) {
      enemyBullets.splice(i, 1);
    }
  }

  const baseMagnetRange = 245 + (meta.upgrades.magnetLvl || 0) * 60;
  for (let i = gems.length - 1; i >= 0; i--) {
    const g = gems[i];
    g.vx *= 0.92;
    g.vy *= 0.92;

    const dx = player.x - g.x;
    const dy = player.y - g.y;
    const d = Math.hypot(dx, dy) || 1;
    const magnetRange = g.magnetized ? 4000 : baseMagnetRange;
    if (d < magnetRange) {
      const pull = g.magnetized ? 980 : (1 - d / magnetRange) * 820;
      g.vx += (dx / d) * pull * dt * 8;
      g.vy += (dy / d) * pull * dt * 8;
    }

    g.x += g.vx * dt;
    g.y += g.vy * dt;
    g.angle += dt * 5;

    if (d < player.radius + 14) {
      player.xp += g.val;
      state.score += Math.floor(25 * state.combo);
      if (state.score >= 100000) unlockAchievement("score_100k");
      if (state.score >= 500000) unlockAchievement("score_500k");
      sfx.playGem();
      gems.splice(i, 1);

      if (player.xp >= player.xpNext) {
        player.xp -= player.xpNext;
        player.level++;
        if (player.level >= 10) unlockAchievement("level_10");
        player.xpNext = Math.floor(player.xpNext * 1.28);
        triggerUpgradeSelection();
      }
      updateHUD();
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= p.drag;
    p.vy *= p.drag;
    p.life -= dt;
    if (p.life <= 0) particles.splice(i, 1);
  }

  for (let i = shockwaves.length - 1; i >= 0; i--) {
    const sw = shockwaves[i];
    sw.radius += sw.speed * dt;
    if (sw.radius >= sw.maxRadius) shockwaves.splice(i, 1);
  }

  for (let i = lightningArcs.length - 1; i >= 0; i--) {
    lightningArcs[i].life -= dt;
    if (lightningArcs[i].life <= 0) lightningArcs.splice(i, 1);
  }

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.y += ft.vy * dt;
    ft.life -= dt;
    if (ft.life <= 0) floatingTexts.splice(i, 1);
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
    document.getElementById("particle-counter").textContent =
      particles.length + bullets.length + enemies.length;
    frameCount = 0;
    fpsTimer = 0;
  }

  update(dt);
  render();
}

/*************************************************************************
 * INPUT LISTENERS & INITIALIZATION
 *************************************************************************/
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mousedown", (e) => {
  if (e.button === 0) mouse.down = true;
  if (e.button === 1) {
    e.preventDefault();
    deploySingularityBomb();
  }
  if (e.button === 2) {
    e.preventDefault();
    triggerHyperDash();
  }
});

window.addEventListener("mouseup", (e) => {
  if (e.button === 0) mouse.down = false;
});

window.addEventListener("contextmenu", (e) => e.preventDefault());

window.addEventListener("keydown", (e) => {
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
    document.getElementById("btn-audio").textContent =
      `🔊 ZVUK: ${sfx.muted ? "OFF" : "ON"}`;
  }
  if (e.code === "KeyN") {
    const label = sfx.cycleStyle();
    document.getElementById("btn-track").textContent = `🎵 RÁDIO: ${label}`;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.code === "KeyW" || e.code === "ArrowUp") keys.w = false;
  if (e.code === "KeyA" || e.code === "ArrowLeft") keys.a = false;
  if (e.code === "KeyS" || e.code === "ArrowDown") keys.s = false;
  if (e.code === "KeyD" || e.code === "ArrowRight") keys.d = false;
});

window.addEventListener("beforeunload", () => {
  if (state.mode === "PLAYING" || state.mode === "PAUSED") {
    saveGameProgress(false, currentSaveSlot);
  }
});

document.getElementById("btn-start").addEventListener("click", startNewGame);
document
  .getElementById("btn-resume-saved")
  .addEventListener("click", () => loadSavedGame(currentSaveSlot));
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

document
  .getElementById("btn-open-achievements")
  .addEventListener("click", () => {
    renderAchievementsModal();
    document.getElementById("achievements-modal").classList.remove("hidden");
    document.getElementById("achievements-modal").classList.add("flex");
  });
document
  .getElementById("btn-close-achievements")
  .addEventListener("click", () => {
    document.getElementById("achievements-modal").classList.add("hidden");
    document.getElementById("achievements-modal").classList.remove("flex");
  });

document.getElementById("btn-go-menu").addEventListener("click", () => {
  state.mode = "MENU";
  document.getElementById("gameover-modal").classList.add("hidden");
  document.getElementById("gameover-modal").classList.remove("flex");
  syncHudVisibilityDOM();
  document.getElementById("start-modal").classList.remove("hidden");
  renderShipSelector();
  refreshMenuSaveUI();
});

document
  .getElementById("btn-pause-hud")
  .addEventListener("click", togglePauseGame);
document
  .getElementById("btn-hide-hud")
  .addEventListener("click", toggleHudVisibility);
document
  .getElementById("btn-resume-play")
  .addEventListener("click", togglePauseGame);
document
  .getElementById("btn-manual-save")
  .addEventListener("click", () => saveGameProgress(true, currentSaveSlot));

[1, 2, 3].forEach((slotNum) => {
  const btn = document.getElementById(`btn-save-slot-${slotNum}`);
  if (btn) {
    btn.addEventListener("click", () => {
      saveGameProgress(true, slotNum);
      document.getElementById("pause-active-slot").textContent = `#${slotNum}`;
    });
  }
});

document.getElementById("btn-save-exit").addEventListener("click", () => {
  saveGameProgress(true, currentSaveSlot);
  state.mode = "MENU";
  document.getElementById("pause-modal").classList.add("hidden");
  document.getElementById("pause-modal").classList.remove("flex");
  syncHudVisibilityDOM();
  document.getElementById("start-modal").classList.remove("hidden");
  renderShipSelector();
  refreshMenuSaveUI();
});
document
  .getElementById("btn-pause-restart")
  .addEventListener("click", startNewGame);

document.getElementById("btn-audio").addEventListener("click", () => {
  sfx.muted = !sfx.muted;
  document.getElementById("btn-audio").textContent =
    `🔊 ZVUK: ${sfx.muted ? "OFF" : "ON"}`;
});
document.getElementById("btn-track").addEventListener("click", () => {
  const label = sfx.cycleStyle();
  document.getElementById("btn-track").textContent = `🎵 RÁDIO: ${label}`;
});

// Přepínání záložek v Hangáru (1. Výběr lodi <-> 2. Paměťové sloty & Ovládání)
function setupHangarTabs() {
    const tabShips = document.getElementById('tab-ships') || document.getElementById('btn-tab-ships');
    const tabSlots = document.getElementById('tab-slots') || document.getElementById('btn-tab-slots');
    const panelShips = document.getElementById('panel-ships') || document.getElementById('tab-content-ships') || document.getElementById('ship-selector-grid')?.parentElement;
    const panelSlots = document.getElementById('panel-slots') || document.getElementById('tab-content-slots') || document.getElementById('save-slots-grid')?.parentElement;

    // Pojistka: najde tlačítka i podle textu, pokud mají v HTML jiné ID
    const allBtns = Array.from(document.querySelectorAll('#start-modal button, #start-modal [role="tab"], #start-modal div.cursor-pointer'));
    const btn1 = tabShips || allBtns.find(el => el.textContent.includes('1. VÝBĚR TŘÍDY'));
    const btn2 = tabSlots || allBtns.find(el => el.textContent.includes('2. PAMĚŤOVÉ SLOTY'));

    if (btn1 && btn2 && panelShips && panelSlots) {
        btn1.style.cursor = 'pointer';
        btn2.style.cursor = 'pointer';

        btn1.addEventListener('click', () => {
            panelShips.classList.remove('hidden');
            panelSlots.classList.add('hidden');
            btn1.classList.add('border-cyan-400', 'text-cyan-300', 'bg-cyan-500/15');
            btn1.classList.remove('text-slate-400', 'border-slate-800');
            btn2.classList.remove('border-cyan-400', 'text-cyan-300', 'bg-cyan-500/15');
            btn2.classList.add('text-slate-400', 'border-slate-800');
        });

        btn2.addEventListener('click', () => {
            panelSlots.classList.remove('hidden');
            panelShips.classList.add('hidden');
            btn2.classList.add('border-cyan-400', 'text-cyan-300', 'bg-cyan-500/15');
            btn2.classList.remove('text-slate-400', 'border-slate-800');
            btn1.classList.remove('border-cyan-400', 'text-cyan-300', 'bg-cyan-500/15');
            btn1.classList.add('text-slate-400', 'border-slate-800');
            renderSaveSlotsUI();
        });
    }
}

window.onload = () => {
  loadMetaProgression();
  saveMetaProgression();
  renderShipSelector();
  setupHangarTabs();
  document.getElementById("best-score-display").textContent = String(
    state.bestScore,
  ).padStart(7, "0");
  refreshMenuSaveUI();
  requestAnimationFrame(gameLoop);
};
