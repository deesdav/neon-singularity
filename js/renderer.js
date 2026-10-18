/*************************************************************************
 * RENDERER.JS - SCI-FI VECTOR MODELS (8 SHIPS), OVERCLOCK & COLOR PICKER
 *************************************************************************/
const SHIP_COLOR_PALETTE = [
  "#00f3ff", "#ff0055", "#fcee09", "#00ffaa", "#bc13fe", "#ff6600", "#38bdf8", "#a3e635"
];

const CUSTOM_SHIP_COLORS = [
  { name: "Neon Cyan", hex: "#00f3ff" },
  { name: "Cyber Magenta", hex: "#ff0055" },
  { name: "Laser Gold", hex: "#fcee09" },
  { name: "Matrix Emerald", hex: "#00ffaa" },
  { name: "Void Violet", hex: "#bc13fe" },
  { name: "Solar Orange", hex: "#ff6600" },
  { name: "Sky Blue", hex: "#38bdf8" },
  { name: "Lime Acid", hex: "#a3e635" }
];

function getShipSVGPreview(shipId, color) {
  if (shipId === "BASTION") {
    return `<svg viewBox="-34 -28 68 56" class="w-16 h-11 mx-auto mb-1">
      <circle cx="0" cy="0" r="24" fill="none" stroke="${color}" stroke-dasharray="6 4" stroke-width="1" opacity="0.5"/>
      <polygon points="24,-8 24,8 8,21 -18,21 -25,11 -16,0 -25,-11 -18,-21 8,-21" fill="rgba(252,238,9,0.12)" stroke="${color}" stroke-width="2.2"/>
      <polygon points="14,-14 20,-6 20,6 14,14 -10,14 -10,-14" fill="none" stroke="#ffffff" stroke-width="1.3"/>
      <circle cx="0" cy="0" r="7" fill="none" stroke="#00f3ff" stroke-dasharray="3 2" stroke-width="1.8"/>
      <circle cx="0" cy="0" r="3" fill="#ffffff"/>
    </svg>`;
  } else if (shipId === "TECHNOMANCER") {
    return `<svg viewBox="-34 -28 68 56" class="w-16 h-11 mx-auto mb-1">
      <circle cx="0" cy="0" r="21" fill="none" stroke="#00f3ff" stroke-dasharray="4 3" stroke-width="1.4"/>
      <polygon points="26,0 5,-17 -19,-13 -10,0 -19,13 5,17" fill="rgba(188,19,254,0.14)" stroke="${color}" stroke-width="2.2"/>
      <polygon points="14,0 2,-8 -10,0 2,8" fill="none" stroke="#ffffff" stroke-width="1.4"/>
      <circle cx="1" cy="0" r="4" fill="#00f3ff"/>
    </svg>`;
  } else if (shipId === "WRAITH") {
    return `<svg viewBox="-34 -28 68 56" class="w-16 h-11 mx-auto mb-1">
      <polygon points="28,0 -5,-21 -1,-7 -24,-16 -13,0 -24,16 -1,7 -5,21" fill="rgba(255,0,85,0.14)" stroke="${color}" stroke-width="2.2"/>
      <line x1="-12" y1="0" x2="22" y2="0" stroke="#ffffff" stroke-width="1.6"/>
      <polygon points="10,-5 22,0 10,5" fill="none" stroke="#fcee09" stroke-width="1.4"/>
    </svg>`;
  } else if (shipId === "SERAPH") {
    return `<svg viewBox="-34 -28 68 56" class="w-16 h-11 mx-auto mb-1">
      <polygon points="26,0 3,-22 -16,-18 -6,-6 -22,0 -6,6 -16,18 3,22" fill="rgba(255,102,0,0.14)" stroke="${color}" stroke-width="2.2"/>
      <polygon points="15,0 0,-11 -11,0 0,11" fill="none" stroke="#fcee09" stroke-width="1.4"/>
      <circle cx="3" cy="0" r="4" fill="#ffffff"/>
    </svg>`;
  } else if (shipId === "ARCHITECT") {
    return `<svg viewBox="-34 -28 68 56" class="w-16 h-11 mx-auto mb-1">
      <polygon points="22,-11 22,11 0,22 -22,11 -22,-11 0,-22" fill="rgba(0,255,170,0.12)" stroke="${color}" stroke-width="2.2"/>
      <rect x="-9" y="-9" width="18" height="18" transform="rotate(45)" fill="none" stroke="#fcee09" stroke-width="1.5"/>
      <circle cx="0" cy="0" r="4" fill="none" stroke="#ffffff" stroke-width="1.6"/>
    </svg>`;
  } else if (shipId === "STALKER") {
    return `<svg viewBox="-34 -28 68 56" class="w-16 h-11 mx-auto mb-1">
      <polygon points="29,0 4,-8 -12,-21 -6,-5 -24,-9 -14,0 -24,9 -6,5 -12,21 4,8" fill="rgba(168,85,247,0.15)" stroke="${color}" stroke-width="2.2"/>
      <polygon points="18,0 -2,-5 -9,0 -2,5" fill="none" stroke="#00f3ff" stroke-width="1.4"/>
      <circle cx="-1" cy="0" r="3" fill="#ffffff"/>
    </svg>`;
  } else if (shipId === "JUGGERNAUT_SHIP") {
    return `<svg viewBox="-34 -28 68 56" class="w-16 h-11 mx-auto mb-1">
      <polygon points="22,-14 26,-6 26,6 22,14 4,22 -20,20 -25,10 -25,-10 -20,-20 4,-22" fill="rgba(56,189,248,0.15)" stroke="${color}" stroke-width="2.4"/>
      <path d="M 18,-16 A 22,22 0 0,1 18,16" fill="none" stroke="#fcee09" stroke-width="2.5"/>
      <rect x="-12" y="-8" width="18" height="16" fill="none" stroke="#ffffff" stroke-width="1.4"/>
    </svg>`;
  }
  return `<svg viewBox="-34 -28 68 56" class="w-16 h-11 mx-auto mb-1">
    <polygon points="27,0 -10,-16 -5,-5 -20,-10 -13,0 -20,10 -5,5 -10,16" fill="rgba(0,243,255,0.14)" stroke="${color}" stroke-width="2.2"/>
    <polygon points="16,0 -4,-6 -8,0 -4,6" fill="none" stroke="#ffffff" stroke-width="1.4"/>
    <line x1="-6" y1="-11" x2="-17" y2="-16" stroke="#ff007f" stroke-width="1.8"/>
    <line x1="-6" y1="11" x2="-17" y2="16" stroke="#ff007f" stroke-width="1.8"/>
  </svg>`;
}

function renderColorPicker() {
  const wrap = document.getElementById("ship-color-picker");
  if (!wrap) return;
  wrap.innerHTML = "";
  const activeCol = (typeof meta !== "undefined" && meta.customColor) || (typeof player !== "undefined" && player.color) || "#00f3ff";

  const resetBtn = document.createElement("button");
  resetBtn.type = "button";
  resetBtn.className = "px-1.5 py-0.5 text-[9px] font-orbitron border border-slate-600 text-slate-300 hover:text-white mr-1";
  resetBtn.textContent = "VÝCHOZÍ";
  resetBtn.addEventListener("click", () => {
    meta.customColor = null;
    saveMetaProgression();
    renderShipSelector();
  });
  wrap.appendChild(resetBtn);

  SHIP_COLOR_PALETTE.forEach((col) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `color-swatch ${activeCol.toLowerCase() === col.toLowerCase() ? "active" : ""}`;
    btn.style.backgroundColor = col;
    btn.style.color = col;
    btn.addEventListener("click", () => {
      meta.customColor = col;
      player.color = col;
      unlockAchievement("custom_paint");
      saveMetaProgression();
      renderColorPicker();
      renderShipSelector();
    });
    wrap.appendChild(btn);
  });
}

