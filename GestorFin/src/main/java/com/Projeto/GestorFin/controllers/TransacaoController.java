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
import java.util.UUID;

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
    //
    // JSON de entrada esperado:
    // {
    //   "usuario":   { "id": "uuid-do-usuario" },
    //   "categoria": { "id": 1 },
    //   "tipo":      "despesa",
    //   "valor":     150.00,
    //   "descricao": "Almoço no restaurante",
    //   "data":      "2025-05-10"
    // }
    // -------------------------------------------------------
    @PostMapping
    public ResponseEntity<String> criarTransacao(@RequestBody Transacao transacao) {

        // Validação: usuário é obrigatório
        if (transacao.getUsuario() == null || transacao.getUsuario().getId() == null) {
            return ResponseEntity.badRequest().body("Erro: informe o id do usuário.");
        }

        // Validação: categoria é obrigatória
        if (transacao.getCategoria() == null || transacao.getCategoria().getId() == null) {
            return ResponseEntity.badRequest().body("Erro: informe o id da categoria.");
        }

        // Validação: tipo deve ser 'receita' ou 'despesa'
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
    public ResponseEntity<List<Transacao>> listarPorUsuario(@PathVariable UUID usuarioId) {

        if (!usuarioRepository.existsById(usuarioId)) {
            return ResponseEntity.notFound().build();
        }

        List<Transacao> transacoes = transacaoRepository.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(transacoes);
    }

    // -------------------------------------------------------
    // GET /transacoes/usuario/{usuarioId}/tipo/{tipo}
    // Lista transações de um usuário filtradas por tipo
    // Ex: GET /transacoes/usuario/uuid-aqui/tipo/despesa
    // -------------------------------------------------------
    @GetMapping("/usuario/{usuarioId}/tipo/{tipo}")
    public ResponseEntity<List<Transacao>> listarPorUsuarioETipo(
            @PathVariable UUID usuarioId,
            @PathVariable String tipo) {

        if (!usuarioRepository.existsById(usuarioId)) {
            return ResponseEntity.notFound().build();
        }

        List<Transacao> transacoes = transacaoRepository.findByUsuarioIdAndTipo(usuarioId, tipo);
        return ResponseEntity.ok(transacoes);
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
    public ResponseEntity<String> atualizarTransacao(@PathVariable Long id, @RequestBody Transacao transacaoAtualizada) {

        return transacaoRepository.findById(id)
                .map(transacao -> {
                    transacao.setTipo(transacaoAtualizada.getTipo());
                    transacao.setValor(transacaoAtualizada.getValor());
                    transacao.setDescricao(transacaoAtualizada.getDescricao());
                    transacao.setData(transacaoAtualizada.getData());

                    // Atualiza categoria se foi informada
                    if (transacaoAtualizada.getCategoria() != null) {
                        transacao.setCategoria(transacaoAtualizada.getCategoria());
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
