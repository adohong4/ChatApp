package com.backend.backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary configKey(){
        Map config = new HashMap();
        config.put("cloud_name", "dvxhwv1hg");
        config.put("api_key", "542425413857814");
        config.put("api_secret", "Gt94fI60feVRku1tbdfsoup110g");
        return new Cloudinary(config);
    }
}
