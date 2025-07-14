package net.plexprison.plexpurchases.config;

import lombok.Data;
import lombok.EqualsAndHashCode;
import net.plexprison.plexpurchases.config.base.ConfiguredPurchaseObject;
import org.bukkit.Material;

@EqualsAndHashCode(callSuper = true)
@Data
public class ConfiguredPlexPurchasesObject extends ConfiguredPurchaseObject {

    private PurchaseActions actions;
    private String dependency;
    private int dependencyAmount;
    private boolean hideIfNoPermission;
    private Material displayItem;
    private int amount;
    private String permission;

    /**
     * Checks if this purchase is limited by times a player can purchase it
     *
     * @return true if the permission contains the <purchase_times> variable
     */
    public boolean isLimitedByTimes() {
        return this.permission != null && this.permission.contains("<purchase_times>");
    }

}
