package com.backend.backend.controller;

import com.backend.backend.config.JwtToken;
import com.backend.backend.model.User;
import com.backend.backend.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Component
public class AuthMiddleware extends OncePerRequestFilter {

    private final JwtToken jwtToken;
    private final UserService userService;

    @Autowired
    public AuthMiddleware(JwtToken jwtToken,@Lazy UserService userService) {
        this.jwtToken = jwtToken;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();

        // Bỏ qua middleware cho các endpoint không cần xác thực
        if (requestURI.startsWith("/api/auth/register") || requestURI.startsWith("/api/auth/logout") || requestURI.startsWith("/api/auth/login")) {
            filterChain.doFilter(request, response); // Bỏ qua middleware
            return;
        }

        String token = null;

        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("jwt")) {
                    token = cookie.getValue();
                    break;
                }
            }
        }

        if (token == null) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("Unauthorized - No Token Provided");
            return;
        }

        try {
            var claims = jwtToken.validateToken(token);
            String userEmail = claims.getSubject();
            User user = userService.findByEmail(userEmail);

            if (user == null) {
                response.setStatus(HttpStatus.NOT_FOUND.value());
                response.getWriter().write("User not found");
                return;
            }

            request.setAttribute("user", user);
        } catch (Exception e) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("Unauthorized - Invalid Token");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
