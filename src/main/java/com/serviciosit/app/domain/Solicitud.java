package com.serviciosit.app.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.UUID;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Solicitud.
 */
@Entity
@Table(name = "solicitud")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Solicitud implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "codigo")
    private UUID codigo;

    @Column(name = "descripcion")
    private String descripcion;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private User usuario;

    @JsonIgnoreProperties(value = { "solicitud" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "solicitud")
    private Servicio servicio;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Solicitud id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getCodigo() {
        return this.codigo;
    }

    public Solicitud codigo(UUID codigo) {
        this.setCodigo(codigo);
        return this;
    }

    public void setCodigo(UUID codigo) {
        this.codigo = codigo;
    }

    public String getDescripcion() {
        return this.descripcion;
    }

    public Solicitud descripcion(String descripcion) {
        this.setDescripcion(descripcion);
        return this;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public User getUsuario() {
        return this.usuario;
    }

    public void setUsuario(User user) {
        this.usuario = user;
    }

    public Solicitud usuario(User user) {
        this.setUsuario(user);
        return this;
    }

    public Servicio getServicio() {
        return this.servicio;
    }

    public void setServicio(Servicio servicio) {
        if (this.servicio != null) {
            this.servicio.setSolicitud(null);
        }
        if (servicio != null) {
            servicio.setSolicitud(this);
        }
        this.servicio = servicio;
    }

    public Solicitud servicio(Servicio servicio) {
        this.setServicio(servicio);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Solicitud)) {
            return false;
        }
        return getId() != null && getId().equals(((Solicitud) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Solicitud{" +
            "id=" + getId() +
            ", codigo='" + getCodigo() + "'" +
            ", descripcion='" + getDescripcion() + "'" +
            "}";
    }
}
