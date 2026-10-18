/*************************************************************************
 * WORLD.JS - PARALLAX SPACE, SPRING-GRID & EXPANDED OMEGA CATALOGS
 *************************************************************************/
class DeepSpaceBackdrop {
  constructor(w, h) {
    this.stars = [];
    this.nebulas = [];
    this.init(w, h);
  }
  init(w, h) {
    this.stars = [];
    for (let i = 0; i < 140; i++) {
      const depth = 0.15 + Math.random() * 0.85;
      this.stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        depth,
        size: depth * 2.2,
        color: Math.random() > 0.7 ? "#00f3ff" : Math.random() > 0.5 ? "#ff007f" : "#ffffff",
        twinkle: Math.random() * Math.PI * 2,
      });
    }
    this.nebulas = [
      { x: w * 0.22, y: h * 0.3, r: 400, color: "rgba(157, 0, 255, 0.09)", depth: 0.12 },
      { x: w * 0.78, y: h * 0.7, r: 460, color: "rgba(0, 243, 255, 0.08)", depth: 0.18 },
      { x: w * 0.52, y: h * 0.25, r: 360, color: "rgba(255, 0, 127, 0.08)", depth: 0.15 },
    ];
  }
  update(dt, pvx, pvy, w, h) {
    const speedBoost = 1 + (sfx.bassEnergy || 0) * 1.4;
    for (const s of this.stars) {
      s.x -= pvx * s.depth * 0.18 * speedBoost * dt;
      s.y -= pvy * s.depth * 0.18 * speedBoost * dt;
      s.twinkle += dt * (3 + (sfx.highEnergy || 0) * 8);
      if (s.x < 0) s.x += w;
      if (s.x > w) s.x -= w;
      if (s.y < 0) s.y += h;
      if (s.y > h) s.y -= h;
    }
    for (const n of this.nebulas) {
      n.x -= pvx * n.depth * 0.12 * dt;
      n.y -= pvy * n.depth * 0.12 * dt;
      if (n.x < -n.r) n.x += w + n.r * 2;
      if (n.x > w + n.r) n.x -= w + n.r * 2;
      if (n.y < -n.r) n.y += h + n.r * 2;
      if (n.y > h + n.r) n.y -= h + n.r * 2;
    }
  }
  draw(ctx) {
    const bassScale = 1 + (sfx.beatPulse || 0) * 0.35 + (sfx.bassEnergy || 0) * 0.25;
    for (const n of this.nebulas) {
      const rad = n.r * bassScale;
      const grad = ctx.createRadialGradient(n.x, n.y, 10, n.x, n.y, rad);
      grad.addColorStop(0, n.color);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, rad, 0, Math.PI * 2);
      ctx.fill();
    }
    const sizePulse = 1 + (sfx.beatPulse || 0) * 0.65;
    for (const s of this.stars) {
      const alpha = 0.4 + Math.sin(s.twinkle) * 0.3 + (sfx.beatPulse || 0) * 0.3;
      ctx.fillStyle = s.color;
      ctx.globalAlpha = Math.min(1, alpha * s.depth);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * sizePulse, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }
}

