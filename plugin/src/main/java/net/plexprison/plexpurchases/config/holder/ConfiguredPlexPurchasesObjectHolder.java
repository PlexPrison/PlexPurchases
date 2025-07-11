package net.plexprison.plexpurchases.config.holder;

import net.plexprison.plexpurchases.config.ConfiguredPlexPurchasesObject;
import net.plexprison.plexpurchases.utils.Logger;
import net.plexprison.plexpurchases.utils.YamlParser;
import org.bukkit.plugin.Plugin;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Holder class responsible for managing a list of ConfiguredPlexPurchasesObject instances.
 * Loads YAML files from the assets/purchases directory and parses them into ConfiguredPlexPurchasesObject.
 * Follows single responsibility principle by only handling the loading and storage of purchase configurations.
 */
public class ConfiguredPlexPurchasesObjectHolder {

    private final List<ConfiguredPlexPurchasesObject> purchases;
    private final Plugin plugin;

    /**
     * Constructor for the holder class
     *
     * @param plugin The plugin instance for accessing resources and data folder
     */
    public ConfiguredPlexPurchasesObjectHolder(final Plugin plugin) {
        this.plugin = plugin;
        this.purchases = new ArrayList<>();
    }

    /**
     * Loads all YAML files from the assets/purchases directory and parses them into ConfiguredPlexPurchasesObject instances.
     * This method should be called during plugin initialization.
     */
    public void loadPurchases() {
        Logger.info("Starting to load purchase configurations...");

        // Create the purchases directory if it doesn't exist
        final File purchasesDir = new File(this.plugin.getDataFolder(), "assets/purchases");
        if (!purchasesDir.exists()) {
            purchasesDir.mkdirs();
            Logger.warning("assets/purchases directory is empty in your project, this plugin is useless without this!");
            return;
        }

        // Load all YAML files from the purchases directory
        this.loadPurchaseFiles(purchasesDir);

        Logger.success("Loaded " + this.purchases.size() + " purchase configurations");
    }

    /**
     * Loads all YAML files from the specified directory and parses them into ConfiguredPlexPurchasesObject instances
     *
     * @param purchasesDir The directory containing purchase YAML files
     */
    private void loadPurchaseFiles(final File purchasesDir) {
        try {
            // Get all YAML files from the directory
            final List<File> yamlFiles = Files.walk(purchasesDir.toPath())
                    .filter(path -> path.toString().toLowerCase().endsWith(".yml") || path.toString().toLowerCase().endsWith(".yaml"))
                    .map(Path::toFile)
                    .filter(File::isFile)
                    .toList();

            Logger.info("Found " + yamlFiles.size() + " YAML files in purchases directory");

            // Parse each YAML file
            for (final File yamlFile : yamlFiles) {
                this.loadPurchaseFile(yamlFile);
            }

        } catch (final IOException e) {
            Logger.error("Failed to scan purchases directory: " + e.getMessage());
        }
    }

    /**
     * Loads a single YAML file and parses it into a ConfiguredPlexPurchasesObject
     *
     * @param yamlFile The YAML file to parse
     */
    private void loadPurchaseFile(final File yamlFile) {
        Logger.debug("Loading purchase file: " + yamlFile.getName());

        final Optional<ConfiguredPlexPurchasesObject> purchaseOptional = YamlParser.parseFile(yamlFile, ConfiguredPlexPurchasesObject.class);

        if (purchaseOptional.isPresent()) {
            final ConfiguredPlexPurchasesObject purchase = purchaseOptional.get();

            // Validate the purchase object
            if (ConfiguredPlexPurchasesObjectHolder.isValidPurchase(purchase)) {
                this.purchases.add(purchase);
                Logger.debug("Successfully loaded purchase configuration: " + purchase.getProductName() + " (ID: " + purchase.getProductId() + ")");
            } else {
                Logger.warning("Invalid purchase configuration in file: " + yamlFile.getName());
            }
        } else {
            Logger.warning("Failed to parse purchase file: " + yamlFile.getName());
        }
    }

    /**
     * Validates a ConfiguredPlexPurchasesObject to ensure it has required fields
     *
     * @param purchase The purchase object to validate
     * @return true if the purchase is valid, false otherwise
     */
    private static boolean isValidPurchase(final ConfiguredPlexPurchasesObject purchase) {
        if (purchase.getProductId() == null || purchase.getProductId().trim().isEmpty()) {
            Logger.warning("Purchase missing required field: productId");
            return false;
        }

        if (purchase.getProductName() == null || purchase.getProductName().trim().isEmpty()) {
            Logger.warning("Purchase missing required field: productName");
            return false;
        }

        if (purchase.getPrice() <= 0) {
            Logger.warning("Purchase has invalid price: " + purchase.getPrice());
            return false;
        }

        if (purchase.getActions() == null) {
            Logger.warning("Purchase missing field: actions, you'll have to listen for this in your plugin!");
        }

        return true;
    }

    /**
     * Gets the list of all loaded ConfiguredPlexPurchasesObject instances
     *
     * @return List of ConfiguredPlexPurchasesObject instances
     */
    public List<ConfiguredPlexPurchasesObject> getConfiguredPurchases() {
        return new ArrayList<>(this.purchases);
    }

    /**
     * Gets a specific purchase by its product ID
     *
     * @param productId The product ID to search for
     * @return Optional containing the purchase if found, empty otherwise
     */
    public Optional<ConfiguredPlexPurchasesObject> getConfigById(final String productId) {
        return this.purchases.stream()
                .filter(purchase -> productId.equals(purchase.getProductId()))
                .findFirst();
    }

    /**
     * Gets the number of loaded purchases
     *
     * @return The number of purchases
     */
    public int getConfiguredPurchaseCount() {
        return this.purchases.size();
    }

} 