package com.Projeto.GestorFin.controllers;

import com.Projeto.GestorFin.entities.Categoria;
import com.Projeto.GestorFin.repositories.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// -------------------------------------------------------
// ATENÇÃO: UsuarioRepository removido temporariamente
// pois a coluna usuario_id ainda não existe no banco.
// Quando o banco adicionar a coluna, restaurar:
//   1. import UsuarioRepository
//   2. @Autowired UsuarioRepository usuarioRepository
//   3. Validações de usuário no saveCategoria()
//   4. Endpoint getCategoriasByUsuario()
// -------------------------------------------------------
@RestController
public class CategoriaController {

    @Autowired
    CategoriaRepository categoriaRepository;

    // POST /categorias → Cria uma categoria
    @PostMapping("/categorias")
    public String saveCategoria(@RequestBody Categoria categoria) {

        // Valida o tipo
        String tipo = categoria.getTipo();
        if (tipo == null || (!tipo.equals("receita") && !tipo.equals("despesa"))) {
            return "Erro: tipo deve ser 'receita' ou 'despesa'.";
        }

        categoriaRepository.save(categoria);
        return "Categoria salva com sucesso!";
    }

    // GET /categorias → Lista todas as categorias
    @GetMapping("/categorias")
    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    // GET /categorias/{id} → Busca categoria por ID
    @GetMapping("/categorias/{id}")
    public Optional<Categoria> getCategoriaById(@PathVariable Long id) {
        return categoriaRepository.findById(id);
    }

    // PUT /categorias/{id} → Atualiza uma categoria
    @PutMapping("/categorias/{id}")
    public String updateCategoria(@PathVariable Long id, @RequestBody Categoria categoria) {
        return categoriaRepository.findById(id).map(existente -> {
            existente.setNome(categoria.getNome());
            existente.setTipo(categoria.getTipo());
            existente.setCor(categoria.getCor());
            existente.setPadrao(categoria.getPadrao());
            categoriaRepository.save(existente);
            return "Categoria atualizada com sucesso!";
        }).orElse("Categoria não encontrada!");
    }

    // DELETE /categorias/{id} → Remove uma categoria
    @DeleteMapping("/categorias/{id}")
    public String deleteCategoria(@PathVariable Long id) {
        if (categoriaRepository.existsById(id)) {
            categoriaRepository.deleteById(id);
            return "Categoria deletada com sucesso!";
        }
        return "Categoria não encontrada!";
    }
}