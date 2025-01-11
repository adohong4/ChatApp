package com.backend.backend.config;


import com.backend.backend.model.User;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;


import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtToken {

    private final String SECRET_KEY="1TjXchw5FloESb63Kc+DFhTARvpWL4jUGCwfGWxuG5SIf/1y/LgJxHnMqaF6A/ij";
    private static final long VALID_DURATION = 604800;

    //encode Token
    public String generateToken(User user, HttpServletResponse response){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try{
            jwsObject.sign(new MACSigner(SECRET_KEY.getBytes()));
            String token = jwsObject.serialize();

            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)
                    .sameSite("Strict")
                    .maxAge(VALID_DURATION)
                    .path("/")
                    .secure(false)
                    .build();

            response.addHeader("Set-Cookie", cookie.toString());

            return token;
        }catch (JOSEException e){
            throw new RuntimeException(e);
        }
    }

    //decode Token
    public JWTClaimsSet validateToken(String token){
        try{
            JWSObject jwsObject = JWSObject.parse(token);
            JWSVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());

            if(!jwsObject.verify(verifier)){
                throw new JOSEException("Invalid token");
            }

            return JWTClaimsSet.parse(jwsObject.getPayload().toJSONObject());

        }catch (Exception e){
            throw new RuntimeException("Token validation failed: " + e.getMessage());
        }
    }
}
