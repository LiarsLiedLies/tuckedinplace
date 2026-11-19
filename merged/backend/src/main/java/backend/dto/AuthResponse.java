package backend.dto;

import backend.entity.Role;

public record AuthResponse(String token, Long id, String name, String email, Role role) {}