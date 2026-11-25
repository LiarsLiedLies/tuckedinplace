package backend.controller;

import backend.dto.AccountDtos.*;
import backend.service.PasswordResetService;
import backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AccountController {

    private final ProfileService profileService;
    private final PasswordResetService resetService;

    // The profile is always the logged-in user's own: there is no id in the URL to tamper with.
    @GetMapping("/api/profile")
    public ProfileResponse getProfile(Authentication auth) {
        return profileService.getProfile(auth.getName());
    }

    @PutMapping("/api/profile")
    public ProfileResponse updateProfile(Authentication auth, @Valid @RequestBody UpdateProfileRequest req) {
        return profileService.updateProfile(auth.getName(), req);
    }

    @PostMapping("/api/profile/change-password")
    public Map<String, String> changePassword(Authentication auth, @Valid @RequestBody ChangePasswordRequest req) {
        profileService.changePassword(auth.getName(), req);
        return Map.of("message", "Password changed successfully");
    }

    @PostMapping("/api/auth/forgot-password")
    public Map<String, String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        resetService.requestReset(req.email());
        return Map.of("message", "If that email is registered, a reset link has been sent.");
    }

    @PostMapping("/api/auth/reset-password")
    public Map<String, String> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        resetService.resetPassword(req);
        return Map.of("message", "Password reset successfully. You can now log in.");
    }
}