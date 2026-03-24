// ===== SVG AVATAR GENERATOR — Pokemon Trainer Style =====
// Creates unique trainer avatars for each player — all in code, no external images

export function createAvatar(playerId, size = 120) {
  if (playerId === 'maddox') return maddoxAvatar(size);
  if (playerId === 'jaxon') return jaxonAvatar(size);
  return '';
}

function maddoxAvatar(size) {
  // Champion trainer — red cap, confident, fire emblem
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <!-- Pokeball glow -->
    <circle cx="62" cy="55" r="38" fill="none" stroke="#CC2936" stroke-width="1" opacity="0.12">
      <animate attributeName="r" values="38;43;38" dur="2.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.12;0.04;0.12" dur="2.5s" repeatCount="indefinite"/>
    </circle>

    <!-- Body — trainer jacket -->
    <ellipse cx="62" cy="82" rx="24" ry="22" fill="#CC2936"/>
    <!-- Jacket collar -->
    <path d="M48,68 L62,75 L76,68" fill="none" stroke="#A01D28" stroke-width="2"/>
    <!-- White undershirt -->
    <rect x="55" y="72" width="14" height="12" rx="2" fill="white" opacity="0.9"/>

    <!-- Head -->
    <circle cx="62" cy="42" r="22" fill="#E8D5B7"/>

    <!-- Eyes - determined, slightly angled -->
    <ellipse cx="55" cy="42" rx="5" ry="5.5" fill="white"/>
    <ellipse cx="69" cy="42" rx="5" ry="5.5" fill="white"/>
    <circle cx="57" cy="42" r="3" fill="#1a1a2e"/>
    <circle cx="71" cy="42" r="3" fill="#1a1a2e"/>
    <!-- Eye shine -->
    <circle cx="58" cy="40.5" r="1" fill="white"/>
    <circle cx="72" cy="40.5" r="1" fill="white"/>

    <!-- Confident grin -->
    <path d="M55 50 Q62 56 69 50" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/>

    <!-- Red Pokemon cap -->
    <ellipse cx="62" cy="28" rx="24" ry="10" fill="#CC2936"/>
    <rect x="38" y="25" width="48" height="8" rx="2" fill="#CC2936"/>
    <!-- Cap brim -->
    <path d="M40,33 L84,33 L80,38 L44,38 Z" fill="#A01D28"/>
    <!-- Pokeball emblem on cap -->
    <circle cx="62" cy="24" r="6" fill="white" opacity="0.9"/>
    <line x1="56" y1="24" x2="68" y2="24" stroke="#1a1a2e" stroke-width="1.5"/>
    <circle cx="62" cy="24" r="2.5" fill="white" stroke="#1a1a2e" stroke-width="1"/>

    <!-- Spiky hair from under cap -->
    <polygon points="40,32 36,38 42,34" fill="#3D2914"/>
    <polygon points="84,32 88,38 82,34" fill="#3D2914"/>
    <polygon points="42,34 38,40 44,36" fill="#3D2914"/>

    <!-- Pokeball in hand -->
    <circle cx="88" cy="80" r="8" fill="#CC2936"/>
    <line x1="80" y1="80" x2="96" y2="80" stroke="#1a1a2e" stroke-width="2"/>
    <circle cx="88" cy="80" r="3" fill="white" stroke="#1a1a2e" stroke-width="1.5"/>
    <circle cx="88" cy="80" r="8" fill="none" stroke="#A01D28" stroke-width="1.5"/>

    <!-- Shoes -->
    <ellipse cx="52" cy="102" rx="12" ry="6" fill="#1a1a2e"/>
    <ellipse cx="72" cy="102" rx="12" ry="6" fill="#1a1a2e"/>
  </svg>`;
}

function jaxonAvatar(size) {
  // Young trainer — blue cap, big eyes, curious, water emblem
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <!-- Pokemon glow -->
    <circle cx="60" cy="55" r="38" fill="none" stroke="#3B4CCA" stroke-width="1" opacity="0.1">
      <animate attributeName="r" values="38;43;38" dur="2.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.1;0.03;0.1" dur="2.5s" repeatCount="indefinite"/>
    </circle>

    <!-- Body — trainer jacket -->
    <ellipse cx="60" cy="82" rx="26" ry="22" fill="#3B4CCA"/>
    <!-- Jacket details -->
    <path d="M46,68 L60,76 L74,68" fill="none" stroke="#2A3699" stroke-width="2"/>
    <!-- White undershirt -->
    <rect x="53" y="72" width="14" height="12" rx="2" fill="white" opacity="0.9"/>

    <!-- Head — rounder, younger -->
    <circle cx="60" cy="42" r="24" fill="#E8D5B7"/>

    <!-- Eyes - big, round, curious -->
    <ellipse cx="53" cy="42" rx="6" ry="6.5" fill="white"/>
    <ellipse cx="67" cy="42" rx="6" ry="6.5" fill="white"/>
    <circle cx="54" cy="42" r="3.5" fill="#1a1a2e"/>
    <circle cx="68" cy="42" r="3.5" fill="#1a1a2e"/>
    <!-- Eye shine - bigger = cuter -->
    <circle cx="55.5" cy="40" r="1.5" fill="white"/>
    <circle cx="69.5" cy="40" r="1.5" fill="white"/>

    <!-- Happy open smile -->
    <path d="M53 51 Q60 57 67 51" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/>

    <!-- Blue Pokemon cap -->
    <ellipse cx="60" cy="26" rx="26" ry="10" fill="#3B4CCA"/>
    <rect x="34" y="23" width="52" height="8" rx="2" fill="#3B4CCA"/>
    <!-- Cap brim -->
    <path d="M36,31 L84,31 L80,37 L40,37 Z" fill="#2A3699"/>
    <!-- Pokeball emblem on cap -->
    <circle cx="60" cy="22" r="6" fill="white" opacity="0.9"/>
    <line x1="54" y1="22" x2="66" y2="22" stroke="#1a1a2e" stroke-width="1.5"/>
    <circle cx="60" cy="22" r="2.5" fill="white" stroke="#1a1a2e" stroke-width="1"/>

    <!-- Soft hair from under cap -->
    <path d="M36,30 Q40,36 38,40" fill="#3D2914" stroke="none"/>
    <path d="M84,30 Q80,36 82,40" fill="#3D2914" stroke="none"/>

    <!-- Pokeball in hand -->
    <circle cx="90" cy="82" r="7" fill="#3B4CCA"/>
    <line x1="83" y1="82" x2="97" y2="82" stroke="#1a1a2e" stroke-width="2"/>
    <circle cx="90" cy="82" r="2.5" fill="white" stroke="#1a1a2e" stroke-width="1.5"/>
    <circle cx="90" cy="82" r="7" fill="none" stroke="#2A3699" stroke-width="1.5"/>

    <!-- Shoes -->
    <ellipse cx="50" cy="102" rx="12" ry="6" fill="#1a1a2e"/>
    <ellipse cx="70" cy="102" rx="12" ry="6" fill="#1a1a2e"/>
  </svg>`;
}

