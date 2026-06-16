// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/repositories/UsuarioRepository.java
// PASTA:   repositories
// ===================================================

package com.Projeto.GestorFin.repositories;

import com.Projeto.GestorFin.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

    // Busca um usuário pelo email
    // O Spring traduz isso para: SELECT * FROM usuarios WHERE email = ?
    Optional<Usuario> findByEmail(String email);

    // Verifica se já existe um usuário com esse email (retorna true ou false)
    boolean existsByEmail(String email);
}