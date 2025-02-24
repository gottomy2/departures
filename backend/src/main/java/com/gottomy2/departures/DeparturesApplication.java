package com.gottomy2.departures;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class DeparturesApplication {

	public static void main(String[] args) {
		SpringApplication.run(DeparturesApplication.class, args);
	}

}
