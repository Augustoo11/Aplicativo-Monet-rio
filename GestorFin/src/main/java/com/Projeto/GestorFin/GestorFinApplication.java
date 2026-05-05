package com.Projeto.GestorFin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class GestorFinApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestorFinApplication.class, args);
	}

	@GetMapping("/teste")
	public String teste() {
		return "API funcionando 🚀";
	}
}