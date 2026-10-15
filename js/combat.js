// 24 ROGUELITE UPGRADE MODULES
const UPGRADE_POOL = [
    {
        id: 'solar_halo', name: 'SLUNEČNÍ AURA', subtitle: 'PERMANENTNÍ ŽHNOUCÍ PRSTENEC',
        desc: 'Kolem lodi pulzuje žhnoucí sluneční koróna, která automaticky spaluje a zpomaluje blízké nepřátele.',
        color: '#fb923c', apply: () => { player.weapons.solarHaloLvl++; }
    },
    {
        id: 'swarm_bots', name: 'ROJ LOVECKÝCH NANOBOTŮ', subtitle: 'SAMONAVÁDĚCÍ KYBER-HMYZ',
        desc: 'Vypouští rychlé zeleno-zlaté nanoboty, kteří vyhledávají oslabené cíle a rozkládají jejich štíty.',
        color: '#a3e635', apply: () => { player.weapons.swarmBotsLvl++; }
    },
    {
        id: 'grav_cannon', name: 'GRAVITAČNÍ DĚLO', subtitle: 'TĚŽKÉ IMPLODUJÍCÍ KULE',
        desc: 'Střílí pomalé temné sféry, které po nárazu přitáhnou okolní nepřátele do jednoho bodu.',
        color: '#c084fc', apply: () => { player.weapons.gravCannonLvl++; }
    },
    {
        id: 'phase_melt', name: 'FÁZOVÝ ROZKLAD PANCÍŘE', subtitle: '+25 % POŠKOZENÍ DO BOSSŮ & ELIT',
        desc: 'Střely narušují molekulární vazby – Elity a Bossové dostávají o +25 % vyšší poškození ze všech zdrojů.',
        color: '#f43f5e', apply: () => { player.weapons.phaseMeltLvl++; }
    },
    {
        id: 'boomerang', name: 'FOTONOVÉ BUMERANGY', subtitle: 'VRACEJÍCÍ SE ENERGETICKÉ SRPY',
        desc: 'Vypouští rotující fotonové bumerangy. (Synergie s Plamenometem -> Sluneční Supernova!)',
        color: '#00ffaa', apply: () => { player.weapons.boomerangLvl++; }
    },
    {
        id: 'mines', name: 'ROJ KVANTOVÝCH MIN', subtitle: 'MAGNETICKÉ PROSTOROVÉ MINY',
        desc: 'Loď za sebou klade pulzující kvantové miny, které se přitáhnou k blízkým nepřátelům a vybuchnou.',
        color: '#fcee09', apply: () => { player.weapons.minesLvl++; }
    },
    {
        id: 'shockwave', name: 'KINETICKÁ TLAKOVÁ VLNA', subtitle: 'ODRAZOVÝ PULZ KOLEM LODI',
        desc: 'Periodicky vysílá prstencovou rázovou vlnu, která odhodí nepřátele, smaže blízké střely a nabije mřížku.',
        color: '#38bdf8', apply: () => { player.weapons.shockwaveLvl++; }
    },
    {
        id: 'gravity_amp', name: 'DRTIČ GRAVITACE', subtitle: '+35 % DOSAH & SÍLA ČERNÉ DÍRY',
        desc: 'Zvětšuje Černé díry o +35 % a přidá +1 nálož. (Synergie se Satelitem -> Hvězdná Singularita!)',
        color: '#bc13fe', apply: () => {
            player.weapons.gravityAmpLvl++;
            player.bombs = Math.min(player.maxBombs, player.bombs + 1);
        }
    },
    {
        id: 'regen', name: 'NANOBOTNÍ REGENERACE', subtitle: 'AUTOMATICKÁ OPRAVA TRUPU V BOJI',
        desc: 'Nanoboty plynule opravují trup lodi (+3.5 HP/s za úroveň) a zvýší Max HP o +15.',
        color: '#10b981', apply: () => {
            player.weapons.regenLvl++;
            player.maxHp += 15;
            player.hp = Math.min(player.maxHp, player.hp + 25);
        }
    },
    {
        id: 'flamethrower', name: 'PLAZMOVÝ PLAMENOMET', subtitle: 'KUŽEL PLAZMATU & ZAPÁLENÍ',
        desc: 'Chrlí žhnoucí proud plazmatu. (Synergie s Bumerangy -> Sluneční Supernova!)',
        color: '#ff5500', apply: () => { player.weapons.flamethrowerLvl++; }
    },
    {
        id: 'satellite', name: 'ORBITÁLNÍ ION-SATELIT', subtitle: 'ORBITÁLNÍ LASEROVÝ ÚDER',
        desc: 'Satelit sesílá iontové sloupy energie. (Synergie s Drtičem Gravitace -> Hvězdná Singularita!)',
        color: '#ff0055', apply: () => { player.weapons.satelliteLvl++; }
    },
    {
        id: 'barrels', name: 'KVANTOVÉ HLAVNĚ', subtitle: '+1 PLAZMOVÝ PROUD',
        desc: 'Přidá další hlaveň k primárnímu pulznímu kanónu a rozšíří zbraňové věže na trupu lodi.',
        color: '#00f3ff', apply: () => {
            player.weapons.barrels = Math.min(7, player.weapons.barrels + 1);
            if (player.weapons.barrels >= 6) unlockAchievement('max_barrels');
        }
    },
    {
        id: 'firerate', name: 'HYPER-KONDENZÁTOR', subtitle: '+22 % KADENCE & POHYB',
        desc: 'Zvyšuje rychlost nabíjení zbraní a zrychluje trysky vznášedla.',
        color: '#fcee09', apply: () => { player.weapons.fireRateLvl++; player.speed += 22; }
    },
    {
        id: 'ricochet', name: 'ODRAZOVÉ FOTONY', subtitle: '+1 ODRAZ & PRŮRAZNOST',
        desc: 'Střely se odrážejí od stěn arény a pronikají skrz pancíře více nepřátel.',
        color: '#00ffaa', apply: () => { player.weapons.ricochetLvl++; }
    },
    {
        id: 'missiles', name: 'ROJ MIKRORAKET', subtitle: 'NAVÁDĚNÁ SALVA',
        desc: 'Vypouští salvu kybernetických mikroraket, které samy pronásledují cíle.',
        color: '#ff007f', apply: () => { player.weapons.missilesLvl++; }
    },
    {
        id: 'railgun', name: 'KVANTOVÝ RAILGUN', subtitle: 'PRŮRAZNÝ HYPER-PAPRSEK',
        desc: 'Namontuje na příď lodi dlouhý Railgun, který vystřeluje okamžitý paprsek přes celou arénu.',
        color: '#ff0055', apply: () => { player.weapons.railgunLvl++; }
    },
    {
        id: 'drones', name: 'AUTONOMNÍ DRONY', subtitle: '+1 ÚTOČNÝ WINGMAN DRON',
        desc: 'Kolem lodi krouží bojové drony. (Synergie s Teslou -> Bouřková Matrice!)',
        color: '#38bdf8', apply: () => { player.weapons.dronesLvl = Math.min(4, player.weapons.dronesLvl + 1); }
    },
    {
        id: 'blades', name: 'ORBITÁLNÍ ČEPELE', subtitle: 'ROTUJÍCÍ PLAZMOVÉ KOTOUČE',
        desc: 'Energetické disky drtící nepřátele i nepřátelské projektily v těsné blízkosti.',
        color: '#bc13fe', apply: () => { player.weapons.bladesLvl = Math.min(6, player.weapons.bladesLvl + 1); }
    },
    {
        id: 'tesla', name: 'TESLŮV OBLOUK', subtitle: 'ŘETĚZOVÝ BLESK',
        desc: 'Vysokonapěťový výboj přeskakující mezi nepřáteli. (Synergie s Drony -> Bouřková Matrice!)',
        color: '#5ffbff', apply: () => { player.weapons.teslaLvl++; }
    },
    {
        id: 'trail', name: 'PLAZMOVÁ STOPA', subtitle: 'HOŘÍCÍ STOPA ZA LODÍ',
        desc: 'Při pohybu a Hyper-Skoku zanechává loď žhnoucí plazmové zóny, které taví pronásledovatele.',
        color: '#fb923c', apply: () => { player.weapons.plasmaTrailLvl++; }
    },
    {
        id: 'cryo', name: 'KRYO-PULZNÍ POLE', subtitle: 'MRAZIVÁ TLAKOVÁ VLNA',
        desc: 'Vysílá sub-nulový pulz, který zpomalí okolní nepřátele na 45 % rychlosti.',
        color: '#67e8f9', apply: () => { player.weapons.cryoNovaLvl++; }
    },
    {
        id: 'aegis', name: 'ENERGETICKÝ ŠTÍT AEGIS', subtitle: 'AUTOMATICKÁ BARIÉRA',
        desc: 'Vytvoří dobíjecí silové pole, které plně pohltí zásah a vyvolá odrazovou vlnu.',
        color: '#60a5fa', apply: () => { player.weapons.aegisLvl++; player.aegisReady = true; player.aegisCooldown = 0; }
    },
    {
        id: 'crit', name: 'KRITICKÝ PŘETAKTOVAČ', subtitle: '2.4x KRITICKÉ ZÁSAHY & OPRAVY',
        desc: 'Zvyšuje šanci na kritické poškození o +15 % a zničení Elit/Bossů opravuje trup.',
        color: '#f43f5e', apply: () => { player.weapons.critLvl++; }
    },
    {
        id: 'nova_core', name: 'JÁDRO SINGULARITY', subtitle: '+1 ČERNÁ DÍRA & +30 MAX TRUP',
        desc: 'Doplní +1 nálož Černé díry, zvýší maximální integritu trupu o +30 a opraví 60 HP.',
        color: '#ff9900', apply: () => { player.maxHp += 30; player.hp = Math.min(player.maxHp, player.hp + 60); player.bombs = Math.min(player.maxBombs, player.bombs + 1); }
    }
];

