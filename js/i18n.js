/*************************************************************************
 * I18N.JS - COMPLETE MULTILINGUAL ENGINE (CZ <-> EN) & TOUCH CONTROLS
 *************************************************************************/
let currentLang = localStorage.getItem("neon_singularity_lang") || "cs";
let isTranslatingDOM = false;

const EN_DICTIONARY = {
    // Hlavní menu, Záložky & Status Bar
    "GAMEPAD: NEPŘIPOJEN": "GAMEPAD: DISCONNECTED",
    "DUALSHOCK / GAMEPAD: AKTIVNÍ": "DUALSHOCK / GAMEPAD: ACTIVE",
    "GAMEPAD: AKTIVNÍ": "GAMEPAD: ACTIVE",
    "TROFEJE:": "TROPHIES:",
    "ČIPY:": "CHIPS:",
    "ČIPŮ": "CHIPS",
    "6 LODÍ // 24 ZBRANÍ + 3 SYNERGIE // 3 OBTÍŽNOSTI // PODPORA GAMEPADU": "6 SHIPS // 24 WEAPONS + 3 SYNERGIES // 3 DIFFICULTIES // GAMEPAD SUPPORT",
    "8 LODÍ // 32 ZBRANÍ + 13 SYNERGIÍ // DENNÍ VÝZVY // OVERCLOCK": "8 SHIPS // 32 WEAPONS + 13 SYNERGIES // DAILY MUTATORS // OVERCLOCK",
    "6 LODÍ // 24 ZBRANÍ + 3 SYNERGIE // VZÁCNÉ ČERVÍ DÍRY // PODPORA GAMEPADU": "6 SHIPS // 24 WEAPONS + 3 SYNERGIES // RARE WORMHOLES // GAMEPAD SUPPORT",
    "1. VÝBĚR TŘÍDY VZNÁŠEDLA (6)": "1. SELECT HOVERCRAFT CLASS (6)",
    "1. VÝBĚR TŘÍDY VZNÁŠEDLA (8)": "1. SELECT HOVERCRAFT CLASS (8)",
    "2. PAMĚŤOVÉ SLOTY (3) & OVLÁDÁNÍ": "2. MEMORY SLOTS (3) & CONTROLS",
    "3. DENNÍ VÝZVA & MUTÁTORY": "3. DAILY CHALLENGE & MUTATORS",
    "VYBER AKTIVNÍ SLOT PRO UKLÁDÁNÍ NEBO PŘEJMENOVÁNÍ ROZEHRANÉ MISE:": "SELECT ACTIVE SLOT TO SAVE, LOAD OR RENAME MISSION:",
    "VYBER AKTIVNÍ SLOT PRO UKLÁDÁNÍ NEBO NAČTENÍ ROZEHRANÉ MISE:": "SELECT ACTIVE SLOT TO SAVE OR LOAD MISSION:",
    "VLASTNÍ NEONOVÉ LAKOVÁNÍ TRUPU:": "CUSTOM NEON HULL PAINT:",
    "VÝCHOZÍ": "DEFAULT",
    "PRÁZDNÝ SLOT": "EMPTY SLOT",
    "Připraven pro novou misi": "Ready for a new mission",
    "POŠKOZENÁ DATA": "CORRUPTED DATA",
    "AKTIVNÍ": "ACTIVE",
    "VYBRÁN": "SELECTED",
    "RYCH:": "SPD:",
    "VYBER OBTÍŽNOST SIMULACE:": "SELECT SIMULATION DIFFICULTY:",
    "ARCADE (STANDARD // 12 VLN)": "ARCADE (STANDARD // 12 WAVES)",
    "HARDCORE (70 % HP // 2x ČIPY ◈)": "HARDCORE (70% HP // 2x CHIPS ◈)",
    "ENDLESS (NEKONEČNÁ VÝZVA)": "ENDLESS (INFINITE SURVIVAL)",
    "ARCADE: Standardní aréna (100 % HP, běžný zisk Čipů, vítězství ve 12. vlně)": "ARCADE: Standard Arena (100% HP, normal Chips, Victory at Wave 12)",
    "HARDCORE: Extrémní výzva (70 % HP, agresivnější AI, ale 2x více Kvantových Čipů ◈ a +35 % Skóre!)": "HARDCORE: Extreme Challenge (70% HP, aggressive AI, 2x Quantum Chips ◈ & +35% Score!)",
    "ENDLESS: Nekonečná simulace bez stropu vln – přežij co nejdéle proti sílícím Bossům!": "ENDLESS: Infinite simulation without wave cap – survive as long as possible!",
    "POKRAČOVAT V ULOŽENÉ MISI (VYBRANÝ SLOT)": "RESUME SAVED MISSION (SELECTED SLOT)",
    "CYBER-SHOP (8)": "CYBER-SHOP (8)",
    "CYBER-SHOP (12)": "CYBER-SHOP (12)",
    "TROFEJE (24)": "TROPHIES (24)",
    "TROFEJE (36)": "TROPHIES (36)",
    "SPUSTIT NOVOU MISI DO SLOTU [ENTER]": "LAUNCH NEW MISSION TO SLOT [ENTER]",
    "SPUSTIT NOVOU MISI": "LAUNCH NEW MISSION",
    "PŘEPSAT": "OVERWRITE",
    "NOVOU MISÍ": "WITH NEW MISSION",

    // Denní výzvy & Mutátory
    "VYBER MODIFIKÁTOR MISE (MUTÁTOR) PRO EXTRA ODMĚNU V ČIPECH:": "SELECT MISSION MUTATOR FOR BONUS QUANTUM CHIPS:",
    "BEZ MUTÁTORU (STANDARDNÍ PRAVIDLA)": "NO MUTATOR (STANDARD RULES)",
    "Standardní fyzika arény bez dodatečných modifikátorů.": "Standard arena physics without additional modifiers.",
    "SKLENĚNÁ DĚLA (2x DMG PRO VŠECHNY)": "GLASS CANNON (2x DMG FOR EVERYONE)",
    "Tvé zbraně způsobují dvojnásobné poškození, ale nepřátelé dávají 2x větší rány!": "Your weapons deal double damage, but enemies hit 2x harder!",
    "NEKONEČNÝ HYPER-SKOK (0.18s COOLDOWN)": "INFINITE HYPER-DASH (0.18s COOLDOWN)",
    "Hyper-Skok se nabíjí téměř okamžitě. Ideální pro čistě kinetický průlet arénou!": "Hyper-Dash recharges almost instantly. Ideal for high-speed kinetic runs!",
    "ROJOVÝ CHAOS (2x VÍCE NEPŘÁTEL)": "SWARM CHAOS (2x MORE ENEMIES)",
    "Dvojnásobný počet nepřátel v každé vlně, ale mají o 28 % méně životů.": "Double the number of enemies in every wave, with 28% less HP.",

    // HUD & Ovládání
    "[H] PLNÝ HUD // [N] RÁDIO // [ESC] PAUZA": "[H] FULL HUD // [N] RADIO // [ESC] PAUSE",
    "PŘETLAK [F / TROJÚHELNÍK]": "OVERDRIVE [F / TRIANGLE]",
    "HYPER-SKOK [MEZERNÍK / KŘÍŽEK]": "HYPER-DASH [SPACE / CROSS]",
    "ČERNÁ DÍRA [Q / ČTVEREC]": "BLACK HOLE [Q / SQUARE]",
    "PŘETLAK PŘIPRAVEN [F]!": "OVERDRIVE READY [F]!",
    "PŘETLAK PŘIPRAVEN [F]": "OVERDRIVE READY [F]",
    "PŘETLAK AKTIVNÍ!": "OVERDRIVE ACTIVE!",
    "PŘETLAK AKTIVNÍ": "OVERDRIVE ACTIVE",
    "ARZENÁL & SYNERGIE:": "ARSENAL & SYNERGIES:",
    "HUD: PLNÝ [H]": "HUD: FULL [H]",
    "HUD: MINIMAL [H]": "HUD: MINIMAL [H]",
    "PAUZA [ESC]": "PAUSE [ESC]",
    "AEGIS ŠTÍT:": "AEGIS SHIELD:",
    "HYPER-SKOK": "HYPER-DASH",
    "ČERNÁ DÍRA": "BLACK HOLE",
    "OBTÍŽNOST:": "DIFF:",
    "ČÁSTICE:": "PARTICLES:",
    "REKORD:": "BEST:",
    "RÁDIO:": "RADIO:",
    "ZVUK:": "AUDIO:",
    "PŘETLAK": "OVERDRIVE",
    "DOBÍJENÍ": "CHARGING",
    "NABITO": "READY",
    "ÚROVEŇ": "LEVEL",
    "SKÓRE": "SCORE",
    "TRUP": "HULL",
    "VLNA": "WAVE",

    // Lodě (8 tříd)
    "ŠÍPOVÁ STÍHAČKA // ODRAZOVÉ FOTONY": "ARROW FIGHTER // RICOCHET PHOTONS",
    "Ultralehká šípová stíhačka s dvojitým plazmovým pohonem. Nejvyšší rychlost a začíná s Odrazovými fotony.": "Ultralight arrow fighter with twin plasma drive. Highest speed and starts with Ricochet Photons.",
    "TĚŽKÝ DREADNOUGHT // AEGIS & ČEPELE": "HEAVY DREADNOUGHT // AEGIS & BLADES",
    "Masivní šestihranný křižník s bočními štíty. Začíná s Aegis bariérou, 2 Orbitálními čepelemi a tlakovým pulzem.": "Massive hexagonal cruiser with side shields. Starts with Aegis barrier, 2 Orbital Blades and Kinetic Pulse.",
    "HVĚZDICOVÝ KŘIŽNÍK // DRONY & TESLA": "STAR CRUISER // DRONES & TESLA",
    "Experimentální plavidlo s levitujícím prstencem. Začíná s Autonomním dronem, Teslovým bleskem a 3 Černými dírami (Synergie Bouřková Matrice!).": "Experimental vessel with levitating ring. Starts with Drone, Tesla Arc and 3 Black Holes (Storm Matrix Synergy!).",
    "KRITICKÝ ZABIJÁK // BUMERANGY & RAILGUN": "CRITICAL ASSASSIN // BOOMERANGS & CRIT",
    "Agresivní kosmický predátor s dvojitými kosami. Začíná s Fotonovými Bumerangy a Kritickým přetaktovačem LV2.": "Aggressive cosmic predator with twin scythes. Starts with Photon Boomerangs and Critical Overclock LV2.",
    "OHNIVÁ VALKÝRA // PLAMENOMET & STOPA": "SOLAR VALKYRIE // FLAMETHROWER & TRAIL",
    "Žhnoucí solární valkýra. Od samého startu spaluje nepřátele Plazmovým Plamenometem a hořící stopou.": "Blazing solar valkyrie. Incinerates enemies right from the start with Plasma Flamethrower and Burning Trail.",
    "VLÁDCE GRAVITACE // MINY, SATELIT & 4x NOVA": "GRAVITY LORD // MINES, SATELLITE & 4x NOVA",
    "Kvantový konstrukt. Začíná s Orbitálním Satelitem, Kvantovými minami a 4 zesílenými Černými dírami (Synergie Hvězdná Singularita!).": "Quantum construct. Starts with Orbital Satellite, Quantum Mines and 4 amplified Black Holes (Stellar Singularity!).",
    "SKRYTÝ DRAVEC // KLONY & NANOBOTY": "STEALTH PREDATOR // CLONES & NANOBOTS",
    "Stínová stíhačka. Při každém Hyper-Skoku zanechá výbušný holografický klon a vypouští lovecké nanoboty (Synergie Fantomová Legie!).": "Shadow fighter. Leaves an explosive holographic decoy on every Hyper-Dash and deploys hunter nanobots (Phantom Legion Synergy!).",
    "PANCÉŘOVÁ PEVNOST // ODRAZ STŘEL & BIČ": "ARMORED FORTRESS // BULLET REFLECT & WHIP",
    "Kolosální bitevní křižník. Automaticky odráží nepřátelské střely zpět na útočníky a šlehá Plazmovým bičem.": "Colossal battlecruiser. Automatically reflects enemy projectiles back at attackers and lashes with the Plasma Whip.",

    // 32 Zbraní & Vylepšení v Arzenálu
    "KVANTOVÁ EVOLUCE SYSTÉMU // KLIKNI, STISKNI [1, 2, 3] NEBO ŠIPKY NA OVLADAČI [⬅️ ⬆️ ➡️]": "QUANTUM SYSTEM EVOLUTION // CLICK, PRESS [1, 2, 3] OR D-PAD [⬅️ ⬆️ ➡️]",
    "D-PAD VLEVO": "D-PAD LEFT",
    "D-PAD NAHORU": "D-PAD UP",
    "D-PAD VPRAVO": "D-PAD RIGHT",
    "PLAZMOVÝ BIČ": "PLASMA WHIP",
    "ENERGETICKÝ ŠVIH (360°)": "360° ENERGY LASH",
    "Šlehá kolem lodi žhnoucím obloukem plazmatu, který drtí vše v dosahu. (Synergie s Bumerangy -> Vortexový Cyklon!)": "Lashes a blazing plasma arc around the ship, crushing nearby foes. (Synergy with Boomerangs -> Vortex Cyclone!)",
    "KVANTOVÝ MINOMET": "QUANTUM MORTAR",
    "TĚŽKÉ OBLOUKOVÉ GRANÁTY": "HEAVY ARC SHELLS",
    "Vystřeluje explozivní kvantové granáty na nejbližší shluk nepřátel. (Synergie s Minami -> Kobercové Bombardování!)": "Fires explosive quantum shells at enemy clusters. (Synergy with Mines -> Carpet Bombardment!)",
    "NANOBOTOVÝ ŠTÍT": "NANOBOT SHIELD",
    "PULZUJÍCÍ BARIÉRA & ODRAZ": "PULSING BARRIER & REFLECT",
    "Snižuje přijaté poškození o 20 % a zrychluje obnovu Aegis štítu. (Synergie s Aegis -> Nesmrtelná Citadela!)": "Reduces incoming damage by 20% and speeds up Aegis recharge. (Synergy with Aegis -> Immortal Citadel!)",
    "HOLOGRAFICKÝ NÁVNADOVÝ DRON": "HOLOGRAPHIC DECOY DRONE",
    "VYBUCHUJÍCÍ KLON": "EXPLOSIVE HOLO-CLONE",
    "Vypouští holografické dvojníky, kteří přitahují palbu a po zničení explodují. (Synergie s Nanoboty -> Fantomová Legie!)": "Deploys holographic doubles that draw enemy fire and explode. (Synergy with Nanobots -> Phantom Legion!)",
    "REZONANČNÍ BLESKOVÁ PAST": "RESONANCE LIGHTNING TRAP",
    "ELEKTRICKÁ SÍŤ V ARÉNĚ": "ARENA ELECTRIC GRID",
    "Klade do prostoru bleskové uzly, které paralyzují a smaží projíždějící nepřátele. (Synergie s Teslou -> Bouřková Síť!)": "Deploys lightning nodes that paralyze and fry passing enemies. (Synergy with Tesla -> Storm Grid!)",
    "SUB-PROSTOROVÝ TRHAČ": "SUB-SPACE RIFT SLICER",
    "DIMENZIONÁLNÍ VLNY": "DIMENSIONAL WAVES",
    "Vysílá široké fázové vlny, které procházejí skrz všechny nepřátele v lajně. (Synergie s Čepelemi -> Dimenzionální Sekáč!)": "Fires wide phase waves that slice through all enemies in a line. (Synergy with Blades -> Dimensional Cleaver!)",
    "FOTONOVÉ HRANOLY": "PHOTON PRISMS",
    "ROZŠTĚPENÉ PAPRSKY": "SPLIT LASER BEAMS",
    "Každý třetí výstřel vyšle vějíř 5 laserových paprsků. (Synergie s Railgunem -> Duhová Anihilace!)": "Every third shot unleashes a fan of 5 laser beams. (Synergy with Railgun -> Prismatic Annihilation!)",
    "OMEGA REAKTOR": "OMEGA REACTOR",
    "+25 % RYCHLOST PŘETLAKU & PALBY": "+25% OVERDRIVE & DAMAGE",
    "Zrychluje nabíjení Přetlaku [F] o +35 % a zvyšuje celkové poškození o +15 %. (Synergie s Aurou -> Jádro Supernovy!)": "Speeds up Overdrive [F] charging by +35% and boosts total damage by +15%. (Synergy with Halo -> Supernova Core!)",
    "SLUNEČNÍ AURA": "SOLAR HALO",
    "PERMANENTNÍ ŽHNOUCÍ PRSTENEC": "PERMANENT BLAZING RING",
    "Kolem lodi pulzuje žhnoucí sluneční koróna, která automaticky spaluje a zpomaluje blízké nepřátele.": "A blazing solar corona pulses around the ship, burning and slowing nearby enemies.",
    "ROJ LOVECKÝCH NANOBOTŮ": "HUNTER NANOBOT SWARM",
    "SAMONAVÁDĚCÍ KYBER-HMYZ": "HOMING CYBER-SWARM",
    "Vypouští rychlé zeleno-zlaté nanoboty, kteří vyhledávají oslabené cíle a rozkládají jejich štíty.": "Releases fast green-gold nanobots that seek targets and dissolve their shields.",
    "GRAVITAČNÍ DĚLO": "GRAVITY CANNON",
    "TĚŽKÉ IMPLODUJÍCÍ KULE": "HEAVY IMPLODING ORBS",
    "Střílí pomalé temné sféry, které po nárazu přitáhnou okolní nepřátele do jednoho bodu.": "Fires slow dark spheres that pull surrounding enemies together on impact.",
    "FÁZOVÝ ROZKLAD PANCÍŘE": "PHASE ARMOR MELT",
    "+25 % POŠKOZENÍ DO BOSSŮ & ELIT": "+25% DAMAGE TO BOSSES & ELITES",
    "Střely narušují molekulární vazby – Elity a Bossové dostávají o +25 % vyšší poškození ze všech zdrojů.": "Disrupts molecular bonds – Elites and Bosses take +25% more damage from all sources.",
    "FOTONOVÉ BUMERANGY": "PHOTON BOOMERANGS",
    "VRACEJÍCÍ SE ENERGETICKÉ SRPY": "RETURNING ENERGY CRESCENTS",
    "Vypouští rotující fotonové bumerangy. (Synergie s Plamenometem -> Sluneční Supernova!)": "Launches spinning photon boomerangs. (Synergy with Flamethrower -> Solar Supernova!)",
    "ROJ KVANTOVÝCH MIN": "QUANTUM MINEFIELD",
    "MAGNETICKÉ PROSTOROVÉ MINY": "MAGNETIC PROXIMITY MINES",
    "Loď za sebou klade pulzující kvantové miny, které se přitáhnou k blízkým nepřátelům a vybuchnou.": "Drops pulsing quantum mines that magnetize to nearby foes and detonate.",
    "KINETICKÁ TLAKOVÁ VLNA": "KINETIC SHOCKWAVE",
    "ODRAZOVÝ PULZ KOLEM LODI": "REPULSION PULSE",
    "Periodicky vysílá prstencovou rázovou vlnu, která odhodí nepřátele a smaže blízké střely.": "Periodically emits a ring shockwave that knocks back enemies and clears projectiles.",
    "DRTIČ GRAVITACE": "GRAVITY CRUSHER",
    "+35 % DOSAH & SÍLA ČERNÉ DÍRY": "+35% BLACK HOLE RANGE & POWER",
    "Zvětšuje Černé díry o +35 % a přidá +1 nálož. (Synergie se Satelitem -> Hvězdná Singularita!)": "Enlarges Black Holes by +35% and adds +1 charge. (Synergy with Satellite -> Stellar Singularity!)",
    "NANOBOTNÍ REGENERACE": "NANOBOT REGENERATION",
    "AUTOMATICKÁ OPRAVA TRUPU V BOJI": "COMBAT HULL REPAIR",
    "Nanoboty plynule opravují trup lodi (+3.5 HP/s za úroveň) a zvýší Max HP o +15.": "Nanobots continuously repair the hull (+3.5 HP/s per level) and increase Max HP by +15.",
    "PLAZMOVÝ PLAMENOMET": "PLASMA FLAMETHROWER",
    "KUŽEL PLAZMATU & ZAPÁLENÍ": "PLASMA CONE & IGNITION",
    "Chrlí žhnoucí proud plazmatu. (Synergie s Bumerangy -> Sluneční Supernova!)": "Spews a blazing stream of plasma. (Synergy with Boomerangs -> Solar Supernova!)",
    "ORBITÁLNÍ ION-SATELIT": "ORBITAL ION-SATELLITE",
    "ORBITÁLNÍ LASEROVÝ ÚDER": "ORBITAL LASER STRIKE",
    "Satelit sesílá iontové sloupy energie. (Synergie s Drtičem Gravitace -> Hvězdná Singularita!)": "Calls down orbital ion pillars. (Synergy with Gravity Crusher -> Stellar Singularity!)",
    "KVANTOVÉ HLAVNĚ": "QUANTUM BARRELS",
    "+1 PLAZMOVÝ PROUD": "+1 PLASMA STREAM",
    "Přidá další hlaveň k primárnímu pulznímu kanónu a rozšíří zbraňové věže na trupu lodi.": "Adds an extra barrel to the primary pulse cannon and expands hull turrets.",
    "HYPER-KONDENZÁTOR": "HYPER-CAPACITOR",
    "+22 % KADENCE & POHYB": "+22% FIRE RATE & SPEED",
    "Zvyšuje rychlost nabíjení zbraní a zrychluje trysky vznášedla.": "Increases weapon fire rate and boosts thruster speed.",
    "ODRAZOVÉ FOTONY": "RICOCHET PHOTONS",
    "+1 ODRAZ & PRŮRAZNOST": "+1 BOUNCE & PIERCE",
    "Střely se odrážejí od stěn arény a pronikají skrz pancíře více nepřátel.": "Shots bounce off arena walls and pierce through enemy armor.",
    "ROJ MIKRORAKET": "MICRO-MISSILE SWARM",
    "NAVÁDĚNÁ SALVA": "HOMING SALVO",
    "Vypouští salvu kybernetických mikroraket, které samy pronásledují cíle.": "Launches a salvo of cybernetic micro-missiles that hunt down targets.",
    "KVANTOVÝ RAILGUN": "QUANTUM RAILGUN",
    "PRŮRAZNÝ HYPER-PAPRSEK": "PIERCING HYPER-BEAM",
    "Namontuje na příď lodi dlouhý Railgun, který vystřeluje okamžitý paprsek přes celou arénu.": "Mounts a forward Railgun that fires an instant beam across the entire arena.",
    "AUTONOMNÍ DRONY": "AUTONOMOUS DRONES",
    "+1 ÚTOČNÝ WINGMAN DRON": "+1 ASSAULT WINGMAN DRONE",
    "Kolem lodi krouží bojové drony. (Synergie s Teslou -> Bouřková Matrice!)": "Combat drones orbit the ship. (Synergy with Tesla -> Storm Matrix!)",
    "ORBITÁLNÍ ČEPELE": "ORBITAL BLADES",
    "ROTUJÍCÍ PLAZMOVÉ KOTOUČE": "SPINNING PLASMA DISCS",
    "Energetické disky drtící nepřátele i nepřátelské projektily v těsné blízkosti.": "Energy discs that shred enemies and enemy projectiles at close range.",
    "TESLŮV OBLOUK": "TESLA ARC",
    "ŘETĚZOVÝ BLESK": "CHAIN LIGHTNING",
    "Vysokonapěťový výboj přeskakující mezi nepřáteli. (Synergie s Drony -> Bouřková Matrice!)": "High-voltage arc jumping between enemies. (Synergy with Drones -> Storm Matrix!)",
    "PLAZMOVÁ STOPA": "PLASMA TRAIL",
    "HOŘÍCÍ STOPA ZA LODÍ": "BURNING WAKE",
    "Při pohybu a Hyper-Skoku zanechává loď žhnoucí plazmové zóny, které taví pronásledovatele.": "Leaves blazing plasma zones behind the ship when moving and dashing.",
    "KRYO-PULZNÍ POLE": "CRYO-PULSE FIELD",
    "MRAZIVÁ TLAKOVÁ VLNA": "FREEZING SHOCKWAVE",
    "Vysílá sub-nulový pulz, který zpomalí okolní nepřátele na 45 % rychlosti.": "Emits a sub-zero pulse that slows nearby enemies to 45% speed.",
    "ENERGETICKÝ ŠTÍT AEGIS": "AEGIS ENERGY SHIELD",
    "AUTOMATICKÁ BARIÉRA": "AUTOMATIC BARRIER",
    "Vytvoří dobíjecí silové pole, které plně pohltí zásah a vyvolá odrazovou vlnu.": "Creates a recharging forcefield that absorbs hits and triggers a blast wave.",
    "KRITICKÝ PŘETAKTOVAČ": "CRITICAL OVERCLOCKER",
    "2.4x KRITICKÉ ZÁSAHY & OPRAVY": "2.4x CRITICAL HITS & REPAIR",
    "Zvyšuje šanci na kritické poškození o +15 % a zničení Elit/Bossů opravuje trup.": "Increases critical hit chance by +15% and destroying Elites/Bosses repairs the hull.",
    "JÁDRO SINGULARITY": "SINGULARITY CORE",
    "+1 ČERNÁ DÍRA & +30 MAX TRUP": "+1 BLACK HOLE & +30 MAX HULL",
    "Doplní +1 nálož Černé díry, zvýší maximální integritu trupu o +30 a opraví 60 HP.": "Restores +1 Black Hole, increases Max HP by +30 and repairs 60 HP.",

    // 13 Synergií
    "SYNERGIE: SLUNEČNÍ SUPERNOVA": "SYNERGY: SOLAR SUPERNOVA",
    "SYNERGIE: BOUŘKOVÁ MATRICE": "SYNERGY: STORM MATRIX",
    "SYNERGIE: HVĚZDNÁ SINGULARITA": "SYNERGY: STELLAR SINGULARITY",
    "SYNERGIE: VORTEXOVÝ CYKLON": "SYNERGY: VORTEX CYCLONE",
    "SYNERGIE: KOBERCOVÉ BOMBARDOVÁNÍ": "SYNERGY: CARPET BOMBARDMENT",
    "SYNERGIE: NESMRTELNÁ CITADELA": "SYNERGY: IMMORTAL CITADEL",
    "SYNERGIE: FANTOMOVÁ LEGIE": "SYNERGY: PHANTOM LEGION",
    "SYNERGIE: BOUŘKOVÁ SÍŤ": "SYNERGY: STORM GRID",
    "SYNERGIE: DIMENZIONÁLNÍ SEKÁČ": "SYNERGY: DIMENSIONAL CLEAVER",
    "SYNERGIE: DUHOVÁ ANIHILACE": "SYNERGY: PRISMATIC ANNIHILATION",
    "SYNERGIE: JÁDRO SUPERNOVY": "SYNERGY: SUPERNOVA CORE",
    "SYNERGIE: KRYO-GRAVITAČNÍ KOLAPS": "SYNERGY: CRYO-GRAVITY COLLAPSE",
    "SYNERGIE: NAPALMOVÝ DEŠŤ": "SYNERGY: NAPALM RAIN",
    "FÚZNÍ SYNERGIE AKTIVNÍ!": "FUSION SYNERGY ACTIVE!",
    "ZBRANĚ SPOJENY DO SUPER-SYSTÉMU": "WEAPONS MERGED INTO SUPER-SYSTEM",

    // Cyber-Shop & Kvantový Overclock
    "TRVALÁ META-PROGRESE JÁDRA (8 MODULŮ)": "PERMANENT CORE META-PROGRESSION (8 MODULES)",
    "TRVALÁ META-PROGRESE JÁDRA (12 MODULŮ)": "PERMANENT CORE META-PROGRESSION (12 MODULES)",
    "KVANTOVÝ OVERCLOCK (NEKONEČNÉ BONUSY ZA PŘEBYTEČNÉ ČIPY)": "QUANTUM OVERCLOCK (INFINITE BONUSES FOR SURPLUS CHIPS)",
    "Utrať 50 ◈ Čipů za trvalé navýšení statistik pro každou další misi:": "Spend 50 ◈ Chips for permanent stat boosts on every future mission:",
    "+1 % POŠKOZENÍ (50 ◈)": "+1% DAMAGE (50 ◈)",
    "+0.5 % RYCHLOST (50 ◈)": "+0.5% SPEED (50 ◈)",
    "+25 STARTOVNÍ XP (50 ◈)": "+25 STARTING XP (50 ◈)",
    "ULOŽIT A ZPĚT DO HANGÁRU": "SAVE & RETURN TO HANGAR",
    "ZPĚT DO HANGÁRU": "RETURN TO HANGAR",
    "MAXIMÁLNÍ ÚROVEŇ": "MAX LEVEL REACHED",
    "VYLEPŠIT": "UPGRADE",

    // Pauza, Trofeje & Statistika po konci hry (Kill Screen)
    "TELEMETRIE MISE (RUN SUMMARY):": "MISSION TELEMETRY (RUN SUMMARY):",
    "ZNIČENÍ NEPŘÁTELÉ": "ENEMIES DESTROYED",
    "ELITY / BOSSOVÉ": "ELITES / BOSSES",
    "NEJÚČINNĚJŠÍ ZBRAŇ": "TOP WEAPON",
    "ČERNÉ DÍRY": "BLACK HOLES",
    "XP KRYSTALY": "XP GEMS",
    "MAX KOMBO": "MAX COMBO",
    "CELKEM OVERCLOCK:": "TOTAL OVERCLOCK:",
    "PŘETAKTOVAT": "OVERCLOCK",
    "SÍŇ SLÁVY SINGULARITY": "HALL OF SINGULARITY",
    "TROFEJE & VÝZVY (24)": "TROPHIES & CHALLENGES (24)",
    "TROFEJE & VÝZVY (36)": "TROPHIES & CHALLENGES (36)",
    "TROFEJ ODEMČENA!": "TROPHY UNLOCKED!",
    "ODEMČENO!": "UNLOCKED!",
    "SPLNĚNO": "UNLOCKED",
    "TAKTICKÁ HIBERNACE // AKTIVNÍ SLOT": "TACTICAL HIBERNATION // ACTIVE SLOT",
    "HRA POZASTAVENA": "GAME PAUSED",
    "Rozehrané Skóre": "Current Score",
    "Aktuální Vlna": "Current Wave",
    "Úroveň Lodi": "Ship Level",
    "NAINSTALOVANÉ SYSTÉMY & SYNERGIE:": "INSTALLED SYSTEMS & SYNERGIES:",
    "RYCHLÉ ULOŽENÍ POZICE DO SLOTU:": "QUICK SAVE TO SLOT:",
    "ULOŽIT -> SLOT": "SAVE -> SLOT",
    "POKRAČOVAT V BOJI [ESC / OPTIONS]": "RESUME COMBAT [ESC / OPTIONS]",
    "ULOŽIT DO AKTIVNÍHO SLOTU": "SAVE TO ACTIVE SLOT",
    "ULOŽIT A DO HANGÁRU": "SAVE & EXIT TO HANGAR",
    "Smazat tento slot a restartovat misi od 1. vlny": "Delete this slot and restart mission from Wave 1",
    "VYLEPŠENÍ ARZENÁLU": "ARSENAL UPGRADE",
    "INSTALOVAT MODUL": "INSTALL MODULE",
    "KLÁVESA": "KEY",
    "KOLAPS JÁDRA // SYSTÉM ZNIČEN": "CORE COLLAPSE // SYSTEM DESTROYED",
    "KONEC PŘENOSU": "TRANSMISSION ENDED",
    "MISE SPLNĚNA!": "MISSION ACCOMPLISHED!",
    "Konečné Skóre": "Final Score",
    "Nejvyšší Rekord": "High Score",
    "Dosažená Vlna": "Wave Reached",
    "Celkem Čipů v Bance": "Total Chips in Bank",
    "DETAILNÍ STATISTIKA MISE (RUN SUMMARY):": "DETAILED MISSION TELEMETRY (RUN SUMMARY):",
    "Zničeno nepřátel:": "Enemies Destroyed:",
    "Elity / Bossové:": "Elites / Bosses:",
    "Použité Černé díry:": "Black Holes Used:",
    "Sebrané XP krystaly:": "XP Gems Collected:",
    "Nejúčinnější zbraň:": "Most Effective Weapon:",
    "HANGÁR & SLOTY": "HANGAR & SLOTS",
    "RESTART [MEZERNÍK]": "RESTART [SPACE]",
    "100 % HP // Běžné čipy // Cíl: 12. vlna": "100% HP // Normal Chips // Goal: Wave 12",
    "70 % HP // Silnější AI // 2x Čipy ◈ & +35 % Skóre": "70% HP // Stronger AI // 2x Chips ◈ & +35% Score",
    "35 % HP // Extrémní AI // 3x Čipy ◈ & +75 % Skóre": "35% HP // Extreme AI // 3x Chips ◈ & +75% Score",
    "Nekonečné vlny // Stupňující se Bossové": "Infinite Waves // Escalating Bosses",
    // Plovoucí texty v Canvasu
    "KVANTOVÁ EXPLOZE & PŘETLAK AKTIVNÍ!": "QUANTUM BLAST & OVERDRIVE ACTIVE!",
    "PŘETLAK 100 %: KVANTOVÝ VÝBOJ! [STISKNI F]": "OVERDRIVE 100%: QUANTUM BLAST! [PRESS F]",
    "HVĚZDNÁ SINGULARITA!": "STELLAR SINGULARITY!",
    "KVANTOVÁ ČERNÁ DÍRA!": "QUANTUM BLACK HOLE!",
    "AEGIS ŠTÍT POHLTIL ZÁSAH!": "AEGIS SHIELD ABSORBED HIT!",
    "AEGIS ŠTÍT NABIT!": "AEGIS SHIELD RECHARGED!",
    "ZÁSOBOVACÍ POD VYSÁZEN!": "SUPPLY POD DEPLOYED!",
    "OPRAVNÝ NANOBOT (+45 HP)": "REPAIR NANOBOT (+45 HP)",
    "KVANTOVÝ MAGNET XP!": "QUANTUM XP MAGNET!",
    "+1 ČERNÁ DÍRA & PŘETLAK": "+1 BLACK HOLE & OVERDRIVE",
    "ANOMÁLIE DETEKOVÁNA: PROSTOROVÁ ČERVÍ DÍRA!": "ANOMALY DETECTED: SPATIAL WORMHOLE!",
    "HYPER-TELEPORT!": "HYPER-TELEPORT!",
    "VAROVÁNÍ:": "WARNING:",
    "ZNIČEN! +1 ČERNÁ DÍRA": "DESTROYED! +1 BLACK HOLE",
    "OBNOVEN!": "RESTORED!",
    "PORTÁL A": "PORTAL A",
    "PORTÁL B": "PORTAL B"
};

