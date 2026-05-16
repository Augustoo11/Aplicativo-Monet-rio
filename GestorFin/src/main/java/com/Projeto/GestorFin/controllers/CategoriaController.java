// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/controllers/CategoriaController.java
// PASTA:   controllers
// ===================================================

package com.Projeto.GestorFin.controllers;

import com.Projeto.GestorFin.entities.Categoria;
import com.Projeto.GestorFin.entities.Usuario;
import com.Projeto.GestorFin.repositories.CategoriaRepository;
import com.Projeto.GestorFin.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    // Injeta os dois repositories que precisamos
    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // -------------------------------------------------------
    // POST /categorias → Cria uma nova categoria
    //
    // COMO FUNCIONA O JSON DE ENTRADA:
    // {
    //   "usuario": { "id": "uuid-do-usuario" },
    //   "nome": "Alimentação",
    //   "tipo": "despesa",
    //   "cor": "#FF5733",
    //   "padrao": false
    // }
    // -------------------------------------------------------
    @PostMapping
    public ResponseEntity<String> criarCategoria(@RequestBody Categoria categoria) {

        // Validação: o campo "usuario" precisa ter um ID válido
        if (categoria.getUsuario() == null || categoria.getUsuario().getId() == null) {
            // 400 Bad Request → "o que você enviou está errado ou incompleto"
            return ResponseEntity.badRequest().body("Erro: informe o id do usuário.");
        }

        // Validação: o tipo deve ser 'receita' ou 'despesa'
        String tipo = categoria.getTipo();
        if (tipo == null || (!tipo.equals("receita") && !tipo.equals("despesa"))) {
            return ResponseEntity.badRequest().body("Erro: tipo deve ser 'receita' ou 'despesa'.");
        }

        // Verifica se o usuário existe no banco antes de criar a categoria
        UUID usuarioId = categoria.getUsuario().getId();
        if (!usuarioRepository.existsById(usuarioId)) {
            // 404 Not Found → usuário não foi encontrado
            return ResponseEntity.status(404).body("Erro: usuário não encontrado.");
        }

        // Salva a categoria no banco
        categoriaRepository.save(categoria);
        return ResponseEntity.status(201).body("Categoria criada com sucesso!");
    }

    // -------------------------------------------------------
    // GET /categorias → Lista todas as categorias
    // -------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Categoria>> listarCategorias() {
        return ResponseEntity.ok(categoriaRepository.findAll());
    }

    // -------------------------------------------------------
    // GET /categorias/usuario/{usuarioId} → Lista categorias de um usuário específico
    // -------------------------------------------------------
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Categoria>> listarPorUsuario(@PathVariable UUID usuarioId) {

        // Verifica se o usuário existe
        if (!usuarioRepository.existsById(usuarioId)) {
            return ResponseEntity.notFound().build();
        }

        List<Categoria> categorias = categoriaRepository.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(categorias);
    }

    // -------------------------------------------------------
    // PUT /categorias/{id} → Atualiza uma categoria
    // -------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<String> atualizarCategoria(@PathVariable Long id, @RequestBody Categoria categoriaAtualizada) {

        return categoriaRepository.findById(id)
                .map(categoria -> {
                    categoria.setNome(categoriaAtualizada.getNome());
                    categoria.setTipo(categoriaAtualizada.getTipo());
                    categoria.setCor(categoriaAtualizada.getCor());
                    categoria.setPadrao(categoriaAtualizada.getPadrao());
                    categoriaRepository.save(categoria);
                    return ResponseEntity.ok("Categoria atualizada com sucesso!");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------
    // DELETE /categorias/{id} → Remove uma categoria
    // -------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCategoria(@PathVariable Long id) {
        if (categoriaRepository.existsById(id)) {
            categoriaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