function selectUpgradeCard(index) {
    if (state.mode !== 'UPGRADE' || !currentUpgradeChoices[index]) return;
    const upg = currentUpgradeChoices[index];
    upg.apply();
    checkWeaponSynergies();
    updateHUD();
    document.getElementById('upgrade-modal').classList.add('hidden');
    document.getElementById('upgrade-modal').classList.remove('flex');
    state.mode = 'PLAYING';
    saveGameProgress(true, currentSaveSlot);
    spawnShockwave(player.x, player.y, 340, upg.color, 5, 560);
    spawnLensFlare(player.x, player.y, upg.color, 450);
    grid.applyForce(player.x, player.y, 300, 40, false, true);
    addFloatingText(player.x, player.y - 30, `${upg.name} AKTIVNÍ!`, upg.color, 1.3);
}

function triggerUpgradeSelection() {
    state.mode = 'UPGRADE';
    sfx.playLevelUp();

    const container = document.getElementById('upgrade-cards-container');
    container.innerHTML = '';
    currentUpgradeChoices = [...UPGRADE_POOL].sort(() => Math.random() - 0.5).slice(0, 3);
    const dpadHints = ['⬅️ D-PAD VLEVO', '⬆️ D-PAD NAHORU', '➡️ D-PAD VPRAVO'];

    currentUpgradeChoices.forEach((upg, idx) => {
        const card = document.createElement('div');
        card.className = 'cyber-card p-6 flex flex-col justify-between';
        card.innerHTML = `
            <div>
                <div class="flex justify-between items-center mb-1">
                    <span class="text-xs font-orbitron tracking-widest uppercase" style="color: ${upg.color}">${upg.subtitle}</span>
                    <span class="px-2 py-0.5 bg-slate-900 border border-slate-700 font-orbitron text-[9px] text-yellow-300">[${idx + 1}] / [${dpadHints[idx]}]</span>
                </div>
                <h3 class="font-orbitron text-2xl font-black text-white mb-3">${upg.name}</h3>
                <p class="text-sm text-slate-300 leading-relaxed mb-5">${upg.desc}</p>
            </div>
            <div class="pt-3 border-t border-cyan-500/20 flex justify-between items-center">
                <span class="font-orbitron text-xs text-cyan-300 font-bold">INSTALOVAT MODUL</span>
                <span class="font-orbitron text-lg font-black" style="color: ${upg.color}">→</span>
            </div>
        `;
        card.addEventListener('click', () => selectUpgradeCard(idx));
        container.appendChild(card);
    });

    document.getElementById('upgrade-modal').classList.remove('hidden');
    document.getElementById('upgrade-modal').classList.add('flex');
}

