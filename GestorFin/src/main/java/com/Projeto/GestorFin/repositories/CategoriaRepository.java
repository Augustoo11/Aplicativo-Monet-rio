package com.Projeto.GestorFin.repositories;

import com.Projeto.GestorFin.entities.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// -------------------------------------------------------
// ATENÇÃO: findByUsuarioId removido temporariamente
// pois a coluna usuario_id ainda não existe no banco.
// Quando o banco adicionar a coluna, restaurar:
//   List<Categoria> findByUsuarioId(String usuarioId);
// -------------------------------------------------------
//
// ✅ PADRONIZADO: JpaRepository<Categoria, String>
//   - O ID agora é do tipo String (UUID gerado pelo código)
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, String> {

}
