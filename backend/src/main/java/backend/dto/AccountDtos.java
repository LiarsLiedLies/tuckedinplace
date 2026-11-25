package backend.dto;

import backend.entity.Role;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public class AccountDtos {

    public record ProfileResponse(Long id, String name, String email, Role role,
                                  String bio, String avatarUrl, LocalDateTime createdAt) {}

    public record UpdateProfileRequest(
            @NotBlank(message = "Name is required")
            @Size(max = 100, message = "Name must be 100 characters or less") String name,
            @Size(max = 500, message = "Bio must be 500 characters or less") String bio,
            @Size(max = 500, message = "Avatar URL is too long")
            @Pattern(regexp = "^$|^https?://\\S+$", message = "Avatar must be a valid http(s) URL") String avatarUrl
    ) {}

    public record ChangePasswordRequest(
            @NotBlank(message = "Current password is required") String currentPassword,
            @NotBlank(message = "New password is required")
            @Size(min = 8, max = 100, message = "New password must be at least 8 characters") String newPassword,
            @NotBlank(message = "Please confirm the new password") String confirmPassword
    ) {}

    public record ForgotPasswordRequest(
            @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email
    ) {}

    public record ResetPasswordRequest(
            @NotBlank(message = "Reset token is required") String token,
            @NotBlank(message = "New password is required")
            @Size(min = 8, max = 100, message = "New password must be at least 8 characters") String newPassword,
            @NotBlank(message = "Please confirm the new password") String confirmPassword
    ) {}
}