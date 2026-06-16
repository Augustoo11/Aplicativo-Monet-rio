package com.Projeto.GestorFin.controllers;

import com.Projeto.GestorFin.entities.Categoria;
import com.Projeto.GestorFin.repositories.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class CategoriaController {

    @Autowired
    CategoriaRepository categoriaRepository;

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

    @GetMapping("/categorias")
    public List<Categoria> getAllCategorias() {
        return categoriaRepository.findAll();
    }

    @GetMapping("/categorias/{id}")
    public Optional<Categoria> getCategoriaById(@PathVariable String id) {
        return categoriaRepository.findById(id);
    }

    @PutMapping("/categorias/{id}")
    public String updateCategoria(@PathVariable String id, @RequestBody Categoria categoria) {
        return categoriaRepository.findById(id).map(existente -> {
            existente.setNome(categoria.getNome());
            existente.setTipo(categoria.getTipo());
            existente.setCor(categoria.getCor());
            existente.setPadrao(categoria.getPadrao());
            categoriaRepository.save(existente);
            return "Categoria atualizada com sucesso!";
        }).orElse("Categoria não encontrada!");
    }

    @DeleteMapping("/categorias/{id}")
    public String deleteCategoria(@PathVariable String id) {
        if (categoriaRepository.existsById(id)) {
            categoriaRepository.deleteById(id);
            return "Categoria deletada com sucesso!";
        }
        return "Categoria não encontrada!";
    }
}