// Seřazení klíčů od nejdelších po nejkratší (zabraňuje kolizím podřetězců)
const EN_ENTRIES = Object.entries(EN_DICTIONARY).sort((a, b) => b[0].length - a[0].length);
const CZ_ENTRIES = Object.entries(EN_DICTIONARY)
    .map(([cz, en]) => [en, cz])
    .sort((a, b) => b[0].length - a[0].length);

function translateString(str) {
    if (!str || typeof str !== "string") return str;
    const entries = currentLang === "en" ? EN_ENTRIES : CZ_ENTRIES;
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
            if (node.parentElement && ["SCRIPT", "STYLE"].includes(node.parentElement.tagName)) continue;
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
            langBtn.textContent = currentLang === "en" ? "🌐 LANG: EN [L]" : "🌐 JAZYK: CZ [L]";
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
    if (typeof renderMutatorsUI === "function") renderMutatorsUI();
    if (typeof refreshMenuSaveUI === "function") refreshMenuSaveUI();
    if (typeof updateHUD === "function") updateHUD();
    applyDOMTranslations();
    if (typeof showSaveToast === "function") {
        showSaveToast(currentLang === "en" ? "🌐 LANGUAGE SET TO: ENGLISH" : "🌐 JAZYK NASTAVEN NA: ČEŠTINA");
    }
}

