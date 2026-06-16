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

        
        if (tipo.equals("despesa") && transacao.isEhMeta() && transacao.getMetaId() != null) {

            
            Optional<Meta> metaOpcional = metaRepository.findById(transacao.getMetaId());

            if (metaOpcional.isEmpty()) {
                return "Erro: meta não encontrada com id " + transacao.getMetaId();
            }

            Meta meta = metaOpcional.get();

            BigDecimal novoValorAtual = meta.getValorAtual().add(transacao.getValor());
            meta.setValorAtual(novoValorAtual);

           
            if (novoValorAtual.compareTo(meta.getValorAlvo()) >= 0) {
                meta.setStatus("concluida");
            }

            
            metaRepository.save(meta);
        }

        
        transacaoRepository.save(transacao);
        return "Transação salva com sucesso!";
    }

   
    @GetMapping("/transacoes")
    public List<Transacao> getAllTransacoes() {
        return transacaoRepository.findAll();
    }

    
    @GetMapping("/transacoes/{id}")
    public Optional<Transacao> getTransacaoById(@PathVariable String id) {
        return transacaoRepository.findById(id);
    }

    
    @GetMapping("/transacoes/usuario/{usuarioId}")
    public Object getTransacoesByUsuario(@PathVariable String usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            return "Usuário não encontrado!";
        }
        return transacaoRepository.findByUsuarioId(usuarioId);
    }

    
    @GetMapping("/transacoes/usuario/{usuarioId}/tipo/{tipo}")
    public Object getTransacoesByTipo(@PathVariable String usuarioId, @PathVariable String tipo) {
        if (!usuarioRepository.existsById(usuarioId)) {
            return "Usuário não encontrado!";
        }
        return transacaoRepository.findByUsuarioIdAndTipo(usuarioId, tipo);
    }

   
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

   
    @DeleteMapping("/transacoes/{id}")
    public String deleteTransacao(@PathVariable String id) {
        if (transacaoRepository.existsById(id)) {
            transacaoRepository.deleteById(id);
            return "Transação deletada com sucesso!";
        }
        return "Transação não encontrada!";
    }
}
