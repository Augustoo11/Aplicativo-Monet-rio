// ===================================================
// controllers/UsuarioController.java — ESTILO UNINASSAU
// ===================================================
package com.Projeto.GestorFin.controllers;

import com.Projeto.GestorFin.entities.Usuario;
import com.Projeto.GestorFin.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController  
public class UsuarioController {

    @Autowired
    UsuarioRepository usuarioRepository; 

    @PostMapping("/usuarios")
    public ResponseEntity<String> saveUsuario(@RequestBody Usuario usuario) {

      
        if (usuario.getNome() == null || usuario.getNome().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro: informe o nome.");
        }
        if (usuario.getEmail() == null || usuario.getEmail().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro: informe o e-mail.");
        }
        if (usuario.getSenha() == null || usuario.getSenha().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro: informe a senha.");
        }

        
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Erro: já existe um usuário com este email.");
        }

        try {
            usuarioRepository.save(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuário salvo com sucesso!");
        } catch (Exception e) {
            // Imprime o erro completo no console do backend (Codespace) para debug
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao salvar usuário: " + e.getMessage());
        }
    }

   
    @PostMapping("/usuarios/login")
    public Object fazerLogin(@RequestBody Map<String, String> credenciais) {
        String email = credenciais.get("email");
        String senha = credenciais.get("senha");

        Optional<Usuario> encontrado = usuarioRepository.findByEmail(email);
        if (encontrado.isEmpty() || !encontrado.get().getSenha().equals(senha)) {
            return "E-mail ou senha inválidos.";
        }

        Usuario usuario = encontrado.get();
        Map<String, String> resposta = new HashMap<>();
        resposta.put("id",    usuario.getId());
        resposta.put("nome",  usuario.getNome());
        resposta.put("email", usuario.getEmail());
        return resposta;
    }

   
    @GetMapping("/usuarios")
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

   
    @GetMapping("/usuarios/{id}")
    public Optional<Usuario> getUsuarioById(@PathVariable String id) {
        return usuarioRepository.findById(id);
    }

    
    @PutMapping("/usuarios/{id}")
    public String updateUsuario(@PathVariable String id, @RequestBody Usuario usuario) {
        return usuarioRepository.findById(id).map(existente -> {
            existente.setNome(usuario.getNome());
            existente.setEmail(usuario.getEmail());
            existente.setSenha(usuario.getSenha());
            usuarioRepository.save(existente);
            return "Usuário atualizado com sucesso!";
        }).orElse("Usuário não encontrado!");
    }

    
    @DeleteMapping("/usuarios/{id}")
    public String deleteUsuario(@PathVariable String id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return "Usuário deletado com sucesso!";
        }
        return "Usuário não encontrado!";
    }
}