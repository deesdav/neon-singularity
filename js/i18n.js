/*************************************************************************
 * I18N.JS - COMPLETE MULTILINGUAL ENGINE (CZ <-> EN) & TOUCH CONTROLS
 *************************************************************************/
let currentLang = localStorage.getItem("neon_singularity_lang") || "cs";
let isTranslatingDOM = false;

const EN_DICTIONARY = {
  // 1. Hlavní menu, Záložky & Status Bar
  "OMEGA OVERCLOCK EDITION": "OMEGA OVERCLOCK EDITION",
  "🎮 GAMEPAD: NEPŘIPOJEN": "🎮 GAMEPAD: DISCONNECTED",
  "GAMEPAD: NEPŘIPOJEN": "GAMEPAD: DISCONNECTED",
  "🎮 DUALSHOCK / GAMEPAD: AKTIVNÍ": "🎮 DUALSHOCK / GAMEPAD: ACTIVE",
  "DUALSHOCK / GAMEPAD: AKTIVNÍ": "DUALSHOCK / GAMEPAD: ACTIVE",
  "GAMEPAD: AKTIVNÍ": "GAMEPAD: ACTIVE",
  "🏆 TROFEJE:": "🏆 TROPHIES:",
  "TROFEJE:": "TROPHIES:",
  "◈ ČIPY:": "◈ CHIPS:",
  "ČIPY:": "CHIPS:",
  ČIPŮ: "CHIPS",
  ČIP: "CHIP",
  "8 LODÍ // 32 ZBRANÍ + 13 SYNERGIÍ // DENNÍ MUTÁTORY // KVANTOVÝ OVERCLOCK":
    "10 SHIPS // 36 WEAPONS + 15 SYNERGIES // DAILY MUTATORS // QUANTUM OVERCLOCK",
  "🚀 1. LODĚ (8)": "🚀 1. SHIPS (8)",
  "💾 2. SLOTY & ZÁLOHY": "💾 2. SLOTS & BACKUPS",
  "🏛️ 3. SÍŇ SLÁVY": "🏛️ 3. HALL OF FAME",
  "⚙️ 4. AUDIO & ZVUK": "⚙️ 4. AUDIO & SOUND",
  "1. LODĚ (8)": "1. SHIPS (8)",
  "2. SLOTY & ZÁLOHY": "2. SLOTS & BACKUPS",
  "3. SÍŇ SLÁVY": "3. HALL OF FAME",
  "4. AUDIO & ZVUK": "4. AUDIO & SOUND",
  "🎨 BARVA LODI:": "🎨 SHIP COLOR:",
  VÝCHOZÍ: "DEFAULT",

  // 2. Sloty, Zálohy, Nápověda v menu & Síň slávy
  "VYBER AKTIVNÍ SLOT PRO UKLÁDÁNÍ NEBO PŘEJMENOVÁNÍ ROZEHRANÉ MISE:":
    "SELECT ACTIVE SLOT TO SAVE, LOAD OR RENAME MISSION:",
  "📤 EXPORTOVAT PROFIL (.JSON)": "📤 EXPORT PROFILE (.JSON)",
  "📥 IMPORTOVAT PROFIL": "📥 IMPORT PROFILE",
  "EXPORTOVAT PROFIL (.JSON)": "EXPORT PROFILE (.JSON)",
  "IMPORTOVAT PROFIL": "IMPORT PROFILE",
  "PRÁZDNÝ SLOT": "EMPTY SLOT",
  "Připraven pro novou misi": "Ready for a new mission",
  "POŠKOZENÁ DATA": "CORRUPTED DATA",
  "⚡ 13 FÚZNÍCH SYNERGIÍ ZBRANÍ (AUTOMATICKÉ):":
    "⚡ 13 WEAPON FUSION SYNERGIES (AUTOMATIC):",
  "Sluneční Supernova:": "Solar Supernova:",
  "Plamenomet + Bumerangy": "Flamethrower + Boomerangs",
  "Bouřková Matrice:": "Storm Matrix:",
  "Teslův Oblouk + Drony": "Tesla Arc + Drones",
  "Hvězdná Singularita:": "Stellar Singularity:",
  "Drtič Gravitace + Ion-Satelit": "Gravity Crusher + Ion-Satellite",
  "Vortexový Cyklon:": "Vortex Cyclone:",
  "Plazmový Bič + Bumerangy": "Plasma Whip + Boomerangs",
  "Kobercové Bombardování:": "Carpet Bombardment:",
  "Kvantový Minomet + Miny": "Quantum Mortar + Mines",
  "Zrcadlová Kletba & 7 dalších fúzí v aréně!":
    "Mirror Curse & 7 more fusions in the arena!",
  "🎮 OVLÁDÁNÍ (KLÁVESNICE / DUALSHOCK 4):":
    "🎮 CONTROLS (KEYBOARD / DUALSHOCK 4):",
  "Pohyb & Míření:": "Move & Aim:",
  "WASD + Myš / Levá + Pravá páčka": "WASD + Mouse / Left + Right Stick",
  "Hyper-Skok & Černá díra:": "Hyper-Dash & Black Hole:",
  "Mezerník (Křížek/R1) / Q,E (Čtverec/L1)":
    "Space (Cross/R1) / Q,E (Square/L1)",
  "Přetlak & Výběr vylepšení:": "Overdrive & Upgrade Select:",
  "Klávesa F (Trojúhelník) / D-Pad (Šipky)":
    "Key F (Triangle) / D-Pad (Arrows)",
  "Vlastní MP3 & Jazyk:": "Custom MP3 & Language:",
  "Klávesa [O] pro MP3 // Klávesa [L] pro CZ/EN":
    "Key [O] for MP3 // Key [L] for CZ/EN",
  "🏛️ CELOŽIVOTNÍ STATISTIKA PILOTA:": "🏛️ LIFETIME PILOT TELEMETRY:",
  "CELOŽIVOTNÍ STATISTIKA PILOTA:": "LIFETIME PILOT TELEMETRY:",
  "CELKEM ELIMINACÍ": "TOTAL ELIMINATIONS",
  "ZNIČENÝCH BOSSŮ": "BOSSES DEFEATED",
  "SEBRANÝCH XP": "XP COLLECTED",
  "ČERNÝCH DĚR": "BLACK HOLES",
  "MIN POLOŽENO": "MINES DEPLOYED",
  "ODRAŽENÝCH STŘEL": "BULLETS REFLECTED",
  "NEJVYŠŠÍ REKORD": "HIGH SCORE",
  "AKTIVNÍCH TROFEJÍ": "ACTIVE TROPHIES",
  "🎵 HLASITOST HUDBY (BGM)": "🎵 MUSIC VOLUME (BGM)",
  "💥 HLASITOST EFEKTŮ (SFX)": "💥 SFX VOLUME",
  "HLASITOST HUDBY (BGM)": "MUSIC VOLUME (BGM)",
  "HLASITOST EFEKTŮ (SFX)": "SFX VOLUME",

  // 3. Obtížnost, Mutátory & Spodní tlačítka Hangáru
  "⚔️ OBTÍŽNOST SIMULACE:": "⚔️ SIMULATION DIFFICULTY:",
  "OBTÍŽNOST SIMULACE:": "SIMULATION DIFFICULTY:",
  "ARCADE: 100 % HP, cíl 12. vlna": "ARCADE: 100% HP, Goal: Wave 12",
  "100 % HP // Běžné čipy // Cíl: 30. vlna (10 Bossů)":
    "100% HP // Normal Chips // Goal: Wave 30 (10 Bosses)",
  "70 % HP // Silnější AI // 2x Čipy ◈ // Cíl: 30. vlna":
    "70% HP // Stronger AI // 2x Chips ◈ // Goal: Wave 30",
  "35 % HP // Extrémní AI // 3x Čipy ◈ // Cíl: 30. vlna":
    "35% HP // Extreme AI // 3x Chips ◈ // Goal: Wave 30",
  "Dokonči 30. vlnu (všech 10 Bossů) na obtížnost HARDCORE!":
    "Complete Wave 30 (all 10 Bosses) on HARDCORE difficulty!",
  "Nekonečné vlny // Stupňující se Bossové":
    "Infinite Waves // Escalating Bosses",
  "🎲 DENNÍ VÝZVA / MUTÁTOR:": "🎲 DAILY CHALLENGE / MUTATOR:",
  "DENNÍ VÝZVA / MUTÁTOR:": "DAILY CHALLENGE / MUTATOR:",
  "💥 SKLENĚNÁ DĚLA": "💥 GLASS CANNON",
  "SKLENĚNÁ DĚLA": "GLASS CANNON",
  "⚡ NEKONEČNÝ SKOK": "⚡ INFINITE DASH",
  "NEKONEČNÝ SKOK": "INFINITE DASH",
  "👾 ROJE CHAOSU": "👾 SWARM CHAOS",
  "ROJE CHAOSU": "SWARM CHAOS",
  "STANDARD: Běžná pravidla bez mutace":
    "STANDARD: Normal rules without mutation",
  "SKLENĚNÁ DĚLA: 2x poškození pro tebe i nepřátele (+30 ◈)":
    "GLASS CANNON: 2x damage for you and enemies (+30 ◈)",
  "NEKONEČNÝ SKOK: Cooldown skoku jen 0.18s (+25 ◈)":
    "INFINITE DASH: Dash cooldown only 0.18s (+25 ◈)",
  "ROJE CHAOSU: 2x více nepřátel s nižším HP (+35 ◈)":
    "SWARM CHAOS: 2x more enemies with lower HP (+35 ◈)",
  "⚡ POKRAČOVAT V ULOŽENÉ MISI (VYBRANÝ SLOT)":
    "⚡ RESUME SAVED MISSION (SELECTED SLOT)",
  "POKRAČOVAT V ULOŽENÉ MISI (VYBRANÝ SLOT)":
    "RESUME SAVED MISSION (SELECTED SLOT)",
  "◈ CYBER-SHOP (12) & OVERCLOCK": "◈ CYBER-SHOP (12) & OVERCLOCK",
  "🏆 TROFEJE (50)": "🏆 TROPHIES (50)",
  "TROFEJE (50)": "TROPHIES (50)",
  "SPUSTIT NOVOU MISI DO SLOTU [ENTER]": "LAUNCH NEW MISSION TO SLOT [ENTER]",
  "SPUSTIT NOVOU MISI": "LAUNCH NEW MISSION",
  PŘEPSAT: "OVERWRITE",
  "NOVOU MISÍ": "WITH NEW MISSION",

  // 4. Lodě (8 tříd v world.js)
  "ŠÍPOVÁ STÍHAČKA // ODRAZOVÉ FOTONY": "ARROW FIGHTER // RICOCHET PHOTONS",
  "Ultralehká šípová stíhačka s dvojitým plazmovým pohonem. Nejvyšší rychlost a začíná s Odrazovými fotony.":
    "Ultralight arrow fighter with twin plasma drive. Highest speed and starts with Ricochet Photons.",
  "TĚŽKÝ DREADNOUGHT // AEGIS & ČEPELE": "HEAVY DREADNOUGHT // AEGIS & BLADES",
  "Masivní šestihranný křižník s bočními štíty. Začíná s Aegis bariérou, 2 Orbitálními čepelemi a tlakovým pulzem.":
    "Massive hexagonal cruiser with side shields. Starts with Aegis barrier, 2 Orbital Blades and Kinetic Pulse.",
  "HVĚZDICOVÝ KŘIŽNÍK // DRONY & TESLA": "STAR CRUISER // DRONES & TESLA",
  "Experimentální plavidlo s levitujícím prstencem. Začíná s Dronem, Teslovým bleskem a 3 Černými dírami (Synergie!).":
    "Experimental vessel with levitating ring. Starts with Drone, Tesla Arc and 3 Black Holes (Synergy!).",
  "KRITICKÝ ZABIJÁK // BUMERANGY & KRIT":
    "CRITICAL ASSASSIN // BOOMERANGS & CRIT",
  "Agresivní kosmický predátor s dvojitými kosami. Začíná s Fotonovými Bumerangy a Kritickým přetaktovačem LV2.":
    "Aggressive cosmic predator with twin scythes. Starts with Photon Boomerangs and Critical Overclocker LV2.",
  "OHNIVÁ VALKÝRA // PLAMENOMET & STOPA":
    "SOLAR VALKYRIE // FLAMETHROWER & TRAIL",
  "Žhnoucí solární valkýra. Od samého startu spaluje nepřátele Plazmovým Plamenometem a hořící stopou.":
    "Blazing solar valkyrie. Incinerates enemies right from the start with Plasma Flamethrower and Burning Trail.",
  "VLÁDCE GRAVITACE // MINY & SATELIT": "GRAVITY LORD // MINES & SATELLITE",
  "Kvantový konstrukt. Začíná s Orbitálním Satelitem, Kvantovými minami a 4 zesílenými Černými dírami.":
    "Quantum construct. Starts with Orbital Satellite, Quantum Mines and 4 amplified Black Holes.",
  "SKRYTÝ DRAVEC // KLONY & TRHAČ": "STEALTH PREDATOR // CLONES & SLICER",
  "Stínový zabiják. Střílí fázové šipky a při každém Hyper-skoku zanechává explozivní holografický klon!":
    "Shadow assassin. Fires phase bolts and leaves an explosive holographic decoy on every Hyper-Dash!",
  "PANCÉŘOVÁ PEVNOST // ODRAZ STŘEL": "ARMORED FORTRESS // BULLET REFLECT",
  "Nepřemožitelná mobilní tvrz. Má obří pancíř, automaticky odráží nepřátelské projektily zpět a nese Kvantový minomet.":
    "Invincible mobile fortress. Features massive armor, automatically reflects enemy projectiles and carries a Quantum Mortar.",
  "RYCH:": "SPD:",

  // 5. Cyber-Shop (12 modulů) & Overclock (3 moduly)
  "TRVALÁ META-PROGRESE JÁDRA (12 MODULŮ + NEKONEČNÝ OVERCLOCK)":
    "PERMANENT CORE META-PROGRESSION (12 MODULES + INFINITE OVERCLOCK)",
  "♾️ KVANTOVÝ OVERCLOCK (NEKONEČNÉ BONUSY PRO PŘEBYTEČNÉ ČIPY)":
    "♾️ QUANTUM OVERCLOCK (INFINITE BONUSES FOR SURPLUS CHIPS)",
  "KVANTOVÝ OVERCLOCK (NEKONEČNÉ BONUSY PRO PŘEBYTEČNÉ ČIPY)":
    "QUANTUM OVERCLOCK (INFINITE BONUSES FOR SURPLUS CHIPS)",
  "Každá úroveň stojí 50 ◈ Čipů a trvale posiluje všechny tvé lodě bez omezení úrovně!":
    "Each level costs 50 ◈ Chips and permanently strengthens all your ships with no level cap!",
  "CELKEM OVERCLOCK:": "TOTAL OVERCLOCK:",
  "TITANOVÉ JÁDRO TRUPU": "TITANIUM HULL CORE",
  "Trvale zvyšuje startovní a maximální HP všech lodí o +25 za úroveň.":
    "Permanently increases starting and maximum HP of all ships by +25 per level.",
  "PLAZMOVÝ AKCELERÁTOR": "PLASMA ACCELERATOR",
  "Trvale zvyšuje poškození všech zbraní a schopností o +12 % za úroveň.":
    "Permanently increases damage of all weapons and abilities by +12% per level.",
  "GRAVITAČNÍ SBĚRAČ XP": "GRAVITY XP COLLECTOR",
  "Zvyšuje dosah přitahování XP krystalů o +60 px a zisk XP o +12 % za úroveň.":
    "Increases XP gem magnet range by +60 px and XP gain by +12% per level.",
  "KOMORA SINGULARITY": "SINGULARITY CHAMBER",
  "Trvale přidá +1 startovní nálož Černé díry a zvyšuje kapacitu slotů.":
    "Permanently adds +1 starting Black Hole charge and increases max capacity.",
  "KVANTOVÁ BATERIE PŘETLAKU": "QUANTUM OVERDRIVE BATTERY",
  "Začínáš každou hru s +25 % nabitým Přetlakem [F] a prodlužuje jeho trvání.":
    "Start every run with +25% charged Overdrive [F] and longer duration.",
  "OPTICKÝ KALIBRÁTOR KRITU": "OPTICAL CRIT CALIBRATOR",
  "Trvale zvyšuje základní šanci na 2.4x Kritický zásah o +6 % za úroveň.":
    "Permanently increases base chance for 2.4x Critical Hit by +6% per level.",
  "SUB-PROSTOROVÉ CHLAZENÍ": "SUB-SPACE COOLING",
  "Trvale zkracuje dobu nabíjení Hyper-skoku o -8 % za každou úroveň.":
    "Permanently reduces Hyper-Dash cooldown by -8% per level.",
  "EXTRAKTOR KVANTOVÝCH ČIPŮ": "QUANTUM CHIP EXTRACTOR",
  "Zvyšuje šanci na zisk Kvantových Čipů (◈) z Elit a přidá +2 čipy za Bosse.":
    "Increases Quantum Chip (◈) drop chance from Elites and adds +2 chips per Boss.",
  "ROZŠÍŘENÍ HORIZONTU": "HORIZON EXPANSION",
  "Zvyšuje poloměr tahu a exploze všech Černých děr o +15 % za úroveň.":
    "Increases pull and blast radius of all Black Holes by +15% per level.",
  "KVANTOVÝ TELEPORTÉR XP": "QUANTUM XP TELEPORTER",
  "Vzdálené XP krystaly se samy pomalu přitahují přes celou arénu.":
    "Distant XP gems slowly gravitate toward your ship across the entire arena.",
  "SYNTETIZÁTOR VYLEPŠENÍ": "UPGRADE SYNTHESIZER",
  "Snižuje potřebné množství XP pro každou další úroveň lodi o -5 %.":
    "Reduces required XP for each ship level-up by -5%.",
  "REAKTIVNÍ PANCÍŘ": "REACTIVE THORNS ARMOR",
  "Při zásahu lodi vyšle zpětný výboj, který zraní všechny okolní nepřátele.":
    "Taking hull damage unleashes a retaliatory shockwave that damages nearby foes.",
  "OVERCLOCK ZBRANÍ": "WEAPON OVERCLOCK",
  "Trvale +2 % k poškození všech zbraní za každou úroveň.":
    "Permanently +2% to all weapon damage per level.",
  "OVERCLOCK MOTORŮ": "ENGINE OVERCLOCK",
  "Trvale +1 % k rychlosti letu a +5 Max HP za každou úroveň.":
    "Permanently +1% flight speed and +5 Max HP per level.",
  "OVERCLOCK REAKTORU": "REACTOR OVERCLOCK",
  "Trvale +35 startovních XP na začátku každé nové mise.":
    "Permanently +35 starting XP at the beginning of every mission.",
  "✓ MAXIMÁLNÍ ÚROVEŇ": "✓ MAX LEVEL",
  "MAXIMÁLNÍ ÚROVEŇ": "MAX LEVEL",
  VYLEPŠIT: "UPGRADE",
  PŘETAKTOVAT: "OVERCLOCK",
  "ULOŽIT A ZPĚT DO HANGÁRU": "SAVE & RETURN TO HANGAR",
  "ZPĚT DO HANGÁRU": "RETURN TO HANGAR",

  // 6. HUD, Ghost HUD, Štítky arzenálu & Ovládací prvky v boji
  "[H] PLNÝ HUD // [N] RÁDIO // [ESC] PAUZA":
    "[H] FULL HUD // [N] RADIO // [ESC] PAUSE",
  "PŘETLAK [F / TROJÚHELNÍK]": "OVERDRIVE [F / TRIANGLE]",
  "HYPER-SKOK [MEZERNÍK / KŘÍŽEK]": "HYPER-DASH [SPACE / CROSS]",
  "ČERNÁ DÍRA [Q / ČTVEREC]": "BLACK HOLE [Q / SQUARE]",
  "⚡ PŘETLAK PŘIPRAVEN [F]!": "⚡ OVERDRIVE READY [F]!",
  "⚡ PŘETLAK PŘIPRAVEN [F]": "⚡ OVERDRIVE READY [F]",
  "⚡ PŘETLAK AKTIVNÍ!": "⚡ OVERDRIVE ACTIVE!",
  "⚡ PŘETLAK [F]": "⚡ OVERDRIVE [F]",
  "PŘETLAK PŘIPRAVEN [F]!": "OVERDRIVE READY [F]!",
  "PŘETLAK PŘIPRAVEN [F]": "OVERDRIVE READY [F]",
  "PŘETLAK AKTIVNÍ!": "OVERDRIVE ACTIVE!",
  "PŘETLAK [F]": "OVERDRIVE [F]",
  "AKTIVNÍ!": "ACTIVE!",
  "AKTIVNÍ (100%)": "ACTIVE (100%)",
  "ARZENÁL & SYNERGIE:": "ARSENAL & SYNERGIES:",
  "👁 HUD: PLNÝ [H]": "👁 HUD: FULL [H]",
  "👁 HUD: MINIMAL [H]": "👁 HUD: MINIMAL [H]",
  "HUD: PLNÝ [H]": "HUD: FULL [H]",
  "HUD: MINIMAL [H]": "HUD: MINIMAL [H]",
  "⏸ PAUZA [ESC]": "⏸ PAUSE [ESC]",
  "PAUZA [ESC]": "PAUSE [ESC]",
  "🎵 RÁDIO:": "🎵 RADIO:",
  "RÁDIO:": "RADIO:",
  "🔊 ZVUK: ON": "🔊 AUDIO: ON",
  "🔊 ZVUK: OFF": "🔊 AUDIO: OFF",
  "ZVUK: ON": "AUDIO: ON",
  "ZVUK: OFF": "AUDIO: OFF",
  "AEGIS ŠTÍT:": "AEGIS SHIELD:",
  DOBÍJENÍ: "CHARGING",
  NABITO: "READY",
  "ČÁSTICE:": "PARTICLES:",
  "STOPKY:": "TIMER:",
  "ČAS:": "TIME:",
  "REKORD:": "BEST:",
  MODULY: "MODULES",
  ÚROVEŇ: "LEVEL",
  SKÓRE: "SCORE",
  TRUP: "HULL",
  VLNA: "WAVE",
  AKTIVNÍ: "ACTIVE",
  // Štítky zbraní v HUDu (arsenal-badges)
  "HLAVNĚ x": "BARRELS x",
  "BIČ LV": "WHIP LV",
  "MINOMET LV": "MORTAR LV",
  "NANO-ŠTÍT LV": "NANO-SHIELD LV",
  "KLONY LV": "DECOYS LV",
  "PAST LV": "TRAP LV",
  "TRHAČ LV": "SLICER LV",
  "HRANOL LV": "PRISM LV",
  "REAKTOR LV": "REACTOR LV",
  "BUMERANG x": "BOOMERANG x",
  "MINY LV": "MINES LV",
  "PLAMENOMET LV": "FLAMETHROWER LV",
  "SATELIT LV": "SATELLITE LV",
  "RAILGUN LV": "RAILGUN LV",
  "DRONY x": "DRONES x",
  "ČEPELE x": "BLADES x",
  "TESLA LV": "TESLA LV",
  // Mobilní tlačítka
  "⚡ SKOK": "⚡ DASH",
  "💥 NOVA": "💥 NOVA",
  "🔥 PŘETLAK": "🔥 OVERDRIVE",

  "10 LODÍ // 36 ZBRANÍ + 15 SYNERGIÍ // 10 BOSSŮ // KVANTOVÝ OVERCLOCK":
    "10 SHIPS // 36 WEAPONS + 15 SYNERGIES // 10 BOSSES // QUANTUM OVERCLOCK",
  "🚀 1. LODĚ (10)": "🚀 1. SHIPS (10)",
  "1. LODĚ (10)": "1. SHIPS (10)",
  "MANIPULÁTOR ČASU // KRYO & PŘETLAK": "TIME MANIPULATOR // CRYO & OVERDRIVE",
  "Časoprostorový křižník. Každý Hyper-skok zmrazí okolní nepřátele a okamžitě nabije +12 % Přetlaku!":
    "Spacetime cruiser. Every Hyper-Dash freezes nearby enemies and instantly charges +12% Overdrive!",
  "MATEŘSKÁ LOĎ // DRONY & NANOBOTY": "MOTHERSHIP CARRIER // DRONES & NANOBOTS",
  "Těžký nosič letky. Vypouští do arény autonomní drony, lovecké nanoboty a explozivní klony.":
    "Heavy fleet carrier. Deploys autonomous drones, hunter nanobots and explosive decoys.",
  "🎲 PŘELOSOVAT VÝBĚR KARET": "🎲 REROLL UPGRADE CARDS",
  "1x ZDARMA": "1x FREE",
  ČIPY: "CHIPS",
  "[KLÁVESA R]": "[KEY R]",

  "SINGULARITNÍ KOPÍ": "SINGULARITY LANCE",
  "FÁZOVÝ PAPRSEK NA PŘÍDI": "FORWARD PHASE BEAM",
  "Vystřeluje soustředěný fázový oštěp před příď lodi, který maže střely a taví pancíře. (Synergie s Railgunem -> Rozparovač Horizontu!)":
    "Fires a focused phase spear ahead of the ship that clears projectiles and melts armor. (Synergy with Railgun -> Horizon Ripper!)",
  "ORBITÁLNÍ LASEROVÝ PRSTENEC": "ORBITAL LASER RING",
  "ROTUJÍCÍ PAPRSKOVÉ POLE": "ROTATING BEAM ARRAY",
  "Kolem lodi rotují souvislé laserové paprsky, které pálí vše ve středním dosahu. (Synergie se Sluneční Aurou -> Hvězdná Koróna!)":
    "Continuous laser arcs orbit the ship, burning everything at medium range. (Synergy with Solar Halo -> Stellar Corona!)",
  "KVANTOVÝ ŘETĚZOVÝ DRTIČ": "QUANTUM CHAIN FLAIL",
  "TĚŽKÁ GRAVITAČNÍ KOULE": "HEAVY GRAVITY MACE",
  "Kolem lodi obíhá na energetickém řetězu masivní gravitační koule, která drtí a odhazuje nepřátele.":
    "A massive gravity sphere orbits on an energy chain, crushing and knocking back enemies.",
  "CHRONO-STÁZOVÁ BOMBA": "CHRONO-STASIS BOMB",
  "ČASOPROSTOROVÁ ANOMÁLIE": "SPACETIME ANOMALY",
  "Vypouští za loď modré stázové pole, které zmrazí pohyb nepřátel a rozkládá jejich molekuly.":
    "Deploys a blue stasis field behind the ship that freezes enemies and disintegrates their molecules.",
  "SYNERGIE: ROZPAROVAČ HORIZONTU": "SYNERGY: HORIZON RIPPER",
  "SYNERGIE: HVĚZDNÁ KORÓNA": "SYNERGY: STELLAR CORONA",
  "KOPÍ LV": "LANCE LV",
  "PRSTENEC LV": "RING LV",
  "DRTIČ LV": "FLAIL LV",
  "STÁZE LV": "STASIS LV",
  "LASEROVÝ PRSTENEC": "LASER RING",
  "ŘETĚZOVÝ DRTIČ": "CHAIN FLAIL",

  "TROFEJNÍ MILNÍKY // JEDNORÁZOVÉ ODMĚNY":
    "TROPHY MILESTONES // ONE-TIME REWARDS",
  "LOVEC TROFEJÍ I (+SKIN PLAZMA)": "TROPHY HUNTER I (+PLASMA SKIN)",
  "LOVEC TROFEJÍ II (+SKIN PŘÍZRAK)": "TROPHY HUNTER II (+SPECTER SKIN)",
  "MISTR SÍNĚ SLÁVY (+SKIN OMEGA DUHA)":
    "HALL OF FAME CHAMPION (+OMEGA RAINBOW SKIN)",
  "10 trofejí": "10 trophies",
  "25 trofejí": "25 trophies",
  "50 trofejí": "50 trophies",
  "ODMĚNA VYZVEDNUTA": "REWARD COLLECTED",

  "⚡ PLAZMA (10🏆)": "⚡ PLASMA (10🏆)",
  "🌌 PŘÍZRAK (25🏆)": "🌌 PHANTOM (25🏆)",
  "👑 OMEGA DUHA (50🏆)": "👑 OMEGA RAINBOW (50🏆)",

  "⚠️ RESET POSTUPU": "⚠️ PROGRESS RESET",
  "Smaže veškerá data uložená pro tento web: postup, profily, mise i nastavení (včetně hlasitosti a jazyka).":
    "Deletes all data stored for this website: progression, profiles, missions, and settings (including volume and language).",
  "🗑️ RESETOVAT VEŠKERÝ HERNÍ POSTUP": "🗑️ RESET ALL GAME PROGRESS",

  // 7. 32 Zbraní & Vylepšení (UPGRADE_POOL)
  "KVANTOVÁ EVOLUCE SYSTÉMU // KLIKNI, STISKNI [1, 2, 3] NEBO ŠIPKY NA OVLADAČI [⬅️ ⬆️ ➡️]":
    "QUANTUM SYSTEM EVOLUTION // CLICK, PRESS [1, 2, 3] OR D-PAD [⬅️ ⬆️ ➡️]",
  "VYLEPŠENÍ ARZENÁLU": "ARSENAL UPGRADE",
  "INSTALOVAT MODUL": "INSTALL MODULE",
  "D-PAD VLEVO": "D-PAD LEFT",
  "D-PAD NAHORU": "D-PAD UP",
  "D-PAD VPRAVO": "D-PAD RIGHT",
  "PLAZMOVÝ BIČ": "PLASMA WHIP",
  "ENERGETICKÝ ŠVIH (360°)": "360° ENERGY LASH",
  "Šlehá kolem lodi žhnoucím obloukem plazmatu, který drtí vše v dosahu. (Synergie s Bumerangy -> Vortexový Cyklon!)":
    "Lashes a blazing plasma arc around the ship, crushing nearby foes. (Synergy with Boomerangs -> Vortex Cyclone!)",
  "KVANTOVÝ MINOMET": "QUANTUM MORTAR",
  "TĚŽKÉ OBLOUKOVÉ GRANÁTY": "HEAVY ARC SHELLS",
  "Vystřeluje explozivní kvantové granáty na nejbližší shluk nepřátel. (Synergie s Minami -> Kobercové Bombardování!)":
    "Fires explosive quantum shells at enemy clusters. (Synergy with Mines -> Carpet Bombardment!)",
  "NANOBOTOVÝ ŠTÍT": "NANOBOT SHIELD",
  "PULZUJÍCÍ BARIÉRA & ODRAZ": "PULSING BARRIER & REFLECT",
  "Snižuje přijaté poškození o 20 % a zrychluje obnovu Aegis štítu. (Synergie s Aegis -> Nesmrtelná Citadela!)":
    "Reduces incoming damage by 20% and speeds up Aegis recharge. (Synergy with Aegis -> Immortal Citadel!)",
  "HOLOGRAFICKÝ NÁVNADOVÝ DRON": "HOLOGRAPHIC DECOY DRONE",
  "VYBUCHUJÍCÍ KLON": "EXPLOSIVE HOLO-CLONE",
  "Vypouští holografické dvojníky, kteří přitahují palbu a po zničení explodují. (Synergie s Nanoboty -> Fantomová Legie!)":
    "Deploys holographic doubles that draw enemy fire and explode. (Synergy with Nanobots -> Phantom Legion!)",
  "REZONANČNÍ BLESKOVÁ PAST": "RESONANCE LIGHTNING TRAP",
  "ELEKTRICKÁ SÍŤ V ARÉNĚ": "ARENA ELECTRIC GRID",
  "Klade do prostoru bleskové uzly, které paralyzují a smaží projíždějící nepřátele. (Synergie s Teslou -> Bouřková Síť!)":
    "Deploys lightning nodes that paralyze and fry passing enemies. (Synergy with Tesla -> Storm Grid!)",
  "SUB-PROSTOROVÝ TRHAČ": "SUB-SPACE RIFT SLICER",
  "DIMENZIONÁLNÍ VLNY": "DIMENSIONAL WAVES",
  "Vysílá široké fázové vlny, které procházejí skrz všechny nepřátele v lajně. (Synergie s Čepelemi -> Dimenzionální Sekáč!)":
    "Fires wide phase waves that slice through all enemies in a line. (Synergy with Blades -> Dimensional Cleaver!)",
  "FOTONOVÉ HRANOLY": "PHOTON PRISMS",
  "ROZŠTĚPENÉ PAPRSKY": "SPLIT LASER BEAMS",
  "Každý třetí výstřel vyšle vějíř 5 laserových paprsků. (Synergie s Railgunem -> Duhová Anihilace!)":
    "Every third shot unleashes a fan of 5 laser beams. (Synergy with Railgun -> Prismatic Annihilation!)",
  "OMEGA REAKTOR": "OMEGA REACTOR",
  "+25 % RYCHLOST PŘETLAKU & PALBY": "+25% OVERDRIVE & DAMAGE",
  "Zrychluje nabíjení Přetlaku [F] o +35 % a zvyšuje celkové poškození o +15 %. (Synergie s Aurou -> Jádro Supernovy!)":
    "Speeds up Overdrive [F] charging by +35% and boosts total damage by +15%. (Synergy with Halo -> Supernova Core!)",
  "SLUNEČNÍ AURA": "SOLAR HALO",
  "PERMANENTNÍ ŽHNOUCÍ PRSTENEC": "PERMANENT BLAZING RING",
  "Kolem lodi pulzuje žhnoucí sluneční koróna, která automaticky spaluje a zpomaluje blízké nepřátele.":
    "A blazing solar corona pulses around the ship, burning and slowing nearby enemies.",
  "ROJ LOVECKÝCH NANOBOTŮ": "HUNTER NANOBOT SWARM",
  "SAMONAVÁDĚCÍ KYBER-HMYZ": "HOMING CYBER-SWARM",
  "Vypouští rychlé zeleno-zlaté nanoboty, kteří vyhledávají oslabené cíle a rozkládají jejich štíty.":
    "Releases fast green-gold nanobots that seek targets and dissolve their shields.",
  "GRAVITAČNÍ DĚLO": "GRAVITY CANNON",
  "TĚŽKÉ IMPLODUJÍCÍ KULE": "HEAVY IMPLODING ORBS",
  "Střílí pomalé temné sféry, které po nárazu přitáhnou okolní nepřátele do jednoho bodu.":
    "Fires slow dark spheres that pull surrounding enemies together on impact.",
  "FÁZOVÝ ROZKLAD PANCÍŘE": "PHASE ARMOR MELT",
  "+25 % POŠKOZENÍ DO BOSSŮ & ELIT": "+25% DAMAGE TO BOSSES & ELITES",
  "Střely narušují molekulární vazby – Elity a Bossové dostávají o +25 % vyšší poškození ze všech zdrojů.":
    "Disrupts molecular bonds – Elites and Bosses take +25% more damage from all sources.",
  "FOTONOVÉ BUMERANGY": "PHOTON BOOMERANGS",
  "VRACEJÍCÍ SE ENERGETICKÉ SRPY": "RETURNING ENERGY CRESCENTS",
  "Vypouští rotující fotonové bumerangy. (Synergie s Plamenometem -> Sluneční Supernova!)":
    "Launches spinning photon boomerangs. (Synergy with Flamethrower -> Solar Supernova!)",
  "ROJ KVANTOVÝCH MIN": "QUANTUM MINEFIELD",
  "MAGNETICKÉ PROSTOROVÉ MINY": "MAGNETIC PROXIMITY MINES",
  "Loď za sebou klade pulzující kvantové miny, které se přitáhnou k blízkým nepřátelům a vybuchnou.":
    "Drops pulsing quantum mines that magnetize to nearby foes and detonate.",
  "KINETICKÁ TLAKOVÁ VLNA": "KINETIC SHOCKWAVE",
  "ODRAZOVÝ PULZ KOLEM LODI": "REPULSION PULSE",
  "Periodicky vysílá prstencovou rázovou vlnu, která odhodí nepřátele a smaže blízké střely.":
    "Periodically emits a ring shockwave that knocks back enemies and clears projectiles.",
  "DRTIČ GRAVITACE": "GRAVITY CRUSHER",
  "+35 % DOSAH & SÍLA ČERNÉ DÍRY": "+35% BLACK HOLE RANGE & POWER",
  "Zvětšuje Černé díry o +35 % a přidá +1 nálož. (Synergie se Satelitem -> Hvězdná Singularita!)":
    "Enlarges Black Holes by +35% and adds +1 charge. (Synergy with Satellite -> Stellar Singularity!)",
  "NANOBOTNÍ REGENERACE": "NANOBOT REGENERATION",
  "AUTOMATICKÁ OPRAVA TRUPU V BOJI": "COMBAT HULL REPAIR",
  "Nanoboty plynule opravují trup lodi (+3.5 HP/s za úroveň) a zvýší Max HP o +15.":
    "Nanobots continuously repair the hull (+3.5 HP/s per level) and increase Max HP by +15.",
  "PLAZMOVÝ PLAMENOMET": "PLASMA FLAMETHROWER",
  "KUŽEL PLAZMATU & ZAPÁLENÍ": "PLASMA CONE & IGNITION",
  "Chrlí žhnoucí proud plazmatu. (Synergie s Bumerangy -> Sluneční Supernova!)":
    "Spews a blazing stream of plasma. (Synergy with Boomerangs -> Solar Supernova!)",
  "ORBITÁLNÍ ION-SATELIT": "ORBITAL ION-SATELLITE",
  "ORBITÁLNÍ LASEROVÝ ÚDER": "ORBITAL LASER STRIKE",
  "Satelit sesílá iontové sloupy energie. (Synergie s Drtičem Gravitace -> Hvězdná Singularita!)":
    "Calls down orbital ion pillars. (Synergy with Gravity Crusher -> Stellar Singularity!)",
  "KVANTOVÉ HLAVNĚ": "QUANTUM BARRELS",
  "+1 PLAZMOVÝ PROUD": "+1 PLASMA STREAM",
  "Přidá další hlaveň k primárnímu pulznímu kanónu a rozšíří zbraňové věže na trupu lodi.":
    "Adds an extra barrel to the primary pulse cannon and expands hull turrets.",
  "HYPER-KONDENZÁTOR": "HYPER-CAPACITOR",
  "+22 % KADENCE & POHYB": "+22% FIRE RATE & SPEED",
  "Zvyšuje rychlost nabíjení zbraní a zrychluje trysky vznášedla.":
    "Increases weapon fire rate and boosts thruster speed.",
  "ODRAZOVÉ FOTONY": "RICOCHET PHOTONS",
  "+1 ODRAZ & PRŮRAZNOST": "+1 BOUNCE & PIERCE",
  "Střely se odrážejí od stěn arény a pronikají skrz pancíře více nepřátel.":
    "Shots bounce off arena walls and pierce through enemy armor.",
  "ROJ MIKRORAKET": "MICRO-MISSILE SWARM",
  "NAVÁDĚNÁ SALVA": "HOMING SALVO",
  "Vypouští salvu kybernetických mikroraket, které samy pronásledují cíle.":
    "Launches a salvo of cybernetic micro-missiles that hunt down targets.",
  "KVANTOVÝ RAILGUN": "QUANTUM RAILGUN",
  "PRŮRAZNÝ HYPER-PAPRSEK": "PIERCING HYPER-BEAM",
  "Namontuje na příď lodi dlouhý Railgun, který vystřeluje okamžitý paprsek přes celou arénu.":
    "Mounts a forward Railgun that fires an instant beam across the entire arena.",
  "AUTONOMNÍ DRONY": "AUTONOMOUS DRONES",
  "+1 ÚTOČNÝ WINGMAN DRON": "+1 ASSAULT WINGMAN DRONE",
  "Kolem lodi krouží bojové drony. (Synergie s Teslou -> Bouřková Matrice!)":
    "Combat drones orbit the ship. (Synergy with Tesla -> Storm Matrix!)",
  "ORBITÁLNÍ ČEPELE": "ORBITAL BLADES",
  "ROTUJÍCÍ PLAZMOVÉ KOTOUČE": "SPINNING PLASMA DISCS",
  "Energetické disky drtící nepřátele i nepřátelské projektily v těsné blízkosti.":
    "Energy discs that shred enemies and enemy projectiles at close range.",
  "TESLŮV OBLOUK": "TESLA ARC",
  "ŘETĚZOVÝ BLESK": "CHAIN LIGHTNING",
  "Vysokonapěťový výboj přeskakující mezi nepřáteli. (Synergie s Drony -> Bouřková Matrice!)":
    "High-voltage arc jumping between enemies. (Synergy with Drones -> Storm Matrix!)",
  "PLAZMOVÁ STOPA": "PLASMA TRAIL",
  "HOŘÍCÍ STOPA ZA LODÍ": "BURNING WAKE",
  "Při pohybu a Hyper-Skoku zanechává loď žhnoucí plazmové zóny, které taví pronásledovatele.":
    "Leaves blazing plasma zones behind the ship when moving and dashing.",
  "KRYO-PULZNÍ POLE": "CRYO-PULSE FIELD",
  "MRAZIVÁ TLAKOVÁ VLNA": "FREEZING SHOCKWAVE",
  "Vysílá sub-nulový pulz, který zpomalí okolní nepřátele na 45 % rychlosti.":
    "Emits a sub-zero pulse that slows nearby enemies to 45% speed.",
  "ENERGETICKÝ ŠTÍT AEGIS": "AEGIS ENERGY SHIELD",
  "AUTOMATICKÁ BARIÉRA": "AUTOMATIC BARRIER",
  "Vytvoří dobíjecí silové pole, které plně pohltí zásah a vyvolá odrazovou vlnu.":
    "Creates a recharging forcefield that absorbs hits and triggers a blast wave.",
  "KRITICKÝ PŘETAKTOVAČ": "CRITICAL OVERCLOCKER",
  "2.4x KRITICKÉ ZÁSAHY & OPRAVY": "2.4x CRITICAL HITS & REPAIR",
  "Zvyšuje šanci na kritické poškození o +15 % a zničení Elit/Bossů opravuje trup.":
    "Increases critical hit chance by +15% and destroying Elites/Bosses repairs the hull.",
  "JÁDRO SINGULARITY": "SINGULARITY CORE",
  "+1 ČERNÁ DÍRA & +30 MAX TRUP": "+1 BLACK HOLE & +30 MAX HULL",
  "Doplní +1 nálož Černé díry, zvýší maximální integritu trupu o +30 a opraví 60 HP.":
    "Restores +1 Black Hole, increases Max HP by +30 and repairs 60 HP.",
  // Zbraně v telemetrii (Run Summary)
  "PULZNÍ KANÓN": "PULSE CANNON",
  MIKRORAKETY: "MICRO-MISSILES",
  "ROJ NANOBOTŮ": "NANOBOT SWARM",
  "KVANTOVÉ MINY": "QUANTUM MINES",
  "ION-SATELIT": "ION-SATELLITE",
  PLAMENOMET: "FLAMETHROWER",
  "TLAKOVÁ VLNA": "SHOCKWAVE",
  "KRYO-POLE": "CRYO-FIELD",
  "HOLO-NÁVNADA": "HOLO-DECOY",
  "BLESKOVÁ PAST": "LIGHTNING TRAP",
  "ODRAZ PANCÍŘE": "ARMOR REFLECT",
  "KOLIZE TRUPU": "HULL COLLISION",
  "KVANTOVÝ PŘETLAK": "QUANTUM OVERDRIVE",

  // 8. 13 Synergií
  "SYNERGIE: SLUNEČNÍ SUPERNOVA": "SYNERGY: SOLAR SUPERNOVA",
  "SYNERGIE: BOUŘKOVÁ MATRICE": "SYNERGY: STORM MATRIX",
  "SYNERGIE: HVĚZDNÁ SINGULARITA": "SYNERGY: STELLAR SINGULARITY",
  "SYNERGIE: VORTEXOVÝ CYKLON": "SYNERGY: VORTEX CYCLONE",
  "SYNERGIE: KOBERCOVÉ BOMBARDOVÁNÍ": "SYNERGY: CARPET BOMBARDMENT",
  "SYNERGIE: NESMRTELNÁ CITADELA": "SYNERGY: IMMORTAL CITADEL",
  "SYNERGIE: FANTOMOVÁ LEGIE": "SYNERGY: PHANTOM LEGION",
  "SYNERGIE: BOUŘKOVÁ SÍŤ SMRTI": "SYNERGY: STORM WEB OF DEATH",
  "SYNERGIE: BOUŘKOVÁ SÍŤ": "SYNERGY: STORM GRID",
  "SYNERGIE: DIMENZIONÁLNÍ SEKÁČ": "SYNERGY: DIMENSIONAL CLEAVER",
  "SYNERGIE: DUHOVÁ ANIHILACE": "SYNERGY: PRISMATIC ANNIHILATION",
  "SYNERGIE: JÁDRO SUPERNOVY": "SYNERGY: SUPERNOVA CORE",
  "SYNERGIE: ABSOLUTNÍ TŘÍŠTĚNÍ": "SYNERGY: ABSOLUTE SHATTER",
  "SYNERGIE: HORIZONT UDÁLOSTÍ": "SYNERGY: EVENT HORIZON",
  "FÚZNÍ SYNERGIE AKTIVNÍ!": "FUSION SYNERGY ACTIVE!",
  "ZBRANĚ SPOJENY DO SUPER-SYSTÉMU": "WEAPONS MERGED INTO SUPER-SYSTEM",

  // 9. 50 Trofejí (ACHIEVEMENTS_LIST)
  "SÍŇ SLÁVY SINGULARITY": "HALL OF SINGULARITY",
  "TROFEJE & VÝZVY (50)": "TROPHIES & CHALLENGES (50)",
  "TROFEJ ODEMČENA!": "TROPHY UNLOCKED!",
  "ODEMČENO!": "UNLOCKED!",
  SPLNĚNO: "UNLOCKED",
  "PRVNÍ KREV": "FIRST BLOOD",
  "Znič svého prvního geometrického nepřítele v aréně.":
    "Destroy your first geometric enemy in the arena.",
  "MISTR SYNCHRONIZACE": "SYNC MASTER",
  "Dosáhni násobiče komba alespoň x10.0.":
    "Reach a combo multiplier of at least x10.0.",
  "BOŽSKÉ REFLEXE x20": "GODLIKE REFLEXES x20",
  "Dosáhni maximálního násobiče komba x20.0!":
    "Reach the maximum combo multiplier of x20.0!",
  "KROTITEL ARCHONŮ": "ARCHON TAMER",
  "Poraz svého prvního hlavního Bosse.": "Defeat your first major Boss.",
  "PLAZMOVÝ PYROMAN": "PLASMA PYROMANIAC",
  "Nainstaluj Plazmový Plamenomet a zapal 15 nepřátel.":
    "Install the Plasma Flamethrower and ignite 15 enemies.",
  "BOŽÍ OKO Z ORBITY": "EYE FROM ORBIT",
  "Nainstaluj Orbitální Ion-Satelit a sežehni 5 cílů.":
    "Install the Orbital Ion-Satellite and scorch 5 targets.",
  "LOVEC HORIZONTU": "HORIZON HUNTER",
  "Odemkni Fotonové Bumerangy a rozdrť 25 nepřátel.":
    "Unlock Photon Boomerangs and crush 25 enemies.",
  "MINOVÉ POLE SMRTI": "DEATH MINEFIELD",
  "Polož 20 Kvantových Min během bojů v aréně.":
    "Deploy 20 Quantum Mines during arena combat.",
  "VETERÁN SINGULARITY": "SINGULARITY VETERAN",
  "Přežij až do 6. vlny (AI Tier III).": "Survive until Wave 6 (AI Tier III).",
  "VLÁDCE DIMENZE TIER IV": "TIER IV DIMENSION LORD",
  "Dosáhni 10. vlny s nejvyšší evolucí AI.":
    "Reach Wave 10 with the highest AI evolution.",
  "NESMRTELNÝ SINGULÁŘ": "IMMORTAL SINGULARITY",
  "Přežij až do extrémní 15. vlny!": "Survive until the extreme Wave 15!",
  "BOŽSTVO GALAXIE (VLNA 20)": "GALAXY DEITY (WAVE 20)",
  "Přežij až do legendární 20. vlny!": "Survive until the legendary Wave 20!",
  "PÁN ČASOPROSTORU": "LORD OF SPACETIME",
  "Aktivuj Kvantový Přetlak [F] pro zpomalení času.":
    "Activate Quantum Overdrive [F] to slow down time.",
  "KYBERNETICKÁ LEGENDA": "CYBERNETIC LEGEND",
  "Překonej hranici 100 000 bodů v jedné hře.":
    "Surpass 100,000 points in a single run.",
  "PŮLMILIONOVÝ IMPERÁTOR": "HALF-MILLION EMPEROR",
  "Překonej hranici 500 000 bodů v jedné hře!":
    "Surpass 500,000 points in a single run!",
  "MILIONOVÝ TRANSCENDENT": "MILLION TRANSCENDENT",
  "Překonej magickou hranici 1 000 000 bodů!":
    "Surpass the magical 1,000,000 points mark!",
  "ARCHITEKT HORIZONTU": "HORIZON ARCHITECT",
  "Vypusť celkem 5 Kvantových černých děr.":
    "Deploy a total of 5 Quantum Black Holes.",
  "PLNOHODNOTNÝ ARZENÁL": "FULL ARSENAL",
  "Dosáhni 10. úrovně lodi v jedné hře.":
    "Reach Ship Level 10 in a single run.",
  "OMEGA KONSTRUKT LV15": "OMEGA CONSTRUCT LV15",
  "Dosáhni 15. úrovně lodi v jedné hře.":
    "Reach Ship Level 15 in a single run.",
  "ROJ PLAZMOVÝCH HLAVNÍ": "PLASMA BARREL SWARM",
  "Vylepši primární kanón na 6 nebo 7 hlavní.":
    "Upgrade your primary cannon to 6 or 7 barrels.",
  "BANKÉŘ SINGULARITY": "SINGULARITY BANKER",
  "Měj na účtu alespoň 50 Kvantových Čipů (◈) najednou.":
    "Hold at least 50 Quantum Chips (◈) at once.",
  "ALCHYMISTA FÚZE": "FUSION ALCHEMIST",
  "Aktivuj v boji svou první Zbraňovou Synergii.":
    "Activate your first Weapon Synergy in combat.",
  "CESTOVATEL ČERVÍ DÍROU": "WORMHOLE TRAVELER",
  "Proleť vzácnou prostorovou anomálií (červí dírou).":
    "Fly through a rare spatial anomaly (wormhole).",
  "TROJITÁ KONVERGENCE": "TRIPLE CONVERGENCE",
  "Měj aktivní alespoň 3 Fúzní Synergie v jedné hře!":
    "Have at least 3 Fusion Synergies active in a single run!",
  "KOMBO VIRTUÓZ": "COMBO VIRTUOSO",
  "Dosáhni v boji kombo násobitele alespoň x5.0.":
    "Reach a combo multiplier of at least x5.0 in combat.",
  "PRVNÍ PŘETAKTOVÁNÍ": "FIRST OVERCLOCK",
  "Investuj přebytečné čipy do Kvantového Overclocku v Shopu.":
    "Invest surplus chips into Quantum Overclock in the Shop.",
  "KVANTOVÝ MAGNÁT": "QUANTUM TYCOON",
  "Utrať celkem 500 ◈ Čipů v sekci Kvantový Overclock.":
    "Spend a total of 500 ◈ Chips in Quantum Overclock.",
  "BLESKOVÁ EXEKUCE": "LIGHTNING EXECUTION",
  "Znič libovolného Bosse do 10 sekund od jeho příletu!":
    "Destroy any Boss within 10 seconds of arrival!",
  "PÁN STÍNŮ": "LORD OF SHADOWS",
  "Dokonči vlnu v lodi Phantom Stalker.":
    "Complete a wave piloting the Phantom Stalker.",
  "ŽELEZNÁ ZEĎ": "IRON WALL",
  "Odraz 15 nepřátelských střel v lodi Titan Juggernaut.":
    "Reflect 15 enemy projectiles in the Titan Juggernaut.",
  "MISTR ANOMÁLIÍ": "ANOMALY MASTER",
  "Přežij do 6. vlny se zapnutým Denním Mutátorem.":
    "Survive to Wave 6 with an active Daily Mutator.",
  "NEONOVÝ STYLISTA": "NEON STYLIST",
  "Přizpůsob si barvu své lodi pomocí palety v Hangáru.":
    "Customize your ship color using the Hangar palette.",
  "KROTITEL KAMIKADZE": "KAMIKAZE HUNTER",
  "Sestřel 15 sebevražedných Kamikadze Interceptorů dřív, než vybuchnou.":
    "Shoot down 15 Kamikaze Interceptors before they explode.",
  "KROTITEL PLAZMATU": "PLASMA TAMER",
  "Odemkni Plazmový Bič nebo Kvantový Minomet v boji.":
    "Unlock the Plasma Whip or Quantum Mortar in combat.",
  "PĚTICE ELEMENTŮ": "FIVE ELEMENTS",
  "Aktivuj 5 různých Fúzních Synergií v jediném průchodu!":
    "Activate 5 different Fusion Synergies in a single run!",
  "DOBYVATEL HARDCORE": "HARDCORE CONQUEROR",
  "Dokonči 12. vlnu na obtížnost HARDCORE!":
    "Complete Wave 12 on HARDCORE difficulty!",
  "LOVEC PŘÍZRAKŮ": "PHANTOM HUNTER",
  "Znič fázového bosse AETHER NEMESIS.":
    "Destroy the phase boss AETHER NEMESIS.",
  "SOLÁRNÍ KOLAPS": "SOLAR COLLAPSE",
  "Znič slunečního reaktorového bosse SOLARIS COLOSSUS.":
    "Destroy the solar reactor boss SOLARIS COLOSSUS.",
  "PÁD VALKÝRY": "FALL OF THE VALKYRIE",
  "Znič bleskového bosse CHRONO SERAPH.":
    "Destroy the lightning boss CHRONO SERAPH.",
  "TRI-CORE ROZPAD": "TRI-CORE BREAKDOWN",
  "Znič trojitého bosse NEXUS HYDRA.":
    "Destroy the triple-core boss NEXUS HYDRA.",
  "DRAČÍ ZKÁZA": "DRAGON BANE",
  "Znič masivního kyber-hada VOID LEVIATHAN.":
    "Destroy the cyber-serpent VOID LEVIATHAN.",
  "ZKROCENÍ BĚSU": "FURY TAMER",
  "Znič libovolného Bosse v jeho rozzuřené Enrage fázi.":
    "Destroy any Boss during its Enrage phase.",
  "DOBYVATEL ENDLESSU": "ENDLESS CONQUEROR",
  "Přežij až do 30. vlny v Endless režimu.":
    "Survive until Wave 30 in Endless mode.",
  "TITÁN ENDLESSU": "ENDLESS TITAN",
  "Dosáhni legendární 50. vlny v Endless režimu!":
    "Reach the legendary Wave 50 in Endless mode!",
  "PŘETLAKOVÝ BĚS": "OVERDRIVE FURY",
  "Použij Kvantový Přetlak [F] celkem 5x během jedné mise.":
    "Use Quantum Overdrive [F] 5 times during a single mission.",
  "HYPER-REFLEX": "HYPER-REFLEX",
  "Proveď Hyper-skok s trupem poškozeným pod 20 % HP.":
    "Perform a Hyper-Dash with hull integrity below 20% HP.",
  "KVANTOVÝ PROFESOR": "QUANTUM PROFESSOR",
  "Měj současně vylepšeno alespoň 6 různých zbraní a modulů.":
    "Have at least 6 different weapons and modules upgraded at once.",
  "EXTRÉMNÍ PŘEŽIVŠÍ": "EXTREME SURVIVOR",
  "Přežij do 6. vlny na brutální obtížnost ULTRA!":
    "Survive to Wave 6 on brutal ULTRA difficulty!",
  "DODÁVKA ZVUKU": "SOUND DELIVERY",
  "Přepni v rádiu všech 9 originálních skladeb.":
    "Cycle through at least 9 original tracks on the radio.",
  "ČIPOVÝ MAGNET": "CHIP MAGNET",
  "Měj na účtu alespoň 150 Kvantových Čipů (◈) najednou.":
    "Hold at least 150 Quantum Chips (◈) in your bank at once.",
  // 4 Nové trofeje pro nové Bosse
  "TŘÍŠTIČ SPEKTRA": "SPECTRUM SHATTERER",
  "Znič krystalického bosse QUANTUM PRISM.":
    "Destroy the crystalline boss QUANTUM PRISM.",
  "PÁN GRAVITACE": "GRAVITY LORD",
  "Znič dvojitou singularitu GRAVITY TITAN.":
    "Destroy the dual singularity GRAVITY TITAN.",
  "VYHLAZOVAČ SÍTÍ": "WEB EXTERMINATOR",
  "Znič mechanickou tarantuli CYBER ARACHNID.":
    "Destroy the mechanical tarantula CYBER ARACHNID.",
  "ZRCADLOVÝ SOUD": "MIRROR JUDGMENT",
  "Znič bitevní křižník OMEGA VALKYRIE.":
    "Destroy the battlecruiser OMEGA VALKYRIE.",

  // Upravený popis Chrono-stázové bomby (z combat.js) a Game Over zisk čipů
  "Vypouští za loď modré stázové pole, které výrazně zpomaluje nepřátele a postupně je poškozuje.":
    "Deploys a blue stasis field behind the ship that heavily slows enemies and damages them over time.",
  "KOLAPS JÁDRA // ZISK Z MISE:": "CORE COLLAPSE // MISSION YIELD:",
  "PŘIPRAVENO K ULOŽENÍ": "READY TO CLAIM",

  // 10. Pauza & Game Over (Kill Screen)
  "TAKTICKÁ HIBERNACE // AKTIVNÍ SLOT": "TACTICAL HIBERNATION // ACTIVE SLOT",
  "HRA POZASTAVENA": "GAME PAUSED",
  "Rozehrané Skóre": "Current Score",
  "Aktuální Vlna": "Current Wave",
  "Úroveň Lodi": "Ship Level",
  "NAINSTALOVANÉ SYSTÉMY & SYNERGIE:": "INSTALLED SYSTEMS & SYNERGIES:",
  "💾 RYCHLÉ ULOŽENÍ POZICE DO SLOTU:": "💾 QUICK SAVE POSITION TO SLOT:",
  "RYCHLÉ ULOŽENÍ POZICE DO SLOTU:": "QUICK SAVE POSITION TO SLOT:",
  "ULOŽIT -> SLOT": "SAVE -> SLOT",
  "POKRAČOVAT V BOJI [ESC / OPTIONS]": "RESUME COMBAT [ESC / OPTIONS]",
  "💾 ULOŽIT DO AKTIVNÍHO SLOTU": "💾 SAVE TO ACTIVE SLOT",
  "ULOŽIT DO AKTIVNÍHO SLOTU": "SAVE TO ACTIVE SLOT",
  "🏠 ULOŽIT A DO HANGÁRU": "🏠 SAVE & EXIT TO HANGAR",
  "ULOŽIT A DO HANGÁRU": "SAVE & EXIT TO HANGAR",
  "Smazat tento slot a restartovat misi od 1. vlny":
    "Delete this slot and restart mission from Wave 1",
  "KOLAPS JÁDRA // SYSTÉM ZNIČEN": "CORE COLLAPSE // SYSTEM DESTROYED",
  "KAMPAŇ DOKONČENA": "CAMPAIGN COMPLETED",
  "KONEC PŘENOSU": "TRANSMISSION ENDED",
  "MISE SPLNĚNA!": "MISSION ACCOMPLISHED!",
  "Konečné Skóre": "Final Score",
  "Nejvyšší Rekord": "High Score",
  "Dosažená Vlna": "Wave Reached",
  "Celkem Čipů v Bance": "Total Chips in Bank",
  "📊 TELEMETRIE MISE (RUN SUMMARY):": "📊 MISSION TELEMETRY (RUN SUMMARY):",
  "TELEMETRIE MISE (RUN SUMMARY):": "MISSION TELEMETRY (RUN SUMMARY):",
  "ZNIČENÍ NEPŘÁTELÉ": "ENEMIES DESTROYED",
  "ELITY / BOSSOVÉ": "ELITES / BOSSES",
  "NEJÚČINNĚJŠÍ ZBRAŇ": "TOP WEAPON",
  "ČERNÉ DÍRY": "BLACK HOLES",
  "XP KRYSTALY": "XP GEMS",
  "MAX KOMBO": "MAX COMBO",
  "🏠 HANGÁR & SLOTY": "🏠 HANGAR & SLOTS",
  "HANGÁR & SLOTY": "HANGAR & SLOTS",
  "RESTART [MEZERNÍK]": "RESTART [SPACE]",

  // 11. Plovoucí texty v Canvasu & Toasty
  "⚡ POZICE AUTOMATICKY ULOŽENA": "⚡ POSITION AUTO-SAVED",
  "⚡ ULOŽENO:": "⚡ SAVED:",
  "📤 PROFIL BYL EXPORTOVÁN DO SOUBORU": "📤 PROFILE EXPORTED TO FILE",
  "📥 PROFIL A SLOTY BYLY ÚSPĚŠNĚ NAČTENY!":
    "📥 PROFILE & SLOTS LOADED SUCCESSFULLY!",
  "❌ CHYBA PŘI NAČÍTÁNÍ ZÁLOHY!": "❌ ERROR LOADING BACKUP FILE!",
  "👁 PLNÝ TAKTICKÝ HUD ZAPNUT": "👁 FULL TACTICAL HUD ENABLED",
  "👁 MINIMALISTICKÝ GHOST HUD AKTIVNÍ": "👁 MINIMALIST GHOST HUD ACTIVE",
  "🎵 DALŠÍ SKLADBA:": "🎵 NEXT TRACK:",
  "STISKNI [O] PRO VLASTNÍ MP3": "PRESS [O] FOR CUSTOM MP3",
  "⚡ KVANTOVÁ EXPLOZE & PŘETLAK AKTIVNÍ!":
    "⚡ QUANTUM BLAST & OVERDRIVE ACTIVE!",
  "KVANTOVÁ EXPLOZE & PŘETLAK AKTIVNÍ!": "QUANTUM BLAST & OVERDRIVE ACTIVE!",
  "⚡ PŘETLAK 100 %: KVANTOVÝ VÝBOJ! [STISKNI F]":
    "⚡ OVERDRIVE 100%: QUANTUM BLAST! [PRESS F]",
  "PŘETLAK 100 %: KVANTOVÝ VÝBOJ! [STISKNI F]":
    "OVERDRIVE 100%: QUANTUM BLAST! [PRESS F]",
  "🌟 HVĚZDNÁ SINGULARITA!": "🌟 STELLAR SINGULARITY!",
  "HVĚZDNÁ SINGULARITA!": "STELLAR SINGULARITY!",
  "KVANTOVÁ ČERNÁ DÍRA!": "QUANTUM BLACK HOLE!",
  "AEGIS ŠTÍT POHLTIL ZÁSAH!": "AEGIS SHIELD ABSORBED HIT!",
  "AEGIS ŠTÍT NABIT!": "AEGIS SHIELD RECHARGED!",
  "ZÁSOBOVACÍ POD VYSÁZEN!": "SUPPLY POD DEPLOYED!",
  "OPRAVNÝ NANOBOT (+45 HP)": "REPAIR NANOBOT (+45 HP)",
  "KVANTOVÝ MAGNET XP!": "QUANTUM XP MAGNET!",
  "+1 ČERNÁ DÍRA & PŘETLAK": "+1 BLACK HOLE & OVERDRIVE",
  "🌀 ANOMÁLIE DETEKOVÁNA: PROSTOROVÁ ČERVÍ DÍRA!":
    "🌀 ANOMALY DETECTED: SPATIAL WORMHOLE!",
  "ANOMÁLIE DETEKOVÁNA: PROSTOROVÁ ČERVÍ DÍRA!":
    "ANOMALY DETECTED: SPATIAL WORMHOLE!",
  "🌀 HYPER-TELEPORT!": "🌀 HYPER-TELEPORT!",
  "HYPER-TELEPORT!": "HYPER-TELEPORT!",
  "FÁZE ZUŘIVOSTI!": "ENRAGE PHASE!",
  "KVANTOVÝCH ČIPŮ!": "QUANTUM CHIPS!",
  "KVANTOVÝCH ČIPŮ": "QUANTUM CHIPS",
  "ZNIČEN! +1 ČERNÁ DÍRA": "DESTROYED! +1 BLACK HOLE",
  "VAROVÁNÍ:": "WARNING:",
  "AKTIVNÍ!": "ACTIVE!",
  "OBNOVEN!": "RESTORED!",
  "TRUP!": "HULL!",
  "KRIT ": "CRIT ",
  "PORTÁL A": "PORTAL A",
  "PORTÁL B": "PORTAL B",

  "NANOBOTOVÝ ŠTÍT AKTIVNÍ": "NANOBOT SHIELD ACTIVE",
  "Snižuje přijaté poškození s klesajícím účinkem (max. 55 %) a zrychluje obnovu Aegis štítu. (Synergie s Aegis -> Nesmrtelná Citadela!)":
    "Reduces incoming damage with diminishing returns (max 55%) and speeds up Aegis recharge. (Synergy with Aegis -> Immortal Citadel!)",
  "Nanoboty plynule opravují trup lodi (+3.5 HP/s za úroveň, max. 5) a zvýší Max HP o +15.":
    "Nanobots continuously repair the hull (+3.5 HP/s per level, max 5) and increase Max HP by +15.",
  "Vytvoří dobíjecí silové pole, které plně pohltí zásah a vyvolá odrazovou vlnu (max. 4. úroveň).":
    "Creates a recharging forcefield that absorbs hits and triggers a blast wave (max level 4).",
};

