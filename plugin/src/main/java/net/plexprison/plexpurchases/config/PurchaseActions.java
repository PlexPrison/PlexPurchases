package net.plexprison.plexpurchases.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseActions {
    private List<String> success;
    private List<String> expire;
    private List<String> renew;
} 