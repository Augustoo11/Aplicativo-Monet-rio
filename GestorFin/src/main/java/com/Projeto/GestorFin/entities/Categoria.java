// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/entities/Categoria.java
// PASTA:   entities
// ===================================================

package com.Projeto.GestorFin.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "categorias")
public class Categoria {

    // ID numérico gerado automaticamente pelo banco (AUTO_INCREMENT)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relacionamento: muitas categorias pertencem a UM usuário
    // @JoinColumn → coluna "usuario_id" é a chave estrangeira (FK) no banco
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private String nome;

    // Aceita apenas "receita" ou "despesa"
    @Column(nullable = false)
    private String tipo;

    // Cor em hexadecimal, ex: "#FF5733"
    private String cor;

    @Column(name = "padrao")
    private Boolean padrao;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Preenche a data automaticamente antes de salvar
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Construtor vazio — obrigatório!
    public Categoria() {}

    // Getters e Setters
    public Long getId()                         { return id; }
    public void setId(Long id)                  { this.id = id; }

    public Usuario getUsuario()                 { return usuario; }
    public void setUsuario(Usuario usuario)     { this.usuario = usuario; }

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