/*************************************************************************
 * WORLD.JS - PARALLAX SPACE, ELECTRIFIED SPRING-GRID & GAME CATALOGS
 *            (HIGH-VISIBILITY AUDIO-REACTIVE EDITION)
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
                size: depth * 2.3,
                color: Math.random() > 0.7 ? '#00f3ff' : (Math.random() > 0.5 ? '#ff007f' : '#ffffff'),
                twinkle: Math.random() * Math.PI * 2
            });
        }

        this.nebulas = [
            { x: w * 0.22, y: h * 0.3, r: 420, baseR: 157, baseG: 0,   baseB: 255, depth: 0.12 },
            { x: w * 0.78, y: h * 0.7, r: 480, baseR: 0,   baseG: 243, baseB: 255, depth: 0.18 },
            { x: w * 0.52, y: h * 0.25, r: 380, baseR: 255, baseG: 0,  baseB: 127, depth: 0.15 }
        ];
    }

    update(dt, pvx, pvy, w, h) {
        const beatSpeedBoost = 1 + (sfx.bassEnergy || 0) * 1.4;
        for (const s of this.stars) {
            s.x -= pvx * s.depth * 0.18 * beatSpeedBoost * dt;
            s.y -= pvy * s.depth * 0.18 * beatSpeedBoost * dt;
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
        const bass = sfx.bassEnergy || 0;
        const pulse = sfx.beatPulse || 0;
        const bassScale = 1 + bass * 0.42 + pulse * 0.18;

        for (const n of this.nebulas) {
            const rad = n.r * bassScale;
            const alpha = Math.min(0.26, 0.065 + bass * 0.10 + pulse * 0.07);
            const grad = ctx.createRadialGradient(n.x, n.y, 10, n.x, n.y, rad);
            grad.addColorStop(0, `rgba(${n.baseR}, ${n.baseG}, ${n.baseB}, ${alpha})`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(n.x, n.y, rad, 0, Math.PI * 2);
            ctx.fill();
        }

        const highBoost = (sfx.highEnergy || 0) * 0.5;
        const sizePulse = 1 + pulse * 0.65;
        for (const s of this.stars) {
            const alpha = 0.35 + Math.sin(s.twinkle) * 0.25 + highBoost;
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
                    bx: x, by: y,
                    x: x, y: y,
                    vx: 0, vy: 0,
                    energy: 0,
                    charge: 0
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
                const falloff = (1 - dist / radius);
                const strength = force * falloff * falloff * (isPull ? -1 : 1);
                p.vx += (dx / dist) * strength;
                p.vy += (dy / dist) * strength;
                p.energy = Math.min(1.0, p.energy + falloff * 0.95);
                if (addCharge && Math.random() < 0.55) {
                    p.charge = Math.min(1.0, p.charge + falloff * 1.15);
                }
            }
        }
    }

    // Náhodné jiskření uzlů mřížky při vysokých frekvencích a beatech
    pulseWithMusic(beatPulse, highEnergy) {
        if (this.points.length === 0) return;
        const count = Math.floor(beatPulse * 14 + highEnergy * 6);
        for (let i = 0; i < count; i++) {
            const idx = Math.floor(Math.random() * this.points.length);
            const p = this.points[idx];
            p.energy = Math.min(1.0, p.energy + 0.55);
            if (Math.random() < 0.4) p.charge = Math.min(1.0, p.charge + 0.7);
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
            p.charge *= 0.87;
        }
    }

    draw(ctx) {
        const cols = this.cols;
        const rows = this.rows;
        const pts = this.points;

        const pulse = sfx.beatPulse || 0;
        const bass = sfx.bassEnergy || 0;

        // Celá mřížka při úderu beatu zřetelně zesvětlá a změní odstín
        const baseAlpha = 0.11 + pulse * 0.22 + bass * 0.08;
        const baseHue = Math.round(190 + pulse * 115);
        ctx.lineWidth = 1 + pulse * 0.7;
        ctx.strokeStyle = state.overdriveTimer > 0
            ? `rgba(252, 238, 9, ${baseAlpha + 0.08})`
            : `hsla(${baseHue}, 100%, 60%, ${baseAlpha})`;

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

        ctx.lineWidth = 2.2;
        for (let r = 1; r < rows - 1; r++) {
            for (let c = 1; c < cols - 1; c++) {
                const idx = r * cols + c;
                const p = pts[idx];
                if (p.energy > 0.06 || p.charge > 0.1) {
                    const pr = pts[idx + 1];
                    const pd = pts[idx + cols];
                    const alpha = Math.min(0.98, Math.max(p.energy, p.charge) * 0.96);
                    const hue = p.charge > 0.25 ? 52 : ((185 + p.energy * 165) % 360);
                    ctx.strokeStyle = `hsla(${hue}, 100%, 65%, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(pr.x, pr.y);
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(pd.x, pd.y);
                    ctx.stroke();

                    if (p.energy > 0.30 || p.charge > 0.22) {
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(p.x - 1.6, p.y - 1.6, 3.2, 3.2);
                    }
                }
            }
        }
    }
}

// 6 DISTINCT SHIP CLASSES
const SHIP_CLASSES = [
    {
        id: 'INTERCEPTOR',
        name: 'INTERCEPTOR X-9',
        role: 'ŠÍPOVÁ STÍHAČKA // ODRAZOVÉ FOTONY',
        color: '#00f3ff',
        hp: 100, speed: 415, dashCd: 1.10, bombs: 2,
        desc: 'Ultralehká šípová stíhačka s dvojitým plazmovým pohonem. Nejvyšší rychlost a začíná s Odrazovými fotony.',
        initWeapons: { barrels: 2, fireRateLvl: 1, ricochetLvl: 1, missilesLvl: 0, bladesLvl: 0, teslaLvl: 0, railgunLvl: 0, dronesLvl: 0, plasmaTrailLvl: 0, cryoNovaLvl: 0, aegisLvl: 0, critLvl: 0, flamethrowerLvl: 0, satelliteLvl: 0, boomerangLvl: 0, minesLvl: 0, shockwaveLvl: 0, gravityAmpLvl: 0, regenLvl: 0 }
    },
    {
        id: 'BASTION',
        name: 'BASTION TITAN',
        role: 'TĚŽKÝ DREADNOUGHT // AEGIS & ČEPELE',
        color: '#fcee09',
        hp: 160, speed: 345, dashCd: 1.50, bombs: 2,
        desc: 'Masivní šestihranný křižník s bočními štíty. Začíná s Aegis bariérou, 2 Orbitálními čepelemi a tlakovým pulzem.',
        initWeapons: { barrels: 2, fireRateLvl: 1, ricochetLvl: 0, missilesLvl: 0, bladesLvl: 2, teslaLvl: 0, railgunLvl: 0, dronesLvl: 0, plasmaTrailLvl: 0, cryoNovaLvl: 0, aegisLvl: 1, critLvl: 0, flamethrowerLvl: 0, satelliteLvl: 0, boomerangLvl: 0, minesLvl: 0, shockwaveLvl: 1, gravityAmpLvl: 0, regenLvl: 0 }
    },
    {
        id: 'TECHNOMANCER',
        name: 'TECHNOMANCER VORTEX',
        role: 'HVĚZDICOVÝ KŘIŽNÍK // DRONY & TESLA',
        color: '#bc13fe',
        hp: 115, speed: 375, dashCd: 1.35, bombs: 3,
        desc: 'Experimentální plavidlo s levitujícím prstencem. Začíná s Autonomním dronem, Teslovým bleskem a 3 Černými dírami.',
        initWeapons: { barrels: 2, fireRateLvl: 1, ricochetLvl: 0, missilesLvl: 0, bladesLvl: 0, teslaLvl: 1, railgunLvl: 0, dronesLvl: 1, plasmaTrailLvl: 0, cryoNovaLvl: 0, aegisLvl: 0, critLvl: 0, flamethrowerLvl: 0, satelliteLvl: 0, boomerangLvl: 0, minesLvl: 0, shockwaveLvl: 0, gravityAmpLvl: 0, regenLvl: 0 }
    },
    {
        id: 'WRAITH',
        name: 'PHANTOM WRAITH',
        role: 'KRITICKÝ ZABIJÁK // BUMERANGY & RAILGUN',
        color: '#ff0055',
        hp: 95, speed: 400, dashCd: 1.15, bombs: 2,
        desc: 'Agresivní kosmický predátor s dvojitými kosami. Začíná s Fotonovými Bumerangy a Kritickým přetaktovačem LV2.',
        initWeapons: { barrels: 2, fireRateLvl: 1, ricochetLvl: 0, missilesLvl: 0, bladesLvl: 0, teslaLvl: 0, railgunLvl: 0, dronesLvl: 0, plasmaTrailLvl: 0, cryoNovaLvl: 0, aegisLvl: 0, critLvl: 2, flamethrowerLvl: 0, satelliteLvl: 0, boomerangLvl: 1, minesLvl: 0, shockwaveLvl: 0, gravityAmpLvl: 0, regenLvl: 0 }
    },
    {
        id: 'SERAPH',
        name: 'SOLAR SERAPH',
        role: 'OHNIVÁ VALKÝRA // PLAMENOMET & STOPA',
        color: '#ff6600',
        hp: 125, speed: 385, dashCd: 1.25, bombs: 2,
        desc: 'Čtyřkřídlá solární valkýra. Od samého startu spaluje nepřátele Plazmovým Plamenometem a hořící stopou.',
        initWeapons: { barrels: 2, fireRateLvl: 1, ricochetLvl: 0, missilesLvl: 0, bladesLvl: 0, teslaLvl: 0, railgunLvl: 0, dronesLvl: 0, plasmaTrailLvl: 1, cryoNovaLvl: 0, aegisLvl: 0, critLvl: 0, flamethrowerLvl: 1, satelliteLvl: 0, boomerangLvl: 0, minesLvl: 0, shockwaveLvl: 0, gravityAmpLvl: 0, regenLvl: 0 }
    },
    {
        id: 'ARCHITECT',
        name: 'OMEGA ARCHITECT',
        role: 'VLÁDCE GRAVITACE // MINY, SATELIT & 4x NOVA',
        color: '#00ffaa',
        hp: 135, speed: 360, dashCd: 1.40, bombs: 4,
        desc: 'Kvantový konstrukt. Začíná s Orbitálním Satelitem, Kvantovými minami a 4 zesílenými Černými dírami.',
        initWeapons: { barrels: 2, fireRateLvl: 1, ricochetLvl: 0, missilesLvl: 0, bladesLvl: 0, teslaLvl: 0, railgunLvl: 0, dronesLvl: 0, plasmaTrailLvl: 0, cryoNovaLvl: 0, aegisLvl: 0, critLvl: 0, flamethrowerLvl: 0, satelliteLvl: 1, boomerangLvl: 0, minesLvl: 1, shockwaveLvl: 0, gravityAmpLvl: 1, regenLvl: 0 }
    }
];

// 18 ACHIEVEMENTS / TROPHIES
const ACHIEVEMENTS_LIST = [
    { id: 'first_blood',   name: 'PRVNÍ KREV',             desc: 'Znič svého prvního geometrického nepřítele v aréně.', reward: 3 },
    { id: 'combo_10',      name: 'MISTR SYNCHRONIZACE',    desc: 'Dosáhni násobiče komba alespoň x10.0.',               reward: 6 },
    { id: 'combo_20',      name: 'BOŽSKÁ REFLEXE x20',     desc: 'Dosáhni maximálního násobiče komba x20.0!',           reward: 15 },
    { id: 'boss_slayer',   name: 'KROTITEL ARCHONŮ',       desc: 'Poraz svého prvního vícefázového Bosse.',             reward: 10 },
    { id: 'pyromancer',    name: 'PLAZMOVÝ PYROMAN',       desc: 'Nainstaluj Plazmový Plamenomet a zapal 15 nepřátel.', reward: 8 },
    { id: 'orbital_god',   name: 'BOŽÍ OKO Z ORBITY',      desc: 'Nainstaluj Orbitální Ion-Satelit a sežehni cíle.',    reward: 8 },
    { id: 'boomerang_pro', name: 'LOVEC HORIZONTU',        desc: 'Odemkni Fotonové Bumerangy a rozdrť 25 nepřátel.',    reward: 8 },
    { id: 'mine_master',   name: 'MINOVÉ POLE SMRTI',      desc: 'Polož 20 Kvantových Min během bojů v aréně.',         reward: 8 },
    { id: 'wave_6',        name: 'VETERÁN SINGULARITY',    desc: 'Přežij až do 6. vlny (AI Tier III).',                 reward: 10 },
    { id: 'wave_10',       name: 'VLÁDCE DIMENZE TIER IV', desc: 'Dosáhni 10. vlny s nejvyšší evolucí AI.',             reward: 20 },
    { id: 'wave_15',       name: 'NESMRTELNÝ SINGULÁR',    desc: 'Přežij až do extrémní 15. vlny!',                     reward: 30 },
    { id: 'overdrive_use', name: 'PÁN ČASOPROSTORU',       desc: 'Aktivuj Kvantový Přetlak [F] pro zpomalení času.',    reward: 5 },
    { id: 'score_100k',    name: 'KYBERNETICKÁ LEGENDA',   desc: 'Překonej hranici 100 000 bodů v jedné hře.',          reward: 12 },
    { id: 'score_500k',    name: ' PŮLMILIONOVÝ IMPERÁTOR', desc: 'Překonej hranici 500 000 bodů v jedné hře!',         reward: 25 },
    { id: 'black_hole_5',  name: 'ARCHITEKT HORIZONTU',    desc: 'Vypusť celkem 5 Kvantových Černých děr.',             reward: 6 },
    { id: 'level_10',      name: 'PLNOHODNOTNÝ ARZENÁL',   desc: 'Dosáhni 10. úrovně lodi v jedné hře.',                reward: 10 },
    { id: 'max_barrels',   name: 'ROJ PLAZMOVÝCH HLAVNÍ',  desc: 'Vylepši primární kanón na 6 nebo 7 hlavní.',          reward: 12 },
    { id: 'rich_cyber',    name: 'BANKÉŘ SINGULARITY',     desc: 'Měj na účtu alespoň 50 Kvantových Čipů (◈) najednou.', reward: 15 }
];

// 6 PERMANENT CYBER-SHOP UPGRADES
const SHOP_ITEMS = [
    {
        key: 'hullLvl',
        name: 'TITANOVÉ JÁDRO TRUPU',
        desc: 'Trvale zvyšuje startovní a maximální HP všech lodí o +25 za každou úroveň.',
        maxLvl: 6, baseCost: 8, color: '#00ffaa'
    },
    {
        key: 'dmgLvl',
        name: 'PLAZMOVÝ AKCELERÁTOR',
        desc: 'Trvale zvyšuje poškození všech zbraní, plamenometu i satelitu o +12 % za úroveň.',
        maxLvl: 6, baseCost: 10, color: '#ff007f'
    },
    {
        key: 'magnetLvl',
        name: 'GRAVITAČNÍ SBĚRAČ XP',
        desc: 'Zvyšuje dosah přitahování XP krystalů o +60 px a zisk XP o +12 % za úroveň.',
        maxLvl: 5, baseCost: 8, color: '#00f3ff'
    },
    {
        key: 'novaLvl',
        name: 'KOMORA SINGULARITY',
        desc: 'Trvale přidává +1 startovní nálož Černé díry a zvyšuje kapacitu slotů.',
        maxLvl: 4, baseCost: 16, color: '#fcee09'
    },
    {
        key: 'overdriveLvl',
        name: 'KVANTOVÁ BATERIE PŘETLAKU',
        desc: 'Začínáš každou hru s +25 % nabitým Přetlakem [F] za úroveň a prodlužuje jeho trvání.',
        maxLvl: 4, baseCost: 12, color: '#bc13fe'
    },
    {
        key: 'critShopLvl',
        name: 'OPTICKÝ KALIBRATOR KRITU',
        desc: 'Trvale zvyšuje základní šanci na 2.4x Kritický zásah o +6 % za každou úroveň.',
        maxLvl: 5, baseCost: 12, color: '#f43f5e'
    }
];