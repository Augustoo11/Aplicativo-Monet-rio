// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/controllers/UsuarioController.java
// PASTA:   controllers
// ===================================================

package com.Projeto.GestorFin.controllers;

import com.Projeto.GestorFin.entities.Usuario;
import com.Projeto.GestorFin.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

// @RestController → esta classe recebe requisições HTTP e retorna JSON
// @RequestMapping → todas as rotas aqui começam com /usuarios
@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    // O Spring injeta o repository automaticamente (não precisa criar manualmente)
    @Autowired
    private UsuarioRepository usuarioRepository;

    // -------------------------------------------------------
    // POST /usuarios → Cria um novo usuário
    // JSON esperado: { "nome": "João", "email": "j@j.com", "senha": "123" }
    // -------------------------------------------------------
    @PostMapping
    public ResponseEntity<String> criarUsuario(@RequestBody Usuario usuario) {

        // Verifica se o email já está cadastrado
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            return ResponseEntity.status(409).body("Erro: já existe um usuário com este email.");
        }

        usuarioRepository.save(usuario); // salva no banco
        return ResponseEntity.status(201).body("Usuário criado com sucesso!");
    }

    // -------------------------------------------------------
    // POST /usuarios/login → Faz o login
    // JSON esperado: { "email": "j@j.com", "senha": "123" }
    // -------------------------------------------------------
    @PostMapping("/login")
    public ResponseEntity<?> fazerLogin(@RequestBody Map<String, String> credenciais) {

        String email = credenciais.get("email");
        String senha = credenciais.get("senha");

        // Campos obrigatórios
        if (email == null || senha == null) {
            return ResponseEntity.badRequest().body("Informe email e senha.");
        }

        // Busca o usuário pelo email
        Optional<Usuario> usuarioEncontrado = usuarioRepository.findByEmail(email);

        // Não encontrou → acesso negado
        if (usuarioEncontrado.isEmpty()) {
            return ResponseEntity.status(401).body("E-mail ou senha inválidos.");
        }

        Usuario usuario = usuarioEncontrado.get();

        // Compara a senha
        if (!usuario.getSenha().equals(senha)) {
            return ResponseEntity.status(401).body("E-mail ou senha inválidos.");
        }

        // Login correto → retorna os dados do usuário
        Map<String, String> resposta = new HashMap<>();
        resposta.put("id",    usuario.getId());
        resposta.put("nome",  usuario.getNome());
        resposta.put("email", usuario.getEmail());

        return ResponseEntity.ok(resposta);
    }

    // -------------------------------------------------------
    // GET /usuarios → Lista todos os usuários
    // -------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    // -------------------------------------------------------
    // GET /usuarios/{id} → Busca um usuário pelo ID
    // -------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable String id) {
        return usuarioRepository.findById(id)
                .map(usuario -> ResponseEntity.ok(usuario))
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------
    // PUT /usuarios/{id} → Atualiza um usuário
    // -------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<String> atualizarUsuario(@PathVariable String id, @RequestBody Usuario atualizado) {
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    usuario.setNome(atualizado.getNome());
                    usuario.setEmail(atualizado.getEmail());
                    usuario.setSenha(atualizado.getSenha());
                    usuarioRepository.save(usuario);
                    return ResponseEntity.ok("Usuário atualizado com sucesso!");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------
    // DELETE /usuarios/{id} → Remove um usuário
    // -------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable String id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 = deletado com sucesso
        }
        return ResponseEntity.notFound().build(); // 404 = não encontrado
    }
}