function getAITier() {
    if (state.wave >= 10) return 4;
    if (state.wave >= 6) return 3;
    if (state.wave >= 3) return 2;
    return 1;
}

function spawnRareWormholePair() {
    const margin = 140;
    const x1 = margin + Math.random() * (W * 0.35 - margin);
    const y1 = margin + Math.random() * (H - margin * 2);
    const x2 = W * 0.65 + Math.random() * (W * 0.35 - margin);
    const y2 = margin + Math.random() * (H - margin * 2);

    wormholes.push({
        x1, y1, x2, y2,
        radius: 30,
        angle: 0,
        life: 24.0
    });
    spawnShockwave(x1, y1, 140, '#00f3ff', 3, 400);
    spawnShockwave(x2, y2, 140, '#ff6600', 3, 400);
    addFloatingText(W / 2, 110, '🌀 ANOMÁLIE DETEKOVÁNA: PROSTOROVÁ ČERVÍ DÍRA!', '#00f3ff', 1.25);
}

function spawnSupplyPod() {
    const margin = 90;
    const x = margin + Math.random() * (W - margin * 2);
    const y = margin + Math.random() * (H - margin * 2);
    const types = [
        { kind: 'HEAL', label: 'OPRAVNÝ NANOBOT (+45 HP)', color: '#00ffaa' },
        { kind: 'MAGNET', label: 'KVANTOVÝ MAGNET XP!', color: '#fcee09' },
        { kind: 'NOVA', label: '+1 ČERNÁ DÍRA & PŘETLAK', color: '#ff007f' }
    ];
    const chosen = types[Math.floor(Math.random() * types.length)];
    supplyPods.push({ x, y, kind: chosen.kind, label: chosen.label, color: chosen.color, radius: 18, angle: 0, life: 14.0 });
    spawnShockwave(x, y, 90, chosen.color, 2.5, 340);
    addFloatingText(x, y - 24, 'ZÁSOBOVACÍ POD VYSÁZEN!', chosen.color, 1.0);
}

