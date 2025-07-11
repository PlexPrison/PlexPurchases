export const DeliveryType = {
  ONLY_WHEN_PLAYER_ONLINE: 'ONLY_WHEN_PLAYER_ONLINE',
  ALLOW_OFFLINE_DELIVERY: 'ALLOW_OFFLINE_DELIVERY'
} as const;

export const SubscriptionFrequency = {
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
  SEMI_YEARLY: 'SEMI_YEARLY',
  YEARLY: 'YEARLY'
} as const;

export type DeliveryType = typeof DeliveryType[keyof typeof DeliveryType];
export type SubscriptionFrequency = typeof SubscriptionFrequency[keyof typeof SubscriptionFrequency];

export interface PurchaseActions {
  success: string[];
  expire: string[];
  renew: string[];
}

export interface ConfiguredPlexPurchasesObject {
  // mineplex options
  productId: string;
  productName: string;
  productDescription: string;
  price: number;
  callbackDelivery: DeliveryType;
  repeatablePurchase: boolean;

  // subscription options
  subscriptionId: string;
  subscriptionName: string;
  subscriptionDescription: string;
  subscriptionBasis: SubscriptionFrequency;

  // plex purchases specific
  actions: PurchaseActions;
  dependency: string;
  permission: string;
} 