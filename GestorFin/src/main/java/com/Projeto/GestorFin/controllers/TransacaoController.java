package com.Projeto.GestorFin.controllers;

import com.Projeto.GestorFin.entities.Meta;
import com.Projeto.GestorFin.entities.Transacao;
import com.Projeto.GestorFin.repositories.CategoriaRepository;
import com.Projeto.GestorFin.repositories.MetaRepository;
import com.Projeto.GestorFin.repositories.TransacaoRepository;
import com.Projeto.GestorFin.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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

    @Autowired
    MetaRepository metaRepository;

    // -------------------------------------------------------
    // POST /transacoes → Cria uma transação
    //
    // JSON esperado (despesa normal):
    // {
    //   "usuario":   { "id": "id-do-usuario" },
    //   "categoria": { "id": "id-da-categoria" },
    //   "tipo":      "despesa",
    //   "valor":     50.00,
    //   "descricao": "Almoço",
    //   "data":      "2026-06-01",
    //   "ehMeta":    false,
    //   "metaId":    null
    // }
    //
    // JSON esperado (despesa de meta):
    // {
    //   "usuario":   { "id": "id-do-usuario" },
    //   "categoria": { "id": "id-da-categoria" },
    //   "tipo":      "despesa",
    //   "valor":     200.00,
    //   "descricao": "Poupança para viagem",
    //   "data":      "2026-06-01",
    //   "ehMeta":    true,
    //   "metaId":    "id-da-meta"
    // }
    //
    // ✅ "id", "categoria.id" e "metaId" agora são Strings (UUID).
    // O "id" da transação é gerado automaticamente pelo código Java.
    // -------------------------------------------------------
    @PostMapping("/transacoes")
    public String saveTransacao(@RequestBody Transacao transacao) {

        // Validação: usuário obrigatório
        if (transacao.getUsuario() == null || transacao.getUsuario().getId() == null) {
            return "Erro: informe o id do usuário.";
        }

        // Validação: categoria obrigatória
        if (transacao.getCategoria() == null || transacao.getCategoria().getId() == null) {
            return "Erro: informe o id da categoria.";
        }

        // Validação: tipo deve ser "receita" ou "despesa"
        String tipo = transacao.getTipo();
        if (tipo == null || (!tipo.equals("receita") && !tipo.equals("despesa"))) {
            return "Erro: tipo deve ser 'receita' ou 'despesa'.";
        }

        // Verifica se o usuário existe no banco
        if (!usuarioRepository.existsById(transacao.getUsuario().getId())) {
            return "Erro: usuário não encontrado.";
        }

        // Verifica se a categoria existe no banco
        if (!categoriaRepository.existsById(transacao.getCategoria().getId())) {
            return "Erro: categoria não encontrada.";
        }

        // -------------------------------------------------------
        // REGRA PRINCIPAL DE METAS:
        //
        // SÓ atualiza a meta se TODAS as condições abaixo forem verdadeiras:
        //   1. É uma DESPESA (não receita)
        //   2. ehMeta = true (marcado como despesa de meta)
        //   3. metaId foi informado (qual meta vai receber o valor)
        //
        // Despesas normais (ehMeta = false) NÃO tocam em nenhuma meta.
        // -------------------------------------------------------
        if (tipo.equals("despesa") && transacao.isEhMeta() && transacao.getMetaId() != null) {

            // Busca a meta pelo ID informado (agora String/UUID)
            Optional<Meta> metaOpcional = metaRepository.findById(transacao.getMetaId());

            if (metaOpcional.isEmpty()) {
                return "Erro: meta não encontrada com id " + transacao.getMetaId();
            }

            Meta meta = metaOpcional.get();

            // Adiciona o valor da despesa ao progresso da meta
            // Exemplo: meta tinha R$ 300, despesa foi R$ 200 → meta fica com R$ 500
            BigDecimal novoValorAtual = meta.getValorAtual().add(transacao.getValor());
            meta.setValorAtual(novoValorAtual);

            // Se já atingiu ou ultrapassou o objetivo, marca como concluída
            if (novoValorAtual.compareTo(meta.getValorAlvo()) >= 0) {
                meta.setStatus("concluida");
            }

            // Salva a meta atualizada no banco
            metaRepository.save(meta);
        }

        // Salva a transação no banco (seja normal ou de meta)
        transacaoRepository.save(transacao);
        return "Transação salva com sucesso!";
    }

    // GET /transacoes → Lista todas as transações
    @GetMapping("/transacoes")
    public List<Transacao> getAllTransacoes() {
        return transacaoRepository.findAll();
    }

    // GET /transacoes/{id} → Busca transação por ID
    // ✅ id agora é String (UUID)
    @GetMapping("/transacoes/{id}")
    public Optional<Transacao> getTransacaoById(@PathVariable String id) {
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
    // ✅ id agora é String (UUID)
    @PutMapping("/transacoes/{id}")
    public String updateTransacao(@PathVariable String id, @RequestBody Transacao transacao) {
        return transacaoRepository.findById(id).map(existente -> {
            existente.setTipo(transacao.getTipo());
            existente.setValor(transacao.getValor());
            existente.setDescricao(transacao.getDescricao());
            existente.setData(transacao.getData());
            existente.setEhMeta(transacao.isEhMeta());
            existente.setMetaId(transacao.getMetaId());
            if (transacao.getCategoria() != null) {
                existente.setCategoria(transacao.getCategoria());
            }
            transacaoRepository.save(existente);
            return "Transação atualizada com sucesso!";
        }).orElse("Transação não encontrada!");
    }

    // DELETE /transacoes/{id} → Remove uma transação
    // ✅ id agora é String (UUID)
    @DeleteMapping("/transacoes/{id}")
    public String deleteTransacao(@PathVariable String id) {
        if (transacaoRepository.existsById(id)) {
            transacaoRepository.deleteById(id);
            return "Transação deletada com sucesso!";
        }
        return "Transação não encontrada!";
    }
}