function spawnEnemy(forcedType = null, xOverride = null, yOverride = null) {
    let x = xOverride, y = yOverride;
    if (x === null || y === null) {
        const margin = 55;
        for (let tries = 0; tries < 12; tries++) {
            x = margin + Math.random() * (W - margin * 2);
            y = margin + Math.random() * (H - margin * 2);
            if (Math.hypot(x - player.x, y - player.y) > 290) break;
        }
    }

    const tier = getAITier();
    const diffHpMult = state.difficulty === 'HARDCORE' ? 1.25 : 1.0;
    const diffSpdMult = state.difficulty === 'HARDCORE' ? 1.12 : 1.0;
    const playerPowerFactor = 1 + (player.level - 1) * 0.16;
    const waveScale = (1 + (state.wave - 1) * 0.28) * playerPowerFactor * diffHpMult;

    let type = forcedType;
    if (!type) {
        const r = Math.random();
        if (r < 0.34) type = 'CHASER';
        else if (r < 0.56) type = 'WEAVER';
        else if (r < 0.72) type = 'SPLITTER';
        else if (r < 0.85) type = 'JUGGERNAUT';
        else if (r < 0.94 && state.wave >= 2) type = 'PHANTOM';
        else type = state.wave >= 3 ? 'GUARDIAN' : 'JUGGERNAUT';
    }

    const eliteChance = Math.min(0.65, (state.wave - 1) * 0.08 + (state.difficulty === 'HARDCORE' ? 0.12 : 0));
    const isElite = Math.random() < eliteChance && type !== 'MINI_SWARM';
    const shieldMult = isElite ? 0.55 : (tier >= 3 ? 0.25 : 0);

    if (type === 'CHASER') {
        const baseHp = 38 * waveScale;
        enemies.push({
            type, x, y, vx: 0, vy: 0, radius: isElite ? 18 : 15,
            hp: baseHp, maxHp: baseHp, shield: baseHp * shieldMult, maxShield: baseHp * shieldMult,
            speed: (205 + Math.min(115, state.wave * 7)) * diffSpdMult, color: '#ff007f', score: 140,
            angle: 0, spin: 5.5, strafeDir: Math.random() < 0.5 ? 1 : -1, strafeTimer: 0.8,
            slowTimer: 0, burnTimer: 0, isElite
        });
    } else if (type === 'WEAVER') {
        const baseHp = 68 * waveScale;
        enemies.push({
            type, x, y, vx: 0, vy: 0, radius: 20,
            hp: baseHp, maxHp: baseHp, shield: baseHp * shieldMult, maxShield: baseHp * shieldMult,
            speed: 140 * diffSpdMult, color: '#bc13fe', score: 260, angle: 0, spin: 2.6,
            shootTimer: 1.4 + Math.random(), slowTimer: 0, burnTimer: 0, isElite
        });
    } else if (type === 'SPLITTER') {
        const baseHp = 92 * waveScale;
        enemies.push({
            type, x, y, vx: 0, vy: 0, radius: 23,
            hp: baseHp, maxHp: baseHp, shield: baseHp * shieldMult, maxShield: baseHp * shieldMult,
            speed: 145 * diffSpdMult, color: '#fcee09', score: 310, angle: 0, spin: 3.2,
            slowTimer: 0, burnTimer: 0, isElite
        });
    } else if (type === 'MINI_SWARM') {
        const baseHp = 22 * waveScale;
        enemies.push({
            type, x, y, vx: (Math.random() - 0.5) * 260, vy: (Math.random() - 0.5) * 260,
            radius: 10, hp: baseHp, maxHp: baseHp, shield: 0, maxShield: 0,
            speed: 285 * diffSpdMult, color: '#00ffaa', score: 85, angle: 0, spin: 9.0,
            slowTimer: 0, burnTimer: 0, isElite: false
        });
    } else if (type === 'JUGGERNAUT') {
        const baseHp = 175 * waveScale;
        enemies.push({
            type, x, y, vx: 0, vy: 0, radius: 27,
            hp: baseHp, maxHp: baseHp, shield: baseHp * 0.4, maxShield: baseHp * 0.4,
            speed: 108 * diffSpdMult, color: '#00f3ff', score: 460,
            angle: Math.atan2(player.y - y, player.x - x), spin: 0, shootTimer: 2.2,
            slowTimer: 0, burnTimer: 0, isElite: true
        });
    } else if (type === 'PHANTOM') {
        const baseHp = 82 * waveScale;
        enemies.push({
            type, x, y, vx: 0, vy: 0, radius: 18,
            hp: baseHp, maxHp: baseHp, shield: baseHp * 0.5, maxShield: baseHp * 0.5,
            speed: 110 * diffSpdMult, color: '#ff2a85', score: 380, angle: 0, spin: 4.0,
            shootTimer: 2.2, teleportTimer: 3.5, aiming: false,
            slowTimer: 0, burnTimer: 0, isElite: true
        });
    } else if (type === 'GUARDIAN') {
        const baseHp = 135 * waveScale;
        enemies.push({
            type, x, y, vx: 0, vy: 0, radius: 22,
            hp: baseHp, maxHp: baseHp, shield: baseHp * 0.6, maxShield: baseHp * 0.6,
            speed: 85 * diffSpdMult, color: '#38bdf8', score: 420, angle: 0, spin: 1.8,
            pulseTimer: 1.6, slowTimer: 0, burnTimer: 0, isElite: true
        });
    } else if (type === 'BOSS') {
        state.bossActive = true;
        const bossIndex = Math.floor(((state.wave / 3) - 1) % 4);
        const bossProfiles = [
            { subtype: 'ARCHON', name: 'OMEGA ARCHON // SINGULARITA', color: '#ff0055', hpMult: 1.0, radius: 56 },
            { subtype: 'SERAPH', name: 'CHRONO SERAPH // VALKÝRA', color: '#fcee09', hpMult: 0.92, radius: 52 },
            { subtype: 'HYDRA', name: 'NEXUS HYDRA // TRI-CORE MATRIX', color: '#00ffaa', hpMult: 1.15, radius: 58 },
            { subtype: 'LEVIATHAN', name: 'VOID LEVIATHAN // KYBER-HAD', color: '#bc13fe', hpMult: 1.25, radius: 54 }
        ];
        const profile = bossProfiles[bossIndex];
        const bossHp = 2100 * waveScale * profile.hpMult;

        const bossObj = {
            type: 'BOSS', subtype: profile.subtype, name: profile.name,
            x: W / 2, y: 130, vx: 0, vy: 0, radius: profile.radius,
            hp: bossHp, maxHp: bossHp, shield: bossHp * 0.25, maxShield: bossHp * 0.25,
            speed: 115 * diffSpdMult, color: profile.color, score: 6500, angle: 0, spin: 1.3,
            shootTimer: 1.1, phaseTimer: 0, slowTimer: 0, burnTimer: 0,
            isElite: true, segments: []
        };

        if (profile.subtype === 'LEVIATHAN') {
            for (let s = 0; s < 8; s++) bossObj.segments.push({ x: W / 2, y: 130 - s * 28, angle: Math.PI / 2 });
        }

        enemies.push(bossObj);
        document.getElementById('boss-name').textContent = profile.name;
        document.getElementById('boss-hud').classList.remove('hidden');
        document.getElementById('boss-hud').classList.add('flex');
        document.getElementById('ghost-boss-bar-wrap').classList.remove('hidden');
        document.getElementById('ghost-boss-bar-wrap').classList.add('flex');
        addFloatingText(W / 2, H / 2 - 80, `VAROVÁNÍ: ${profile.name}!`, profile.color, 1.45);
        spawnShockwave(W / 2, 130, 460, profile.color, 6, 520);
        spawnLensFlare(W / 2, 130, profile.color, 700);
        grid.applyForce(W / 2, 130, 440, 70, false, true);
        state.chromatic = 1.0;
    }

    spawnShockwave(x, y, 48, '#ffffff', 2, 260);
    grid.applyForce(x, y, 110, 14, false);
}

