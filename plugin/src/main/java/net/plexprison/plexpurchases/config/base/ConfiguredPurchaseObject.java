package net.plexprison.plexpurchases.config.base;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConfiguredPurchaseObject {

    // mineplex options
    private String productId;
    private String productName;
    private String productDescription;
    private long price;
    private DeliveryType callbackDelivery;
    private boolean repeatablePurchase;

    // subscription options
    private String subscriptionId;
    private String subscriptionName;
    private String subscriptionDescription;
    private SubscriptionFrequency subscriptionBasis;

    // extended options

}