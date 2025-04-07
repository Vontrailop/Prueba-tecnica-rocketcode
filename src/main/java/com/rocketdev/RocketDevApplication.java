package com.rocketdev;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.mybatis.spring.annotation.MapperScan;

@SpringBootApplication
@MapperScan("com.rocketdev.mapper")
public class RocketDevApplication {
    public static void main(String[] args) {
        SpringApplication.run(RocketDevApplication.class, args);
    }
}