class SpringGrid {
  constructor(spacing = 46) {
    this.spacing = spacing;
    this.cols = 0;
    this.rows = 0;
    this.points = [];
    this.stiffness = 0.038;
    this.damping = 0.89;
    this.resize(window.innerWidth, window.innerHeight);
  }
  resize(w, h) {
    this.cols = Math.ceil(w / this.spacing) + 3;
    this.rows = Math.ceil(h / this.spacing) + 3;
    this.points = new Array(this.cols * this.rows);
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const x = (c - 1) * this.spacing;
        const y = (r - 1) * this.spacing;
        this.points[r * this.cols + c] = { bx: x, by: y, x, y, vx: 0, vy: 0, energy: 0, charge: 0 };
      }
    }
  }
  applyForce(fx, fy, radius, force, isPull = false, addCharge = false) {
    const rSq = radius * radius;
    for (let i = 0; i < this.points.length; i++) {
      const p = this.points[i];
      const dx = p.x - fx;
      const dy = p.y - fy;
      const dSq = dx * dx + dy * dy;
      if (dSq < rSq && dSq > 0.001) {
        const dist = Math.sqrt(dSq);
        const falloff = 1 - dist / radius;
        const strength = force * falloff * falloff * (isPull ? -1 : 1);
        p.vx += (dx / dist) * strength;
        p.vy += (dy / dist) * strength;
        p.energy = Math.min(1.0, p.energy + falloff * 0.88);
        if (addCharge && Math.random() < 0.45) {
          p.charge = Math.min(1.0, p.charge + falloff * 1.1);
        }
      }
    }
  }
  triggerBeatWave(cx, cy, intensity = 1.0) {
    for (let i = 0; i < this.points.length; i += 2) {
      const p = this.points[i];
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 420) {
        const wave = Math.sin(dist * 0.04) * 5.5 * intensity;
        p.vx += (dx / dist) * wave;
        p.vy += (dy / dist) * wave;
        p.energy = Math.min(1.0, p.energy + 0.35 * intensity);
      }
    }
  }
  update() {
    const cols = this.cols;
    const rows = this.rows;
    const pts = this.points;
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        const idx = r * cols + c;
        const p = pts[idx];
        let ax = (p.bx - p.x) * this.stiffness;
        let ay = (p.by - p.y) * this.stiffness;
        const left = pts[idx - 1];
        const right = pts[idx + 1];
        const up = pts[idx - cols];
        const down = pts[idx + cols];
        ax += ((left.x + right.x + up.x + down.x) * 0.25 - p.x) * 0.025;
        ay += ((left.y + right.y + up.y + down.y) * 0.25 - p.y) * 0.025;
        p.vx = (p.vx + ax) * this.damping;
        p.vy = (p.vy + ay) * this.damping;
      }
    }
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx;
      p.y += p.vy;
      p.energy *= 0.93;
      p.charge *= 0.88;
    }
  }
  draw(ctx) {
    const cols = this.cols;
    const rows = this.rows;
    const pts = this.points;
    const beatGlow = (sfx.beatPulse || 0) * 0.16;
    const baseAlpha = 0.09 + beatGlow;
    const gridHue = Math.floor(185 + (sfx.midEnergy || 0) * 140);

    ctx.lineWidth = 1 + (sfx.beatPulse || 0) * 0.8;
    ctx.strokeStyle = state.overdriveTimer > 0
      ? `rgba(252, 238, 9, ${baseAlpha + 0.06})`
      : `hsla(${gridHue}, 100%, 55%, ${baseAlpha})`;

    ctx.beginPath();
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const idx = r * cols + c;
        const p = pts[idx];
        const pr = pts[idx + 1];
        const pd = pts[idx + cols];
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(pr.x, pr.y);
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(pd.x, pd.y);
      }
    }
    ctx.stroke();

    ctx.lineWidth = 2.1;
    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        const idx = r * cols + c;
        const p = pts[idx];
        if (p.energy > 0.06 || p.charge > 0.1) {
          const pr = pts[idx + 1];
          const pd = pts[idx + cols];
          const alpha = Math.min(0.96, Math.max(p.energy, p.charge) * 0.95);
          const hue = p.charge > 0.25 ? 55 : (185 + p.energy * 165) % 360;
          ctx.strokeStyle = `hsla(${hue}, 100%, 64%, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pr.x, pr.y);
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pd.x, pd.y);
          ctx.stroke();
          if (p.energy > 0.3 || p.charge > 0.25) {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(p.x - 1.5, p.y - 1.5, 3.0, 3.0);
          }
        }
      }
    }
  }
}

const DEFAULT_WEAPONS_TEMPLATE = {
  barrels: 2, fireRateLvl: 1, ricochetLvl: 0, missilesLvl: 0,
  bladesLvl: 0, teslaLvl: 0, railgunLvl: 0, dronesLvl: 0,
  plasmaTrailLvl: 0, cryoNovaLvl: 0, aegisLvl: 0, critLvl: 0,
  flamethrowerLvl: 0, satelliteLvl: 0, boomerangLvl: 0, minesLvl: 0,
  shockwaveLvl: 0, gravityAmpLvl: 0, regenLvl: 0, solarHaloLvl: 0,
  swarmBotsLvl: 0, gravCannonLvl: 0, phaseMeltLvl: 0,
  whipLvl: 0, mortarLvl: 0, nanoShieldLvl: 0, decoyLvl: 0,
  lightningTrapLvl: 0, riftSlicerLvl: 0, prismLaserLvl: 0, overchargeCoreLvl: 0,
  voidLanceLvl: 0, laserRingLvl: 0, chainFlailLvl: 0, stasisFieldLvl: 0
};

// 8 HOVER-SHIP CLASSES
const SHIP_CLASSES = [
  {
    id: "INTERCEPTOR",
    name: "INTERCEPTOR X-9",
    role: "ŠÍPOVÁ STÍHAČKA // ODRAZOVÉ FOTONY",
    color: "#00f3ff",
    hp: 100, speed: 415, dashCd: 1.1, bombs: 2,
    desc: "Ultralehká šípová stíhačka s dvojitým plazmovým pohonem. Nejvyšší rychlost a začíná s Odrazovými fotony.",
    initWeapons: { ...DEFAULT_WEAPONS_TEMPLATE, ricochetLvl: 1 }
  },
  {
    id: "BASTION",
    name: "BASTION TITAN",
    role: "TĚŽKÝ DREADNOUGHT // AEGIS & ČEPELE",
    color: "#fcee09",
    hp: 160, speed: 345, dashCd: 1.5, bombs: 2,
    desc: "Masivní šestihranný křižník s bočními štíty. Začíná s Aegis bariérou, 2 Orbitálními čepelemi a tlakovým pulzem.",
    initWeapons: { ...DEFAULT_WEAPONS_TEMPLATE, bladesLvl: 2, aegisLvl: 1, shockwaveLvl: 1 }
  },
  {
    id: "TECHNOMANCER",
    name: "TECHNOMANCER VORTEX",
    role: "HVĚZDICOVÝ KŘIŽNÍK // DRONY & TESLA",
    color: "#bc13fe",
    hp: 115, speed: 375, dashCd: 1.35, bombs: 3,
    desc: "Experimentální plavidlo s levitujícím prstencem. Začíná s Dronem, Teslovým bleskem a 3 Černými dírami (Synergie!).",
    initWeapons: { ...DEFAULT_WEAPONS_TEMPLATE, teslaLvl: 1, dronesLvl: 1 }
  },
  {
    id: "WRAITH",
    name: "PHANTOM WRAITH",
    role: "KRITICKÝ ZABIJÁK // BUMERANGY & KRIT",
    color: "#ff0055",
    hp: 95, speed: 400, dashCd: 1.15, bombs: 2,
    desc: "Agresivní kosmický predátor s dvojitými kosami. Začíná s Fotonovými Bumerangy a Kritickým přetaktovačem LV2.",
    initWeapons: { ...DEFAULT_WEAPONS_TEMPLATE, critLvl: 2, boomerangLvl: 1 }
  },
  {
    id: "SERAPH",
    name: "SOLAR SERAPH",
    role: "OHNIVÁ VALKÝRA // PLAMENOMET & STOPA",
    color: "#ff6600",
    hp: 125, speed: 385, dashCd: 1.25, bombs: 2,
    desc: "Žhnoucí solární valkýra. Od samého startu spaluje nepřátele Plazmovým Plamenometem a hořící stopou.",
    initWeapons: { ...DEFAULT_WEAPONS_TEMPLATE, plasmaTrailLvl: 1, flamethrowerLvl: 1 }
  },
  {
    id: "ARCHITECT",
    name: "OMEGA ARCHITECT",
    role: "VLÁDCE GRAVITACE // MINY & SATELIT",
    color: "#00ffaa",
    hp: 135, speed: 360, dashCd: 1.4, bombs: 4,
    desc: "Kvantový konstrukt. Začíná s Orbitálním Satelitem, Kvantovými minami a 4 zesílenými Černými dírami.",
    initWeapons: { ...DEFAULT_WEAPONS_TEMPLATE, satelliteLvl: 1, minesLvl: 1, gravityAmpLvl: 1 }
  },
  {
    id: "STALKER",
    name: "PHANTOM STALKER",
    role: "SKRYTÝ DRAVEC // KLONY & TRHAČ",
    color: "#a855f7",
    hp: 105, speed: 425, dashCd: 0.95, bombs: 2,
    desc: "Stínový zabiják. Střílí fázové šipky a při každém Hyper-skoku zanechává explozivní holografický klon!",
    initWeapons: { ...DEFAULT_WEAPONS_TEMPLATE, riftSlicerLvl: 1, decoyLvl: 1, critLvl: 1 }
  },
  {
    id: "JUGGERNAUT_SHIP",
    name: "TITAN JUGGERNAUT",
    role: "PANCÉŘOVÁ PEVNOST // ODRAZ STŘEL",
    color: "#38bdf8",
    hp: 210, speed: 325, dashCd: 1.6, bombs: 3,
    desc: "Nepřemožitelná mobilní tvrz. Má obří pancíř, automaticky odráží nepřátelské projektily zpět a nese Kvantový minomet.",
    initWeapons: { ...DEFAULT_WEAPONS_TEMPLATE, mortarLvl: 1, nanoShieldLvl: 1, regenLvl: 1 }
  },
  {
    id: "CHRONO_SHIP",
    name: "CHRONO WEAVER",
    role: "MANIPULÁTOR ČASU // KRYO & PŘETLAK",
    color: "#67e8f9",
    hp: 110, speed: 405, dashCd: 1.05, bombs: 3,
    desc: "Časoprostorový křižník. Každý Hyper-skok zmrazí okolní nepřátele a okamžitě nabije +12 % Přetlaku!",
    initWeapons: { ...DEFAULT_WEAPONS_TEMPLATE, cryoNovaLvl: 1, overchargeCoreLvl: 1 }
  },
  {
    id: "HIVE_SHIP",
    name: "HIVE CARRIER",
    role: "MATEŘSKÁ LOĎ // DRONY & NANOBOTY",
    color: "#a3e635",
    hp: 150, speed: 355, dashCd: 1.4, bombs: 2,
    desc: "Těžký nosič letky. Vypouští do arény autonomní drony, lovecké nanoboty a explozivní klony.",
    initWeapons: { ...DEFAULT_WEAPONS_TEMPLATE, dronesLvl: 2, swarmBotsLvl: 1, decoyLvl: 1 }
  }
];

// 13 WEAPON SYNERGIES (3 ORIGINAL + 10 NEW FUSIONS)
const SYNERGIES_LIST = [
  { id: "solar_supernova", name: "🔥 SYNERGIE: SLUNEČNÍ SUPERNOVA", color: "#ff6600", check: (w) => w.flamethrowerLvl > 0 && w.boomerangLvl > 0 },
  { id: "storm_matrix", name: "⚡ SYNERGIE: BOUŘKOVÁ MATRICE", color: "#5ffbff", check: (w) => w.teslaLvl > 0 && w.dronesLvl > 0 },
  { id: "stellar_singularity", name: "🌟 SYNERGIE: HVĚZDNÁ SINGULARITA", color: "#ff007f", check: (w) => w.gravityAmpLvl > 0 && w.satelliteLvl > 0 },
  { id: "vortex_cyclone", name: "🌪️ SYNERGIE: VORTEXOVÝ CYKLON", color: "#00ffaa", check: (w) => w.whipLvl > 0 && w.boomerangLvl > 0 },
  { id: "carpet_bombing", name: "💣 SYNERGIE: KOBERCOVÉ BOMBARDOVÁNÍ", color: "#fcee09", check: (w) => w.mortarLvl > 0 && w.minesLvl > 0 },
  { id: "immortal_fortress", name: "🛡️ SYNERGIE: NESMRTELNÁ CITADELA", color: "#38bdf8", check: (w) => w.nanoShieldLvl > 0 && w.aegisLvl > 0 },
  { id: "phantom_legion", name: "👥 SYNERGIE: FANTOMOVÁ LEGIE", color: "#a855f7", check: (w) => w.decoyLvl > 0 && w.swarmBotsLvl > 0 },
  { id: "thunder_web", name: "🕸️ SYNERGIE: BOUŘKOVÁ SÍŤ SMRTI", color: "#67e8f9", check: (w) => w.lightningTrapLvl > 0 && w.teslaLvl > 0 },
  { id: "dimensional_reaper", name: "⚔️ SYNERGIE: DIMENZIONÁLNÍ SEKÁČ", color: "#f43f5e", check: (w) => w.riftSlicerLvl > 0 && w.bladesLvl > 0 },
  { id: "rainbow_annihilation", name: "🌈 SYNERGIE: DUHOVÁ ANIHILACE", color: "#ff0055", check: (w) => w.prismLaserLvl > 0 && w.railgunLvl > 0 },
  { id: "supernova_reactor", name: "☀️ SYNERGIE: JÁDRO SUPERNOVY", color: "#fb923c", check: (w) => w.overchargeCoreLvl > 0 && w.solarHaloLvl > 0 },
  { id: "cryo_shatter", name: "❄️ SYNERGIE: ABSOLUTNÍ TŘÍŠTĚNÍ", color: "#38bdf8", check: (w) => w.cryoNovaLvl > 0 && w.shockwaveLvl > 0 },
  { id: "event_horizon", name: "🌀 SYNERGIE: HORIZONT UDÁLOSTÍ", color: "#c084fc", check: (w) => w.gravCannonLvl > 0 && w.gravityAmpLvl > 0 },
  { id: "horizon_ripper", name: "⚡ SYNERGIE: ROZPAROVAČ HORIZONTU", color: "#c084fc", check: (w) => w.voidLanceLvl > 0 && w.railgunLvl > 0 },
  { id: "stellar_corona", name: "🔆 SYNERGIE: HVĚZDNÁ KORÓNA", color: "#fcee09", check: (w) => w.laserRingLvl > 0 && w.solarHaloLvl > 0 }
];

// 50 ACHIEVEMENTS / TROPHIES
const ACHIEVEMENTS_LIST = [
  { id: "first_blood", name: "PRVNÍ KREV", desc: "Znič svého prvního geometrického nepřítele v aréně.", reward: 3 },
  { id: "combo_10", name: "MISTR SYNCHRONIZACE", desc: "Dosáhni násobiče komba alespoň x10.0.", reward: 6 },
  { id: "combo_20", name: "BOŽSKÉ REFLEXE x20", desc: "Dosáhni maximálního násobiče komba x20.0!", reward: 15 },
  { id: "boss_slayer", name: "KROTITEL ARCHONŮ", desc: "Poraz svého prvního hlavního Bosse.", reward: 10 },
  { id: "pyromancer", name: "PLAZMOVÝ PYROMAN", desc: "Nainstaluj Plazmový Plamenomet a zapal 15 nepřátel.", reward: 8 },
  { id: "orbital_god", name: "BOŽÍ OKO Z ORBITY", desc: "Nainstaluj Orbitální Ion-Satelit a sežehni 5 cílů.", reward: 8 },
  { id: "boomerang_pro", name: "LOVEC HORIZONTU", desc: "Odemkni Fotonové Bumerangy a rozdrť 25 nepřátel.", reward: 8 },
  { id: "mine_master", name: "MINOVÉ POLE SMRTI", desc: "Polož 20 Kvantových Min během bojů v aréně.", reward: 8 },
  { id: "wave_6", name: "VETERÁN SINGULARITY", desc: "Přežij až do 6. vlny (AI Tier III).", reward: 10 },
  { id: "wave_10", name: "VLÁDCE DIMENZE TIER IV", desc: "Dosáhni 10. vlny s nejvyšší evolucí AI.", reward: 20 },
  { id: "wave_15", name: "NESMRTELNÝ SINGULÁŘ", desc: "Přežij až do extrémní 15. vlny!", reward: 30 },
  { id: "wave_20", name: "BOŽSTVO GALAXIE (VLNA 20)", desc: "Přežij až do legendární 20. vlny!", reward: 45 },
  { id: "overdrive_use", name: "PÁN ČASOPROSTORU", desc: "Aktivuj Kvantový Přetlak [F] pro zpomalení času.", reward: 5 },
  { id: "score_100k", name: "KYBERNETICKÁ LEGENDA", desc: "Překonej hranici 100 000 bodů v jedné hře.", reward: 12 },
  { id: "score_500k", name: "PŮLMILIONOVÝ IMPERÁTOR", desc: "Překonej hranici 500 000 bodů v jedné hře!", reward: 25 },
  { id: "score_1m", name: "MILIONOVÝ TRANSCENDENT", desc: "Překonej magickou hranici 1 000 000 bodů!", reward: 50 },
  { id: "black_hole_5", name: "ARCHITEKT HORIZONTU", desc: "Vypusť celkem 5 Kvantových černých děr.", reward: 6 },
  { id: "level_10", name: "PLNOHODNOTNÝ ARZENÁL", desc: "Dosáhni 10. úrovně lodi v jedné hře.", reward: 10 },
  { id: "level_15", name: "OMEGA KONSTRUKT LV15", desc: "Dosáhni 15. úrovně lodi v jedné hře.", reward: 20 },
  { id: "max_barrels", name: "ROJ PLAZMOVÝCH HLAVNÍ", desc: "Vylepši primární kanón na 6 nebo 7 hlavní.", reward: 12 },
  { id: "rich_cyber", name: "BANKÉŘ SINGULARITY", desc: "Měj na účtu alespoň 50 Kvantových Čipů (◈) najednou.", reward: 15 },
  { id: "synergy_unlock", name: "ALCHYMISTA FÚZE", desc: "Aktivuj v boji svou první Zbraňovou Synergii.", reward: 15 },
  { id: "wormhole_jump", name: "CESTOVATEL ČERVÍ DÍROU", desc: "Proleť vzácnou prostorovou anomálií (červí dírou).", reward: 12 },
  { id: "all_synergies", name: "TROJITÁ KONVERGENCE", desc: "Měj aktivní alespoň 3 Fúzní Synergie v jedné hře!", reward: 35 },
  { id: "combo_5", name: "KOMBO VIRTUÓZ", desc: "Dosáhni v boji kombo násobitele alespoň x5.0.", reward: 10 },
  { id: "overclock_1", name: "PRVNÍ PŘETAKTOVÁNÍ", desc: "Investuj přebytečné čipy do Kvantového Overclocku v Shopu.", reward: 15 },
  { id: "overclock_1000", name: "KVANTOVÝ MAGNÁT", desc: "Utrať celkem 500 ◈ Čipů v sekci Kvantový Overclock.", reward: 40 },
  { id: "speed_boss", name: "BLESKOVÁ EXEKUCE", desc: "Znič libovolného Bosse do 10 sekund od jeho příletu!", reward: 25 },
  { id: "stalker_master", name: "PÁN STÍNŮ", desc: "Dokonči vlnu v lodi Phantom Stalker.", reward: 12 },
  { id: "juggernaut_master", name: "ŽELEZNÁ ZEĎ", desc: "Odraz 15 nepřátelských střel v lodi Titan Juggernaut.", reward: 15 },
  { id: "mutator_win", name: "MISTR ANOMÁLIÍ", desc: "Přežij do 6. vlny se zapnutým Denním Mutátorem.", reward: 20 },
  { id: "custom_paint", name: "NEONOVÝ STYLISTA", desc: "Přizpůsob si barvu své lodi pomocí palety v Hangáru.", reward: 5 },
  { id: "kamikaze_hunter", name: "KROTITEL KAMIKADZE", desc: "Sestřel 15 sebevražedných Kamikadze Interceptorů dřív, než vybuchnou.", reward: 15 },
  { id: "whip_master", name: "KROTITEL PLAZMATU", desc: "Odemkni Plazmový Bič nebo Kvantový Minomet v boji.", reward: 10 },
  { id: "synergy_5", name: "PĚTICE ELEMENTŮ", desc: "Aktivuj 5 různých Fúzních Synergií v jediném průchodu!", reward: 50 },
  { id: "hardcore_victor", name: "DOBYVATEL HARDCORE", desc: "Dokonči 12. vlnu na obtížnost HARDCORE!", reward: 60 },
  // 14 NOVÝCH PRO PLNÝCH 50 TROFEJÍ
  { id: "boss_nemesis", name: "LOVEC PŘÍZRAKŮ", desc: "Znič fázového bosse AETHER NEMESIS.", reward: 30 },
  { id: "boss_colossus", name: "SOLÁRNÍ KOLAPS", desc: "Znič slunečního reaktorového bosse SOLARIS COLOSSUS.", reward: 30 },
  { id: "boss_seraph", name: "PÁD VALKÝRY", desc: "Znič bleskového bosse CHRONO SERAPH.", reward: 25 },
  { id: "boss_hydra", name: "TRI-CORE ROZPAD", desc: "Znič trojitého bosse NEXUS HYDRA.", reward: 25 },
  { id: "boss_leviathan", name: "DRAČÍ ZKÁZA", desc: "Znič masivního kyber-hada VOID LEVIATHAN.", reward: 30 },
  { id: "enrage_tamer", name: "ZKROCENÍ BĚSU", desc: "Znič libovolného Bosse v jeho rozzuřené Enrage fázi.", reward: 20 },
  { id: "endless_30", name: "DOBYVATEL ENDLESSU", desc: "Přežij až do 30. vlny v Endless režimu.", reward: 35 },
  { id: "endless_50", name: "TITÁN ENDLESSU", desc: "Dosáhni legendární 50. vlny v Endless režimu!", reward: 60 },
  { id: "overdrive_master", name: "PŘETLAKOVÝ BĚS", desc: "Použij Kvantový Přetlak [F] celkem 5x během jedné mise.", reward: 20 },
  { id: "clutch_dash", name: "HYPER-REFLEX", desc: "Proveď Hyper-skok s trupem poškozeným pod 20 % HP.", reward: 15 },
  { id: "arsenal_expert", name: "KVANTOVÝ PROFESOR", desc: "Měj současně vylepšeno alespoň 6 různých zbraní a modulů.", reward: 25 },
  { id: "ultra_survivor", name: "EXTRÉMNÍ PŘEŽIVŠÍ", desc: "Přežij do 6. vlny na brutální obtížnost ULTRA!", reward: 40 },
  { id: "audiophile", name: "DODÁVKA ZVUKU", desc: "Přepni v rádiu všech 9 originálních skladeb.", reward: 15 },
  { id: "chip_hoarder", name: "ČIPOVÝ MAGNET", desc: "Měj na účtu alespoň 150 Kvantových Čipů (◈) najednou.", reward: 30 }
];

// 12 PERMANENT CYBER-SHOP UPGRADES
const SHOP_ITEMS = [
  { key: "hullLvl", name: "TITANOVÉ JÁDRO TRUPU", desc: "Trvale zvyšuje startovní a maximální HP všech lodí o +25 za úroveň.", maxLvl: 6, baseCost: 8, color: "#00ffaa" },
  { key: "dmgLvl", name: "PLAZMOVÝ AKCELERÁTOR", desc: "Trvale zvyšuje poškození všech zbraní a schopností o +12 % za úroveň.", maxLvl: 6, baseCost: 10, color: "#ff007f" },
  { key: "magnetLvl", name: "GRAVITAČNÍ SBĚRAČ XP", desc: "Zvyšuje dosah přitahování XP krystalů o +60 px a zisk XP o +12 % za úroveň.", maxLvl: 5, baseCost: 8, color: "#00f3ff" },
  { key: "novaLvl", name: "KOMORA SINGULARITY", desc: "Trvale přidá +1 startovní nálož Černé díry a zvyšuje kapacitu slotů.", maxLvl: 4, baseCost: 16, color: "#fcee09" },
  { key: "overdriveLvl", name: "KVANTOVÁ BATERIE PŘETLAKU", desc: "Začínáš každou hru s +25 % nabitým Přetlakem [F] a prodlužuje jeho trvání.", maxLvl: 4, baseCost: 12, color: "#bc13fe" },
  { key: "critShopLvl", name: "OPTICKÝ KALIBRÁTOR KRITU", desc: "Trvale zvyšuje základní šanci na 2.4x Kritický zásah o +6 % za úroveň.", maxLvl: 5, baseCost: 12, color: "#f43f5e" },
  { key: "dashCdLvl", name: "SUB-PROSTOROVÉ CHLAZENÍ", desc: "Trvale zkracuje dobu nabíjení Hyper-skoku o -8 % za každou úroveň.", maxLvl: 5, baseCost: 10, color: "#38bdf8" },
  { key: "shardHunterLvl", name: "EXTRAKTOR KVANTOVÝCH ČIPŮ", desc: "Zvyšuje šanci na zisk Kvantových Čipů (◈) z Elit a přidá +2 čipy za Bosse.", maxLvl: 4, baseCost: 15, color: "#10b981" },
  // 4 NEW SHOP MODULES
  { key: "bombRadiusLvl", name: "ROZŠÍŘENÍ HORIZONTU", desc: "Zvyšuje poloměr tahu a exploze všech Černých děr o +15 % za úroveň.", maxLvl: 4, baseCost: 14, color: "#a855f7" },
  { key: "xpTeleporterLvl", name: "KVANTOVÝ TELEPORTÉR XP", desc: "Vzdálené XP krystaly se samy pomalu přitahují přes celou arénu.", maxLvl: 4, baseCost: 12, color: "#fb923c" },
  { key: "rerollDiscountLvl", name: "SYNTETIZÁTOR VYLEPŠENÍ", desc: "Snižuje potřebné množství XP pro každou další úroveň lodi o -5 %.", maxLvl: 4, baseCost: 14, color: "#67e8f9" },
  { key: "thornsArmorLvl", name: "REAKTIVNÍ PANCÍŘ", desc: "Při zásahu lodi vyšle zpětný výboj, který zraní všechny okolní nepřátele.", maxLvl: 4, baseCost: 12, color: "#f43f5e" }
];

// INFINITE QUANTUM OVERCLOCK UPGRADES (CHIP SINK)
const OVERCLOCK_ITEMS = [
  { key: "dmgOc", name: "OVERCLOCK ZBRANÍ", desc: "Trvale +2 % k poškození všech zbraní za každou úroveň.", cost: 50, color: "#ff0055" },
  { key: "spdOc", name: "OVERCLOCK MOTORŮ", desc: "Trvale +1 % k rychlosti letu a +5 Max HP za každou úroveň.", cost: 50, color: "#00f3ff" },
  { key: "xpOc", name: "OVERCLOCK REAKTORU", desc: "Trvale +35 startovních XP na začátku každé nové mise.", cost: 50, color: "#fcee09" }
];