function renderShipSelector() {
  const container = document.getElementById("ship-selector-grid");
  if (!container) return;
  container.innerHTML = "";
  const ocSpdLvl = (meta.overclock && (meta.overclock.spdOc || meta.overclock.spdPct)) || 0;
  const hullBonus = (meta.upgrades.hullLvl || 0) * 25 + ocSpdLvl * 5;
  const spdMult = 1 + ocSpdLvl * 0.01;

  SHIP_CLASSES.forEach((sc) => {
    const isSel = meta.selectedShip === sc.id;
    const displayCol = isSel && meta.customColor ? meta.customColor : sc.color;
    const card = document.createElement("div");
    card.className = `ship-card p-2.5 flex flex-col justify-between ${isSel ? "selected" : ""}`;
    card.innerHTML = `
      <div>
        <div class="flex justify-between items-center mb-0.5">
          <span class="font-orbitron text-[8px] tracking-wider uppercase font-bold truncate" style="color:${displayCol}">${sc.role}</span>
          ${isSel ? '<span class="px-1.5 py-0.5 bg-cyan-400 text-black font-orbitron text-[8px] font-black shrink-0">AKTIVNÍ</span>' : ""}
        </div>
        ${getShipSVGPreview(sc.id, displayCol)}
        <div class="font-orbitron text-xs font-black text-white mb-0.5 text-center">${sc.name}</div>
        <p class="text-[10px] text-slate-300 leading-snug mb-1.5">${sc.desc}</p>
      </div>
      <div class="grid grid-cols-3 gap-1 pt-1 border-t border-slate-800 text-[9px] font-orbitron text-center">
        <div class="text-cyan-300">HP: <span class="text-white">${sc.hp + hullBonus}</span></div>
        <div class="text-yellow-300">RYCH: <span class="text-white">${Math.round(sc.speed * spdMult)}</span></div>
        <div class="text-pink-400">NOVA: <span class="text-white">${sc.bombs + (meta.upgrades.novaLvl || 0)}</span></div>
      </div>
    `;
    card.addEventListener("click", () => {
      meta.selectedShip = sc.id;
      player.shipClass = sc.id;
      player.color = meta.customColor || sc.color;
      saveMetaProgression();
      renderShipSelector();
    });
    container.appendChild(card);
  });
  renderColorPicker();
}

function renderSaveSlotsUI() {
  const gridEl = document.getElementById("save-slots-grid");
  if (!gridEl) return;
  gridEl.innerHTML = "";

  for (let slot = 1; slot <= 3; slot++) {
    const isSel = currentSaveSlot === slot;
    const raw = localStorage.getItem(getSaveKey(slot));
    const savedCustomName = localStorage.getItem(`neon_singularity_slot_name_${slot}`);
    let customName = savedCustomName || `Profil #${slot}`;
    let slotInfoHtml = "";

    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data.customName && !savedCustomName) customName = data.customName;
        const sc = Math.floor(data.state.score || 0).toLocaleString("cs-CZ");
        const shipName = data.player.shipClass || "INTERCEPTOR";
        const diff = data.state.difficulty || "ARCADE";
        slotInfoHtml = `
          <div class="font-orbitron text-xs font-bold text-white mt-1">${shipName} // VLNA ${data.state.wave}</div>
          <div class="flex justify-between text-[10px] font-orbitron text-slate-300 mt-1 pt-1 border-t border-slate-800">
            <span>LV ${data.player.level} (${Math.ceil(data.player.hp)} HP) // ${diff}</span>
            <span class="text-cyan-300 font-bold">${sc} B.</span>
          </div>
        `;
      } catch (e) {
        slotInfoHtml = `<div class="text-xs font-orbitron text-slate-500 mt-1">SLOT #${slot} // POŠKOZENÁ DATA</div>`;
      }
    } else {
      slotInfoHtml = `
        <div class="font-orbitron text-xs text-slate-400 py-1">PRÁZDNÝ SLOT</div>
        <div class="text-[9px] font-orbitron text-slate-500 border-t border-slate-800/80 pt-1">Připraven pro novou misi</div>
      `;
    }

    const card = document.createElement("div");
    card.className = `ship-card p-3 text-left transition ${isSel ? "selected" : ""}`;
    card.innerHTML = `
      <div class="flex justify-between items-center gap-1.5 mb-1">
        <input
          type="text"
          data-slot-input="${slot}"
          value="${customName}"
          maxlength="24"
          class="bg-slate-950/90 border border-cyan-500/40 focus:border-yellow-400 px-2 py-0.5 text-xs font-orbitron font-bold text-yellow-300 w-full rounded outline-none"
          title="Klikni pro přejmenování slotu"
        />
        <div class="flex items-center gap-1 shrink-0">
          ${isSel ? '<span class="px-1.5 py-0.5 bg-cyan-400 text-black font-orbitron text-[8px] font-black">AKTIVNÍ</span>' : ""}
          ${raw ? `<button data-del-slot="${slot}" class="px-1.5 py-0.5 bg-rose-950/80 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-orbitron text-[9px] transition" title="Smazat tento slot">✕</button>` : ""}
        </div>
      </div>
      ${slotInfoHtml}
    `;

    const inputEl = card.querySelector(`[data-slot-input="${slot}"]`);
    inputEl.addEventListener("click", (e) => e.stopPropagation());
    inputEl.addEventListener("keydown", (e) => e.stopPropagation());
    inputEl.addEventListener("input", (e) => {
      const newName = e.target.value;
      localStorage.setItem(`neon_singularity_slot_name_${slot}`, newName);
      const slotRaw = localStorage.getItem(getSaveKey(slot));
      if (slotRaw) {
        try {
          const parsed = JSON.parse(slotRaw);
          parsed.customName = newName;
          localStorage.setItem(getSaveKey(slot), JSON.stringify(parsed));
        } catch (err) { }
      }
    });

    card.addEventListener("click", (e) => {
      if (e.target && e.target.getAttribute("data-del-slot")) {
        e.stopPropagation();
        const s = parseInt(e.target.getAttribute("data-del-slot"), 10);
        clearSavedGame(s);
        return;
      }
      currentSaveSlot = slot;
      refreshMenuSaveUI();
    });

    gridEl.appendChild(card);
  }
}

