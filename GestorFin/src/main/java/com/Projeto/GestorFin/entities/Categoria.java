package com.Projeto.GestorFin.entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "categorias")
public class Categoria implements Serializable {
    private static final long serialVersionUID = 1L;

   
    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)", updatable = false, nullable = false)
    private String id;


    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String tipo;

    private String cor;

    @Column(name = "padrao")
    private Boolean padrao;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        
        this.id        = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
    }

    public Categoria() {}

    public String getId()                       { return id; }
    public void setId(String id)                { this.id = id; }

    public String getNome()                     { return nome; }
    public void setNome(String nome)            { this.nome = nome; }

    public String getTipo()                     { return tipo; }
    public void setTipo(String tipo)            { this.tipo = tipo; }

    public String getCor()                      { return cor; }
    public void setCor(String cor)              { this.cor = cor; }

    public Boolean getPadrao()                  { return padrao; }
    public void setPadrao(Boolean padrao)       { this.padrao = padrao; }

    public LocalDateTime getCreatedAt()         { return createdAt; }
    public void setCreatedAt(LocalDateTime v)   { this.createdAt = v; }
}
