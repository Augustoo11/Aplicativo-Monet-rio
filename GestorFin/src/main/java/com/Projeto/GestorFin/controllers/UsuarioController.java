package com.Projeto.GestorFin.controllers;

import com.Projeto.GestorFin.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/teste")
    public String testeConexao() {
        try {
            // O Controller pede para o Repository contar os usuários no banco
            long total = usuarioRepository.count();
            return "Conexão OK! Total de usuários: " + total;
        } catch (Exception e) {
            return "Erro ao conectar no banco: " + e.getMessage();
        }
    }
}