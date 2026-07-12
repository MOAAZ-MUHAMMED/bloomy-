const fs = require('fs');
let code = fs.readFileSync('src/components/MagicGarden.tsx', 'utf8');

// 1. Fix hungry
code = code.replace(/elapsed >= 16000/, 'elapsed >= 14400000');

// 2. Fix Fences cost 15 -> 100
const buyFenceRegex = /if \(globalStars < 15\) \{[\s\S]*?updateStars\(-15\);[\s\S]*?triggerNotice\([^)]*\);/g;
const newFenceLogic = `if (globalStars < 100) {
      synth.playPop(); triggerNotice('لا تملك ١٠٠ نجمة لشراء السور!'); return;
    }
    const nextFences = { ...unlockedFences, [type]: true };
    setUnlockedFences(nextFences);
    localStorage.setItem("bloomly_unlocked_fences", JSON.stringify(nextFences));
    updateStars(-100);
    synth.playPetUnlock();
    triggerNotice('تم بناء السور الخشبي الجميل! -100⭐');`;
code = code.replace(buyFenceRegex, newFenceLogic);

// Also fix UI text "(15⭐)" -> "(100⭐)"
code = code.replace(/\(15⭐\)/g, '(100⭐)');

// 3. Fix animalLists recreating
const animalListsRegex = /const newLists: Record<PaddockType, AnimalState\[\]> = \{\} as any;[\s\S]*?setAnimalLists\(newLists\);/m;
const newAnimalListsLogic = `setAnimalLists(prev => {
      const newLists = { ...prev };
      ALL_PADDOCK_TYPES.forEach(type => {
        const targetCount = animalCounts[type] || 0;
        const currentList = prev[type] || [];
        if (currentList.length < targetCount) {
          const added = makeAnimals(type, targetCount - currentList.length);
          newLists[type] = [...currentList, ...added];
        } else if (currentList.length > targetCount) {
          newLists[type] = currentList.slice(0, targetCount);
        }
      });
      return newLists;
    });`;
code = code.replace(animalListsRegex, newAnimalListsLogic);

// 4. Fix house overlap
code = code.replace(/left-\[1750px\] top-\[580px\]/, 'left-[1750px] top-[300px]');

fs.writeFileSync('src/components/MagicGarden.tsx', code);
console.log('Patched MagicGarden.tsx!');
