// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/repositories/TransacaoRepository.java
// PASTA:   repositories
// ===================================================

package com.Projeto.GestorFin.repositories;

import com.Projeto.GestorFin.entities.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    // Busca todas as transações de um usuário específico.
    // SELECT * FROM transacoes WHERE usuario_id = ?
    List<Transacao> findByUsuarioId(UUID usuarioId);

    // Busca transações de um usuário filtradas por tipo ('receita' ou 'despesa').
    // SELECT * FROM transacoes WHERE usuario_id = ? AND tipo = ?
    List<Transacao> findByUsuarioIdAndTipo(UUID usuarioId, String tipo);
}