// Automatický překlad plovoucích textů přímo v Canvasu
const origFillText = CanvasRenderingContext2D.prototype.fillText;
CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {
    const translated = currentLang === "en" ? translateString(String(text)) : text;
    if (maxWidth !== undefined) return origFillText.call(this, translated, x, y, maxWidth);
    return origFillText.call(this, translated, x, y);
};

// Virtuální dotykové ovládání pro mobily a tablety
function setupResponsiveTouchControls() {
    if (document.getElementById("touch-controls")) return;
    const touchWrap = document.createElement("div");
    touchWrap.id = "touch-controls";
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

    bindStick("joy-left", "joy-left-knob", (nx, ny) => {
        keys.a = nx < -0.22;
        keys.d = nx > 0.22;
        keys.w = ny < -0.22;
        keys.s = ny > 0.22;
    });

    bindStick("joy-right", "joy-right-knob", (nx, ny, active) => {
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

    document.getElementById("touch-btn-dash").addEventListener("touchstart", (e) => { e.preventDefault(); triggerHyperDash(); });
    document.getElementById("touch-btn-bomb").addEventListener("touchstart", (e) => { e.preventDefault(); deploySingularityBomb(); });
    document.getElementById("touch-btn-od").addEventListener("touchstart", (e) => { e.preventDefault(); triggerQuantumOverdrive(); });

    setInterval(() => {
        touchWrap.classList.toggle("active", state.mode === "PLAYING");
    }, 250);
}

// Napojení přepínače jazyka a modálních oken bez MutationObserveru
window.addEventListener("DOMContentLoaded", () => {
    const langBtn = document.getElementById("btn-lang-toggle");
    if (langBtn) langBtn.addEventListener("click", toggleLanguage);

    ["btn-open-shop", "btn-open-achievements", "tab-btn-ships", "tab-btn-slots", "tab-btn-mutators"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("click", () => { if (currentLang === "en") setTimeout(applyDOMTranslations, 15); });
    });

    setupResponsiveTouchControls();
    if (currentLang === "en") setTimeout(applyDOMTranslations, 80);
});

window.addEventListener("keydown", (e) => {
    if (document.activeElement && document.activeElement.tagName === "INPUT") return;
    if (e.code === "KeyL") toggleLanguage();
});