package com.Projeto.GestorFin.entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transacoes")
public class Transacao implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    private String descricao;

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

    public Transacao() {}

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