// ===== SVG AVATAR GENERATOR =====
// Creates unique character avatars for each player — all in code, no external images

export function createAvatar(playerId, size = 120) {
  if (playerId === 'maddox') return maddoxAvatar(size);
  if (playerId === 'jaxon') return jaxonAvatar(size);
  return '';
}

function maddoxAvatar(size) {
  // Lightning-fast character — angular, electric blue, speed trails
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <!-- Speed trail lines -->
    <line x1="10" y1="50" x2="35" y2="50" stroke="#1B6FF4" stroke-width="2" opacity="0.3">
      <animate attributeName="opacity" values="0.1;0.5;0.1" dur="1.5s" repeatCount="indefinite"/>
    </line>
    <line x1="5" y1="60" x2="30" y2="60" stroke="#4D91FF" stroke-width="1.5" opacity="0.25">
      <animate attributeName="opacity" values="0.1;0.4;0.1" dur="1.2s" repeatCount="indefinite"/>
    </line>
    <line x1="12" y1="70" x2="32" y2="70" stroke="#1B6FF4" stroke-width="1" opacity="0.2">
      <animate attributeName="opacity" values="0.1;0.3;0.1" dur="1.8s" repeatCount="indefinite"/>
    </line>

    <!-- Body - angular/fast looking -->
    <ellipse cx="62" cy="70" rx="22" ry="28" fill="#1B6FF4"/>

    <!-- Head -->
    <circle cx="62" cy="38" r="22" fill="#1B6FF4"/>

    <!-- Face plate -->
    <ellipse cx="62" cy="42" rx="15" ry="13" fill="#E8D5B7"/>

    <!-- Eyes - determined, slightly angled -->
    <ellipse cx="55" cy="39" rx="5" ry="5.5" fill="white"/>
    <ellipse cx="69" cy="39" rx="5" ry="5.5" fill="white"/>
    <circle cx="57" cy="39" r="3" fill="#1a1a2e"/>
    <circle cx="71" cy="39" r="3" fill="#1a1a2e"/>
    <!-- Eye shine -->
    <circle cx="58" cy="37.5" r="1" fill="white"/>
    <circle cx="72" cy="37.5" r="1" fill="white"/>

    <!-- Confident grin -->
    <path d="M55 48 Q62 54 69 48" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/>

    <!-- Spiky hair (speed-inspired) -->
    <polygon points="62,12 55,22 48,10 52,24 40,16 50,26" fill="#0A4BBF"/>
    <polygon points="62,12 69,22 76,10 72,24 84,16 74,26" fill="#0A4BBF"/>
    <polygon points="62,8 58,18 66,18" fill="#1B6FF4"/>

    <!-- Lightning bolt emblem on chest -->
    <polygon points="60,60 56,68 62,66 58,76 66,65 60,67 64,60" fill="#FFD700"/>

    <!-- Shoes/feet -->
    <ellipse cx="52" cy="98" rx="12" ry="6" fill="#CC2936"/>
    <ellipse cx="72" cy="98" rx="12" ry="6" fill="#CC2936"/>

    <!-- Speed glow -->
    <circle cx="62" cy="55" r="35" fill="none" stroke="#1B6FF4" stroke-width="1" opacity="0.15">
      <animate attributeName="r" values="35;40;35" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>`;
}

function jaxonAvatar(size) {
  // Water-powered stealth character — rounder, teal, wave effects
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <!-- Water ripple effects -->
    <circle cx="60" cy="95" rx="30" ry="8" fill="none" stroke="#00BCD4" stroke-width="1" opacity="0.2">
      <animate attributeName="rx" values="25;35;25" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.2;0.05;0.2" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="60" cy="95" rx="20" ry="5" fill="none" stroke="#26C6DA" stroke-width="1" opacity="0.3">
      <animate attributeName="rx" values="18;25;18" dur="1.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0.1;0.3" dur="1.5s" repeatCount="indefinite"/>
    </circle>

    <!-- Body - rounder, friendlier -->
    <ellipse cx="60" cy="72" rx="24" ry="26" fill="#00BCD4"/>

    <!-- Head -->
    <circle cx="60" cy="38" r="24" fill="#00BCD4"/>

    <!-- Face plate -->
    <ellipse cx="60" cy="42" rx="17" ry="15" fill="#E8D5B7"/>

    <!-- Eyes - big, round, curious -->
    <ellipse cx="53" cy="39" rx="6" ry="6.5" fill="white"/>
    <ellipse cx="67" cy="39" rx="6" ry="6.5" fill="white"/>
    <circle cx="54" cy="39" r="3.5" fill="#1a1a2e"/>
    <circle cx="68" cy="39" r="3.5" fill="#1a1a2e"/>
    <!-- Eye shine - bigger = cuter -->
    <circle cx="55.5" cy="37" r="1.5" fill="white"/>
    <circle cx="69.5" cy="37" r="1.5" fill="white"/>

    <!-- Happy open smile -->
    <path d="M53 49 Q60 55 67 49" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/>

    <!-- Soft wavy hair -->
    <path d="M36,32 Q42,14 52,18 Q58,8 68,18 Q78,14 84,32" fill="#008BA3" stroke="none"/>
    <path d="M40,28 Q48,16 56,20 Q62,12 70,20 Q78,16 82,28" fill="#00BCD4" stroke="none"/>

    <!-- Water drop emblem on chest -->
    <path d="M60,60 Q54,70 60,76 Q66,70 60,60Z" fill="#26C6DA" opacity="0.8"/>
    <ellipse cx="58" cy="66" rx="2" ry="3" fill="white" opacity="0.4"/>

    <!-- Shoes/feet -->
    <ellipse cx="50" cy="98" rx="12" ry="6" fill="#00838F"/>
    <ellipse cx="70" cy="98" rx="12" ry="6" fill="#00838F"/>

    <!-- Water aura -->
    <circle cx="60" cy="55" r="38" fill="none" stroke="#00BCD4" stroke-width="1" opacity="0.1">
      <animate attributeName="r" values="38;43;38" dur="2.5s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.1;0.03;0.1" dur="2.5s" repeatCount="indefinite"/>
    </circle>
  </svg>`;
}

