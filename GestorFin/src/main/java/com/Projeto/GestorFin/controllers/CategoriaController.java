// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/controllers/CategoriaController.java
// PASTA:   controllers
// ===================================================

package com.Projeto.GestorFin.controllers;

import com.Projeto.GestorFin.entities.Categoria;
import com.Projeto.GestorFin.repositories.CategoriaRepository;
import com.Projeto.GestorFin.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // -------------------------------------------------------
    // POST /categorias → Cria uma nova categoria
    // JSON esperado:
    // {
    //   "usuario": { "id": "id-do-usuario" },
    //   "nome": "Alimentação",
    //   "tipo": "despesa",
    //   "cor": "#FF5733",
    //   "padrao": false
    // }
    // -------------------------------------------------------
    @PostMapping
    public ResponseEntity<String> criarCategoria(@RequestBody Categoria categoria) {

        // Verifica se o usuário foi informado
        if (categoria.getUsuario() == null || categoria.getUsuario().getId() == null) {
            return ResponseEntity.badRequest().body("Erro: informe o id do usuário.");
        }

        // Verifica se o tipo é válido
        String tipo = categoria.getTipo();
        if (tipo == null || (!tipo.equals("receita") && !tipo.equals("despesa"))) {
            return ResponseEntity.badRequest().body("Erro: tipo deve ser 'receita' ou 'despesa'.");
        }

        // Verifica se o usuário existe no banco
        String usuarioId = categoria.getUsuario().getId();
        if (!usuarioRepository.existsById(usuarioId)) {
            return ResponseEntity.status(404).body("Erro: usuário não encontrado.");
        }

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
    // GET /categorias/usuario/{usuarioId} → Lista categorias de um usuário
    // -------------------------------------------------------
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Categoria>> listarPorUsuario(@PathVariable String usuarioId) {

        if (!usuarioRepository.existsById(usuarioId)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(categoriaRepository.findByUsuarioId(usuarioId));
    }

    // -------------------------------------------------------
    // PUT /categorias/{id} → Atualiza uma categoria
    // -------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<String> atualizarCategoria(@PathVariable Long id, @RequestBody Categoria atualizada) {
        return categoriaRepository.findById(id)
                .map(categoria -> {
                    categoria.setNome(atualizada.getNome());
                    categoria.setTipo(atualizada.getTipo());
                    categoria.setCor(atualizada.getCor());
                    categoria.setPadrao(atualizada.getPadrao());
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