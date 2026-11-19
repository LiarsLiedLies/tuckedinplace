package backend.config;

import backend.entity.Role;
import backend.entity.User;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String email = "admin@tuckedinplace.com";
        if (!userRepository.existsByEmail(email)) {
            userRepository.save(User.builder()
                    .name("System Admin")
                    .email(email)
                    .passwordHash(passwordEncoder.encode("Admin@12345"))
                    .role(Role.ADMIN)
                    .build());
        }
    }
}