// KVANTOVÁ EXPLOZE (PŘI NABITÍ PŘETLAKU NA 100 % NEBO JEHO AKTIVACI)
function unleashQuantumExplosion(isInitialCharge = false) {
    spawnShockwave(player.x, player.y, 750, '#fcee09', 8, 920);
    spawnShockwave(player.x, player.y, 520, '#00f3ff', 5, 680);
    spawnLensFlare(player.x, player.y, '#fcee09', 900);
    grid.applyForce(player.x, player.y, 640, 115, false, true);
    state.chromatic = 1.0;
    state.shake = Math.max(state.shake, 22);

    // Okamžité vymazání všech běžných nepřátelských projektilů v aréně
    enemyBullets.length = 0;

    // Bleskový výboj do všech nepřátel na obrazovce
    const blastDmg = (isInitialCharge ? 140 : 280) * player.dmgMult;
    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        lightningArcs.push({ x1: player.x, y1: player.y, x2: e.x, y2: e.y, life: 0.32, color: '#fcee09' });
        e.slowTimer = Math.max(e.slowTimer || 0, 3.5);
        damageEnemy(e, blastDmg, '#fcee09', true);
    }
}

function triggerQuantumOverdrive() {
    if (state.mode !== 'PLAYING' || state.overdrive < 100 || state.overdriveTimer > 0) return;
    state.overdrive = 0;
    state.overdriveTimer = 5.5 + (meta.upgrades.overdriveLvl || 0) * 0.8;
    unlockAchievement('overdrive_use');
    sfx.playLevelUp();

    unleashQuantumExplosion(false);
    addFloatingText(player.x, player.y - 42, '⚡ KVANTOVÁ EXPLOZE & PŘETLAK AKTIVNÍ!', '#fcee09', 1.45);
    updateHUD();
}

function firePhotonBoomerangs() {
    const count = player.weapons.boomerangLvl;
    const isSupernova = player.weapons.flamethrowerLvl > 0;
    for (let i = 0; i < count; i++) {
        const a = player.angle + (i - (count - 1) / 2) * 0.4;
        boomerangs.push({
            x: player.x, y: player.y,
            vx: Math.cos(a) * 680, vy: Math.sin(a) * 680,
            returning: false,
            spinAngle: 0,
            life: 2.2,
            isSupernova,
            dmg: (52 + player.weapons.boomerangLvl * 20) * player.dmgMult * (isSupernova ? 1.35 : 1.0),
            color: isSupernova ? '#ff6600' : '#00ffaa'
        });
    }
    sfx.playLaser(0.75);
}

function dropQuantumMine() {
    mines.push({
        x: player.x, y: player.y,
        radius: 14,
        triggerRadius: 95 + player.weapons.minesLvl * 15,
        blastRadius: 145 + player.weapons.minesLvl * 20,
        dmg: (110 + player.weapons.minesLvl * 40) * player.dmgMult,
        pulse: 0,
        life: 14.0
    });
    meta.stats.minesDropped = (meta.stats.minesDropped || 0) + 1;
    if (meta.stats.minesDropped >= 20) unlockAchievement('mine_master');
}

