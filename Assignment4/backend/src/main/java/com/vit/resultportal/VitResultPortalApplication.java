package com.vit.resultportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VitResultPortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(VitResultPortalApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" VIT Semester Result Portal is successfully running!");
        System.out.println(" URL: http://localhost:8080");
        System.out.println(" API: http://localhost:8080/api/results");
        System.out.println("=================================================");
    }
}
