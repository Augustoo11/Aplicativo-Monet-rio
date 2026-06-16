package com.Projeto.GestorFin.entities;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transacoes")
public class Transacao implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(36)", updatable = false, nullable = false)
    private String id;

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

    @Column(name = "eh_meta", nullable = false)
    private boolean ehMeta = false;

    @Column(name = "meta_id", columnDefinition = "VARCHAR(36)")
    private String metaId;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.id        = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Transacao() {}

    public String getId()                        { return id; }
    public void setId(String id)                 { this.id = id; }

    public Usuario getUsuario()                  { return usuario; }
    public void setUsuario(Usuario usuario)      { this.usuario = usuario; }

    public Categoria getCategoria()              { return categoria; }
    public void setCategoria(Categoria c)        { this.categoria = c; }

    public String getTipo()                      { return tipo; }
    public void setTipo(String tipo)             { this.tipo = tipo; }

    public BigDecimal getValor()                 { return valor; }
    public void setValor(BigDecimal valor)       { this.valor = valor; }

    public String getDescricao()                 { return descricao; }
    public void setDescricao(String descricao)   { this.descricao = descricao; }

    public LocalDate getData()                   { return data; }
    public void setData(LocalDate data)          { this.data = data; }

    public boolean isEhMeta()                    { return ehMeta; }
    public void setEhMeta(boolean ehMeta)        { this.ehMeta = ehMeta; }

    public String getMetaId()                    { return metaId; }
    public void setMetaId(String metaId)         { this.metaId = metaId; }

    public LocalDateTime getCreatedAt()          { return createdAt; }
    public void setCreatedAt(LocalDateTime v)    { this.createdAt = v; }

    public LocalDateTime getUpdatedAt()          { return updatedAt; }
    public void setUpdatedAt(LocalDateTime v)    { this.updatedAt = v; }
}
