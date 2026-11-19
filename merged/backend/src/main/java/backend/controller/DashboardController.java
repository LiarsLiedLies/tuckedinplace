package backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class DashboardController {

    @GetMapping("/api/user/dashboard")
    public Map<String, String> user(Authentication auth) {
        return Map.of("message", "Welcome to the Spot Finder dashboard", "email", auth.getName());
    }

    @GetMapping("/api/owner/dashboard")
    public Map<String, String> owner(Authentication auth) {
        return Map.of("message", "Welcome to the Business Owner dashboard", "email", auth.getName());
    }

    @GetMapping("/api/admin/dashboard")
    public Map<String, String> admin(Authentication auth) {
        return Map.of("message", "Welcome to the Admin dashboard", "email", auth.getName());
    }
}