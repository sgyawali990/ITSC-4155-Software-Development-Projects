const businessTemplates = {
  OFFICE: {
    key: "OFFICE",
    label: "Office",
    description: "Ideal for offices managing supplies, breakroom items, and general consumables.",
    defaults: {
      updateMode: "MANUAL", // Default mode for this business type
      categories: ["Office Supplies", "Breakroom", "Cleaning", "Electronics"],
      starterItems: [
        { itemName: "Printer Paper", quantity: 10, reorderThreshold: 5, category: "Office Supplies" },
        { itemName: "Pens (Black/Blue)", quantity: 50, reorderThreshold: 20, category: "Office Supplies" },
        { itemName: "Coffee Pods", quantity: 30, reorderThreshold: 10, category: "Breakroom" },
        { itemName: "Disinfecting Wipes", quantity: 15, reorderThreshold: 5, category: "Cleaning" },
        { itemName: "Sticky Notes", quantity: 25, reorderThreshold: 10, category: "Office Supplies" }
      ]
    }
  },

  WORKSHOP: {
    key: "WORKSHOP",
    label: "Workshop",
    description: "Best for workshops tracking tools, materials, and safety equipment.",
    defaults: {
      updateMode: "MANUAL",
      categories: ["Tools", "Safety", "Hardware", "Materials"],
      starterItems: [
        { itemName: "Work Gloves", quantity: 20, reorderThreshold: 8, category: "Safety" },
        { itemName: "Safety Glasses", quantity: 15, reorderThreshold: 5, category: "Safety" },
        { itemName: "Screws (Standard)", quantity: 200, reorderThreshold: 50, category: "Hardware" },
        { itemName: "Sandpaper (Assorted)", quantity: 40, reorderThreshold: 10, category: "Materials" },
        { itemName: "Drill Bits", quantity: 25, reorderThreshold: 8, category: "Tools" }
      ]
    }
  },

  SMALL_RETAIL: {
    key: "SMALL_RETAIL",
    label: "Small Retail",
    description: "Flexible setup for retail stores tracking packaging and floor supplies.",
    defaults: {
      updateMode: "EOD", // End of day tallying
      categories: ["Inventory", "Packaging", "Supplies", "Misc"],
      starterItems: [
        { itemName: "Packaging Tape", quantity: 20, reorderThreshold: 5, category: "Packaging" },
        { itemName: "Shipping Labels", quantity: 100, reorderThreshold: 25, category: "Packaging" },
        { itemName: "Cleaning Spray", quantity: 10, reorderThreshold: 3, category: "Supplies" },
        { itemName: "Receipt Paper", quantity: 12, reorderThreshold: 4, category: "Supplies" },
        { itemName: "Plastic/Paper Bags", quantity: 200, reorderThreshold: 50, category: "Packaging" }
      ]
    }
  }
};

module.exports = businessTemplates;