package com.Projeto.GestorFin.repositories;

import com.Projeto.GestorFin.entities.Meta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MetaRepository extends JpaRepository<Meta, String> {

    // Busca todas as metas de um usuário específico
    // SELECT * FROM metas WHERE usuario_id = ?
    List<Meta> findByUsuarioId(String usuarioId);

    // Busca metas de um usuário filtradas por status
    // Ex: status = "em_andamento", "concluida" ou "cancelada"
    // SELECT * FROM metas WHERE usuario_id = ? AND status = ?
    List<Meta> findByUsuarioIdAndStatus(String usuarioId, String status);
}
