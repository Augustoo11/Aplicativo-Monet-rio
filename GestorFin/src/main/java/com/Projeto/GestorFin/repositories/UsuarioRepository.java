package com.Projeto.GestorFin.repositories;

// AQUI ESTAVA O ERRO: mudamos de .models para .entities
import com.Projeto.GestorFin.entities.Usuario; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
}