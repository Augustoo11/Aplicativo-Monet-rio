// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/controllers/TransacaoController.java
// PASTA:   controllers
// ===================================================

package com.Projeto.GestorFin.controllers;

import com.Projeto.GestorFin.entities.Transacao;
import com.Projeto.GestorFin.repositories.CategoriaRepository;
import com.Projeto.GestorFin.repositories.TransacaoRepository;
import com.Projeto.GestorFin.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transacoes")
public class TransacaoController {

    @Autowired
    private TransacaoRepository transacaoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    // -------------------------------------------------------
    // POST /transacoes → Cria uma nova transação
    // JSON esperado:
    // {
    //   "usuario":   { "id": "id-do-usuario" },
    //   "categoria": { "id": 1 },
    //   "tipo":      "despesa",
    //   "valor":     150.00,
    //   "descricao": "Almoço",
    //   "data":      "2025-05-10"
    // }
    // -------------------------------------------------------
    @PostMapping
    public ResponseEntity<String> criarTransacao(@RequestBody Transacao transacao) {

        // Usuário é obrigatório
        if (transacao.getUsuario() == null || transacao.getUsuario().getId() == null) {
            return ResponseEntity.badRequest().body("Erro: informe o id do usuário.");
        }

        // Categoria é obrigatória
        if (transacao.getCategoria() == null || transacao.getCategoria().getId() == null) {
            return ResponseEntity.badRequest().body("Erro: informe o id da categoria.");
        }

        // Tipo deve ser "receita" ou "despesa"
        String tipo = transacao.getTipo();
        if (tipo == null || (!tipo.equals("receita") && !tipo.equals("despesa"))) {
            return ResponseEntity.badRequest().body("Erro: tipo deve ser 'receita' ou 'despesa'.");
        }

        // Verifica se o usuário existe
        if (!usuarioRepository.existsById(transacao.getUsuario().getId())) {
            return ResponseEntity.status(404).body("Erro: usuário não encontrado.");
        }

        // Verifica se a categoria existe
        if (!categoriaRepository.existsById(transacao.getCategoria().getId())) {
            return ResponseEntity.status(404).body("Erro: categoria não encontrada.");
        }

        transacaoRepository.save(transacao);
        return ResponseEntity.status(201).body("Transação criada com sucesso!");
    }

    // -------------------------------------------------------
    // GET /transacoes → Lista todas as transações
    // -------------------------------------------------------
    @GetMapping
    public ResponseEntity<List<Transacao>> listarTransacoes() {
        return ResponseEntity.ok(transacaoRepository.findAll());
    }

    // -------------------------------------------------------
    // GET /transacoes/usuario/{usuarioId} → Lista transações de um usuário
    // -------------------------------------------------------
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Transacao>> listarPorUsuario(@PathVariable String usuarioId) {

        if (!usuarioRepository.existsById(usuarioId)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(transacaoRepository.findByUsuarioId(usuarioId));
    }

    // -------------------------------------------------------
    // GET /transacoes/usuario/{usuarioId}/tipo/{tipo}
    // Filtra transações por tipo: "receita" ou "despesa"
    // -------------------------------------------------------
    @GetMapping("/usuario/{usuarioId}/tipo/{tipo}")
    public ResponseEntity<List<Transacao>> listarPorTipo(
            @PathVariable String usuarioId,
            @PathVariable String tipo) {

        if (!usuarioRepository.existsById(usuarioId)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(transacaoRepository.findByUsuarioIdAndTipo(usuarioId, tipo));
    }

    // -------------------------------------------------------
    // GET /transacoes/{id} → Busca uma transação pelo ID
    // -------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Transacao> buscarPorId(@PathVariable Long id) {
        return transacaoRepository.findById(id)
                .map(transacao -> ResponseEntity.ok(transacao))
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------
    // PUT /transacoes/{id} → Atualiza uma transação
    // -------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<String> atualizarTransacao(@PathVariable Long id, @RequestBody Transacao atualizada) {
        return transacaoRepository.findById(id)
                .map(transacao -> {
                    transacao.setTipo(atualizada.getTipo());
                    transacao.setValor(atualizada.getValor());
                    transacao.setDescricao(atualizada.getDescricao());
                    transacao.setData(atualizada.getData());
                    if (atualizada.getCategoria() != null) {
                        transacao.setCategoria(atualizada.getCategoria());
                    }
                    transacaoRepository.save(transacao);
                    return ResponseEntity.ok("Transação atualizada com sucesso!");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------
    // DELETE /transacoes/{id} → Remove uma transação
    // -------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarTransacao(@PathVariable Long id) {
        if (transacaoRepository.existsById(id)) {
            transacaoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}