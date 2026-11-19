package backend.dto;

import backend.entity.Role;

public record UserResponse(Long id, String name, String email, Role role) {}