// Mini avatar for HUD
export function createMiniAvatar(playerId, size = 40) {
  if (playerId === 'maddox') {
    return `<svg viewBox="0 0 40 40" width="${size}" height="${size}">
      <circle cx="20" cy="20" r="18" fill="#1B6FF4"/>
      <circle cx="20" cy="18" r="10" fill="#E8D5B7"/>
      <circle cx="16" cy="16" r="2" fill="#1a1a2e"/><circle cx="24" cy="16" r="2" fill="#1a1a2e"/>
      <path d="M15 22 Q20 26 25 22" fill="none" stroke="#1a1a2e" stroke-width="1.5" stroke-linecap="round"/>
      <polygon points="20,2 16,9 12,3 15,10 10,5 14,11 20,5 26,11 30,5 25,10 28,3 24,9" fill="#0A4BBF"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 40 40" width="${size}" height="${size}">
    <circle cx="20" cy="20" r="18" fill="#00BCD4"/>
    <circle cx="20" cy="18" r="10" fill="#E8D5B7"/>
    <circle cx="16" cy="16" r="2.5" fill="#1a1a2e"/><circle cx="24" cy="16" r="2.5" fill="#1a1a2e"/>
    <path d="M15 22 Q20 26 25 22" fill="none" stroke="#1a1a2e" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M10,10 Q14,4 20,7 Q26,4 30,10" fill="#008BA3"/>
  </svg>`;
}

// Star SVG
export function starSVG(size = 24, filled = false) {
  const fill = filled ? '#FFD700' : 'rgba(255,255,255,0.15)';
  const stroke = filled ? '#C7A600' : 'none';
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}">
    <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9"
      fill="${fill}" stroke="${stroke}" stroke-width="0.5"/>
  </svg>`;
}
