/*************************************************************************
 * MULTILINGUAL ENGINE (CZ <-> EN) - SAFE & ZERO-LAG VERSION
 *************************************************************************/
let currentLang = localStorage.getItem('neon_singularity_lang') || 'cs';
let isTranslatingDOM = false;

const EN_DICTIONARY = {
    // Hlavní menu & Záložky
    'GAMEPAD: NEPŘIPOJEN': 'GAMEPAD: DISCONNECTED',
    'DUALSHOCK / GAMEPAD: AKTIVNÍ': 'DUALSHOCK / GAMEPAD: ACTIVE',
    'GAMEPAD: AKTIVNÍ': 'GAMEPAD: ACTIVE',
    'TROFEJE:': 'TROPHIES:',
    'ČIPY:': 'CHIPS:',
    'ČIPŮ': 'CHIPS',
    '6 LODÍ // 24 ZBRANÍ + 3 SYNERGIE // 3 OBTÍŽNOSTI // PODPORA GAMEPADU': '6 SHIPS // 24 WEAPONS + 3 SYNERGIES // 3 DIFFICULTIES // GAMEPAD SUPPORT',
    '6 LODÍ // 24 ZBRANÍ + 3 SYNERGIE // VZÁCNÉ ČERVÍ DÍRY // PODPORA GAMEPADU': '6 SHIPS // 24 WEAPONS + 3 SYNERGIES // RARE WORMHOLES // GAMEPAD SUPPORT',
    '1. VÝBĚR TŘÍDY VZNÁŠEDLA (6)': '1. SELECT HOVERCRAFT CLASS (6)',
    '2. PAMĚŤOVÉ SLOTY (3) & OVLÁDÁNÍ': '2. MEMORY SLOTS (3) & CONTROLS',
    'VYBER AKTIVNÍ SLOT PRO UKLÁDÁNÍ NEBO PŘEJMENOVÁNÍ ROZEHRANÉ MISE:': 'SELECT ACTIVE SLOT TO SAVE, LOAD OR RENAME MISSION:',
    'VYBER AKTIVNÍ SLOT PRO UKLÁDÁNÍ NEBO NAČTENÍ ROZEHRANÉ MISE:': 'SELECT ACTIVE SLOT TO SAVE OR LOAD MISSION:',
    'PRÁZDNÝ SLOT': 'EMPTY SLOT',
    'Připraven pro novou misi': 'Ready for a new mission',
    'AKTIVNÍ': 'ACTIVE',
    'VYBRÁN': 'SELECTED',
    'RYCH:': 'SPD:',
    'VYBER OBTÍŽNOST SIMULACE:': 'SELECT SIMULATION DIFFICULTY:',
    'ARCADE (STANDARD // 12 VLN)': 'ARCADE (STANDARD // 12 WAVES)',
    'HARDCORE (70 % HP // 2x ČIPY ◈)': 'HARDCORE (70% HP // 2x CHIPS ◈)',
    'ENDLESS (NEKONEČNÁ VÝZVA)': 'ENDLESS (INFINITE SURVIVAL)',
    'ARCADE: Standardní aréna (100 % HP, běžný zisk Čipů, vítězství ve 12. vlně)': 'ARCADE: Standard Arena (100% HP, normal Chips, Victory at Wave 12)',
    'HARDCORE: Extrémní výzva (70 % HP, agresivnější AI, ale 2x více Kvantových Čipů ◈ a +35 % Skóre!)': 'HARDCORE: Extreme Challenge (70% HP, aggressive AI, 2x Quantum Chips ◈ & +35% Score!)',
    'ENDLESS: Nekonečná simulace bez stropu vln – přežij co nejdéle proti sílícím Bossům!': 'ENDLESS: Infinite simulation without wave cap – survive as long as possible!',
    'POKRAČOVAT V ULOŽENÉ MISI (VYBRANÝ SLOT)': 'RESUME SAVED MISSION (SELECTED SLOT)',
    'CYBER-SHOP (8)': 'CYBER-SHOP (8)',
    'TROFEJE (24)': 'TROPHIES (24)',
    'SPUSTIT NOVOU MISI': 'LAUNCH NEW MISSION',
    'PŘEPSAT': 'OVERWRITE',
    'NOVOU MISÍ': 'WITH NEW MISSION',

    // HUD & Ovládání
    'PŘETLAK PŘIPRAVEN [F]!': 'OVERDRIVE READY [F]!',
    'PŘETLAK AKTIVNÍ!': 'OVERDRIVE ACTIVE!',
    'ARZENÁL & SYNERGIE:': 'ARSENAL & SYNERGIES:',
    'HUD: PLNÝ [H]': 'HUD: FULL [H]',
    'HUD: MINIMAL [H]': 'HUD: MINIMAL [H]',
    'PAUZA [ESC]': 'PAUSE [ESC]',
    'AEGIS ŠTÍT:': 'AEGIS SHIELD:',
    'HYPER-SKOK': 'HYPER-DASH',
    'ČERNÁ DÍRA': 'BLACK HOLE',
    'OBTÍŽNOST:': 'DIFF:',
    'ČÁSTICE:': 'PARTICLES:',
    'REKORD:': 'BEST:',
    'RÁDIO:': 'RADIO:',
    'ZVUK:': 'AUDIO:',
    'PŘETLAK': 'OVERDRIVE',
    'DOBÍJENÍ': 'CHARGING',
    'NABITO': 'READY',
    'ÚROVEŇ': 'LEVEL',
    'SKÓRE': 'SCORE',
    'TRUP': 'HULL',
    'VLNA': 'WAVE',

    // Pauza, Shop, Trofeje, Konec hry
    'TRVALÁ META-PROGRESE JÁDRA (8 MODULŮ)': 'PERMANENT CORE META-PROGRESSION (8 MODULES)',
    'ULOŽIT A ZPĚT DO HANGÁRU': 'SAVE & RETURN TO HANGAR',
    'ZPĚT DO HANGÁRU': 'RETURN TO HANGAR',
    'MAXIMÁLNÍ ÚROVEŇ': 'MAX LEVEL REACHED',
    'VYLEPŠIT': 'UPGRADE',
    'SÍŇ SLÁVY SINGULARITY': 'HALL OF SINGULARITY',
    'TROFEJE & VÝZVY (24)': 'TROPHIES & CHALLENGES (24)',
    'TROFEJ ODEMČENA!': 'TROPHY UNLOCKED!',
    'ODEMČENO!': 'UNLOCKED!',
    'SPLNĚNO': 'UNLOCKED',
    'TAKTICKÁ HIBERNACE // AKTIVNÍ SLOT': 'TACTICAL HIBERNATION // ACTIVE SLOT',
    'HRA POZASTAVENA': 'GAME PAUSED',
    'Rozehrané Skóre': 'Current Score',
    'Aktuální Vlna': 'Current Wave',
    'Úroveň Lodi': 'Ship Level',
    'NAINSTALOVANÉ SYSTÉMY & SYNERGIE:': 'INSTALLED SYSTEMS & SYNERGIES:',
    'RYCHLÉ ULOŽENÍ POZICE DO SLOTU:': 'QUICK SAVE TO SLOT:',
    'ULOŽIT -> SLOT': 'SAVE -> SLOT',
    'POKRAČOVAT V BOJI [ESC / OPTIONS]': 'RESUME COMBAT [ESC / OPTIONS]',
    'ULOŽIT DO AKTIVNÍHO SLOTU': 'SAVE TO ACTIVE SLOT',
    'ULOŽIT A DO HANGÁRU': 'SAVE & EXIT TO HANGAR',
    'Smazat tento slot a restartovat misi od 1. vlny': 'Delete this slot and restart mission from Wave 1',
    'VYLEPŠENÍ ARZENÁLU': 'ARSENAL UPGRADE',
    'INSTALOVAT MODUL': 'INSTALL MODULE',
    'KLÁVESA': 'KEY',
    'KOLAPS JÁDRA // SYSTÉM ZNIČEN': 'CORE COLLAPSE // SYSTEM DESTROYED',
    'KONEC PŘENOSU': 'TRANSMISSION ENDED',
    'MISE SPLNĚNA!': 'MISSION ACCOMPLISHED!',
    'Konečné Skóre': 'Final Score',
    'Nejvyšší Rekord': 'High Score',
    'Dosažená Vlna': 'Wave Reached',
    'Celkem Čipů v Bance': 'Total Chips in Bank',
    'HANGÁR & SLOTY': 'HANGAR & SLOTS',
    'RESTART [MEZERNÍK]': 'RESTART [SPACE]',

    // Popisy lodí a Synergie
    'ŠÍPOVÁ STÍHAČKA // ODRAZOVÉ FOTONY': 'ARROW FIGHTER // RICOCHET PHOTONS',
    'Ultralehká šípová stíhačka s dvojitým plazmovým pohonem. Nejvyšší rychlost a začíná s Odrazovými fotony.': 'Ultralight arrow fighter with twin plasma drive. Highest speed and starts with Ricochet Photons.',
    'TĚŽKÝ DREADNOUGHT // AEGIS & ČEPELE': 'HEAVY DREADNOUGHT // AEGIS & BLADES',
    'Masivní šestihranný křižník s bočními štíty. Začíná s Aegis bariérou, 2 Orbitálními čepelemi a tlakovým pulzem.': 'Massive hexagonal cruiser with side shields. Starts with Aegis barrier, 2 Orbital Blades and Kinetic Pulse.',
    'HVĚZDICOVÝ KŘIŽNÍK // DRONY & TESLA': 'STAR CRUISER // DRONES & TESLA',
    'Experimentální plavidlo s levitujícím prstencem. Začíná s Autonomním dronem, Teslovým bleskem a 3 Černými dírami (Synergie Bouřková Matrice!).': 'Experimental vessel with levitating ring. Starts with Drone, Tesla Arc and 3 Black Holes (Storm Matrix Synergy!).',
    'KRITICKÝ ZABIJÁK // BUMERANGY & RAILGUN': 'CRITICAL ASSASSIN // BOOMERANGS & CRIT',
    'Agresivní kosmický predátor s dvojitými kosami. Začíná s Fotonovými Bumerangy a Kritickým přetaktovačem LV2.': 'Aggressive cosmic predator with twin scythes. Starts with Photon Boomerangs and Critical Overclock LV2.',
    'OHNIVÁ VALKÝRA // PLAMENOMET & STOPA': 'SOLAR VALKYRIE // FLAMETHROWER & TRAIL',
    'Žhnoucí solární valkýra. Od samého startu spaluje nepřátele Plazmovým Plamenometem a hořící stopou.': 'Blazing solar valkyrie. Incinerates enemies right from the start with Plasma Flamethrower and Burning Trail.',
    'VLÁDCE GRAVITACE // MINY, SATELIT & 4x NOVA': 'GRAVITY LORD // MINES, SATELLITE & 4x NOVA',
    'Kvantový konstrukt. Začíná s Orbitálním Satelitem, Kvantovými minami a 4 zesílenými Černými dírami (Synergie Hvězdná Singularita!).': 'Quantum construct. Starts with Orbital Satellite, Quantum Mines and 4 amplified Black Holes (Stellar Singularity!).',
    'SYNERGIE: SLUNEČNÍ SUPERNOVA': 'SYNERGY: SOLAR SUPERNOVA',
    'SYNERGIE: BOUŘKOVÁ MATRICE': 'SYNERGY: STORM MATRIX',
    'SYNERGIE: HVĚZDNÁ SINGULARITA': 'SYNERGY: STELLAR SINGULARITY',

    // Plovoucí texty v Canvasu
    'KVANTOVÁ EXPLOZE & PŘETLAK AKTIVNÍ!': 'QUANTUM BLAST & OVERDRIVE ACTIVE!',
    'PŘETLAK 100 %: KVANTOVÝ VÝBOJ! [STISKNI F]': 'OVERDRIVE 100%: QUANTUM BLAST! [PRESS F]',
    'HVĚZDNÁ SINGULARITA!': 'STELLAR SINGULARITY!',
    'KVANTOVÁ ČERNÁ DÍRA!': 'QUANTUM BLACK HOLE!',
    'AEGIS ŠTÍT POHLTIL ZÁSAH!': 'AEGIS SHIELD ABSORBED HIT!',
    'AEGIS ŠTÍT NABIT!': 'AEGIS SHIELD RECHARGED!',
    'ZÁSOBOVACÍ POD VYSÁZEN!': 'SUPPLY POD DEPLOYED!',
    'OPRAVNÝ NANOBOT (+45 HP)': 'REPAIR NANOBOT (+45 HP)',
    'KVANTOVÝ MAGNET XP!': 'QUANTUM XP MAGNET!',
    '+1 ČERNÁ DÍRA & PŘETLAK': '+1 BLACK HOLE & OVERDRIVE',
    'ANOMÁLIE DETEKOVÁNA: PROSTOROVÁ ČERVÍ DÍRA!': 'ANOMALY DETECTED: SPATIAL WORMHOLE!',
    'PORTÁL A': 'PORTAL A',
    'PORTÁL B': 'PORTAL B'
};

