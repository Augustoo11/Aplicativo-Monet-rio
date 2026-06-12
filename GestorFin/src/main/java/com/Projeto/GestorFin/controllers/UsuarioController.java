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

@RestController  // ← sem @RequestMapping na classe, igual à professora
public class UsuarioController {

    @Autowired
    UsuarioRepository usuarioRepository; // ← professora não usa private aqui

    // -------------------------------------------------------
    // POST /usuarios → Cria usuário
    // ✅ AJUSTADO: agora retorna o status HTTP correto
    //   - 201 → conta criada com sucesso
    //   - 409 → já existe um usuário com esse e-mail
    //   - 400 → faltou nome, email ou senha
    //   - 500 → erro inesperado ao salvar no banco
    //           (a mensagem real do erro vai no corpo da resposta,
    //            isso ajuda muito a descobrir o que está errado)
    // -------------------------------------------------------
    @PostMapping("/usuarios")
    public ResponseEntity<String> saveUsuario(@RequestBody Usuario usuario) {

        // Validação simples dos campos obrigatórios
        if (usuario.getNome() == null || usuario.getNome().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro: informe o nome.");
        }
        if (usuario.getEmail() == null || usuario.getEmail().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro: informe o e-mail.");
        }
        if (usuario.getSenha() == null || usuario.getSenha().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erro: informe a senha.");
        }

        // Verifica se já existe um usuário com esse e-mail
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Erro: já existe um usuário com este email.");
        }

        // ✅ Tenta salvar e, se der algum erro inesperado no banco,
        //    devolve a mensagem real do erro (em vez de travar com 500 "vazio")
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