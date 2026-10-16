# NEON SINGULARITY // SYNERGY EDITION

> **[▶ PLAY NEON SINGULARITY](https://deesdav.github.io/neon-singularity/)** · [Source code](https://github.com/deesdav/neon-singularity)

**Neon Singularity** je neonově laděná sci-fi arkádová vesmírná střílečka běžící přímo v prohlížeči. Pilotuj svou loď, přežij stále náročnější vlny nepřátel, sbírej skóre a kvantové čipy, odemykej vylepšení a postav se bossům na cestě k singularitě.

Hra kombinuje rychlý souboj, postup postavy, synergická vylepšení a cyberpunkovou atmosféru s neonovým HUDem.

## ✨ Co hra nabízí

- **Arkádový vesmírný souboj** – pohybuj se, miř a bojuj proti vlnám nepřátel.
- **Postup a evoluce** – získávej zkušenosti, zvyšuj úroveň a vybírej si vylepšení.
- **Synergie a arzenál** – kombinuj schopnosti a vytvářej silnější sestavy.
- **Bossové** – připrav se na náročnější střety včetně Omega Archona.
- **Speciální schopnosti** – používej hyper-skok, černou díru a přetlak.
- **Skóre, komba a rekordy** – udržuj řetězec eliminací a překonávej své nejlepší výsledky.
- **Ukládání postupu** – hra nabízí paměťové sloty a automatické ukládání pozice.
- **Hudba a zvuk** – přepínej rádio i zvukové efekty.
- **Retro-futuristický vzhled** – neonové barvy, CRT efekt a futuristické rozhraní.

## 🚀 Zahraj si online

Hra je dostupná jako webová stránka přes GitHub Pages:

**[▶ Spustit Neon Singularity](https://deesdav.github.io/neon-singularity/)**

Po každém pushi do větve `main` se web automaticky nasadí pomocí GitHub Actions. První nasazení může několik minut trvat.

## 💻 Lokální spuštění

Hra je vytvořená pomocí HTML, CSS a JavaScriptu a nevyžaduje instalaci balíčků.

1. Naklonuj repozitář nebo si ho stáhni jako ZIP.
   ```bash
   git clone https://github.com/deesdav/neon-singularity.git
   cd neon-singularity
   ```
2. Otevři soubor `index.html` v moderním webovém prohlížeči.

Pro lokální vývoj můžeš spustit jednoduchý HTTP server, například pomocí Pythonu:
```bash
python -m http.server 8000
```
Potom otevři [http://localhost:8000](http://localhost:8000).

> Rozhraní používá Tailwind CSS a fonty načítané z CDN, takže pro jejich načtení je potřeba internetové připojení.

## 🎮 Ovládání

| Akce | Klávesnice | Ovladač DualShock 4 |
|---|---|---|
| Pohyb a míření | WASD | Analogové páčky |
| Hyper-skok | Mezerník | Křížek / R1 |
| Černá díra | Q / E | Čtverec / L1 |
| Přetlak | F | Trojúhelník |
| Výběr vylepšení | 1, 2, 3 nebo šipky | D-pad |
| Pauza | Esc | — |
| Zobrazit / skrýt HUD | H | — |
| Přepínání rádia | N nebo tlačítko v HUD | — |

Některé akce se mohou lišit podle obrazovky nebo právě aktivního menu. Dostupné pokyny najdeš také přímo ve hře.

## 🗂️ Struktura projektu

```text
neon-singularity/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml # Automatické nasazení na GitHub Pages
├── index.html       # Herní stránka a uživatelské rozhraní
├── js/
│   ├── game.js      # Hlavní herní logika
│   ├── combat.js    # Soubojový systém
│   ├── renderer.js  # Vykreslování hry
│   ├── world.js     # Herní svět
│   ├── audio.js     # Hudba a zvuk
│   └── i18n.js      # Jazykové texty
├── style/
│   └── style.css    # Vlastní styly a vizuální efekty
├── audio/           # Herní audio soubory
└── README.md
```

## 🛠️ Technologie

- HTML5 Canvas
- CSS
- JavaScript
- Tailwind CSS (CDN)
- Google Fonts: Orbitron a Rajdhani
- GitHub Actions + GitHub Pages pro publikování

## 📌 Stav projektu

Projekt je průběžně vyvíjen. Konkrétní dostupné funkce a herní obsah odpovídají aktuální verzi v repozitáři.

## 📄 Licence

Licence zatím není v repozitáři uvedena. Před dalším šířením nebo použitím částí projektu si ověř podmínky pro kód i přiložené audio soubory.