function renderCyberShop() {
  document.getElementById("shop-shards-count").textContent = meta.shards;
  const gridEl = document.getElementById("shop-items-grid");
  gridEl.innerHTML = "";

  // Vyvážený progresivní scaling cen v Cyber-Shopu
  SHOP_ITEMS.forEach((item) => {
    const lvl = meta.upgrades[item.key] || 0;
    const cost = Math.round(item.baseCost + lvl * 10 + Math.pow(lvl, 1.55) * 4);
    const isMax = lvl >= item.maxLvl;
    const canAfford = meta.shards >= cost && !isMax;

    const box = document.createElement("div");
    box.className = "bg-slate-950/90 border border-cyan-500/35 p-3 flex flex-col justify-between";
    box.innerHTML = `
      <div>
        <div class="flex justify-between items-center mb-1">
          <span class="font-orbitron text-xs font-black" style="color:${item.color}">${item.name}</span>
          <span class="font-orbitron text-[10px] text-white bg-slate-900 px-2 py-0.5 border border-slate-700">LV ${lvl} / ${item.maxLvl}</span>
        </div>
        <p class="text-[11px] text-slate-300 mb-2.5">${item.desc}</p>
      </div>
      <button class="w-full py-1.5 font-orbitron text-[11px] font-black uppercase transition ${isMax
        ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 cursor-default"
        : canAfford
          ? "cyber-btn-gold"
          : "bg-slate-900 border border-slate-700 text-slate-500 cursor-not-allowed"
      }">
        ${isMax ? "✓ MAXIMÁLNÍ ÚROVEŇ" : `VYLEPŠIT (◈ ${cost} ČIPŮ)`}
      </button>
    `;

    if (!isMax && canAfford) {
      box.querySelector("button").addEventListener("click", () => {
        meta.shards -= cost;
        meta.upgrades[item.key] = (meta.upgrades[item.key] || 0) + 1;
        sfx.playLevelUp();
        saveMetaProgression();
        renderCyberShop();
        renderShipSelector();
      });
    }
    gridEl.appendChild(box);
  });

  // Render Infinite Quantum Overclock s lehkým progresivním růstem ceny
  const ocGrid = document.getElementById("overclock-grid");
  if (ocGrid) {
    ocGrid.innerHTML = "";
    meta.overclock = meta.overclock || { dmgOc: 0, spdOc: 0, xpOc: 0, spent: 0 };
    const totalOc = (meta.overclock.dmgOc || 0) + (meta.overclock.spdOc || 0) + (meta.overclock.xpOc || 0);
    const badge = document.getElementById("overclock-total-badge");
    if (badge) badge.textContent = `CELKEM OVERCLOCK: LV ${totalOc}`;

    OVERCLOCK_ITEMS.forEach((oc) => {
      const lvl = meta.overclock[oc.key] || 0;
      const dynamicCost = oc.cost + lvl * 10;
      const canAfford = meta.shards >= dynamicCost;
      const card = document.createElement("div");
      card.className = "bg-black/75 border border-yellow-400/40 p-2.5 flex flex-col justify-between";
      card.innerHTML = `
        <div>
          <div class="flex justify-between items-center mb-1">
            <span class="font-orbitron text-xs font-black" style="color:${oc.color}">${oc.name}</span>
            <span class="font-orbitron text-[10px] text-yellow-300 font-bold">LV ${lvl}</span>
          </div>
          <p class="text-[10px] text-slate-300 mb-2">${oc.desc}</p>
        </div>
        <button class="w-full py-1.5 font-orbitron text-[10px] font-black uppercase transition ${canAfford ? "cyber-btn-gold" : "bg-slate-900 border border-slate-700 text-slate-500 cursor-not-allowed"
        }">
          PŘETAKTOVAT (◈ ${dynamicCost} ČIPŮ)
        </button>
      `;
      if (canAfford) {
        card.querySelector("button").addEventListener("click", () => {
          meta.shards -= dynamicCost;
          meta.overclock[oc.key] = (meta.overclock[oc.key] || 0) + 1;
          meta.overclock.spent = (meta.overclock.spent || 0) + dynamicCost;
          sfx.playLevelUp();
          unlockAchievement("overclock_1");
          if (meta.overclock.spent >= 500) unlockAchievement("overclock_1000");
          saveMetaProgression();
          renderCyberShop();
          renderShipSelector();
        });
      }
      ocGrid.appendChild(card);
    });
  }
}

function renderAchievementsModal() {
  const unlockedCount = Object.keys(meta.achievements).length;
  document.getElementById("modal-ach-progress").textContent = `${unlockedCount} / ${ACHIEVEMENTS_LIST.length}`;
  const gridEl = document.getElementById("achievements-grid");
  gridEl.innerHTML = "";

  ACHIEVEMENTS_LIST.forEach((ach) => {
    const done = !!meta.achievements[ach.id];
    const card = document.createElement("div");
    card.className = `p-3 border flex items-start gap-3 text-left ${done ? "bg-yellow-500/10 border-yellow-400/70" : "bg-slate-950/85 border-slate-800 opacity-70"
      }`;
    card.innerHTML = `
      <div class="text-xl mt-0.5">${done ? "🏆" : "🔒"}</div>
      <div class="flex-1">
        <div class="flex justify-between items-center">
          <span class="font-orbitron text-xs font-black ${done ? "text-yellow-300" : "text-slate-300"}">${ach.name}</span>
          <span class="font-orbitron text-[10px] font-bold px-2 py-0.5 ${done ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-slate-900 text-yellow-400"
      }">
            ${done ? "SPLNĚNO" : `+${ach.reward} ◈`}
          </span>
        </div>
        <p class="text-[11px] text-slate-300 mt-1">${ach.desc}</p>
      </div>
    `;
    gridEl.appendChild(card);
  });
}

function syncHudVisibilityDOM() {
  const hudEl = document.getElementById("hud");
  const ghostEl = document.getElementById("ghost-hud");
  const hintEl = document.getElementById("minimal-hud-hint");
  const btnEl = document.getElementById("btn-hide-hud");

  if (state.mode === "PLAYING" || state.mode === "PAUSED") {
    hudEl.style.opacity = state.hudVisible ? "1" : "0";
    ghostEl.style.opacity = state.hudVisible ? "0" : "1";
    hintEl.style.opacity = state.hudVisible ? "0" : "1";
  } else {
    hudEl.style.opacity = "0";
    ghostEl.style.opacity = "0";
    hintEl.style.opacity = "0";
  }
  if (btnEl) btnEl.textContent = `👁 HUD: ${state.hudVisible ? "PLNÝ" : "MINIMAL"} [H]`;
}

function toggleHudVisibility() {
  state.hudVisible = !state.hudVisible;
  syncHudVisibilityDOM();
  showSaveToast(state.hudVisible ? "👁 PLNÝ TAKTICKÝ HUD ZAPNUT" : "👁 MINIMALISTICKÝ GHOST HUD AKTIVNÍ");
}

let toastTimeout = null;
function showSaveToast(msg = "⚡ POZICE AUTOMATICKY ULOŽENA") {
  // POKUD JSME V MENU, NIKDY NIC NEUKAZUJ A ROVNOU SKONČI
  if (typeof state !== "undefined" && state.mode === "MENU") {
    const el = document.getElementById("save-toast");
    if (el) el.style.opacity = "0";
    return;
  }

  const el = document.getElementById("save-toast");
  if (!el) return;
  el.textContent = msg;
  el.style.opacity = "1";
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    el.style.opacity = "0";
  }, 1900);
}

