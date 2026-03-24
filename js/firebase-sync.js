// ===== FIREBASE REALTIME DATABASE SYNC =====
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

let db = null;
let _initialized = false;
const _lastPushedTimestamp = { maddox: 0, jaxon: 0 };

export const FirebaseSync = {
  /**
   * Initialize Firebase and set up listeners for both player profiles.
   * @param {Function} onRemoteUpdate - Called with (playerId, profileData) when remote data changes
   * @returns {Promise} Resolves when initial data is received or after 3s timeout
   */
  init(onRemoteUpdate) {
    if (_initialized) return Promise.resolve();

    return new Promise((resolve) => {
      try {
        const app = initializeApp(firebaseConfig);
        db = getDatabase(app);
        _initialized = true;

        let pendingPlayers = 2;
        let resolved = false;

        const done = () => {
          if (!resolved) {
            resolved = true;
            resolve();
          }
        };

        // Timeout so offline startup is never blocked
        setTimeout(done, 3000);

        // Listen for changes on both profiles
        for (const playerId of ['maddox', 'jaxon']) {
          const profileRef = ref(db, 'profiles/' + playerId);
          onValue(profileRef, (snapshot) => {
            const remoteData = snapshot.val();

            // Skip if this is our own write echoing back
            if (remoteData && remoteData.lastModified === _lastPushedTimestamp[playerId]) {
              pendingPlayers--;
              if (pendingPlayers <= 0) done();
              return;
            }

            if (remoteData) {
              onRemoteUpdate(playerId, remoteData);
            }

            pendingPlayers--;
            if (pendingPlayers <= 0) done();
          }, (error) => {
            console.warn('Firebase listener error for', playerId, error);
            pendingPlayers--;
            if (pendingPlayers <= 0) done();
          });
        }
      } catch (e) {
        console.warn('Firebase init error:', e);
        resolve();
      }
    });
  },

  /**
   * Push a player profile to Firebase. Fire-and-forget — SDK handles offline queuing.
   * @param {string} playerId - 'maddox' or 'jaxon'
   * @param {Object} profileData - The full profile object
   */
  pushProfile(playerId, profileData) {
    if (!db) return;
    try {
      _lastPushedTimestamp[playerId] = profileData.lastModified;
      set(ref(db, 'profiles/' + playerId), profileData);
    } catch (e) {
      console.warn('Firebase push error:', e);
    }
  }
};
