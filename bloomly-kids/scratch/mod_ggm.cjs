const fs = require('fs');

const ggmPath = 'src/components/GameGridMenu.tsx';
let ggmText = fs.readFileSync(ggmPath, 'utf8');

// Update props to include new actions
ggmText = ggmText.replace(
    'onBackToCategories?: () => void;',
    'onBackToCategories?: () => void;\n  onOpenParents?: () => void;\n  onOpenMap?: () => void;\n  onOpenAbout?: () => void;'
);

ggmText = ggmText.replace(
    'onBackToCategories \n}) => {',
    'onBackToCategories, \n  onOpenParents, \n  onOpenMap, \n  onOpenAbout \n}) => {'
);

// We need to inject the custom boxes into the horizontal scrolling list.
// The list is rendered by `categoriesData.map((cat, index) => (`
// Let's create an array of "extended categories" inside the component before mapping.

const extendedCategoriesCode = `
  const customBoxes = [
    {
      id: "parents",
      title: "أولياء الأمور",
      englishTitle: "PARENTS AREA",
      icon: "👨‍👩‍👧‍👦",
      bgGradient: "from-[#8E2DE2]/90 to-[#4A00E0]/90",
      textColor: "text-purple-700",
      borderColor: "border-purple-400",
      action: onOpenParents
    },
    {
      id: "island_map",
      title: "خريطة الجزيرة",
      englishTitle: "ISLAND MAP",
      icon: "🗺️",
      bgGradient: "from-[#11998e]/90 to-[#38ef7d]/90",
      textColor: "text-green-700",
      borderColor: "border-green-400",
      action: onOpenMap
    },
    {
      id: "about_us",
      title: "بنعرف عن نفسنا",
      englishTitle: "ABOUT US",
      icon: "ℹ️",
      bgGradient: "from-[#fc4a1a]/90 to-[#f7b733]/90",
      textColor: "text-orange-700",
      borderColor: "border-orange-400",
      action: onOpenAbout
    }
  ];
  
  // Combine categories and custom boxes.
  // The user said "بنعرف عن نفسنا في الاخر" (About Us at the end).
  // The farm box is already in categoriesData.
  const allBoxes = [
    ...categoriesData,
    customBoxes[0], // Parents
    customBoxes[1], // Map
    customBoxes[2]  // About Us
  ];
`;

ggmText = ggmText.replace(
    '{categoriesData.map((cat, index) => (',
    extendedCategoriesCode + '\n          {allBoxes.map((cat, index) => ('
);

// Change the onClick handler in the map
ggmText = ggmText.replace(
    'if (onSelectCategory) onSelectCategory(cat.id);',
    'if ((cat as any).action) { (cat as any).action(); } else if (onSelectCategory) onSelectCategory(cat.id);'
);

fs.writeFileSync(ggmPath, ggmText, 'utf8');
console.log("GameGridMenu updated!");