// Seřazení klíčů od nejdelších po nejkratší (zabraňuje kolizím podřetězců)
const EN_ENTRIES = Object.entries(EN_DICTIONARY).sort((a, b) => b[0].length - a[0].length);
const CZ_ENTRIES = Object.entries(EN_DICTIONARY)
    .map(([cz, en]) => [en, cz])
    .sort((a, b) => b[0].length - a[0].length);

function translateString(str) {
    if (!str || typeof str !== 'string') return str;
    const entries = currentLang === 'en' ? EN_ENTRIES : CZ_ENTRIES;
    let out = str;
    for (let i = 0; i < entries.length; i++) {
        const [src, target] = entries[i];
        if (out.includes(src)) {
            out = out.split(src).join(target);
        }
    }
    return out;
}

function applyDOMTranslations() {
    if (isTranslatingDOM) return;
    isTranslatingDOM = true;
    try {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];
        let node;
        while ((node = walker.nextNode())) {
            if (node.parentElement && ['SCRIPT', 'STYLE'].includes(node.parentElement.tagName)) continue;
            if (node.nodeValue && node.nodeValue.trim().length > 1) {
                textNodes.push(node);
            }
        }
        for (let i = 0; i < textNodes.length; i++) {
            const n = textNodes[i];
            const translated = translateString(n.nodeValue);
            if (translated !== n.nodeValue) {
                n.nodeValue = translated;
            }
        }
        const langBtn = document.getElementById('btn-lang-toggle');
        if (langBtn) {
            langBtn.textContent = currentLang === 'en' ? '🌐 LANG: EN [L]' : '🌐 JAZYK: CZ [L]';
        }
    } finally {
        isTranslatingDOM = false;
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'cs' ? 'en' : 'cs';
    localStorage.setItem('neon_singularity_lang', currentLang);
    document.documentElement.lang = currentLang;
    renderShipSelector();
    refreshMenuSaveUI();
    updateHUD();
    applyDOMTranslations();
    showSaveToast(currentLang === 'en' ? '🌐 LANGUAGE SET TO: ENGLISH' : '🌐 JAZYK NASTAVEN NA: ČEŠTINA');
}