// Seřazení klíčů od nejdelších po nejkratší (zabraňuje kolizím podřetězců, např. "TRUP" uvnitř "TITANOVÉ JÁDRO TRUPU")
const EN_ENTRIES = Object.entries(EN_DICTIONARY).sort(
  (a, b) => b[0].length - a[0].length,
);
const CZ_ENTRIES = Object.entries(EN_DICTIONARY)
  .map(([cz, en]) => [en, cz])
  .sort((a, b) => b[0].length - a[0].length);

function translateString(str) {
  if (!str || typeof str !== "string") return str;
  // Normalizace vícenásobných mezer a Enterů (\n) z formátovaného HTML na jednu mezeru
  let out = str.replace(/\s+/g, " ");
  const entries = currentLang === "en" ? EN_ENTRIES : CZ_ENTRIES;
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
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      if (
        node.parentElement &&
        ["SCRIPT", "STYLE"].includes(node.parentElement.tagName)
      )
        continue;
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
    const langBtn = document.getElementById("btn-lang-toggle");
    if (langBtn) {
      langBtn.textContent =
        currentLang === "en" ? "🌐 LANG: EN [L]" : "🌐 JAZYK: CZ [L]";
    }
  } finally {
    isTranslatingDOM = false;
  }
}

function toggleLanguage() {
  currentLang = currentLang === "cs" ? "en" : "cs";
  localStorage.setItem("neon_singularity_lang", currentLang);
  document.documentElement.lang = currentLang;
  if (typeof renderShipSelector === "function") renderShipSelector();
  if (typeof refreshMenuSaveUI === "function") refreshMenuSaveUI();
  if (typeof renderHallOfFame === "function") renderHallOfFame();
  if (typeof updateHUD === "function") updateHUD();
  applyDOMTranslations();
  if (typeof showSaveToast === "function") {
    showSaveToast(
      currentLang === "en"
        ? "🌐 LANGUAGE SET TO: ENGLISH"
        : "🌐 JAZYK NASTAVEN NA: ČEŠTINA",
    );
  }
}

