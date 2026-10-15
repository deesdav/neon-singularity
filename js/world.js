/*************************************************************************
 * WORLD.JS - PARALLAX SPACE, AUDIO-REACTIVE SPRING-GRID & GAME CATALOGS
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
        color:
          Math.random() > 0.7
            ? "#00f3ff"
            : Math.random() > 0.5
              ? "#ff007f"
              : "#ffffff",
        twinkle: Math.random() * Math.PI * 2,
      });
    }

    this.nebulas = [
      {
        x: w * 0.22,
        y: h * 0.3,
        r: 400,
        color: "rgba(157, 0, 255, 0.09)",
        depth: 0.12,
      },
      {
        x: w * 0.78,
        y: h * 0.7,
        r: 460,
        color: "rgba(0, 243, 255, 0.08)",
        depth: 0.18,
      },
      {
        x: w * 0.52,
        y: h * 0.25,
        r: 360,
        color: "rgba(255, 0, 127, 0.08)",
        depth: 0.15,
      },
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
    const bassScale =
      1 + (sfx.beatPulse || 0) * 0.35 + (sfx.bassEnergy || 0) * 0.25;
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
      const alpha =
        0.4 + Math.sin(s.twinkle) * 0.3 + (sfx.beatPulse || 0) * 0.3;
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
        this.points[r * this.cols + c] = {
          bx: x,
          by: y,
          x: x,
          y: y,
          vx: 0,
          vy: 0,
          energy: 0,
          charge: 0,
        };
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

        const avgX = (left.x + right.x + up.x + down.x) * 0.25;
        const avgY = (left.y + right.y + up.y + down.y) * 0.25;

        ax += (avgX - p.x) * 0.025;
        ay += (avgY - p.y) * 0.025;

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
    ctx.strokeStyle =
      state.overdriveTimer > 0
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

const SHIP_CLASSES = [
  {
    id: "INTERCEPTOR",
    name: "INTERCEPTOR X-9",
    role: "ŠÍPOVÁ STÍHAČKA // ODRAZOVÉ FOTONY",
    color: "#00f3ff",
    hp: 100,
    speed: 415,
    dashCd: 1.1,
    bombs: 2,
    desc: "Ultralehká šípová stíhačka s dvojitým plazmovým pohonem. Nejvyšší rychlost a začíná s Odrazovými fotony.",
    initWeapons: {
      barrels: 2,
      fireRateLvl: 1,
      ricochetLvl: 1,
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
  },
  {
    id: "BASTION",
    name: "BASTION TITAN",
    role: "TĚŽKÝ DREADNOUGHT // AEGIS & ČEPELE",
    color: "#fcee09",
    hp: 160,
    speed: 345,
    dashCd: 1.5,
    bombs: 2,
    desc: "Masivní šestihranný křižník s bočními štíty. Začíná s Aegis bariérou, 2 Orbitálními čepelemi a tlakovým pulzem.",
    initWeapons: {
      barrels: 2,
      fireRateLvl: 1,
      ricochetLvl: 0,
      missilesLvl: 0,
      bladesLvl: 2,
      teslaLvl: 0,
      railgunLvl: 0,
      dronesLvl: 0,
      plasmaTrailLvl: 0,
      cryoNovaLvl: 0,
      aegisLvl: 1,
      critLvl: 0,
      flamethrowerLvl: 0,
      satelliteLvl: 0,
      boomerangLvl: 0,
      minesLvl: 0,
      shockwaveLvl: 1,
      gravityAmpLvl: 0,
      regenLvl: 0,
      solarHaloLvl: 0,
      swarmBotsLvl: 0,
      gravCannonLvl: 0,
      phaseMeltLvl: 0,
    },
  },
  {
    id: "TECHNOMANCER",
    name: "TECHNOMANCER VORTEX",
    role: "HVĚZDICOVÝ KŘIŽNÍK // DRONY & TESLA",
    color: "#bc13fe",
    hp: 115,
    speed: 375,
    dashCd: 1.35,
    bombs: 3,
    desc: "Experimentální plavidlo s levitujícím prstencem. Začíná s Autonomním dronem, Teslovým bleskem a 3 Černými dírami (Synergie Bouřková Matrice!).",
    initWeapons: {
      barrels: 2,
      fireRateLvl: 1,
      ricochetLvl: 0,
      missilesLvl: 0,
      bladesLvl: 0,
      teslaLvl: 1,
      railgunLvl: 0,
      dronesLvl: 1,
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
  },
  {
    id: "WRAITH",
    name: "PHANTOM WRAITH",
    role: "KRITICKÝ ZABIJÁK // BUMERANGY & RAILGUN",
    color: "#ff0055",
    hp: 95,
    speed: 400,
    dashCd: 1.15,
    bombs: 2,
    desc: "Agresivní kosmický predátor s dvojitými kosami. Začíná s Fotonovými Bumerangy a Kritickým přetaktovačem LV2.",
    initWeapons: {
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
      critLvl: 2,
      flamethrowerLvl: 0,
      satelliteLvl: 0,
      boomerangLvl: 1,
      minesLvl: 0,
      shockwaveLvl: 0,
      gravityAmpLvl: 0,
      regenLvl: 0,
      solarHaloLvl: 0,
      swarmBotsLvl: 0,
      gravCannonLvl: 0,
      phaseMeltLvl: 0,
    },
  },
  {
    id: "SERAPH",
    name: "SOLAR SERAPH",
    role: "OHNIVÁ VALKÝRA // PLAMENOMET & STOPA",
    color: "#ff6600",
    hp: 125,
    speed: 385,
    dashCd: 1.25,
    bombs: 2,
    desc: "Čtyřkřídlá solární valkýra. Od samého startu spaluje nepřátele Plazmovým Plamenometem a hořící stopou.",
    initWeapons: {
      barrels: 2,
      fireRateLvl: 1,
      ricochetLvl: 0,
      missilesLvl: 0,
      bladesLvl: 0,
      teslaLvl: 0,
      railgunLvl: 0,
      dronesLvl: 0,
      plasmaTrailLvl: 1,
      cryoNovaLvl: 0,
      aegisLvl: 0,
      critLvl: 0,
      flamethrowerLvl: 1,
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
  },
  {
    id: "ARCHITECT",
    name: "OMEGA ARCHITECT",
    role: "VLÁDCE GRAVITACE // MINY, SATELIT & 4x NOVA",
    color: "#00ffaa",
    hp: 135,
    speed: 360,
    dashCd: 1.4,
    bombs: 4,
    desc: "Kvantový konstrukt. Začíná s Orbitálním Satelitem, Kvantovými minami a 4 zesílenými Černými dírami (Synergie Hvězdná Singularita!).",
    initWeapons: {
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
      satelliteLvl: 1,
      boomerangLvl: 0,
      minesLvl: 1,
      shockwaveLvl: 0,
      gravityAmpLvl: 1,
      regenLvl: 0,
      solarHaloLvl: 0,
      swarmBotsLvl: 0,
      gravCannonLvl: 0,
      phaseMeltLvl: 0,
    },
  },
];

// 3 WEAPON SYNERGIES (FUSIONS)
const SYNERGIES_LIST = [
  {
    id: "solar_supernova",
    name: "🔥 SYNERGIE: SLUNEČNÍ SUPERNOVA",
    color: "#ff6600",
    check: (w) => w.flamethrowerLvl > 0 && w.boomerangLvl > 0,
  },
  {
    id: "storm_matrix",
    name: "⚡ SYNERGIE: BOUŘKOVÁ MATRICE",
    color: "#5ffbff",
    check: (w) => w.teslaLvl > 0 && w.dronesLvl > 0,
  },
  {
    id: "stellar_singularity",
    name: "🌌 SYNERGIE: HVĚZDNÁ SINGULARITA",
    color: "#ff007f",
    check: (w) => w.gravityAmpLvl > 0 && w.satelliteLvl > 0,
  },
];

// 24 ACHIEVEMENTS / TROPHIES
const ACHIEVEMENTS_LIST = [
  {
    id: "first_blood",
    name: "PRVNÍ KREV",
    desc: "Znič svého prvního geometrického nepřítele v aréně.",
    reward: 3,
  },
  {
    id: "combo_10",
    name: "MISTR SYNCHRONIZACE",
    desc: "Dosáhni násobiče komba alespoň x10.0.",
    reward: 6,
  },
  {
    id: "combo_20",
    name: "BOŽSKÁ REFLEXE x20",
    desc: "Dosáhni maximálního násobiče komba x20.0!",
    reward: 15,
  },
  {
    id: "boss_slayer",
    name: "KROTITEL ARCHONŮ",
    desc: "Poraz svého prvního vícefázového Bosse.",
    reward: 10,
  },
  {
    id: "pyromancer",
    name: "PLAZMOVÝ PYROMAN",
    desc: "Nainstaluj Plazmový Plamenomet a zapal 15 nepřátel.",
    reward: 8,
  },
  {
    id: "orbital_god",
    name: "BOŽÍ OKO Z ORBITY",
    desc: "Nainstaluj Orbitální Ion-Satelit a sežehni cíle.",
    reward: 8,
  },
  {
    id: "boomerang_pro",
    name: "LOVEC HORIZONTU",
    desc: "Odemkni Fotonové Bumerangy a rozdrť 25 nepřátel.",
    reward: 8,
  },
  {
    id: "mine_master",
    name: "MINOVÉ POLE SMRTI",
    desc: "Polož 20 Kvantových Min během bojů v aréně.",
    reward: 8,
  },
  {
    id: "wave_6",
    name: "VETERÁN SINGULARITY",
    desc: "Přežij až do 6. vlny (AI Tier III).",
    reward: 10,
  },
  {
    id: "wave_10",
    name: "VLÁDCE DIMENZE TIER IV",
    desc: "Dosáhni 10. vlny s nejvyšší evolucí AI.",
    reward: 20,
  },
  {
    id: "wave_15",
    name: "NESMRTELNÝ SINGULÁR",
    desc: "Přežij až do extrémní 15. vlny!",
    reward: 30,
  },
  {
    id: "wave_20",
    name: "BOŽSTVO GALAXIE (VLNA 20)",
    desc: "Přežij až do legendární 20. vlny!",
    reward: 45,
  },
  {
    id: "overdrive_use",
    name: "PÁN ČASOPROSTORU",
    desc: "Aktivuj Kvantový Přetlak [F] pro zpomalení času.",
    reward: 5,
  },
  {
    id: "score_100k",
    name: "KYBERNETICKÁ LEGENDA",
    desc: "Překonej hranici 100 000 bodů v jedné hře.",
    reward: 12,
  },
  {
    id: "score_500k",
    name: "PŮLMILIONOVÝ IMPERÁTOR",
    desc: "Překonej hranici 500 000 bodů v jedné hře!",
    reward: 25,
  },
  {
    id: "score_1m",
    name: "MILIONOVÝ TRANSCENDENT",
    desc: "Překonej magickou hranici 1 000 000 bodů!",
    reward: 50,
  },
  {
    id: "black_hole_5",
    name: "ARCHITEKT HORIZONTU",
    desc: "Vypusť celkem 5 Kvantových Černých děr.",
    reward: 6,
  },
  {
    id: "level_10",
    name: "PLNOHODNOTNÝ ARZENÁL",
    desc: "Dosáhni 10. úrovně lodi v jedné hře.",
    reward: 10,
  },
  {
    id: "level_15",
    name: "OMEGA KONSTRUKT LV15",
    desc: "Dosáhni 15. úrovně lodi v jedné hře.",
    reward: 20,
  },
  {
    id: "max_barrels",
    name: "ROJ PLAZMOVÝCH HLAVNÍ",
    desc: "Vylepši primární kanón na 6 nebo 7 hlavní.",
    reward: 12,
  },
  {
    id: "rich_cyber",
    name: "BANKÉŘ SINGULARITY",
    desc: "Měj na účtu alespoň 50 Kvantových Čipů (◈) najednou.",
    reward: 15,
  },
  {
    id: "synergy_unlock",
    name: "ALCHYMISTA FÚZE",
    desc: "Aktivuj v boji svou první Zbraňovou Synergii.",
    reward: 15,
  },
  {
    id: "wormhole_jump",
    name: "CESTOVATEL ČERVÍ DÍROU",
    desc: "Proleť vzácnou prostorovou anomálií (Červí dírou).",
    reward: 12,
  },
  {
    id: "all_synergies",
    name: "TROJITÁ KONVERGENCE",
    desc: "Měj aktivní všechny 3 Fúzní Synergie v jedné hře!",
    reward: 35,
  },
];

// 8 PERMANENT CYBER-SHOP UPGRADES
const SHOP_ITEMS = [
  {
    key: "hullLvl",
    name: "TITANOVÉ JÁDRO TRUPU",
    desc: "Trvale zvyšuje startovní a maximální HP všech lodí o +25 za každou úroveň.",
    maxLvl: 6,
    baseCost: 8,
    color: "#00ffaa",
  },
  {
    key: "dmgLvl",
    name: "PLAZMOVÝ AKCELERÁTOR",
    desc: "Trvale zvyšuje poškození všech zbraní, plamenometu i satelitu o +12 % za úroveň.",
    maxLvl: 6,
    baseCost: 10,
    color: "#ff007f",
  },
  {
    key: "magnetLvl",
    name: "GRAVITAČNÍ SBĚRAČ XP",
    desc: "Zvyšuje dosah přitahování XP krystalů o +60 px a zisk XP o +12 % za úroveň.",
    maxLvl: 5,
    baseCost: 8,
    color: "#00f3ff",
  },
  {
    key: "novaLvl",
    name: "KOMORA SINGULARITY",
    desc: "Trvale přidává +1 startovní nálož Černé díry a zvyšuje kapacitu slotů.",
    maxLvl: 4,
    baseCost: 16,
    color: "#fcee09",
  },
  {
    key: "overdriveLvl",
    name: "KVANTOVÁ BATERIE PŘETLAKU",
    desc: "Začínáš každou hru s +25 % nabitým Přetlakem [F] za úroveň a prodlužuje jeho trvání.",
    maxLvl: 4,
    baseCost: 12,
    color: "#bc13fe",
  },
  {
    key: "critShopLvl",
    name: "OPTICKÝ KALIBRÁTOR KRITU",
    desc: "Trvale zvyšuje základní šanci na 2.4x Kritický zásah o +6 % za každou úroveň.",
    maxLvl: 5,
    baseCost: 12,
    color: "#f43f5e",
  },
  {
    key: "dashCdLvl",
    name: "SUB-PROSTOROVÉ CHLAZENÍ",
    desc: "Trvale zkracuje dobu nabíjení Hyper-skoku o -8 % za každou úroveň.",
    maxLvl: 5,
    baseCost: 10,
    color: "#38bdf8",
  },
  {
    key: "shardHunterLvl",
    name: "EXTRAKTOR KVANTOVÝCH ČIPŮ",
    desc: "Zvyšuje šanci na zisk Kvantových čipů (◈) z Elit a přidává +2 čipy za každého Bosse.",
    maxLvl: 4,
    baseCost: 15,
    color: "#10b981",
  },
];
