package com.Projeto.GestorFin.controllers;

import com.Projeto.GestorFin.entities.Meta;
import com.Projeto.GestorFin.repositories.MetaRepository;
import com.Projeto.GestorFin.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
public class MetaController {

    @Autowired
    MetaRepository metaRepository;

    @Autowired
    UsuarioRepository usuarioRepository;

    @PostMapping("/metas")
    public String saveMeta(@RequestBody Meta meta) {

       
        if (meta.getUsuario() == null || meta.getUsuario().getId() == null) {
            return "Erro: informe o id do usuário.";
        }


        if (!usuarioRepository.existsById(meta.getUsuario().getId())) {
            return "Erro: usuário não encontrado.";
        }


        if (meta.getValorAlvo() == null || meta.getValorAlvo().doubleValue() <= 0) {
            return "Erro: valor alvo deve ser maior que zero.";
        }

       
        String status = meta.getStatus();
        if (status != null
                && !status.equals("em_andamento")
                && !status.equals("concluida")
                && !status.equals("cancelada")) {
            return "Erro: status deve ser 'em_andamento', 'concluida' ou 'cancelada'.";
        }

        metaRepository.save(meta);
        return "Meta salva com sucesso!";
    }

    @GetMapping("/metas")
    public List<Meta> getAllMetas() {
        return metaRepository.findAll();
    }

    @GetMapping("/metas/{id}")
    public Optional<Meta> getMetaById(@PathVariable String id) {
        return metaRepository.findById(id);
    }

    @GetMapping("/metas/usuario/{usuarioId}")
    public Object getMetasByUsuario(@PathVariable String usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            return "Usuário não encontrado!";
        }
        return metaRepository.findByUsuarioId(usuarioId);
    }

    
    @GetMapping("/metas/usuario/{usuarioId}/status/{status}")
    public Object getMetasByStatus(@PathVariable String usuarioId, @PathVariable String status) {
        if (!usuarioRepository.existsById(usuarioId)) {
            return "Usuário não encontrado!";
        }
        return metaRepository.findByUsuarioIdAndStatus(usuarioId, status);
    }


    @PutMapping("/metas/{id}")
    public String updateMeta(@PathVariable String id, @RequestBody Meta meta) {
        return metaRepository.findById(id).map(existente -> {
            existente.setNome(meta.getNome());
            existente.setValorAlvo(meta.getValorAlvo());
            existente.setValorAtual(meta.getValorAtual());
            existente.setDataLimite(meta.getDataLimite());
            existente.setStatus(meta.getStatus());
            metaRepository.save(existente);
            return "Meta atualizada com sucesso!";
        }).orElse("Meta não encontrada!");
    }


    @DeleteMapping("/metas/{id}")
    public String deleteMeta(@PathVariable String id) {
        if (metaRepository.existsById(id)) {
            metaRepository.deleteById(id);
            return "Meta deletada com sucesso!";
        }
        return "Meta não encontrada!";
    }
}