function updateHUD() {
  const tierRoman = ["I", "II", "III", "IV"][getAITier() - 1];
  const scoreStr = String(Math.floor(state.score)).padStart(7, "0");
  const hpStr = `${Math.max(0, Math.ceil(player.hp))} / ${player.maxHp}`;

  document.getElementById("hp-text").textContent = hpStr;
  document.getElementById("hp-bar").style.width = `${Math.max(0, (player.hp / player.maxHp) * 100)}%`;
  document.getElementById("level-text").textContent = `ÚROVEŇ ${String(player.level).padStart(2, "0")}`;
  document.getElementById("wave-text").textContent = `VLNA ${state.wave} // TIER ${tierRoman}`;
  document.getElementById("xp-bar").style.width = `${Math.min(100, (player.xp / player.xpNext) * 100)}%`;
  document.getElementById("hud-shards").textContent = meta.shards;

  const slotHud = document.getElementById("hud-active-slot");
  if (slotHud) slotHud.textContent = `#${currentSaveSlot}`;

  document.getElementById("ghost-hp").textContent = hpStr;
  document.getElementById("ghost-score").textContent = scoreStr;
  document.getElementById("ghost-combo").textContent = `x${state.combo.toFixed(1)}`;
  document.getElementById("ghost-wave").textContent = `${state.wave} (${tierRoman})`;
  document.getElementById("ghost-level").textContent = String(player.level).padStart(2, "0");

  // Spočítání všech úrovní zbraní a aktivních synergií pro Ghost HUD
  const totalUpgradesCount = Object.values(player.weapons).reduce((acc, val) => acc + (val || 0), 0);
  const activeSynCount = SYNERGIES_LIST.filter(s => s.check(player.weapons)).length;
  const ghostUpgEl = document.getElementById("ghost-upgrades");
  if (ghostUpgEl) {
    ghostUpgEl.textContent = activeSynCount > 0 ? `${totalUpgradesCount} (+${activeSynCount}★)` : `${totalUpgradesCount}`;
  }

  // Zobrazení aktuálně hrající skladby v Ghost HUDu
  const ghostTrackEl = document.getElementById("ghost-track");
  if (ghostTrackEl && typeof sfx !== "undefined" && sfx.tracks && sfx.tracks[sfx.styleIndex]) {
    ghostTrackEl.textContent = sfx.tracks[sfx.styleIndex].label;
  }
  const ghostOd = document.getElementById("ghost-overdrive");
  if (state.overdrive >= 100 || state.overdriveTimer > 0) {
    ghostOd.classList.remove("hidden");
    ghostOd.textContent = state.overdriveTimer > 0 ? "⚡ PŘETLAK AKTIVNÍ!" : "⚡ PŘETLAK PŘIPRAVEN [F]";
  } else {
    ghostOd.classList.add("hidden");
  }

  const odPct = state.overdriveTimer > 0 ? Math.ceil((state.overdriveTimer / 5.5) * 100) : Math.floor(state.overdrive);
  document.getElementById("overdrive-pct").textContent = state.overdriveTimer > 0 ? "AKTIVNÍ!" : `${odPct}%`;
  document.getElementById("overdrive-bar").style.width = `${Math.min(100, odPct)}%`;
  document.getElementById("overdrive-label").textContent = state.overdrive >= 100 ? "⚡ PŘETLAK PŘIPRAVEN [F]!" : "PŘETLAK [F]";

  const aegisRow = document.getElementById("aegis-row");
  if (player.weapons.aegisLvl > 0 || player.weapons.nanoShieldLvl > 0) {
    aegisRow.classList.remove("hidden");
    aegisRow.classList.add("flex");
    document.getElementById("aegis-status").textContent = player.weapons.aegisLvl <= 0
      ? "NANOBOTOVÝ ŠTÍT AKTIVNÍ"
      : (player.aegisReady ? "AKTIVNÍ (100%)" : `DOBÍJENÍ (${player.aegisCooldown.toFixed(1)}s)`);
  } else {
    aegisRow.classList.add("hidden");
  }

  document.getElementById("score-display").textContent = scoreStr;
  if (state.score > state.bestScore) {
    state.bestScore = Math.floor(state.score);
    localStorage.setItem(BEST_KEY, String(state.bestScore));
  }
  document.getElementById("best-score-display").textContent = String(state.bestScore).padStart(7, "0");
  document.getElementById("combo-badge").textContent = `x${state.combo.toFixed(1)}`;

  const bombContainer = document.getElementById("bomb-slots");
  bombContainer.innerHTML = "";
  for (let i = 0; i < player.maxBombs; i++) {
    const slot = document.createElement("div");
    slot.className = `w-5 h-2.5 border ${i < player.bombs ? "bg-pink-500 border-pink-300 shadow-[0_0_8px_#ff007f]" : "bg-slate-900 border-slate-700"
      }`;
    bombContainer.appendChild(slot);
  }

  const badges = document.getElementById("arsenal-badges");
  badges.innerHTML = "";
  const addBadge = (label, col, isSynergy = false) => {
    const b = document.createElement("span");
    b.className = `px-2 py-0.5 border text-[10px] font-bold ${isSynergy ? "bg-yellow-500/20 animate-pulse" : "bg-slate-900/90"
      }`;
    b.style.borderColor = col;
    b.style.color = col;
    b.textContent = label;
    badges.appendChild(b);
  };

  SYNERGIES_LIST.forEach((syn) => {
    if (syn.check(player.weapons)) addBadge(syn.name, syn.color, true);
  });

  addBadge(`HLAVNĚ x${player.weapons.barrels}`, "#00f3ff");
  if (player.weapons.whipLvl > 0) addBadge(`BIČ LV${player.weapons.whipLvl}`, "#00ffaa");
  if (player.weapons.mortarLvl > 0) addBadge(`MINOMET LV${player.weapons.mortarLvl}`, "#fcee09");
  if (player.weapons.nanoShieldLvl > 0) addBadge(`NANO-ŠTÍT LV${player.weapons.nanoShieldLvl}`, "#38bdf8");
  if (player.weapons.decoyLvl > 0) addBadge(`KLONY LV${player.weapons.decoyLvl}`, "#a855f7");
  if (player.weapons.lightningTrapLvl > 0) addBadge(`PAST LV${player.weapons.lightningTrapLvl}`, "#67e8f9");
  if (player.weapons.riftSlicerLvl > 0) addBadge(`TRHAČ LV${player.weapons.riftSlicerLvl}`, "#f43f5e");
  if (player.weapons.prismLaserLvl > 0) addBadge(`HRANOL LV${player.weapons.prismLaserLvl}`, "#ff0055");
  if (player.weapons.overchargeCoreLvl > 0) addBadge(`REAKTOR LV${player.weapons.overchargeCoreLvl}`, "#fb923c");
  if (player.weapons.boomerangLvl > 0) addBadge(`BUMERANG x${player.weapons.boomerangLvl}`, "#00ffaa");
  if (player.weapons.minesLvl > 0) addBadge(`MINY LV${player.weapons.minesLvl}`, "#fcee09");
  if (player.weapons.flamethrowerLvl > 0) addBadge(`PLAMENOMET LV${player.weapons.flamethrowerLvl}`, "#ff5500");
  if (player.weapons.satelliteLvl > 0) addBadge(`SATELIT LV${player.weapons.satelliteLvl}`, "#ff0055");
  if (player.weapons.railgunLvl > 0) addBadge(`RAILGUN LV${player.weapons.railgunLvl}`, "#ff0055");
  if (player.weapons.dronesLvl > 0) addBadge(`DRONY x${player.weapons.dronesLvl}`, "#38bdf8");
  if (player.weapons.bladesLvl > 0) addBadge(`ČEPELE x${player.weapons.bladesLvl}`, "#bc13fe");
  if (player.weapons.teslaLvl > 0) addBadge(`TESLA LV${player.weapons.teslaLvl}`, "#5ffbff");

  // Aktualizace reálného času a data v HUDech
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const timeStr = `${hours}:${minutes}`;

  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const dateStr = `${day}.${month}.`;

  const timeEl1 = document.getElementById("hud-real-time");
  if (timeEl1) timeEl1.textContent = `${dateStr} ${timeStr}`; // V plném HUDu: Datum + Čas

  const timeEl2 = document.getElementById("ghost-real-time");
  if (timeEl2) timeEl2.textContent = timeStr; // V Ghost HUDu: Pouze Čas
}

function drawSonicEqualizerHalo(ctx, x, y, baseRadius, color) {
  if (!sfx.bands) return;
  const numSpokes = 32;
  const now = performance.now() * 0.0015;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(now);
  for (let i = 0; i < numSpokes; i++) {
    const bandVal = sfx.bands[i % 16] || 0;
    const a = (i * Math.PI * 2) / numSpokes;
    const innerR = baseRadius + 9;
    const barLen = 3 + bandVal * 26 + (sfx.beatPulse || 0) * 7;
    ctx.strokeStyle = i % 2 === 0 ? color : "#ff007f";
    ctx.globalAlpha = 0.25 + bandVal * 0.65;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * innerR, Math.sin(a) * innerR);
    ctx.lineTo(Math.cos(a) * (innerR + barLen), Math.sin(a) * (innerR + barLen));
    ctx.stroke();
  }
  ctx.restore();
  ctx.globalAlpha = 1.0;
}

