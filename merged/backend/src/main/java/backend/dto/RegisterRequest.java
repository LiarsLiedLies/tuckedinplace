package backend.dto;

import backend.entity.Role;
import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank(message = "Name is required") @Size(max = 100) String name,
        @NotBlank(message = "Email is required") @Email(message = "Invalid email format") @Size(max = 150) String email,
        @NotBlank(message = "Password is required") @Size(min = 8, max = 100, message = "Password must be at least 8 characters") String password,
        @NotNull(message = "Role is required") Role role
) {}