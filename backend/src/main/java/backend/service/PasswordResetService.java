package backend.service;

import backend.dto.AccountDtos.ResetPasswordRequest;
import backend.entity.PasswordResetToken;
import backend.entity.User;
import backend.repository.PasswordResetTokenRepository;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final String INVALID = "Invalid or expired reset link";

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final SecureRandom random = new SecureRandom();

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${app.reset-token-minutes}")
    private long tokenMinutes;

    @Transactional
    public void requestReset(String rawEmail) {
        // Same response whether or not the email exists, so accounts cannot be probed.
        userRepository.findByEmail(rawEmail.trim().toLowerCase()).ifPresent(user -> {
            tokenRepository.deleteByUserId(user.getId());

            byte[] bytes = new byte[32];
            random.nextBytes(bytes);
            String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

            PasswordResetToken entity = new PasswordResetToken();
            entity.setTokenHash(hash(token));
            entity.setUserId(user.getId());
            entity.setExpiresAt(Instant.now().plus(tokenMinutes, ChronoUnit.MINUTES));
            tokenRepository.save(entity);

            mailService.sendResetLink(user.getEmail(), frontendUrl + "/reset-password?token=" + token);
        });
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        if (!req.newPassword().equals(req.confirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password and confirmation do not match");
        }
        PasswordResetToken token = tokenRepository.findByTokenHash(hash(req.token()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID));
        if (token.isUsed() || token.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID);
        }
        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, INVALID));

        user.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        userRepository.save(user);
        token.setUsed(true);
        tokenRepository.save(token);
    }

    private String hash(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}