// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/entities/Usuario.java
// PASTA:   entities
// ===================================================

package com.Projeto.GestorFin.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.annotations.JdbcTypeCode;   // ← NOVO
import org.hibernate.type.SqlTypes;               // ← NOVO
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.VARCHAR)  // ← força salvar como texto no banco
    @Column(columnDefinition = "VARCHAR(36)", updatable = false, nullable = false)
    private UUID id;

    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false)
    private String nome;

    @Email(message = "E-mail inválido")
    @NotBlank(message = "E-mail é obrigatório")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Senha é obrigatória")
    @Column(nullable = false)
    private String senha;

    @Column(name = "data_cadastro", updatable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.dataCadastro = LocalDateTime.now();
        this.updatedAt    = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Usuario() {}

    public Usuario(String nome, String email, String senha) {
        this.nome  = nome;
        this.email = email;
        this.senha = senha;
    }

    public UUID getId()                           { return id; }
    public void setId(UUID id)                    { this.id = id; }

    public String getNome()                       { return nome; }
    public void setNome(String nome)              { this.nome = nome; }

    public String getEmail()                      { return email; }
    public void setEmail(String email)            { this.email = email; }

    public String getSenha()                      { return senha; }
    public void setSenha(String senha)            { this.senha = senha; }

    public LocalDateTime getDataCadastro()        { return dataCadastro; }
    public void setDataCadastro(LocalDateTime v)  { this.dataCadastro = v; }

    public LocalDateTime getUpdatedAt()           { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v)     { this.updatedAt = v; }
}