function triggerKineticShockwave(customRadius = null, customDmg = null, customCol = '#38bdf8') {
    const radius = customRadius || (210 + player.weapons.shockwaveLvl * 45);
    spawnShockwave(player.x, player.y, radius, customCol, 4.5, 580);
    grid.applyForce(player.x, player.y, radius, 42, false, true);

    for (const e of enemies) {
        const dx = e.x - player.x;
        const dy = e.y - player.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d <= radius) {
            const push = (1 - d / radius) * (e.type === 'BOSS' ? 35 : 165);
            e.x += (dx / d) * push;
            e.y += (dy / d) * push;
            const dmg = customDmg || ((35 + player.weapons.shockwaveLvl * 18) * player.dmgMult);
            damageEnemy(e, dmg, customCol, true);
        }
    }
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
        if (Math.hypot(enemyBullets[i].x - player.x, enemyBullets[i].y - player.y) <= radius * 0.85) {
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
        const cols = ['#ff3300', '#ff8800', '#fcee09'];
        particles.push({
            x: player.x + Math.cos(player.angle) * 18,
            y: player.y + Math.sin(player.angle) * 18,
            vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
            color: cols[Math.floor(Math.random() * cols.length)],
            size: 3.5 + Math.random() * 2.5, life: 0.28 + Math.random() * 0.16,
            maxLife: 0.42, drag: 0.92
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
                const diff = Math.abs(Math.atan2(Math.sin(angleToEnemy - player.angle), Math.cos(angleToEnemy - player.angle)));
                if (diff <= coneHalfAngle) {
                    if (!e.burnTimer || e.burnTimer <= 0) {
                        meta.stats.burnedCount = (meta.stats.burnedCount || 0) + 1;
                        if (meta.stats.burnedCount >= 15) unlockAchievement('pyromancer');
                    }
                    e.burnTimer = 2.6;
                    damageEnemy(e, dmg, '#ff6600', true);
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
        x: target.x, y: target.y, targetRef: target, radius,
        phase: 'LOCK', timer: 0.75, maxTimer: 0.75, beamLife: 0.45,
        dmg: (165 + player.weapons.satelliteLvl * 75 + player.level * 10) * player.dmgMult
    });
}

function firePrimaryWeapons() {
    const barrels = player.weapons.barrels;
    const spread = 0.105;
    const baseAngle = player.angle;
    const isBassShot = (sfx.beatPulse || 0) > 0.45 || (sfx.bassEnergy || 0) > 0.65;
    const bassDmgMult = isBassShot ? 1.25 : 1.0;

    for (let i = 0; i < barrels; i++) {
        const offsetIndex = i - (barrels - 1) / 2;
        const a = baseAngle + offsetIndex * spread;
        const muzzleX = player.x + Math.cos(a) * 18;
        const muzzleY = player.y + Math.sin(a) * 18;

        bullets.push({
            x: muzzleX, y: muzzleY, px: muzzleX, py: muzzleY,
            vx: Math.cos(a) * 940, vy: Math.sin(a) * 940,
            dmg: (24 + player.level * 3.2) * player.dmgMult * bassDmgMult,
            bounces: player.weapons.ricochetLvl,
            pierce: Math.floor(player.weapons.ricochetLvl / 2),
            bassBoosted: isBassShot,
            color: state.overdriveTimer > 0
                ? '#fcee09'
                : (isBassShot ? '#ff007f' : (player.weapons.ricochetLvl > 0 ? '#00ffaa' : player.color)),
            life: 1.35
        });
    }

    grid.applyForce(player.x + Math.cos(baseAngle) * 24, player.y + Math.sin(baseAngle) * 24, 75, 5.5, false);
    sfx.playLaser(state.overdriveTimer > 0 ? 1.25 : (isBassShot ? 1.12 : (0.95 + Math.random() * 0.15)));
}

function fireQuantumRailgun() {
    const a = player.angle;
    const len = Math.hypot(W, H);
    const x2 = player.x + Math.cos(a) * len;
    const y2 = player.y + Math.sin(a) * len;

    railBeams.push({ x1: player.x, y1: player.y, x2, y2, color: '#ff0055', life: 0.28, maxLife: 0.28 });
    sfx.playRailgun();
    state.shake = Math.max(state.shake, 9);
    state.chromatic = Math.max(state.chromatic, 0.45);
    spawnLensFlare(player.x, player.y, '#ff0055', 420);

    for (let d = 60; d < 900; d += 90) {
        const gx = player.x + Math.cos(a) * d;
        const gy = player.y + Math.sin(a) * d;
        if (gx > 0 && gx < W && gy > 0 && gy < H) grid.applyForce(gx, gy, 130, 24, false, true);
    }

    const dx = Math.cos(a);
    const dy = Math.sin(a);
    const dmg = (95 + player.weapons.railgunLvl * 45 + player.level * 6) * player.dmgMult;

    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        const ex = e.x - player.x;
        const ey = e.y - player.y;
        const proj = ex * dx + ey * dy;
        if (proj > 0) {
            const perpDist = Math.abs(ex * dy - ey * dx);
            if (perpDist < e.radius + 16) {
                damageEnemy(e, dmg, '#ff0055', true);
                spawnShockwave(e.x, e.y, 75, '#ff0055', 3, 420);
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
            if (dist < bestD) { bestD = dist; nearest = e; }
        }
        const aimA = nearest ? Math.atan2(nearest.y - dy, nearest.x - dx) : player.angle;
        bullets.push({
            x: dx, y: dy, px: dx, py: dy,
            vx: Math.cos(aimA) * 860, vy: Math.sin(aimA) * 860,
            dmg: (18 + player.level * 2) * player.dmgMult,
            bounces: 0, pierce: 0,
            stormArc: hasStormSynergy,
            color: hasStormSynergy ? '#5ffbff' : '#38bdf8',
            life: 1.1
        });
    }
}

function triggerCryoNova() {
    const radius = 260 + player.weapons.cryoNovaLvl * 45;
    spawnShockwave(player.x, player.y, radius, '#67e8f9', 5, 520);
    grid.applyForce(player.x, player.y, radius, 26, false);

    for (const e of enemies) {
        if (Math.hypot(e.x - player.x, e.y - player.y) <= radius) {
            e.slowTimer = 3.2;
            damageEnemy(e, (28 + player.weapons.cryoNovaLvl * 14) * player.dmgMult, '#67e8f9');
        }
    }
}

function fireHomingMissiles() {
    const count = 1 + player.weapons.missilesLvl;
    for (let i = 0; i < count; i++) {
        const a = player.angle + (i - (count - 1) / 2) * 0.45;
        missiles.push({
            x: player.x, y: player.y,
            vx: Math.cos(a) * 320, vy: Math.sin(a) * 320,
            speed: 550, dmg: (46 + player.weapons.missilesLvl * 16) * player.dmgMult,
            life: 3.0, color: '#ff007f'
        });
    }
}

function fireSwarmNanobots() {
    const count = 2 + player.weapons.swarmBotsLvl;
    for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        missiles.push({
            x: player.x, y: player.y,
            vx: Math.cos(a) * 420, vy: Math.sin(a) * 420,
            speed: 680, dmg: (28 + player.weapons.swarmBotsLvl * 12) * player.dmgMult,
            life: 2.5, color: '#a3e635'
        });
    }
}

function fireGravityCannon() {
    const a = player.angle;
    bullets.push({
        x: player.x + Math.cos(a) * 20,
        y: player.y + Math.sin(a) * 20,
        px: player.x, py: player.y,
        vx: Math.cos(a) * 460, vy: Math.sin(a) * 460,
        dmg: (75 + player.weapons.gravCannonLvl * 35) * player.dmgMult,
        bounces: 0, pierce: 2,
        radius: 7,
        gravImplode: true,
        color: '#c084fc',
        life: 1.8
    });
}

function fireTeslaLightning(originX = player.x, originY = player.y, maxTargetsOverride = null) {
    if (enemies.length === 0) return;
    const maxTargets = maxTargetsOverride || (2 + player.weapons.teslaLvl * 2);
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
            if (d < minDist) { minDist = d; nearest = e; }
        }
        if (!nearest) break;

        hitSet.add(nearest);
        grid.applyForce(nearest.x, nearest.y, 90, 12, false, true);
        damageEnemy(nearest, (38 + player.weapons.teslaLvl * 14) * player.dmgMult, '#5ffbff', true);
        lightningArcs.push({ x1: currX, y1: currY, x2: nearest.x, y2: nearest.y, life: 0.18, color: '#5ffbff' });
        currX = nearest.x;
        currY = nearest.y;
    }
}

