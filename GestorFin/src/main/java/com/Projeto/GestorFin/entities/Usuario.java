// ===================================================
// entities/Usuario.java — ESTILO UNINASSAU
// ===================================================
package com.Projeto.GestorFin.entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty; 
import java.io.Serializable;        
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
public class Usuario implements Serializable {  
    private static final long serialVersionUID = 1L; 

    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)", updatable = false, nullable = false)
    private String id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String senha;

    @Column(name = "data_cadastro", updatable = false)
    private LocalDateTime dataCadastro;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.id           = UUID.randomUUID().toString();
        this.dataCadastro = LocalDateTime.now();
        this.updatedAt    = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Usuario() {}

    public String getId()                 { return id; }
    public void setId(String id)          { this.id = id; }
    public String getNome()               { return nome; }
    public void setNome(String nome)      { this.nome = nome; }
    public String getEmail()              { return email; }
    public void setEmail(String email)    { this.email = email; }
    public String getSenha()              { return senha; }
    public void setSenha(String senha)    { this.senha = senha; }
    public LocalDateTime getDataCadastro()           { return dataCadastro; }
    public void setDataCadastro(LocalDateTime v)     { this.dataCadastro = v; }
    public LocalDateTime getUpdatedAt()              { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v)        { this.updatedAt = v; }
}