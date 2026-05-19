// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/repositories/CategoriaRepository.java
// PASTA:   repositories
// ===================================================

package com.Projeto.GestorFin.repositories;

import com.Projeto.GestorFin.entities.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

// JpaRepository<Categoria, Long>:
//   - Gerencia a tabela "categorias"
//   - O ID é do tipo Long (número)
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    // Busca todas as categorias de um usuário pelo ID (String)
    // SELECT * FROM categorias WHERE usuario_id = ?
    List<Categoria> findByUsuarioId(String usuarioId);
}