// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/entities/Usuario.java
// PASTA:   entities
// ===================================================

package com.Projeto.GestorFin.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

// @Entity → diz ao Spring que esta classe representa uma tabela no banco
// Analogia: é o "molde" da tabela usuarios
@Entity
@Table(name = "usuarios") // nome exato da tabela no banco
public class Usuario {

    // O ID agora é uma String simples (texto)
    // UUID.randomUUID() gera um código único como: "550e8400-e29b-41d4-a716-446655440000"
    // Fazemos isso manualmente no onCreate() abaixo — sem complicação!
    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)", updatable = false, nullable = false)
    private String id;

    @Column(nullable = false) // não pode ser vazio no banco
    private String nome;

    @Column(nullable = false, unique = true) // não pode repetir email
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(name = "data_cadastro", updatable = false) // preenchido só na criação
    private LocalDateTime dataCadastro;

    @Column(name = "updated_at") // atualizado toda vez que o registro muda
    private LocalDateTime updatedAt;

    // @PrePersist → executado automaticamente ANTES de salvar pela 1ª vez
    // Aqui geramos o ID e as datas automaticamente
    @PrePersist
    protected void onCreate() {
        this.id           = UUID.randomUUID().toString(); // gera ID único
        this.dataCadastro = LocalDateTime.now();          // data de agora
        this.updatedAt    = LocalDateTime.now();
    }

    // @PreUpdate → executado automaticamente ANTES de qualquer atualização
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now(); // atualiza a data de modificação
    }

    // Construtor vazio — obrigatório para o Spring funcionar!
    public Usuario() {}

    // -------------------------------------------------------
    // Getters (pegar o valor) e Setters (definir o valor)
    // -------------------------------------------------------
    public String getId()                 { return id; }
    public void setId(String id)          { this.id = id; }

    public String getNome()               { return nome; }
    public void setNome(String nome)      { this.nome = nome; }

    public String getEmail()              { return email; }
    public void setEmail(String email)    { this.email = email; }

    public String getSenha()              { return senha; }
    public void setSenha(String senha)    { this.senha = senha; }

    public LocalDateTime getDataCadastro()               { return dataCadastro; }
    public void setDataCadastro(LocalDateTime v)         { this.dataCadastro = v; }

    public LocalDateTime getUpdatedAt()                  { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v)            { this.updatedAt = v; }
}