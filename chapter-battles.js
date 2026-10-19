// Stable source IDs keep existing numeric reading bookmarks compatible.
(() => {
  const storageKey = 'akatsuki_chapter_battles_v1';
  const encounters = [{ id: 'iga-protect-ieyasu', chapter: 1, srcId: 'n0067', chunk: 1, resumeSrcId: 's0069' }];
  let completed = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) completed = new Set(saved.filter(id => encounters.some(e => e.id === id)));
  } catch {}
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify([...completed])); } catch {}
  }
  window.chapterBattles = {
    beforeAdvance(index) {
      const unit = units[index];
      const encounter = encounters.find(e => e.srcId === unit?.srcId && e.chunk === unit.chunk);
      if (!encounter || completed.has(encounter.id) || !window.akatsukiBattle) return false;
      saveProgress();
      return window.akatsukiBattle.openChapter(encounter.id);
    },
    complete(id) {
      const encounter = encounters.find(e => e.id === id);
      if (!encounter) return null;
      completed.add(id);
      persist();
      return units.findIndex(u => u.srcId === encounter.resumeSrcId);
    },
    reset() {
      completed.clear();
      persist();
    }
  };
})();
