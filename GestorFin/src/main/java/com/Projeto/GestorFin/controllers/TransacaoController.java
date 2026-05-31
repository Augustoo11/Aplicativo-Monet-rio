package com.Projeto.GestorFin.controllers;

import com.Projeto.GestorFin.entities.Transacao;
import com.Projeto.GestorFin.repositories.CategoriaRepository;
import com.Projeto.GestorFin.repositories.TransacaoRepository;
import com.Projeto.GestorFin.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class TransacaoController {

    @Autowired
    TransacaoRepository transacaoRepository;

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    CategoriaRepository categoriaRepository;

    // POST /transacoes → Cria uma transação
    @PostMapping("/transacoes")
    public String saveTransacao(@RequestBody Transacao transacao) {

        if (transacao.getUsuario() == null || transacao.getUsuario().getId() == null) {
            return "Erro: informe o id do usuário.";
        }

        if (transacao.getCategoria() == null || transacao.getCategoria().getId() == null) {
            return "Erro: informe o id da categoria.";
        }

        String tipo = transacao.getTipo();
        if (tipo == null || (!tipo.equals("receita") && !tipo.equals("despesa"))) {
            return "Erro: tipo deve ser 'receita' ou 'despesa'.";
        }

        if (!usuarioRepository.existsById(transacao.getUsuario().getId())) {
            return "Erro: usuário não encontrado.";
        }

        if (!categoriaRepository.existsById(transacao.getCategoria().getId())) {
            return "Erro: categoria não encontrada.";
        }

        transacaoRepository.save(transacao);
        return "Transação salva com sucesso!";
    }

    // GET /transacoes → Lista todas as transações
    @GetMapping("/transacoes")
    public List<Transacao> getAllTransacoes() {
        return transacaoRepository.findAll();
    }

    // GET /transacoes/{id} → Busca transação por ID
    @GetMapping("/transacoes/{id}")
    public Optional<Transacao> getTransacaoById(@PathVariable Long id) {
        return transacaoRepository.findById(id);
    }

    // GET /transacoes/usuario/{usuarioId} → Lista transações de um usuário
    @GetMapping("/transacoes/usuario/{usuarioId}")
    public Object getTransacoesByUsuario(@PathVariable String usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            return "Usuário não encontrado!";
        }
        return transacaoRepository.findByUsuarioId(usuarioId);
    }

    // GET /transacoes/usuario/{usuarioId}/tipo/{tipo} → Filtra por tipo
    @GetMapping("/transacoes/usuario/{usuarioId}/tipo/{tipo}")
    public Object getTransacoesByTipo(@PathVariable String usuarioId, @PathVariable String tipo) {
        if (!usuarioRepository.existsById(usuarioId)) {
            return "Usuário não encontrado!";
        }
        return transacaoRepository.findByUsuarioIdAndTipo(usuarioId, tipo);
    }

    // PUT /transacoes/{id} → Atualiza uma transação
    @PutMapping("/transacoes/{id}")
    public String updateTransacao(@PathVariable Long id, @RequestBody Transacao transacao) {
        return transacaoRepository.findById(id).map(existente -> {
            existente.setTipo(transacao.getTipo());
            existente.setValor(transacao.getValor());
            existente.setDescricao(transacao.getDescricao());
            existente.setData(transacao.getData());
            if (transacao.getCategoria() != null) {
                existente.setCategoria(transacao.getCategoria());
            }
            transacaoRepository.save(existente);
            return "Transação atualizada com sucesso!";
        }).orElse("Transação não encontrada!");
    }

    // DELETE /transacoes/{id} → Remove uma transação
    @DeleteMapping("/transacoes/{id}")
    public String deleteTransacao(@PathVariable Long id) {
        if (transacaoRepository.existsById(id)) {
            transacaoRepository.deleteById(id);
            return "Transação deletada com sucesso!";
        }
        return "Transação não encontrada!";
    }
}