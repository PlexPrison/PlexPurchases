package net.plexprison.plexpurchases.utils;

import org.bukkit.ChatColor;
import org.bukkit.plugin.Plugin;

/**
 * Utility class for logging messages with different levels
 * Uses plugin-specific logger for better contextual information
 */
public class Logger {
    
    private static Plugin plugin;
    
    /**
     * Initialize the logger with the plugin instance
     *
     * @param pluginInstance The plugin instance
     */
    public static void initialize(final Plugin pluginInstance) {
        plugin = pluginInstance;
    }
    
    /**
     * Log an INFO level message
     *
     * @param message The message to log
     */
    public static void info(final String message) {
        if (plugin != null) {
            plugin.getLogger().info(message);
        }
    }
    
    /**
     * Log a WARNING level message
     *
     * @param message The message to log
     */
    public static void warning(final String message) {
        if (plugin != null) {
            plugin.getLogger().warning(message);
        }
    }
    
    /**
     * Log an ERROR level message
     *
     * @param message The message to log
     */
    public static void error(final String message) {
        if (plugin != null) {
            plugin.getLogger().severe(message);
        }
    }
    
    /**
     * Log a DEBUG level message (only if debug is enabled)
     *
     * @param message The message to log
     */
    public static void debug(final String message) {
        if (plugin != null) {
            plugin.getLogger().info("[DEBUG] " + message);
        }
    }
    
    /**
     * Log a SUCCESS level message (green colored in console)
     *
     * @param message The message to log
     */
    public static void success(final String message) {
        if (plugin != null) {
            plugin.getLogger().info(ChatColor.GREEN + message + ChatColor.RESET);
        }
    }
    
    /**
     * Log a formatted message with parameters
     *
     * @param level   The log level (INFO, WARNING, ERROR, DEBUG, SUCCESS)
     * @param message The message to log
     * @param args    The arguments to format into the message
     */
    public static void log(final String level, final String message, final Object... args) {
        final String formattedMessage = String.format(message, args);
        switch (level.toUpperCase()) {
            case "WARNING":
                Logger.warning(formattedMessage);
                break;
            case "ERROR":
                Logger.error(formattedMessage);
                break;
            case "DEBUG":
                Logger.debug(formattedMessage);
                break;
            case "SUCCESS":
                Logger.success(formattedMessage);
                break;
            default:
                Logger.info(formattedMessage);
                break;
        }
    }
} 