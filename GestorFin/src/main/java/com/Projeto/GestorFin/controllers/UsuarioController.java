// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/controllers/UsuarioController.java
// PASTA:   controllers
// ===================================================

package com.Projeto.GestorFin.controllers;

// Importações necessárias
import com.Projeto.GestorFin.entities.Usuario;
import com.Projeto.GestorFin.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

// -------------------------------------------------------
// @RestController = @Controller + @ResponseBody
// Diz ao Spring: "Esta classe recebe requisições HTTP e
// retorna respostas no formato JSON automaticamente."
// Analogia: é como um garçom que recebe pedidos e traz respostas.
// -------------------------------------------------------
@RestController

// @RequestMapping("/usuarios") define o "prefixo" de todos os endpoints desta classe.
// Todos os métodos abaixo começarão com /usuarios
// Ex: GET /usuarios, POST /usuarios, DELETE /usuarios/123
@RequestMapping("/usuarios")
public class UsuarioController {

    // @Autowired pede ao Spring para injetar (criar e fornecer) o repository.
    // Você NÃO precisa escrever: UsuarioRepository repo = new UsuarioRepository()
    // O Spring faz isso sozinho. Isso se chama "Injeção de Dependência".
    // Analogia: é como pedir para o Spring ser seu assistente e já trazer os materiais.
    @Autowired
    private UsuarioRepository usuarioRepository;

    // -------------------------------------------------------
    // POST /usuarios → Cria um novo usuário
    // @PostMapping → Responde a requisições do tipo POST
    // @RequestBody → Pega o JSON enviado no corpo da requisição e converte para objeto Usuario
    // ResponseEntity<String> → Retorna uma resposta HTTP com status e mensagem
    // -------------------------------------------------------
    @PostMapping
    public ResponseEntity<String> criarUsuario(@RequestBody Usuario usuario) {

        // Verifica se o email já existe no banco antes de salvar
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            // .status(409) → HTTP 409 Conflict = "já existe um conflito com o que você enviou"
            return ResponseEntity.status(409).body("Erro: já existe um usuário com este email.");
        }

        // Salva o usuário no banco de dados
        usuarioRepository.save(usuario);

        // .status(201) → HTTP 201 Created = "criado com sucesso!"
        return ResponseEntity.status(201).body("Usuário criado com sucesso!");
    }

    // -------------------------------------------------------
    // GET /usuarios → Lista todos os usuários
    // @GetMapping → Responde a requisições do tipo GET (buscar dados)
    // ResponseEntity<List<Usuario>> → Retorna uma lista de usuários em JSON
    // -------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        // findAll() busca todos os registros da tabela usuarios
        List<Usuario> usuarios = usuarioRepository.findAll();

        // ResponseEntity.ok() → HTTP 200 = "tudo certo, aqui estão os dados"
        return ResponseEntity.ok(usuarios);
    }

    // -------------------------------------------------------
    // GET /usuarios/{id} → Busca um usuário pelo ID
    // @PathVariable → Pega o valor do {id} que vem na URL
    // Ex: GET /usuarios/550e8400-e29b-41d4-a716-446655440000
    // -------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarUsuarioPorId(@PathVariable UUID id) {

        // findById() retorna um Optional<Usuario>
        // Optional = "pode ter ou não ter um resultado"
        // .map() → se encontrou, executa o código dentro
        // .orElse() → se NÃO encontrou, executa isso
        return usuarioRepository.findById(id)
                .map(usuario -> ResponseEntity.ok(usuario))              // Encontrou → retorna 200 com o usuário
                .orElse(ResponseEntity.notFound().build());              // Não encontrou → retorna 404
    }

    // -------------------------------------------------------
    // PUT /usuarios/{id} → Atualiza um usuário existente
    // @PutMapping("/{id}") → Responde ao PUT com um ID na URL
    // -------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<String> atualizarUsuario(@PathVariable UUID id, @RequestBody Usuario usuarioAtualizado) {

        // Busca o usuário pelo ID, atualiza os campos e salva
        return usuarioRepository.findById(id)
                .map(usuario -> {
                    // Atualiza apenas os campos que podem mudar
                    usuario.setNome(usuarioAtualizado.getNome());
                    usuario.setEmail(usuarioAtualizado.getEmail());
                    usuario.setSenha(usuarioAtualizado.getSenha());

                    // Salva as alterações no banco
                    usuarioRepository.save(usuario);

                    return ResponseEntity.ok("Usuário atualizado com sucesso!");
                })
                .orElse(ResponseEntity.notFound().build()); // 404 se não encontrar
    }

    // -------------------------------------------------------
    // DELETE /usuarios/{id} → Remove um usuário pelo ID
    // @DeleteMapping("/{id}") → Responde ao DELETE com ID na URL
    // -------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable UUID id) {

        // Verifica se o usuário existe antes de tentar deletar
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            // 204 No Content → deletou com sucesso, sem corpo na resposta
            return ResponseEntity.noContent().build();
        }

        // 404 Not Found → não encontrou para deletar
        return ResponseEntity.notFound().build();
    }
}
