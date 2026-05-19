// ===================================================
// ARQUIVO: src/main/java/com/Projeto/GestorFin/entities/Transacao.java
// PASTA:   entities
// ===================================================

package com.Projeto.GestorFin.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacoes")
public class Transacao {

    // ID numérico gerado automaticamente pelo banco (AUTO_INCREMENT)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relacionamento: muitas transações pertencem a UM usuário
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Relacionamento: muitas transações pertencem a UMA categoria
    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    // Aceita apenas "receita" ou "despesa"
    @Column(nullable = false)
    private String tipo;

    // BigDecimal é o tipo correto para dinheiro (evita erros de arredondamento)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    // Descrição é opcional (pode ser nula)
    private String descricao;

    // LocalDate = só a data, sem horário. Ex: 2025-05-10
    @Column(nullable = false)
    private LocalDate data;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Construtor vazio — obrigatório!
    public Transacao() {}

    // Getters e Setters
    public Long getId()                         { return id; }
    public void setId(Long id)                  { this.id = id; }

    public Usuario getUsuario()                 { return usuario; }
    public void setUsuario(Usuario usuario)     { this.usuario = usuario; }

    public Categoria getCategoria()                 { return categoria; }
    public void setCategoria(Categoria categoria)   { this.categoria = categoria; }

    public String getTipo()                     { return tipo; }
    public void setTipo(String tipo)            { this.tipo = tipo; }

    public BigDecimal getValor()                { return valor; }
    public void setValor(BigDecimal valor)      { this.valor = valor; }

    public String getDescricao()                { return descricao; }
    public void setDescricao(String descricao)  { this.descricao = descricao; }

    public LocalDate getData()                  { return data; }
    public void setData(LocalDate data)         { this.data = data; }

    public LocalDateTime getCreatedAt()         { return createdAt; }
    public void setCreatedAt(LocalDateTime v)   { this.createdAt = v; }

    public LocalDateTime getUpdatedAt()         { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v)   { this.updatedAt = v; }
}