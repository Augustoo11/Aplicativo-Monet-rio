// ===================================================
// controllers/UsuarioController.java — ESTILO UNINASSAU
// ===================================================
package com.Projeto.GestorFin.controllers;

import com.Projeto.GestorFin.entities.Usuario;
import com.Projeto.GestorFin.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController  // ← sem @RequestMapping na classe, igual à professora
public class UsuarioController {

    @Autowired
    UsuarioRepository usuarioRepository; // ← professora não usa private aqui

    // POST /usuarios → Cria usuário
    @PostMapping("/usuarios")
    public String saveUsuario(@RequestBody Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            return "Erro: já existe um usuário com este email.";
        }
        usuarioRepository.save(usuario);
        return "Usuário salvo com sucesso!";
    }

    // POST /usuarios/login → Login
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

    // GET /usuarios → Lista todos
    @GetMapping("/usuarios")
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    // GET /usuarios/{id} → Busca por ID
    @GetMapping("/usuarios/{id}")
    public Optional<Usuario> getUsuarioById(@PathVariable String id) {
        return usuarioRepository.findById(id);
    }

    // PUT /usuarios/{id} → Atualiza
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

    // DELETE /usuarios/{id} → Remove
    @DeleteMapping("/usuarios/{id}")
    public String deleteUsuario(@PathVariable String id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return "Usuário deletado com sucesso!";
        }
        return "Usuário não encontrado!";
    }
}