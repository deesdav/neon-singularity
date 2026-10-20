# NEON SINGULARITY // OMEGA EDITION

> **[▶ Hrát online](https://deesdav.github.io/neon-singularity/)** · [Zdrojový kód](https://github.com/deesdav/neon-singularity)

**Neon Singularity // Omega Edition** je arkádová sci-fi survival bullet-hell střílečka pro moderní webové prohlížeče. V neonové aréně ovládáš pokročilé vznášedlo, proplétáš se hustým deštěm projektilů, sbíráš kvantové čipy, rozvíjíš technologický strom a čelíš eskalujícím vlnám nepřátel až po střety s obřími geometrickými bossy. Hra staví na maximální plynulosti (stabilních 60 FPS), precizním ovládání a kombinování zbraní do zničujících fúzí.

## 🎮 Zahraj si

**[▶ Spustit NEON SINGULARITY na GitHub Pages](https://deesdav.github.io/neon-singularity/)**

Hra běží přímo v prohlížeči bez nutnosti instalace.

---

## ⚡ Klíčové prvky hry

- **10 unikátních tříd lodí** – od bleskové stíhačky Interceptor po časoprostorový Chrono Weaver nebo mateřskou loď Hive Carrier.
- **3 trofejní skiny** – odemykatelné vizuální modely za milníky trofejí (Plazmový pulz za 10 🏆, Fázový přízrak za 25 🏆 a duhová Božská singularita za 50 🏆).
- **36 zbraňových modulů & 15 fúzních synergií** – kombinuj základní zbraně do super-systémů (např. _Sluneční Supernova_, _Rozparovač Horizontu_, _Hvězdná Koróna_ nebo _Bouřková Matrice_).
- **🎲 Reroll karet** – možnost přelosovat nabídku vylepšení při postupu na novou úroveň (1× zdarma za level, další za kvantové čipy).
- **10 unikátních Bossů** – Archon, Seraph, Hydra, Leviathan, Nemesis, Colossus, Quantum Prism, Gravity Titan, Cyber Arachnid a Omega Valkyrie. Každý s vlastními útočnými vzorci a zuřivou Enrage fází pod 50 % HP.
- **Kampaň na 30 vln & Endless režim** – v plné kampani (Arcade, Hardcore, Ultra) potkáš každé 3 vlny jednoho z 10 bossů. V Endless režimu čelíš nekonečné eskalaci.
- **Přehledné 5záložkové Menu** – čistě rozdělené na Hangár lodí s paletou lakování, Výběr misí a výzev, Paměťové sloty, Síň slávy a Nastavení zvuku.
- **Trvalá progrese (Cyber-Shop & Overclock)** – 12 permanentních vylepšení jádra a nekonečný Kvantový Overclock pro přebytečné čipy.
- **Přesně 50 trofejí & výzev** – sleduj svůj celoživotní postup a získávej štědré odměny v čipech.
- **3 paměťové sloty** – automatické i manuální ukládání a obnova rozjetých misí včetně exportu a importu profilu do souboru `.json`.
- **Darksynth audio & reaktivní vizuály** – 9 skladeb s FFT frekvenční analýzou, pulzující ekvalizér kolem lodi a možnost načíst vlastní MP3 klávesou `[O]`.
- **Kompletní dvojjazyčnost** – plynulé přepínání mezi češtinou a angličtinou přímo za běhu (`[L]`).
- **Optimalizace pro klávesnici i gamepad** – podpora DualShocku / standardních ovladačů a dotykového ovládání na mobilních zařízeních.

---

## 🕹️ Ovládání

| Akce                               | Klávesnice                      | Gamepad / DualShock                 |
| :--------------------------------- | :------------------------------ | :---------------------------------- |
| **Pohyb**                          | `W`, `A`, `S`, `D` / Šipky      | Levá páčka                          |
| **Míření**                         | Pohyb myši                      | Pravá páčka                         |
| **Palba**                          | Automatická / Levé tlačítko     | Automatická                         |
| **Hyper-skok**                     | `Mezerník` / Pravé tlačítko     | `Křížek` / `R1`                     |
| **Kvantová černá díra**            | `Q` / `E` / Prostřední tlačítko | `Čtverec` / `L1`                    |
| **Kvantový přetlak**               | `F`                             | `Trojúhelník`                       |
| **Výběr vylepšení**                | `1`, `2`, `3`                   | D-Pad (`Vlevo`, `Nahoru`, `Vpravo`) |
| **Přelosovat karty (Reroll)**      | `R`                             | Tlačítko na obrazovce               |
| **Pauza hry**                      | `Esc` / `P`                     | `Options` / `Start`                 |
| **Přepnutí HUDu (Plný / Minimal)** | `H`                             | Tlačítko v HUDu                     |
| **Přepnutí skladby rádia**         | `N`                             | Tlačítko v HUDu                     |
| **Nahrát vlastní MP3**             | `O`                             | —                                   |
| **Přepnout jazyk (CZ / EN)**       | `L`                             | Tlačítko v Menu                     |

---

## 🚀 Lokální spuštění

Projekt nevyžaduje žádné závislosti ani instalaci balíčků přes npm.

1. Naklonuj repozitář:
   ```bash
   git clone [https://github.com/deesdav/neon-singularity.git](https://github.com/deesdav/neon-singularity.git)
   cd neon-
   ```
2. Otevři `index.html` v moderním prohlížeči, nebo spusť lokální HTTP server:

   ```bash
   python -m http.server 8000
   ```

   nebo:

   ```bash
   py -m http.server 8000
   ```

3. Otevři [http://localhost:8000](http://localhost:8000).

## 🗂️ Struktura projektu

```text
neon-singularity/
├── .github/workflows/
│   └── deploy-pages.yml  # Automatické nasazení na GitHub Pages
├── audio/                # Soundtracky ve formátu MP3
├── js/
│   ├── audio.js          # Zvukový engine, adaptivní FFT analýza a hudba
│   ├── combat.js         # Arzenál (36 zbraní), synergie, bojová mechanika a nepřátelé
│   ├── game.js           # Herní smyčka, stav hry, správa slotů a vstupů
│   ├── i18n.js           # Kompletní lokalizace CZ <-> EN a virtuální dotykové ovládání
│   ├── renderer.js       # Vektorové modely lodí/bossů, částicové efekty a HUD
│   └── world.js          # Pozadí, pružinová mřížka (grid), lodě a katalog 50 trofejí
├── style/
│   └── style.css         # Sci-fi CSS fazety, neonové záře a CRT overlay
├── index.html            # Hlavní herní rozhraní a struktura aplikace
└── README.md
```

## 🛠️ Technologie

- HTML5 Canvas & 2D Context – 60 FPS vektorový rendering bez externích knihoven

- Web Audio API – FFT spektrální analýza a syntéza zvuků v reálném čase

- CSS3 / Tailwind CSS (CDN) – responzivní kybernetické rozhraní a animace

- Vanilla JavaScript (ES6+) – čistá herní logika bez frameworků