// Automatický překlad plovoucích textů přímo v Canvasu
const origFillText = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
    const translated = currentLang === 'en' ? translateString(String(text)) : text;
    if (maxWidth !== undefined) return origFillText.call(this, translated, x, y, maxWidth);
    return origFillText.call(this, translated, x, y);
};

// Virtuální dotykové ovládání pro mobily a tablety
function setupResponsiveTouchControls() {
    const touchWrap = document.createElement('div');
    touchWrap.id = 'touch-controls';
    touchWrap.innerHTML = `
    <div id="joy-left" class="touch-zone" style="left: 20px;">
      <div id="joy-left-knob" class="touch-knob"></div>
    </div>
    <div id="joy-right" class="touch-zone" style="right: 20px;">
      <div id="joy-right-knob" class="touch-knob" style="background: radial-gradient(circle, #ff007f 0%, rgba(255,0,127,0.3) 100%); box-shadow: 0 0 15px #ff007f;"></div>
    </div>
    <div class="touch-action-btns">
      <button id="touch-btn-dash" class="cyber-btn px-3 py-2 text-[10px]">SKOK</button>
      <button id="touch-btn-bomb" class="cyber-btn-outline px-3 py-2 text-[10px] border-pink-500 text-pink-300">NOVA</button>
      <button id="touch-btn-od" class="cyber-btn-gold px-3 py-2 text-[10px]">PŘETLAK</button>
    </div>
  `;
    document.body.appendChild(touchWrap);

    const bindStick = (zoneId, knobId, onMove) => {
        const zone = document.getElementById(zoneId);
        const knob = document.getElementById(knobId);
        let activeId = null;

        const handleTouch = (e) => {
            e.preventDefault();
            for (const t of e.changedTouches) {
                if (activeId === null || t.identifier === activeId) {
                    activeId = t.identifier;
                    const rect = zone.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    let dx = t.clientX - cx;
                    let dy = t.clientY - cy;
                    const dist = Math.hypot(dx, dy);
                    const maxR = rect.width / 2 - 12;
                    if (dist > maxR) { dx = (dx / dist) * maxR; dy = (dy / dist) * maxR; }
                    knob.style.transform = `translate(${dx}px, ${dy}px)`;
                    onMove(dx / maxR, dy / maxR, true);
                }
            }
        };

        const endTouch = (e) => {
            for (const t of e.changedTouches) {
                if (t.identifier === activeId) {
                    activeId = null;
                    knob.style.transform = 'translate(0px, 0px)';
                    onMove(0, 0, false);
                }
            }
        };

        zone.addEventListener('touchstart', handleTouch, { passive: false });
        zone.addEventListener('touchmove', handleTouch, { passive: false });
        zone.addEventListener('touchend', endTouch);
        zone.addEventListener('touchcancel', endTouch);
    };

    bindStick('joy-left', 'joy-left-knob', (nx, ny) => {
        keys.a = nx < -0.22;
        keys.d = nx > 0.22;
        keys.w = ny < -0.22;
        keys.s = ny > 0.22;
    });

    bindStick('joy-right', 'joy-right-knob', (nx, ny, active) => {
        if (active && (Math.abs(nx) > 0.1 || Math.abs(ny) > 0.1)) {
            const aimA = Math.atan2(ny, nx);
            player.angle = aimA;
            mouse.x = player.x + Math.cos(aimA) * 180;
            mouse.y = player.y + Math.sin(aimA) * 180;
            mouse.down = true;
        } else {
            mouse.down = false;
        }
    });

    document.getElementById('touch-btn-dash').addEventListener('touchstart', (e) => { e.preventDefault(); triggerHyperDash(); });
    document.getElementById('touch-btn-bomb').addEventListener('touchstart', (e) => { e.preventDefault(); deploySingularityBomb(); });
    document.getElementById('touch-btn-od').addEventListener('touchstart', (e) => { e.preventDefault(); triggerQuantumOverdrive(); });

    setInterval(() => {
        touchWrap.classList.toggle('active', state.mode === 'PLAYING');
    }, 250);
}

// Napojení přepínače jazyka a modálních tlačítek bez jakéhokoliv MutationObserveru
window.addEventListener('DOMContentLoaded', () => {
    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) langBtn.addEventListener('click', toggleLanguage);

    ['btn-open-shop', 'btn-open-achievements', 'tab-btn-ships', 'tab-btn-slots'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', () => { if (currentLang === 'en') setTimeout(applyDOMTranslations, 10); });
    });

    setupResponsiveTouchControls();
    if (currentLang === 'en') setTimeout(applyDOMTranslations, 80);
});

window.addEventListener('keydown', (e) => {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    if (e.code === 'KeyL') toggleLanguage();
});