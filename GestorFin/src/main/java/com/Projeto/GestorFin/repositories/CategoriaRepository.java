// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/repositories/CategoriaRepository.java
// PASTA:   repositories
// ===================================================

package com.Projeto.GestorFin.repositories;

import com.Projeto.GestorFin.entities.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    // Busca todas as categorias de um usuário específico pelo ID do usuário.
    // O Spring traduz isso para: SELECT * FROM categorias WHERE usuario_id = ?
    // Note: usamos "usuario_Id" porque o campo na entity é "usuario" (objeto Usuario),
    // e o ID dele é "id".
    List<Categoria> findByUsuarioId(UUID usuarioId);
}
