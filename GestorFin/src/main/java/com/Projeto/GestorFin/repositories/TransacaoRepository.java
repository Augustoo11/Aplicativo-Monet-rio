// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/repositories/TransacaoRepository.java
// PASTA:   repositories
// ===================================================

package com.Projeto.GestorFin.repositories;

import com.Projeto.GestorFin.entities.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

// JpaRepository<Transacao, Long>:
//   - Gerencia a tabela "transacoes"
//   - O ID é do tipo Long (número)
@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    // Busca todas as transações de um usuário
    // SELECT * FROM transacoes WHERE usuario_id = ?
    List<Transacao> findByUsuarioId(String usuarioId);

    // Busca transações de um usuário filtradas por tipo ("receita" ou "despesa")
    // SELECT * FROM transacoes WHERE usuario_id = ? AND tipo = ?
    List<Transacao> findByUsuarioIdAndTipo(String usuarioId, String tipo);
}