// Mini avatar for HUD
export function createMiniAvatar(playerId, size = 40) {
  if (playerId === 'maddox') {
    return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#CC2936"/>
      <circle cx="20" cy="20" r="10" fill="#E8D5B7"/>
      <circle cx="16" cy="18" r="2" fill="#1a1a2e"/><circle cx="24" cy="18" r="2" fill="#1a1a2e"/>
      <path d="M15 23 Q20 27 25 23" fill="none" stroke="#1a1a2e" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M8,12 L32,12 L30,15 L10,15 Z" fill="#A01D28"/>
      <rect x="8" y="6" width="24" height="7" rx="3" fill="#CC2936"/>
      <circle cx="20" cy="8" r="3" fill="white" opacity="0.9"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="18" fill="#3B4CCA"/>
    <circle cx="20" cy="20" r="10" fill="#E8D5B7"/>
    <circle cx="16" cy="18" r="2.5" fill="#1a1a2e"/><circle cx="24" cy="18" r="2.5" fill="#1a1a2e"/>
    <path d="M15 23 Q20 27 25 23" fill="none" stroke="#1a1a2e" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M8,12 L32,12 L30,15 L10,15 Z" fill="#2A3699"/>
    <rect x="8" y="6" width="24" height="7" rx="3" fill="#3B4CCA"/>
    <circle cx="20" cy="8" r="3" fill="white" opacity="0.9"/>
  </svg>`;
}

// Star SVG (kept as stars — universal reward icon)
export function starSVG(size = 24, filled = false) {
  const fill = filled ? '#FFD700' : 'rgba(255,255,255,0.15)';
  const stroke = filled ? '#C7A600' : 'none';
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"
      fill="${fill}" stroke="${stroke}" stroke-width="0.5"/>
  </svg>`;
}
