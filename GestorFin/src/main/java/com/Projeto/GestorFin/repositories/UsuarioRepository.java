// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/repositories/UsuarioRepository.java
// PASTA:   repositories
// ===================================================

package com.Projeto.GestorFin.repositories;

import com.Projeto.GestorFin.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

// @Repository diz ao Spring: "Esta interface acessa o banco de dados"
// JpaRepository<Usuario, UUID> significa:
//   - Gerencia objetos do tipo "Usuario"
//   - A chave primária (ID) é do tipo "UUID"
// O Spring cria automaticamente os métodos: save(), findAll(), findById(), deleteById(), etc.
// Você não precisa escrever nenhum SQL!
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    // Método personalizado: busca usuário pelo email.
    // O Spring entende o nome "findByEmail" e cria a query SQL automaticamente:
    // SELECT * FROM usuarios WHERE email = ?
    // Optional<> significa: pode retornar um usuário OU pode não encontrar ninguém.
    Optional<Usuario> findByEmail(String email);

    // Verifica se já existe um usuário com este email.
    // Retorna true (existe) ou false (não existe).
    boolean existsByEmail(String email);
}
