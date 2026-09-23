package com.equiprent.service;

import com.equiprent.exception.BadRequestException;
import com.equiprent.exception.ResourceNotFoundException;
import com.equiprent.model.User;
import com.equiprent.model.UserRole;
import com.equiprent.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User userInput) {
        if (userInput.getEmail() == null || userInput.getEmail().trim().isEmpty()) {
            throw new BadRequestException("Email is required");
        }
        if (userInput.getPassword() == null || userInput.getPassword().trim().isEmpty()) {
            throw new BadRequestException("Password is required");
        }
        if (userRepository.existsByEmail(userInput.getEmail())) {
            throw new BadRequestException("User already exists with email: " + userInput.getEmail());
        }

        User user = new User();
        user.setId("user_" + System.currentTimeMillis());
        user.setName(userInput.getName() != null ? userInput.getName() : "User");
        user.setEmail(userInput.getEmail().toLowerCase().trim());
        user.setPassword(userInput.getPassword()); // Plain password for hackathon
        user.setRole(userInput.getRole() != null ? userInput.getRole() : UserRole.CUSTOMER);
        user.setPhone(userInput.getPhone());
        user.setUpiId(userInput.getUpiId());
        user.setUpiQrUrl(userInput.getUpiQrUrl());

        return userRepository.save(user);
    }

    public User login(String email, String password) {
        if (email == null || email.trim().isEmpty()) {
            throw new BadRequestException("Email is required");
        }

        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if (!user.getPassword().equals(password)) {
            throw new BadRequestException("Invalid email or password");
        }

        return user;
    }
}
