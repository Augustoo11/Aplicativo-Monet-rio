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

    // -------------------------------------------------------
    // POST /metas → Cria uma nova meta
    //
    // JSON esperado:
    // {
    //   "usuario":    { "id": "id-do-usuario" },
    //   "nome":       "Viagem para Europa",
    //   "valorAlvo":  10000.00,
    //   "valorAtual": 0,
    //   "dataLimite": "2026-12-31",   ← opcional
    //   "status":     "em_andamento"
    // }
    //
    // ✅ O "id" da meta NÃO é enviado pelo frontend — ele é gerado
    // automaticamente pelo código Java (UUID) ao salvar.
    // -------------------------------------------------------
    @PostMapping("/metas")
    public String saveMeta(@RequestBody Meta meta) {

        // Usuário obrigatório
        if (meta.getUsuario() == null || meta.getUsuario().getId() == null) {
            return "Erro: informe o id do usuário.";
        }

        // Verifica se o usuário existe no banco
        if (!usuarioRepository.existsById(meta.getUsuario().getId())) {
            return "Erro: usuário não encontrado.";
        }

        // Valor alvo deve ser positivo
        if (meta.getValorAlvo() == null || meta.getValorAlvo().doubleValue() <= 0) {
            return "Erro: valor alvo deve ser maior que zero.";
        }

        // Status aceita apenas 3 valores
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

    // -------------------------------------------------------
    // GET /metas → Lista todas as metas
    // -------------------------------------------------------
    @GetMapping("/metas")
    public List<Meta> getAllMetas() {
        return metaRepository.findAll();
    }

    // -------------------------------------------------------
    // GET /metas/{id} → Busca uma meta pelo ID
    // ✅ id agora é String (UUID)
    // -------------------------------------------------------
    @GetMapping("/metas/{id}")
    public Optional<Meta> getMetaById(@PathVariable String id) {
        return metaRepository.findById(id);
    }

    // -------------------------------------------------------
    // GET /metas/usuario/{usuarioId} → Lista metas de um usuário
    // -------------------------------------------------------
    @GetMapping("/metas/usuario/{usuarioId}")
    public Object getMetasByUsuario(@PathVariable String usuarioId) {
        if (!usuarioRepository.existsById(usuarioId)) {
            return "Usuário não encontrado!";
        }
        return metaRepository.findByUsuarioId(usuarioId);
    }

    // -------------------------------------------------------
    // GET /metas/usuario/{usuarioId}/status/{status}
    // Lista metas filtradas por status
    // Ex: GET /metas/usuario/abc123/status/em_andamento
    // -------------------------------------------------------
    @GetMapping("/metas/usuario/{usuarioId}/status/{status}")
    public Object getMetasByStatus(@PathVariable String usuarioId, @PathVariable String status) {
        if (!usuarioRepository.existsById(usuarioId)) {
            return "Usuário não encontrado!";
        }
        return metaRepository.findByUsuarioIdAndStatus(usuarioId, status);
    }

    // -------------------------------------------------------
    // PUT /metas/{id} → Atualiza uma meta existente
    // ✅ id agora é String (UUID)
    // -------------------------------------------------------
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

    // -------------------------------------------------------
    // DELETE /metas/{id} → Remove uma meta
    // ✅ id agora é String (UUID)
    // -------------------------------------------------------
    @DeleteMapping("/metas/{id}")
    public String deleteMeta(@PathVariable String id) {
        if (metaRepository.existsById(id)) {
            metaRepository.deleteById(id);
            return "Meta deletada com sucesso!";
        }
        return "Meta não encontrada!";
    }
}
