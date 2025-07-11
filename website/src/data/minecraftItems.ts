export interface MinecraftItem {
  id: string;
  displayName: string;
  imageUrl?: string;
}

// Helper function to convert item ID to display name
const formatDisplayName = (id: string): string => {
  return id
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Helper function to generate image URL from item ID
const generateImageUrl = (id: string): string => {
  return `https://static.minecraftitemids.com/64/${id.toLowerCase()}.png`;
};

// Helper function to create a Minecraft item
const createItem = (id: string): MinecraftItem => ({
  id,
  displayName: formatDisplayName(id),
  imageUrl: generateImageUrl(id)
});

export const minecraftItems: MinecraftItem[] = [
  // Gems and Materials
  createItem('DIAMOND'),
  createItem('EMERALD'),
  createItem('GOLD_INGOT'),
  createItem('IRON_INGOT'),
  createItem('COAL'),
  createItem('REDSTONE'),
  createItem('LAPIS_LAZULI'),
  createItem('NETHERITE_INGOT'),
  createItem('BEDROCK'),

  // Basic Blocks
  createItem('COBBLESTONE'),
  createItem('STONE'),
  createItem('DIRT'),
  createItem('GRASS_BLOCK'),
  createItem('SAND'),
  createItem('GRAVEL'),
  createItem('CLAY'),
  createItem('OAK_LOG'),
  createItem('SPRUCE_LOG'),
  createItem('BIRCH_LOG'),
  createItem('JUNGLE_LOG'),
  createItem('ACACIA_LOG'),
  createItem('DARK_OAK_LOG'),

  // Swords
  createItem('DIAMOND_SWORD'),
  createItem('IRON_SWORD'),
  createItem('GOLDEN_SWORD'),
  createItem('STONE_SWORD'),
  createItem('WOODEN_SWORD'),
  createItem('NETHERITE_SWORD'),

  // Pickaxes
  createItem('DIAMOND_PICKAXE'),
  createItem('IRON_PICKAXE'),
  createItem('GOLDEN_PICKAXE'),
  createItem('STONE_PICKAXE'),
  createItem('WOODEN_PICKAXE'),
  createItem('NETHERITE_PICKAXE'),

  // Shovels
  createItem('DIAMOND_SHOVEL'),
  createItem('IRON_SHOVEL'),
  createItem('GOLDEN_SHOVEL'),
  createItem('STONE_SHOVEL'),
  createItem('WOODEN_SHOVEL'),
  createItem('NETHERITE_SHOVEL'),

  // Armor
  createItem('DIAMOND_HELMET'),
  createItem('IRON_HELMET'),
  createItem('GOLDEN_HELMET'),
  createItem('DIAMOND_CHESTPLATE'),
  createItem('IRON_CHESTPLATE'),
  createItem('GOLDEN_CHESTPLATE'),
  createItem('NETHERITE_HELMET'),
  createItem('NETHERITE_CHESTPLATE'),
  createItem('NETHERITE_LEGGINGS'),
  createItem('NETHERITE_BOOTS'),
  createItem('IRON_LEGGINGS'),
  createItem('IRON_BOOTS'),
  createItem('DIAMOND_LEGGINGS'),
  createItem('DIAMOND_BOOTS'),

  // Axes
  createItem('DIAMOND_AXE'),
  createItem('IRON_AXE'),
  createItem('GOLDEN_AXE'),
  createItem('STONE_AXE'),
  createItem('WOODEN_AXE'),
  createItem('NETHERITE_AXE'),

  // Special Items
  createItem('ENDER_PEARL'),
  createItem('ENDER_EYE'),
  createItem('ENDER_CHEST'),
  createItem('BEACON'),
  createItem('NETHER_STAR'),
  createItem('DRAGON_EGG'),
  createItem('TOTEM_OF_UNDYING'),

  // Bows and Arrows
  createItem('BOW'),
  createItem('ARROW'),
  createItem('SPECTRAL_ARROW'),
  createItem('TIPPED_ARROW'),

  // Books and Experience
  createItem('BOOK'),
  createItem('ENCHANTED_BOOK'),
  createItem('EXPERIENCE_BOTTLE'),

  // Food and Potions
  createItem('GOLDEN_APPLE'),
  createItem('ENCHANTED_GOLDEN_APPLE'),
  createItem('POTION'),
  createItem('SPLASH_POTION'),

  // Tools and Utilities
  createItem('COMPASS'),
  createItem('CLOCK'),
  createItem('MAP'),
  createItem('TORCH'),
  createItem('LANTERN'),

  // Storage
  createItem('CHEST'),
  createItem('TRAPPED_CHEST'),
  createItem('SHULKER_BOX'),

  // Special Blocks
  createItem('CONDUIT'),
  createItem('RESPAWN_ANCHOR'),
  createItem('TRIDENT'),

  // Materials
  createItem('BLAZE_ROD'),
  createItem('BLAZE_POWDER'),
  createItem('GHAST_TEAR'),
  createItem('MAGMA_CREAM'),
  createItem('SLIME_BALL'),
  createItem('GUNPOWDER'),
  createItem('STRING'),
  createItem('FEATHER'),
  createItem('FLINT'),
  createItem('CLAY_BALL'),
  createItem('SNOWBALL'),
  createItem('EGG'),
  createItem('MILK_BUCKET'),
  createItem('WATER_BUCKET'),
  createItem('LAVA_BUCKET'),
  createItem('BUCKET'),

  // Food
  createItem('BREAD'),
  createItem('COOKIE'),
  createItem('CAKE'),
  createItem('PUMPKIN_PIE'),
  createItem('MELON_SLICE'),
  createItem('APPLE'),
  createItem('GOLDEN_CARROT'),
  createItem('COOKED_BEEF'),
  createItem('COOKED_CHICKEN'),
  createItem('COOKED_PORKCHOP'),
  createItem('BEEF'),
  createItem('CHICKEN'),
  createItem('PORKCHOP'),

  // Special Items
  createItem('HONEY_BOTTLE'),
  createItem('HONEYCOMB'),
  createItem('SWEET_BERRIES'),
  createItem('GLOW_BERRIES'),
  createItem('CHORUS_FRUIT'),
  createItem('POPPED_CHORUS_FRUIT'),
  createItem('DRIED_KELP'),

  // Additional Common Items
  createItem('OBSIDIAN'),
  createItem('GLASS'),
  createItem('GLASS_PANE'),
  createItem('WOOL'),
  createItem('CARPET'),
  createItem('BED'),
  createItem('FURNACE'),
  createItem('CRAFTING_TABLE'),
  createItem('ANVIL'),
  createItem('ENCHANTING_TABLE'),
  createItem('BOOKSHELF'),
  createItem('PAINTING'),
  createItem('ITEM_FRAME'),
  createItem('ARMOR_STAND'),
  createItem('SIGN'),
  createItem('LADDER'),
  createItem('FENCE'),
  createItem('FENCE_GATE'),
  createItem('DOOR'),
  createItem('TRAPDOOR'),
  createItem('STAIRS'),
  createItem('SLAB'),
  createItem('WALL'),
  createItem('BUTTON'),
  createItem('LEVER'),
  createItem('PRESSURE_PLATE'),
  createItem('REDSTONE_TORCH'),
  createItem('REDSTONE_BLOCK'),
  createItem('REPEATER'),
  createItem('COMPARATOR'),
  createItem('DISPENSER'),
  createItem('DROPPER'),
  createItem('HOPPER'),
  createItem('PISTON'),
  createItem('STICKY_PISTON'),
  createItem('OBSERVER'),
  createItem('TARGET'),
  createItem('DAYLIGHT_DETECTOR'),
  createItem('NOTE_BLOCK'),
  createItem('JUKEBOX'),
  createItem('MUSIC_DISC'),
  createItem('RECORD_PLAYER'),
  createItem('CAULDRON'),
  createItem('BREWING_STAND'),
  createItem('SPIDER_EYE'),
  createItem('FERMENTED_SPIDER_EYE'),
  createItem('GLOWSTONE_DUST'),
  createItem('GLOWSTONE'),
  createItem('SEA_LANTERN'),
  createItem('END_ROD'),
  createItem('REDSTONE_LAMP'),
  createItem('CROSSBOW'),
  createItem('SHIELD'),
  createItem('ELYTRA'),
  createItem('PHANTOM_MEMBRANE'),
  createItem('TURTLE_HELMET'),
  createItem('SCUTE'),
  createItem('NAUTILUS_SHELL'),
  createItem('HEART_OF_THE_SEA'),
  createItem('SEA_PICKLE'),
  createItem('TROPICAL_FISH'),
  createItem('PUFFERFISH'),
  createItem('SALMON'),
  createItem('COD'),
  createItem('COOKED_SALMON'),
  createItem('COOKED_COD'),
  createItem('KELP'),
  createItem('SEAGRASS'),
  createItem('CORAL'),
  createItem('CORAL_BLOCK'),
  createItem('CORAL_FAN'),
  createItem('DEAD_CORAL'),
  createItem('DEAD_CORAL_BLOCK'),
  createItem('DEAD_CORAL_FAN'),
  createItem('BRAIN_CORAL'),
  createItem('BUBBLE_CORAL'),
  createItem('FIRE_CORAL'),
  createItem('HORN_CORAL'),
  createItem('TUBE_CORAL'),
  createItem('BRAIN_CORAL_BLOCK'),
  createItem('BUBBLE_CORAL_BLOCK'),
  createItem('FIRE_CORAL_BLOCK'),
  createItem('HORN_CORAL_BLOCK'),
  createItem('TUBE_CORAL_BLOCK'),
  createItem('BRAIN_CORAL_FAN'),
  createItem('BUBBLE_CORAL_FAN'),
  createItem('FIRE_CORAL_FAN'),
  createItem('HORN_CORAL_FAN'),
  createItem('TUBE_CORAL_FAN'),
  createItem('DEAD_BRAIN_CORAL'),
  createItem('DEAD_BUBBLE_CORAL'),
  createItem('DEAD_FIRE_CORAL'),
  createItem('DEAD_HORN_CORAL'),
  createItem('DEAD_TUBE_CORAL'),
  createItem('DEAD_BRAIN_CORAL_BLOCK'),
  createItem('DEAD_BUBBLE_CORAL_BLOCK'),
  createItem('DEAD_FIRE_CORAL_BLOCK'),
  createItem('DEAD_HORN_CORAL_BLOCK'),
  createItem('DEAD_TUBE_CORAL_BLOCK'),
  createItem('DEAD_BRAIN_CORAL_FAN'),
  createItem('DEAD_BUBBLE_CORAL_FAN'),
  createItem('DEAD_FIRE_CORAL_FAN'),
  createItem('DEAD_HORN_CORAL_FAN'),
  createItem('DEAD_TUBE_CORAL_FAN')
].sort((a, b) => a.displayName.localeCompare(b.displayName)); 