package net.plexprison.plexpurchases;

import lombok.Getter;
import net.plexprison.plexpurchases.config.holder.ConfiguredPlexPurchasesObjectHolder;
import net.plexprison.plexpurchases.utils.Logger;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.plugin.java.JavaPlugin;

@Getter
public class PlexPurchases extends JavaPlugin implements Listener {

    /**
     * -- GETTER --
     * Gets the purchases holder instance
     */
    private ConfiguredPlexPurchasesObjectHolder purchasesHolder;

    @Override
    public void onEnable() {
        // Initialize the logger with this plugin instance
        Logger.initialize(this);

        Logger.success("Plugin initialization started");

        try {
            // Register events
            this.getServer().getPluginManager().registerEvents(this, this);
            Logger.info("Event listeners registered successfully");

            // Initialize and load purchase configurations
            this.purchasesHolder = new ConfiguredPlexPurchasesObjectHolder(this);
            this.purchasesHolder.loadPurchases();
            Logger.info("Purchase configurations loaded successfully");

            Logger.success("Plugin has been enabled successfully!");

        } catch (final Exception e) {
            Logger.error("Failed to enable plugin: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void onDisable() {
        Logger.warning("Plugin shutdown initiated");

        try {
            // Cleanup tasks can go here
            Logger.info("Plugin cleanup completed");
            Logger.warning("Plugin has been disabled successfully!");

        } catch (final Exception e) {
            Logger.error("Error during plugin shutdown: " + e.getMessage());
        }
    }

    @EventHandler
    public void onPlayerJoin(final PlayerJoinEvent event) {
        final String playerName = event.getPlayer().getName();

        // Send welcome message to player using configuration
        Logger.debug("Player joined: " + playerName);
        Logger.info("Player " + playerName + " joined the server");

        // Log the number of loaded purchases for debugging
        if (this.purchasesHolder != null) {
            Logger.debug("Player " + playerName + " joined. Total purchases loaded: " + this.purchasesHolder.getConfiguredPurchaseCount());
        }
    }

}