# NEON SINGULARITY // OMEGA EDITION

> **[▶ Hrát online](https://deesdav.github.io/neon-singularity/)** · [Zdrojový kód](https://github.com/deesdav/neon-singularity)

**Neon Singularity** je arkádová sci-fi survival střílečka pro webový prohlížeč. V neonové aréně ovládáš vlastní vznášedlo, bojuješ s vlnami nepřátel, sbíráš kvantové čipy, vylepšuješ arzenál a snažíš se přežít až do střetu se silnými bossy. Hra staví na rychlém pohybu, kombinování zbraní a postupném budování stále silnější sestavy.

## 🎮 Zahraj si

**[▶ Spustit NEON SINGULARITY na GitHub Pages](https://deesdav.github.io/neon-singularity/)**

Hra běží v moderním prohlížeči a nevyžaduje instalaci. Při prvním otevření se načítá herní kód a podle použití také hudba a externí fonty/styly.

## ⚡ Hlavní funkce

- **10 tříd vznášedel** – vyber si loď podle svého herního stylu a uprav její barvu.
- **Arzenál a evoluce** – během mise získávej úrovně a vybírej si nová vylepšení.
- **36 zbraní a 15 fúzních synergií** – kombinuj zbraně a vytvářej silnější efekty.
- **4 režimy obtížnosti** – Arcade, Hardcore, Ultra a Endless.
- **Denní mutátory** – měň pravidla mise pomocí speciálních modifikátorů.
- **10 variant bossů** – sleduj zdraví bosse a připrav se na náročnější střety.
- **Cyber-shop a Quantum Overclock** – utrácej kvantové čipy za trvalá vylepšení.
- **50 trofejí a výzev** – plň úkoly a sleduj svůj postup.
- **3 paměťové sloty** – ukládej a obnovuj rozehrané mise.
- **Komba a rekordy** – řetěz eliminace, zvyšuj skóre a překonávej vlastní nejlepší výsledek.
- **Hudební rádio** – devět vestavěných skladeb, zvukové efekty a možnost načíst vlastní MP3.
- **Audio-reaktivní vizuály** – efekty reagují na rytmus a frekvence hudby.
- **Čeština a angličtina** – jazyk lze přepnout přímo v menu.
- **Klávesnice i gamepad** – hra obsahuje podporu ovládání ovladačem.
- **Neonový CRT vzhled** – futuristický HUD, částicové efekty a cyberpunková estetika.

## 🕹️ Základní ovládání

| Akce                                  | Klávesnice                                |
| ------------------------------------- | ----------------------------------------- |
| Pohyb                                 | WASD                                      |
| Míření                                | Myš                                       |
| Hyper-skok                            | Mezerník                                  |
| Černá díra                            | Q / E                                     |
| Přetlak                               | F                                         |
| Výběr vylepšení                       | 1, 2, 3 nebo šipky                        |
| Pauza                                 | Esc                                       |
| Přepnutí plného/minimalistického HUDu | H                                         |
| Přepnutí hudební skladby              | N                                         |
| Nahrání vlastní MP3                   | O                                         |
| Přepnutí jazyka CZ/EN                 | L                                         |

Hra zobrazuje další nápovědu přímo v menu. Ovládání gamepadem je vysvětlené v záložce paměťových slotů a ovládání.

## 🚀 Spuštění lokálně

Projekt používá HTML, CSS a JavaScript bez nutnosti instalovat balíčky.

1. Naklonuj repozitář:
   ```bash
   git clone https://github.com/deesdav/neon-singularity.git
   cd neon-singularity
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

**Poznámka:** Tailwind CSS a fonty Orbitron/Rajdhani se načítají z externích CDN, takže jejich načtení vyžaduje internetové připojení. Hra je publikovaná přes GitHub Pages a nasazení zajišťuje GitHub Actions.

## 🗂️ Struktura projektu

```text
neon-singularity/
├── .github/workflows/
│   └── deploy-pages.yml  # Automatické nasazení na GitHub Pages
├── audio/                # Vestavěné MP3 soundtracky
├── js/
│   ├── audio.js          # Hudba, zvukové efekty a audio analýza
│   ├── combat.js         # Boj a herní mechaniky
│   ├── game.js           # Hlavní logika, menu a postup hrou
│   ├── i18n.js            # Jazykové texty CZ/EN
│   ├── renderer.js       # Vykreslování arény a efektů
│   └── world.js           # Herní svět a entity
├── style/
│   └── style.css         # Vlastní vzhled a CRT/neon efekty
├── index.html            # Herní stránka a rozhraní
└── README.md
```

## 🛠️ Technologie

- HTML5 Canvas
- CSS
- JavaScript
- Tailwind CSS přes CDN
- Google Fonts: Orbitron a Rajdhani
- GitHub Actions a GitHub Pages

## 📦 Načítání a výkon

Herní soundtrack obsahuje devět MP3 souborů o velikosti přibližně 5 MB každý. To neznamená, že se všechny musí stáhnout při otevření stránky. Pokud se hra načítá pomalu nebo se některé prvky nezobrazují, zkontroluj konzoli a síťové požadavky prohlížeče a také [stav nasazení GitHub Actions](https://github.com/deesdav/neon-singularity/actions).

## 📄 Licence

V repozitáři zatím není uvedena licence. Před dalším šířením nebo použitím kódu a audio souborů je potřeba ověřit příslušná práva.
