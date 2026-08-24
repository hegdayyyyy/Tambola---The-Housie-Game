package com.tambola.housie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TambolaApplication {

    public static void main(String[] args) {
        SpringApplication.run(TambolaApplication.class, args);
    }
}