// Automatický překlad plovoucích textů přímo v Canvasu
const origFillText = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
  const translated =
    currentLang === "en" ? translateString(String(text)) : text;
  if (maxWidth !== undefined)
    return origFillText.call(this, translated, x, y, maxWidth);
  return origFillText.call(this, translated, x, y);
};

// Virtuální dotykové ovládání pro mobily a tablety
function setupResponsiveTouchControls() {
  if (document.getElementById("touch-controls")) return;
  const touchWrap = document.createElement("div");
  touchWrap.id = "touch-controls";
  touchWrap.innerHTML = `
    <div id="joy-left" class="touch-zone" style="left: 24px; bottom: 24px;">
      <div id="joy-left-knob" class="touch-knob"></div>
    </div>
    <div class="touch-action-btns" style="bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 10px;">
      <button id="touch-btn-dash" class="cyber-btn px-4 py-3 text-xs shadow-lg">⚡ SKOK</button>
      <button id="touch-btn-bomb" class="cyber-btn-outline px-4 py-3 text-xs border-pink-500 text-pink-300 shadow-lg">💥 NOVA</button>
      <button id="touch-btn-od" class="cyber-btn-gold px-4 py-2.5 text-xs shadow-lg">🔥 PŘETLAK</button>
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
          const maxR = rect.width / 2 - 10;
          if (dist > maxR) {
            dx = (dx / dist) * maxR;
            dy = (dy / dist) * maxR;
          }
          knob.style.transform = `translate(${dx}px, ${dy}px)`;
          onMove(dx / maxR, dy / maxR, true);
        }
      }
    };

    const endTouch = (e) => {
      for (const t of e.changedTouches) {
        if (t.identifier === activeId) {
          activeId = null;
          knob.style.transform = "translate(0px, 0px)";
          onMove(0, 0, false);
        }
      }
    };

    zone.addEventListener("touchstart", handleTouch, { passive: false });
    zone.addEventListener("touchmove", handleTouch, { passive: false });
    zone.addEventListener("touchend", endTouch);
    zone.addEventListener("touchcancel", endTouch);
  };

  bindStick("joy-left", "joy-left-knob", (nx, ny, active) => {
    keys.a = active && nx < -0.22;
    keys.d = active && nx > 0.22;
    keys.w = active && ny < -0.22;
    keys.s = active && ny > 0.22;
  });

  document
    .getElementById("touch-btn-dash")
    .addEventListener("touchstart", (e) => {
      e.preventDefault();
      triggerHyperDash();
    });
  document
    .getElementById("touch-btn-bomb")
    .addEventListener("touchstart", (e) => {
      e.preventDefault();
      deploySingularityBomb();
    });
  document
    .getElementById("touch-btn-od")
    .addEventListener("touchstart", (e) => {
      e.preventDefault();
      triggerQuantumOverdrive();
    });

  setInterval(() => {
    touchWrap.classList.toggle("active", state.mode === "PLAYING");
  }, 250);
}

// Automatické obalení klíčových UI funkcí, aby se překlad aplikoval vždy po překreslení HUDu, Shopu či Pauzy
window.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.getElementById("btn-lang-toggle");
  if (langBtn) langBtn.addEventListener("click", toggleLanguage);

  const hookTranslationAfter = (fnName) => {
    if (typeof window[fnName] === "function") {
      const orig = window[fnName];
      window[fnName] = function (...args) {
        const res = orig.apply(this, args);
        if (currentLang === "en") applyDOMTranslations();
        return res;
      };
    }
  };

  [
    "updateHUD",
    "syncHudVisibilityDOM",
    "renderShipSelector",
    "renderSaveSlotsUI",
    "refreshMenuSaveUI",
    "renderCyberShop",
    "renderAchievementsModal",
    "renderHallOfFame",
    "togglePauseGame",
    "showBannerPopup",
    "showSaveToast",
    "selectMutatorMode",
  ].forEach(hookTranslationAfter);

  // Při kliknutí na libovolné tlačítko v menu (např. obtížnost, taby) přeloží nově zobrazené texty
  document.addEventListener("click", () => {
    if (currentLang === "en") setTimeout(applyDOMTranslations, 10);
  });

  setupResponsiveTouchControls();
  if (currentLang === "en") setTimeout(applyDOMTranslations, 60);
});

window.addEventListener("keydown", (e) => {
  if (document.activeElement && document.activeElement.tagName === "INPUT")
    return;
  if (e.code === "KeyL") toggleLanguage();
});