function drawPlayerShipGeometry(ctx, shipClass, color) {
  const mainCol = player.invulnTimer > 0 || state.overdriveTimer > 0 ? "#fcee09" : color;
  const now = performance.now() * 0.008;
  const beat = sfx.beatPulse || 0;
  const thrust = 10 + Math.sin(now * 6) * 4 + (sfx.bassEnergy || 0) * 16 + Math.min(10, Math.hypot(player.vx, player.vy) * 0.025);

  ctx.save();
  ctx.strokeStyle = mainCol;
  ctx.globalAlpha = 0.16 + beat * 0.28;
  ctx.lineWidth = 1.4 + beat * 1.5;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = now * 0.4 + (i * Math.PI) / 3;
    const r = 26 + beat * 5;
    if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  ctx.save();
  const flameCol = state.overdriveTimer > 0 ? "#fcee09" : beat > 0.5 ? "#ff007f" : mainCol;
  ctx.strokeStyle = flameCol;
  ctx.fillStyle = "rgba(0, 243, 255, 0.35)";
  ctx.lineWidth = 2;

  if (shipClass === "BASTION" || shipClass === "JUGGERNAUT_SHIP") {
    [-11, 0, 11].forEach((yOff) => {
      ctx.beginPath();
      ctx.moveTo(-19, yOff - 3.5);
      ctx.lineTo(-19 - thrust * 1.35, yOff);
      ctx.lineTo(-19, yOff + 3.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  } else if (shipClass === "STALKER" || shipClass === "WRAITH") {
    [-8, 8].forEach((yOff) => {
      ctx.beginPath();
      ctx.moveTo(-15, yOff - 2);
      ctx.lineTo(-15 - thrust * 1.7, yOff);
      ctx.lineTo(-15, yOff + 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  } else {
    [-5, 5].forEach((yOff) => {
      ctx.beginPath();
      ctx.moveTo(-14, yOff - 2.5);
      ctx.lineTo(-14 - thrust * 1.45, yOff);
      ctx.lineTo(-14, yOff + 2.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });
  }
  ctx.restore();

  const traceMainHull = () => {
    ctx.beginPath();
    if (shipClass === "BASTION") {
      ctx.moveTo(24, -8); ctx.lineTo(24, 8); ctx.lineTo(8, 20); ctx.lineTo(-17, 20);
      ctx.lineTo(-23, 10); ctx.lineTo(-15, 0); ctx.lineTo(-23, -10); ctx.lineTo(-17, -20); ctx.lineTo(8, -20);
    } else if (shipClass === "TECHNOMANCER") {
      ctx.moveTo(26, 0); ctx.lineTo(5, -16); ctx.lineTo(-19, -12); ctx.lineTo(-10, 0); ctx.lineTo(-19, 12); ctx.lineTo(5, 16);
    } else if (shipClass === "WRAITH") {
      ctx.moveTo(28, 0); ctx.lineTo(-5, -20); ctx.lineTo(-1, -7); ctx.lineTo(-23, -15);
      ctx.lineTo(-13, 0); ctx.lineTo(-23, 15); ctx.lineTo(-1, 7); ctx.lineTo(-5, 20);
    } else if (shipClass === "SERAPH") {
      ctx.moveTo(26, 0); ctx.lineTo(3, -21); ctx.lineTo(-16, -17); ctx.lineTo(-6, -5);
      ctx.lineTo(-21, 0); ctx.lineTo(-6, 5); ctx.lineTo(-16, 17); ctx.lineTo(3, 21);
    } else if (shipClass === "ARCHITECT") {
      ctx.moveTo(21, -11); ctx.lineTo(21, 11); ctx.lineTo(0, 21); ctx.lineTo(-21, 11); ctx.lineTo(-21, -11); ctx.lineTo(0, -21);
    } else if (shipClass === "STALKER") {
      ctx.moveTo(29, 0); ctx.lineTo(4, -8); ctx.lineTo(-12, -21); ctx.lineTo(-6, -5);
      ctx.lineTo(-24, -9); ctx.lineTo(-14, 0); ctx.lineTo(-24, 9); ctx.lineTo(-6, 5); ctx.lineTo(-12, 21); ctx.lineTo(4, 8);
    } else if (shipClass === "JUGGERNAUT_SHIP") {
      ctx.moveTo(22, -14); ctx.lineTo(26, -6); ctx.lineTo(26, 6); ctx.lineTo(22, 14);
      ctx.lineTo(4, 22); ctx.lineTo(-20, 20); ctx.lineTo(-25, 10); ctx.lineTo(-25, -10); ctx.lineTo(-20, -20); ctx.lineTo(4, -22);
    } else {
      ctx.moveTo(26, 0); ctx.lineTo(-10, -16); ctx.lineTo(-5, -5); ctx.lineTo(-19, -9);
      ctx.lineTo(-13, 0); ctx.lineTo(-19, 9); ctx.lineTo(-5, 5); ctx.lineTo(-10, 16);
    }
    ctx.closePath();
  };

  ctx.strokeStyle = mainCol;
  ctx.lineWidth = 6.0 + beat * 3.0;
  ctx.globalAlpha = 0.35;
  traceMainHull();
  ctx.stroke();

  ctx.lineWidth = 3.2;
  ctx.globalAlpha = 0.85;
  traceMainHull();
  ctx.stroke();

  ctx.globalAlpha = 1.0;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.save();
  ctx.rotate(now * 1.4);
  ctx.strokeStyle = "#fcee09";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-4.5, -4.5, 9, 9);
  ctx.restore();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(0, 0, 2.8 + beat * 1.8, 0, Math.PI * 2);
  ctx.fill();

  if (shipClass === "JUGGERNAUT_SHIP") {
    ctx.strokeStyle = "#fcee09";
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(0, 0, 26, -0.85, 0.85);
    ctx.stroke();
  }
}

function render() {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(2, 0, 8, 0.44)";
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  if (state.shake > 0) {
    ctx.translate((Math.random() - 0.5) * state.shake * 2, (Math.random() - 0.5) * state.shake * 2);
  }

  ctx.globalCompositeOperation = "lighter";
  spaceBg.draw(ctx);
  grid.draw(ctx);

  for (const wh of wormholes) {
    ctx.strokeStyle = "rgba(0, 243, 255, 0.16)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(wh.x1, wh.y1);
    ctx.lineTo(wh.x2, wh.y2);
    ctx.stroke();
    ctx.setLineDash([]);

    const drawPortal = (px, py, col1, col2, label) => {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(wh.angle);
      for (let r = 0; r < 3; r++) {
        ctx.strokeStyle = r % 2 === 0 ? col1 : col2;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(0, 0, wh.radius - r * 7 + (sfx.beatPulse || 0) * 4, r, r + Math.PI * 1.4);
        ctx.stroke();
      }
      ctx.restore();
      ctx.font = "800 9px Orbitron, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = col1;
      ctx.fillText(label, px, py - wh.radius - 8);
    };
    drawPortal(wh.x1, wh.y1, "#00f3ff", "#38bdf8", "PORTÁL A");
    drawPortal(wh.x2, wh.y2, "#ff6600", "#fcee09", "PORTÁL B");
  }

  if (state.mode !== "GAMEOVER") {
    const auraR = 140 + (sfx.bassEnergy || 0) * 75;
    const pLight = ctx.createRadialGradient(player.x, player.y, 4, player.x, player.y, auraR);
    pLight.addColorStop(0, `rgba(0, 243, 255, ${0.14 + (sfx.beatPulse || 0) * 0.14})`);
    pLight.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = pLight;
    ctx.beginPath();
    ctx.arc(player.x, player.y, auraR, 0, Math.PI * 2);
    ctx.fill();

    if (player.weapons.solarHaloLvl > 0) {
      const haloR = 115 + player.weapons.solarHaloLvl * 28 + (sfx.beatPulse || 0) * 12;
      ctx.strokeStyle = "rgba(251, 146, 60, 0.45)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(player.x, player.y, haloR, 0, Math.PI * 2);
      ctx.stroke();
    }
    drawSonicEqualizerHalo(ctx, player.x, player.y, player.radius + 14, player.color);
  }

  for (const pool of plasmaPools) {
    const alpha = (pool.life / pool.maxLife) * 0.55;
    ctx.strokeStyle = pool.color || "#fb923c";
    ctx.fillStyle = pool.isTrap ? "rgba(103, 232, 249, 0.22)" : "rgba(251, 146, 60, 0.18)";
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pool.x, pool.y, pool.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  if (typeof decoys !== "undefined") {
    for (const dc of decoys) {
      ctx.save();
      ctx.translate(dc.x, dc.y);
      ctx.rotate(dc.angle);
      ctx.globalAlpha = 0.65 + Math.sin(performance.now() * 0.02) * 0.25;
      drawPlayerShipGeometry(ctx, player.shipClass, "#a855f7");
      ctx.restore();
    }
    ctx.globalAlpha = 1.0;
  }

  for (const mn of mines) {
    ctx.save();
    ctx.translate(mn.x, mn.y);
    ctx.strokeStyle = "#fcee09";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, 0, mn.radius + Math.sin(mn.pulse) * 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ff0055";
    ctx.beginPath();
    ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  for (const st of orbitalStrikes) {
    if (st.phase === "LOCK") {
      const p = 1 - st.timer / st.maxTimer;
      ctx.save();
      ctx.translate(st.x, st.y);
      ctx.rotate(p * 5);
      ctx.strokeStyle = "#ff0055";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, st.radius * (1.2 - p * 0.2), 0, Math.PI * 2);
      ctx.moveTo(-st.radius, 0); ctx.lineTo(st.radius, 0);
      ctx.moveTo(0, -st.radius); ctx.lineTo(0, st.radius);
      ctx.stroke();
      ctx.restore();
    } else {
      const alpha = st.beamLife / 0.45;
      ctx.globalAlpha = alpha;
      const grad = ctx.createLinearGradient(st.x - st.radius * 0.5, 0, st.x + st.radius * 0.5, 0);
      grad.addColorStop(0, "rgba(255, 0, 85, 0)");
      grad.addColorStop(0.5, "rgba(255, 255, 255, 0.95)");
      grad.addColorStop(1, "rgba(255, 0, 85, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(st.x - st.radius * 0.5, 0, st.radius, st.y);
      ctx.fillStyle = "rgba(255, 0, 85, 0.45)";
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }

  for (const sw of shockwaves) {
    const progress = sw.radius / sw.maxRadius;
    const alpha = Math.max(0, 1 - progress);
    ctx.strokeStyle = sw.color;
    ctx.globalAlpha = alpha * 0.85;
    ctx.lineWidth = sw.lineWidth * (1 - progress * 0.6);
    ctx.beginPath();
    ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (const lf of lensFlares) {
    const alpha = lf.life / lf.maxLife;
    ctx.globalAlpha = alpha * 0.85;
    const w = lf.width * alpha;
    const grad = ctx.createLinearGradient(lf.x - w, lf.y, lf.x + w, lf.y);
    grad.addColorStop(0, "rgba(0,0,0,0)");
    grad.addColorStop(0.5, lf.color);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(lf.x - w, lf.y - 3, w * 2, 6);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(lf.x - w * 0.35, lf.y - 1, w * 0.7, 2);
  }
  ctx.globalAlpha = 1.0;

  for (const s of singularities) {
    const grad = ctx.createRadialGradient(s.x, s.y, s.radius * 0.5, s.x, s.y, s.radius * 3.2);
    grad.addColorStop(0, "rgba(255, 0, 127, 0.45)");
    grad.addColorStop(0.5, "rgba(0, 243, 255, 0.2)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius * 3.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.angle);
    for (let r = 0; r < 3; r++) {
      ctx.strokeStyle = r % 2 === 0 ? "#ff007f" : "#00f3ff";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, s.radius + r * 14, r, r + Math.PI * 1.35);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#020006";
    ctx.beginPath();
    ctx.arc(0, 0, s.radius * 0.78, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    ctx.globalCompositeOperation = "lighter";
  }

  for (const sp of supplyPods) {
    ctx.save();
    ctx.translate(sp.x, sp.y);
    ctx.rotate(sp.angle);
    ctx.strokeStyle = sp.color;
    ctx.lineWidth = 2.8;
    ctx.strokeRect(-12, -12, 24, 24);
    ctx.rotate(Math.PI / 4);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-8, -8, 16, 16);
    ctx.restore();
  }

  const gemScale = 1 + (sfx.beatPulse || 0) * 0.32;
  for (const g of gems) {
    ctx.save();
    ctx.translate(g.x, g.y);
    ctx.rotate(g.angle);
    ctx.scale(gemScale, gemScale);
    ctx.strokeStyle = g.magnetized ? "#fcee09" : "#00ffaa";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -7); ctx.lineTo(6, 0); ctx.lineTo(0, 7); ctx.lineTo(-6, 0);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    const alpha = Math.max(0, p.life / p.maxLife);
    if (alpha <= 0.02) continue;
    ctx.strokeStyle = p.color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = p.size;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - p.vx * 0.038, p.y - p.vy * 0.038);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;

  for (const rb of railBeams) {
    const alpha = rb.life / rb.maxLife;
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = rb.color;
    ctx.lineWidth = 12 * alpha;
    ctx.beginPath();
    ctx.moveTo(rb.x1, rb.y1);
    ctx.lineTo(rb.x2, rb.y2);
    ctx.stroke();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3.5 * alpha;
    ctx.beginPath();
    ctx.moveTo(rb.x1, rb.y1);
    ctx.lineTo(rb.x2, rb.y2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  for (const b of bullets) {
    ctx.strokeStyle = b.color;
    ctx.lineWidth = b.radius ? b.radius * 1.4 : b.bassBoosted ? 4.8 : 3.4;
    ctx.beginPath();
    ctx.moveTo(b.x - b.vx * 0.025, b.y - b.vy * 0.025);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius || (b.bassBoosted ? 3.0 : 2.2), 0, Math.PI * 2);
    ctx.fill();
  }

  for (const bm of boomerangs) {
    ctx.save();
    ctx.translate(bm.x, bm.y);
    ctx.rotate(bm.spinAngle);
    ctx.strokeStyle = bm.isSupernova ? "#ff6600" : bm.color;
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(0, 0, 15, -Math.PI * 0.65, Math.PI * 0.65);
    ctx.stroke();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 11, -Math.PI * 0.5, Math.PI * 0.5);
    ctx.stroke();
    ctx.restore();
  }

  for (const m of missiles) {
    ctx.save();
    ctx.translate(m.x, m.y);
    ctx.rotate(Math.atan2(m.vy, m.vx));
    ctx.strokeStyle = m.color || "#ff007f";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(9, 0); ctx.lineTo(-6, -5); ctx.lineTo(-6, 5);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  for (const arc of lightningArcs) {
    ctx.strokeStyle = arc.color;
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = arc.life / 0.18;
    ctx.beginPath();
    ctx.moveTo(arc.x1, arc.y1);
    const segs = 5;
    for (let s = 1; s < segs; s++) {
      const t = s / segs;
      ctx.lineTo(arc.x1 + (arc.x2 - arc.x1) * t + (Math.random() - 0.5) * 22, arc.y1 + (arc.y2 - arc.y1) * t + (Math.random() - 0.5) * 22);
    }
    ctx.lineTo(arc.x2, arc.y2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  for (const eb of enemyBullets) {
    ctx.fillStyle = eb.color;
    ctx.beginPath();
    ctx.arc(eb.x, eb.y, eb.radius * (1 + (sfx.beatPulse || 0) * 0.25), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(eb.x, eb.y, eb.radius * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const e of enemies) {
    if (e.type === "BOSS" && e.subtype === "LEVIATHAN" && Array.isArray(e.segments)) {
      for (let idx = e.segments.length - 1; idx >= 0; idx--) {
        const seg = e.segments[idx];
        const sr = (29 - idx * 2.1) * (1 + (sfx.beatPulse || 0) * 0.12);
        ctx.save();
        ctx.translate(seg.x, seg.y);
        ctx.rotate(seg.angle || 0);
        ctx.strokeStyle = idx % 2 === 0 ? "#bc13fe" : "#00f3ff";
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(sr, 0); ctx.lineTo(0, -sr * 0.9); ctx.lineTo(-sr, -sr * 0.5);
        ctx.lineTo(-sr * 0.6, 0); ctx.lineTo(-sr, sr * 0.5); ctx.lineTo(0, sr * 0.9);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
    }

    if (e.type === "PHANTOM" && e.aiming) {
      ctx.strokeStyle = "rgba(255, 42, 133, 0.55)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(e.x, e.y);
      ctx.lineTo(player.x, player.y);
      ctx.stroke();
    }

    const drawEnemyShape = (strokeCol) => {
      ctx.strokeStyle = strokeCol;
      ctx.lineWidth = 2.5 + (sfx.beatPulse || 0) * 1.4;
      const r = e.radius;
      if (e.type === "KAMIKAZE") {
        const blink = Math.sin(performance.now() * 0.035) > 0 ? "#ffffff" : "#ff0033";
        ctx.strokeStyle = blink;
        ctx.beginPath();
        ctx.moveTo(r * 1.45, 0);
        ctx.lineTo(-r, -r * 0.95);
        ctx.lineTo(-r * 0.4, 0);
        ctx.lineTo(-r, r * 0.95);
        ctx.closePath();
        ctx.stroke();
      } else if (e.type === "DISRUPTOR") {
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "#fcee09";
        ctx.strokeRect(-r * 0.55, -r * 0.55, r * 1.1, r * 1.1);
      } else if (e.type === "ENERGY_ORB") {
        ctx.strokeStyle = "#00ffaa";
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else if (e.type === "CHASER" || e.type === "MINI_SWARM") {
        ctx.beginPath();
        for (let k = 0; k < 4; k++) {
          const a = (k * Math.PI) / 2;
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * r * 1.3, Math.sin(a) * r * 1.3);
          ctx.lineTo(Math.cos(a + 0.45) * r * 0.65, Math.sin(a + 0.45) * r * 0.65);
          ctx.closePath();
        }
        ctx.stroke();
      } else if (e.type === "WEAVER") {
        for (let k = 0; k < 4; k++) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(r * 0.25, 0); ctx.lineTo(r * 1.15, r * 0.35);
          ctx.lineTo(r * 0.75, r * 0.95); ctx.lineTo(0, r * 0.45);
          ctx.closePath();
          ctx.stroke();
        }
      } else if (e.type === "SPLITTER") {
        const s1 = r * 0.88;
        ctx.strokeRect(-s1, -s1, s1 * 2, s1 * 2);
        ctx.save();
        ctx.rotate(Math.PI / 4);
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(-s1 * 0.72, -s1 * 0.72, s1 * 1.44, s1 * 1.44);
        ctx.restore();
      } else if (e.type === "PHANTOM") {
        ctx.beginPath();
        ctx.moveTo(r * 1.4, -3); ctx.lineTo(r * 0.3, -r * 0.35); ctx.lineTo(-r * 0.9, -r * 1.05);
        ctx.lineTo(-r * 0.45, 0); ctx.lineTo(-r * 0.9, r * 1.05); ctx.lineTo(r * 0.3, r * 0.35); ctx.lineTo(r * 1.4, 3);
        ctx.closePath();
        ctx.stroke();
      } else if (e.type === "GUARDIAN" || e.type === "JUGGERNAUT") {
        ctx.beginPath();
        for (let k = 0; k < 8; k++) {
          const a = (k * Math.PI) / 4;
          if (k === 0) ctx.moveTo(Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85);
          else ctx.lineTo(Math.cos(a) * r * 0.85, Math.sin(a) * r * 0.85);
        }
        ctx.closePath();
        ctx.stroke();
        if (e.type === "JUGGERNAUT") {
          ctx.strokeStyle = "#fcee09";
          ctx.lineWidth = 4.5;
          ctx.beginPath();
          ctx.arc(0, 0, r + 6, -0.95, 0.95);
          ctx.stroke();
        }
      } else if (e.type === "BOSS") {
        const isEnraged = e.hp < e.maxHp * 0.5;
        const corePulse = 1 + (sfx.beatPulse || 0) * 0.25 + (isEnraged ? 0.15 : 0);

        // Enrage varovná aura pod 50 % HP
        if (isEnraged) {
          ctx.save();
          ctx.strokeStyle = "#ff0055";
          ctx.lineWidth = 2.0;
          ctx.setLineDash([10, 6]);
          ctx.beginPath();
          ctx.arc(0, 0, r * 1.35, -e.angle * 2, -e.angle * 2 + Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        }

        if (e.subtype === "ARCHON") {
          // 1. OMEGA ARCHON: Prstence singularity + temné jádro
          for (let layer = 0; layer < 3; layer++) {
            ctx.save();
            ctx.rotate(layer % 2 === 0 ? e.angle : -e.angle * 1.4);
            const lr = r - layer * 11;
            ctx.strokeStyle = layer === 0 ? strokeCol : layer === 1 ? "#fcee09" : "#00f3ff";
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            for (let k = 0; k < 16; k++) {
              const rad = k % 2 === 0 ? lr * 1.15 : lr * 0.72;
              const a = (k * Math.PI) / 8;
              if (k === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
              else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
          }
          ctx.fillStyle = "#050010";
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.35 * corePulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.stroke();

        } else if (e.subtype === "SERAPH") {
          // 2. CHRONO SERAPH: Zlatá mechanická křídla Valkýry
          ctx.save();
          const wingSpread = Math.sin(performance.now() * 0.008) * 0.15;
          [-1, 1].forEach((dir) => {
            ctx.save();
            ctx.scale(1, dir);
            ctx.rotate(wingSpread);
            ctx.strokeStyle = "#fcee09";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(10, 8);
            ctx.lineTo(-15, r * 1.45);
            ctx.lineTo(-35, r * 1.15);
            ctx.lineTo(-12, r * 0.65);
            ctx.lineTo(-42, r * 0.75);
            ctx.lineTo(-20, 12);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
          });
          // Centrální kopí a svatozář
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          ctx.moveTo(r * 1.3, 0);
          ctx.lineTo(0, -r * 0.45);
          ctx.lineTo(-r * 0.9, 0);
          ctx.lineTo(0, r * 0.45);
          ctx.closePath();
          ctx.stroke();
          ctx.strokeStyle = "#00f3ff";
          ctx.beginPath();
          ctx.arc(-8, 0, r * 0.55, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

        } else if (e.subtype === "HYDRA") {
          // 3. NEXUS HYDRA: Centrální šestiúhelník + 3 obíhající reaktorové uzly
          ctx.strokeStyle = strokeCol;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            const a = (k * Math.PI) / 3;
            if (k === 0) ctx.moveTo(Math.cos(a) * r * 0.65, Math.sin(a) * r * 0.65);
            else ctx.lineTo(Math.cos(a) * r * 0.65, Math.sin(a) * r * 0.65);
          }
          ctx.closePath();
          ctx.stroke();

          for (let node = 0; node < 3; node++) {
            const na = (node * Math.PI * 2) / 3;
            const nx = Math.cos(na) * 48;
            const ny = Math.sin(na) * 48;
            // Energetický paprsek do uzlu
            ctx.strokeStyle = "#fcee09";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(nx, ny);
            ctx.stroke();
            // Uzel
            ctx.fillStyle = "#021814";
            ctx.strokeStyle = "#00ffaa";
            ctx.lineWidth = 2.8;
            ctx.beginPath();
            ctx.arc(nx, ny, 15 * corePulse, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }

        } else if (e.subtype === "LEVIATHAN") {
          // 4. VOID LEVIATHAN: Dračí kyber-hlava s kusadly
          ctx.strokeStyle = strokeCol;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(r * 1.15, 0);
          ctx.lineTo(r * 0.2, -r * 0.85);
          ctx.lineTo(-r * 0.8, -r * 0.6);
          ctx.lineTo(-r * 0.4, 0);
          ctx.lineTo(-r * 0.8, r * 0.6);
          ctx.lineTo(r * 0.2, r * 0.85);
          ctx.closePath();
          ctx.stroke();
          // Kusadla
          ctx.strokeStyle = "#00f3ff";
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(r * 0.6, -r * 0.5);
          ctx.lineTo(r * 1.35, -r * 0.25);
          ctx.moveTo(r * 0.6, r * 0.5);
          ctx.lineTo(r * 1.35, r * 0.25);
          ctx.stroke();

        } else if (e.subtype === "NEMESIS") {
          // 5. AETHER NEMESIS: Čtyřcípá fázová hvězdice (Shuriken)
          for (let layer = 0; layer < 2; layer++) {
            ctx.save();
            ctx.rotate(layer === 0 ? 0 : Math.PI / 4);
            ctx.strokeStyle = layer === 0 ? "#38bdf8" : "#ff007f";
            ctx.lineWidth = 3;
            ctx.beginPath();
            for (let k = 0; k < 8; k++) {
              const rad = k % 2 === 0 ? r * 1.25 : r * 0.35;
              const a = (k * Math.PI) / 4;
              if (k === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
              else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
          }
          ctx.strokeStyle = "#ffffff";
          ctx.strokeRect(-10, -10, 20, 20);

        } else {
          // 6. SOLARIS COLOSSUS: Hvězdná kovárna s ozubeným prstencem a korónou
          ctx.strokeStyle = "#fb923c";
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          const teeth = 24;
          for (let k = 0; k < teeth; k++) {
            const rad = k % 2 === 0 ? r * 1.15 : r * 0.88;
            const a = (k * Math.PI * 2) / teeth;
            if (k === 0) ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad);
            else ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
          }
          ctx.closePath();
          ctx.stroke();

          ctx.fillStyle = "rgba(251, 146, 60, 0.35)";
          ctx.strokeStyle = "#fcee09";
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.55 * corePulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }
    };

    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(e.angle);
    const beatScale = 1 + (sfx.beatPulse || 0) * (e.type === "BOSS" ? 0.14 : 0.24);
    ctx.scale(beatScale, beatScale);
    const stateCol = e.burnTimer && e.burnTimer > 0 ? "#ff5500" : e.slowTimer > 0 ? "#67e8f9" : e.color;
    drawEnemyShape(stateCol);
    ctx.restore();

    if (e.shield && e.shield > 0) {
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.radius + 6, 0, Math.PI * 2 * (e.shield / e.maxShield));
      ctx.stroke();
    }

    if (e.type !== "BOSS" && e.hp < e.maxHp) {
      const bw = e.radius * 1.6;
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      ctx.fillRect(e.x - bw / 2, e.y - e.radius - 12, bw, 3.5);
      ctx.fillStyle = e.color;
      ctx.fillRect(e.x - bw / 2, e.y - e.radius - 12, bw * Math.max(0, e.hp / e.maxHp), 3.5);
    }
  }

  for (const img of player.afterimages) {
    ctx.save();
    ctx.translate(img.x, img.y);
    ctx.rotate(img.angle);
    ctx.globalAlpha = img.alpha * 0.55;
    drawPlayerShipGeometry(ctx, player.shipClass, player.color);
    ctx.restore();
  }
  ctx.globalAlpha = 1.0;

  if (state.mode !== "GAMEOVER") {
    if ((player.weapons.aegisLvl > 0 || player.weapons.nanoShieldLvl > 0) && player.aegisReady) {
      ctx.strokeStyle = "#60a5fa";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius + 13 + (sfx.beatPulse || 0) * 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    const pScale = 1 + (sfx.beatPulse || 0) * 0.12;
    ctx.scale(pScale, pScale);
    drawPlayerShipGeometry(ctx, player.shipClass, player.color);
    ctx.restore();

    if (player.weapons.bladesLvl > 0) {
      const bCount = player.weapons.bladesLvl;
      const orbitR = 58;
      for (let i = 0; i < bCount; i++) {
        const ba = player.bladeAngle + (i * Math.PI * 2) / bCount;
        const bx = player.x + Math.cos(ba) * orbitR;
        const by = player.y + Math.sin(ba) * orbitR;
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(ba * 3);
        ctx.strokeStyle = "#bc13fe";
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-7, -7, 14, 14);
        ctx.restore();
      }
    }

    if (player.weapons.dronesLvl > 0) {
      const dCount = player.weapons.dronesLvl;
      const orbitR = 44;
      for (let i = 0; i < dCount; i++) {
        const da = player.droneAngle + (i * Math.PI * 2) / dCount;
        const dx = player.x + Math.cos(da) * orbitR;
        const dy = player.y + Math.sin(da) * orbitR;
        ctx.save();
        ctx.translate(dx, dy);
        ctx.rotate(player.angle);
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(9, 0); ctx.lineTo(-5, -6); ctx.lineTo(-2, 0); ctx.lineTo(-5, 6);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  ctx.font = "900 16px Orbitron, sans-serif";
  ctx.textAlign = "center";
  for (const ft of floatingTexts) {
    ctx.globalAlpha = Math.max(0, ft.life / ft.maxLife);
    ctx.fillStyle = ft.color;
    ctx.save();
    ctx.translate(ft.x, ft.y);
    ctx.scale(ft.scale, ft.scale);
    ctx.fillText(ft.text, 0, 0);
    ctx.restore();
  }
  ctx.globalAlpha = 1.0;

  if (state.mode === "PLAYING") {
    const pulse = Math.max(sfx.beatPulse || 0, (sfx.bassEnergy || 0) * 0.85);
    if (pulse > 0.12) {
      ctx.save();
      const borderCol = state.overdriveTimer > 0 ? "#fcee09" : (sfx.justBarDrop ? "#ff007f" : player.color);
      ctx.strokeStyle = borderCol;
      ctx.shadowColor = borderCol;
      ctx.shadowBlur = 18 * pulse;
      ctx.globalAlpha = Math.min(0.65, pulse * 0.55);
      ctx.lineWidth = 4 + pulse * 12;
      ctx.strokeRect(0, 0, W, H);
      ctx.restore();
    }
  }

  // HIGH-VISIBILITY SCI-FI CROSSHAIR
  if (state.mode === "PLAYING" || state.mode === "PAUSED") {
    ctx.save();
    ctx.translate(mouse.x, mouse.y);

    // Zrušíme aditivní prosvětlování, aby byl zaměřovač vždy 100% viditelný i na explozích
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1.0;

    const crosshairCol = state.overdriveTimer > 0 ? "#fcee09" : "#00f3ff";
    const pulse = (sfx.beatPulse || 0) * 4;
    const r = 13 + pulse;

    // 1. Černý kontrastní stín pod zaměřovačem (aby nesplýval na neonovém pozadí)
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.moveTo(-22 - pulse, 0); ctx.lineTo(-6, 0);
    ctx.moveTo(6, 0); ctx.lineTo(22 + pulse, 0);
    ctx.moveTo(0, -22 - pulse); ctx.lineTo(0, -6);
    ctx.moveTo(0, 6); ctx.lineTo(0, 22 + pulse);
    ctx.stroke();

    // 2. Hlavní neonový svítící kroužek a kříž
    ctx.strokeStyle = crosshairCol;
    ctx.shadowColor = crosshairCol;
    ctx.shadowBlur = 10;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.moveTo(-20 - pulse, 0); ctx.lineTo(-6, 0);
    ctx.moveTo(6, 0); ctx.lineTo(20 + pulse, 0);
    ctx.moveTo(0, -20 - pulse); ctx.lineTo(0, -6);
    ctx.moveTo(0, 6); ctx.lineTo(0, 20 + pulse);
    ctx.stroke();

    // 3. Svítící červeno-bílý středový zaměřovací bod (přesné míření)
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#ff0055";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
}