function triggerHyperDash() {
    if (state.mode !== 'PLAYING' || player.dashCooldown > 0) return;
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
                x: ix, y: iy, radius: 34,
                dmg: (65 + player.weapons.plasmaTrailLvl * 25) * player.dmgMult,
                life: 2.2, maxLife: 2.2
            });
        }
    }

    player.x = Math.max(25, Math.min(W - 25, player.x + Math.cos(dashAngle) * dashDist));
    player.y = Math.max(25, Math.min(H - 25, player.y + Math.sin(dashAngle) * dashDist));

    sfx.playDash();
    spawnShockwave(player.x, player.y, 185, player.color, 4, 520);
    spawnParticles(player.x, player.y, player.color, 28, 120, 420, 2.8);
    grid.applyForce(player.x, player.y, 240, 42, false, true);
    state.shake = Math.max(state.shake, 7);
}

function deploySingularityBomb() {
    if (state.mode !== 'PLAYING' || player.bombs <= 0) return;
    player.bombs--;
    meta.stats.blackHolesUsed = (meta.stats.blackHolesUsed || 0) + 1;
    if (meta.stats.blackHolesUsed >= 5) unlockAchievement('black_hole_5');
    updateHUD();

    const amp = 1 + (player.weapons.gravityAmpLvl || 0) * 0.35;
    const isStarSingularity = player.weapons.satelliteLvl > 0 && player.weapons.gravityAmpLvl > 0;
    const dist = Math.min(280, Math.hypot(mouse.x - player.x, mouse.y - player.y));
    const a = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    const sx = Math.max(80, Math.min(W - 80, player.x + Math.cos(a) * dist));
    const sy = Math.max(80, Math.min(H - 80, player.y + Math.sin(a) * dist));

    singularities.push({
        x: sx, y: sy,
        radius: 36 * amp,
        pullRadius: 430 * amp,
        amp,
        isStarSingularity,
        strikeTimer: 0.45,
        life: 2.5, maxLife: 2.5, angle: 0
    });
    sfx.playSingularity();
    spawnLensFlare(sx, sy, isStarSingularity ? '#fcee09' : '#ff007f', 520);
    addFloatingText(sx, sy - 40, isStarSingularity ? '🌟 HVĚZDNÁ SINGULARITA!' : 'KVANTOVÁ ČERNÁ DÍRA!', isStarSingularity ? '#fcee09' : '#ff007f', 1.35);
    state.shake = 12;
    state.chromatic = 0.9;
}

