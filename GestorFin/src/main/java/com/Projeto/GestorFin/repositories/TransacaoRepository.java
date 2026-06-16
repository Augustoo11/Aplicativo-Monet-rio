package com.Projeto.GestorFin.repositories;

import com.Projeto.GestorFin.entities.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, String> {

    // ✅ String porque Usuario.id é String
    List<Transacao> findByUsuarioId(String usuarioId);

    List<Transacao> findByUsuarioIdAndTipo(String usuarioId, String tipo);
}
