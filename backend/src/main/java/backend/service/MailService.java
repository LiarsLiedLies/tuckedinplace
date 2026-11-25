package backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class MailService {

    private final ObjectProvider<JavaMailSender> senderProvider;

    @Value("${spring.mail.username:}")
    private String username;

    @Value("${spring.mail.password:}")
    private String password;

    @Value("${app.mail.from}")
    private String from;

    @Value("${app.reset-token-minutes}")
    private long tokenMinutes;

    public void sendResetLink(String to, String link) {
        JavaMailSender sender = senderProvider.getIfAvailable();
        if (sender == null || username.isBlank() || password.isBlank()) {
            log.warn("Mail is not configured. Password reset link for {}: {}", to, link);
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(from);
            msg.setTo(to);
            msg.setSubject("TuckedinPlace password reset");
            msg.setText("We received a request to reset your TuckedinPlace password.\n\n"
                    + "Open this link to choose a new password (valid for " + tokenMinutes + " minutes, single use):\n"
                    + link + "\n\nIf you did not request this, you can ignore this email.");
            sender.send(msg);
        } catch (Exception e) {
            log.error("Could not send reset email to {}: {}", to, e.getMessage());
            log.warn("Fallback reset link for {}: {}", to, link);
        }
    }
}