function damageEnemy(e, dmg, hitColor = '#00f3ff', shieldBonus = false, fromBoomerang = false) {
    let finalDmg = dmg;
    if (player.weapons.phaseMeltLvl > 0 && (e.isElite || e.type === 'BOSS')) {
        finalDmg *= (1 + player.weapons.phaseMeltLvl * 0.25);
    }

    let isCrit = false;
    const totalCritChance = (player.weapons.critLvl || 0) * 0.14 + (meta.upgrades.critShopLvl || 0) * 0.06;
    if (totalCritChance > 0 && Math.random() < totalCritChance) {
        finalDmg *= 2.4;
        isCrit = true;
        hitColor = '#fcee09';
    }

    if (e.shield && e.shield > 0) {
        const shieldDmg = shieldBonus ? finalDmg * 1.6 : finalDmg;
        if (e.shield >= shieldDmg) {
            e.shield -= shieldDmg;
            spawnParticles(e.x, e.y, '#38bdf8', 4, 60, 200, 2.0, 0.12, 0.25);
            return;
        } else {
            const leftover = shieldDmg - e.shield;
            e.shield = 0;
            e.hp -= leftover;
            spawnShockwave(e.x, e.y, e.radius * 2.2, '#38bdf8', 2.5, 360);
        }
    } else {
        e.hp -= finalDmg;
    }

    if (isCrit && Math.random() < 0.35) {
        addFloatingText(e.x, e.y - 18, `KRIT ${Math.floor(finalDmg)}!`, '#fcee09', 0.95);
    }
    spawnParticles(e.x, e.y, hitColor, 4, 60, 240, 2.0, 0.15, 0.32);

    if (e.hp <= 0 && !e.dead) {
        e.dead = true;
        unlockAchievement('first_blood');
        if (fromBoomerang) {
            meta.stats.boomerangKills = (meta.stats.boomerangKills || 0) + 1;
            if (meta.stats.boomerangKills >= 25) unlockAchievement('boomerang_pro');
        }

        state.combo = Math.min(20.0, +(state.combo + 0.25).toFixed(2));
        if (state.combo > state.maxCombo) state.maxCombo = state.combo;
        if (state.combo >= 10.0) unlockAchievement('combo_10');
        if (state.combo >= 20.0) unlockAchievement('combo_20');
        state.comboTimer = 3.8;

        if (state.overdriveTimer <= 0) {
            const prevOd = state.overdrive;
            state.overdrive = Math.min(100, state.overdrive + (e.type === 'BOSS' ? 40 : (e.isElite ? 8 : 4.5)));
            if (prevOd < 100 && state.overdrive >= 100) {
                unleashQuantumExplosion(true);
                addFloatingText(player.x, player.y - 45, '⚡ PŘETLAK 100 %: KVANTOVÝ VÝBOJ! [STISKNI F]', '#fcee09', 1.35);
            }
        }

        const scoreMult = state.difficulty === 'HARDCORE' ? 1.35 : 1.0;
        const gainedScore = Math.floor(e.score * state.combo * scoreMult);
        state.score += gainedScore;
        if (state.score >= 100000) unlockAchievement('score_100k');
        if (state.score >= 500000) unlockAchievement('score_500k');
        if (state.score >= 1000000) unlockAchievement('score_1m');

        const isBoss = e.type === 'BOSS';
        const pCount = isBoss ? 160 : 32;
        spawnParticles(e.x, e.y, e.color, pCount, 90, isBoss ? 680 : 450, isBoss ? 4.0 : 2.8);
        spawnParticles(e.x, e.y, '#ffffff', Math.floor(pCount * 0.35), 120, 520, 2.2);
        spawnShockwave(e.x, e.y, isBoss ? 540 : 125, e.color, isBoss ? 7 : 3.5, isBoss ? 620 : 420);
        if (isBoss || e.isElite) spawnLensFlare(e.x, e.y, e.color, isBoss ? 800 : 340);
        grid.applyForce(e.x, e.y, isBoss ? 480 : 195, isBoss ? 85 : 28, false, isBoss);

        state.shake = Math.max(state.shake, isBoss ? 25 : 6.5);
        if (isBoss) state.chromatic = 1.0;
        sfx.playExplosion(isBoss ? 2.4 : 1.0);

        const shardHunterBonus = meta.upgrades.shardHunterLvl || 0;
        const diffChipMult = state.difficulty === 'HARDCORE' ? 2 : 1;

        if (isBoss) {
            unlockAchievement('boss_slayer');
            const rewardShards = (8 + shardHunterBonus * 2) * diffChipMult;
            meta.shards += rewardShards;
            saveMetaProgression();
            addFloatingText(e.x, e.y - 55, `+${rewardShards} ◈ KVANTOVÝCH ČIPŮ!`, '#fcee09', 1.4);
        } else if (e.isElite && Math.random() < (0.35 + shardHunterBonus * 0.10)) {
            const eliteShards = 1 * diffChipMult;
            meta.shards += eliteShards;
            saveMetaProgression();
            addFloatingText(e.x, e.y - 22, `+${eliteShards} ◈ ČIP`, '#fcee09', 1.05);
        }

        if (player.weapons.critLvl > 0 && (e.isElite || isBoss)) {
            const heal = isBoss ? 25 : 4;
            player.hp = Math.min(player.maxHp, player.hp + heal);
        }

        if (e.type === 'SPLITTER') {
            for (let k = 0; k < 3; k++) {
                spawnEnemy('MINI_SWARM', e.x + (Math.random() - 0.5) * 24, e.y + (Math.random() - 0.5) * 24);
            }
        }

        if (isBoss) {
            state.bossActive = false;
            document.getElementById('boss-hud').classList.add('hidden');
            document.getElementById('boss-hud').classList.remove('flex');
            document.getElementById('ghost-boss-bar-wrap').classList.add('hidden');
            document.getElementById('ghost-boss-bar-wrap').classList.remove('flex');
            player.bombs = Math.min(player.maxBombs, player.bombs + 1);
            addFloatingText(e.x, e.y - 30, `${e.name} ZNIČEN! +1 ČERNÁ DÍRA`, '#fcee09', 1.45);
            saveGameProgress(true, currentSaveSlot);

            // Vítězství v kampani na 12. vlně pro ARCADE a HARDCORE (ENDLESS běží do nekonečna)
            if (state.difficulty !== 'ENDLESS' && state.wave >= 12) {
                triggerGameOver(true);
                return;
            }
        }

        const gemCount = isBoss ? 20 : (e.isElite ? 4 : 2);
        const xpBonus = 1 + meta.upgrades.magnetLvl * 0.12;
        for (let g = 0; g < gemCount; g++) {
            const ga = Math.random() * Math.PI * 2;
            const gs = 60 + Math.random() * 140;
            gems.push({
                x: e.x, y: e.y,
                vx: Math.cos(ga) * gs, vy: Math.sin(ga) * gs,
                val: Math.round((isBoss ? 20 : 13) * xpBonus),
                angle: Math.random() * 6, magnetized: false
            });
        }
    }
}

function damagePlayer(amount) {
    if (player.invulnTimer > 0 || state.mode !== 'PLAYING') return;

    if (player.weapons.aegisLvl > 0 && player.aegisReady) {
        player.aegisReady = false;
        player.aegisCooldown = Math.max(4.5, 11.0 - player.weapons.aegisLvl * 1.8);
        player.invulnTimer = 0.9;
        state.chromatic = 0.65;
        spawnShockwave(player.x, player.y, 290, '#60a5fa', 6, 580);
        spawnLensFlare(player.x, player.y, '#60a5fa', 480);
        grid.applyForce(player.x, player.y, 320, 55, false, true);
        addFloatingText(player.x, player.y - 28, 'AEGIS ŠTÍT POHLTIL ZÁSAH!', '#60a5fa', 1.25);
        for (let i = enemyBullets.length - 1; i >= 0; i--) {
            if (Math.hypot(enemyBullets[i].x - player.x, enemyBullets[i].y - player.y) < 260) {
                enemyBullets.splice(i, 1);
            }
        }
        updateHUD();
        return;
    }

    const finalAmount = state.difficulty === 'HARDCORE' ? Math.ceil(amount * 1.25) : amount;
    player.hp -= finalAmount;
    player.invulnTimer = 0.85;
    state.combo = Math.max(1.0, +(state.combo * 0.55).toFixed(1));
    state.shake = 18;
    state.chromatic = 1.0;

    sfx.playExplosion(1.7);
    spawnShockwave(player.x, player.y, 260, '#ff0055', 5, 550);
    spawnParticles(player.x, player.y, '#ff0055', 45, 120, 480, 3.2);
    grid.applyForce(player.x, player.y, 320, 52, false, true);
    addFloatingText(player.x, player.y - 25, `-${Math.floor(finalAmount)} TRUP!`, '#ff0055', 1.25);

    updateHUD();
    if (player.hp <= 0) triggerGameOver(false);
}