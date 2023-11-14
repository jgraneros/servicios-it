package com.serviciosit.app.web.rest;

import com.serviciosit.app.domain.Servicio;
import com.serviciosit.app.repository.ServicioRepository;
import com.serviciosit.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.serviciosit.app.domain.Servicio}.
 */
@RestController
@RequestMapping("/api/servicios")
@Transactional
public class ServicioResource {

    private final Logger log = LoggerFactory.getLogger(ServicioResource.class);

    private static final String ENTITY_NAME = "servicio";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ServicioRepository servicioRepository;

    public ServicioResource(ServicioRepository servicioRepository) {
        this.servicioRepository = servicioRepository;
    }

    /**
     * {@code POST  /servicios} : Create a new servicio.
     *
     * @param servicio the servicio to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new servicio, or with status {@code 400 (Bad Request)} if the servicio has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Servicio> createServicio(@RequestBody Servicio servicio) throws URISyntaxException {
        log.debug("REST request to save Servicio : {}", servicio);
        if (servicio.getId() != null) {
            throw new BadRequestAlertException("A new servicio cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Servicio result = servicioRepository.save(servicio);
        return ResponseEntity
            .created(new URI("/api/servicios/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /servicios/:id} : Updates an existing servicio.
     *
     * @param id the id of the servicio to save.
     * @param servicio the servicio to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated servicio,
     * or with status {@code 400 (Bad Request)} if the servicio is not valid,
     * or with status {@code 500 (Internal Server Error)} if the servicio couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Servicio> updateServicio(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Servicio servicio
    ) throws URISyntaxException {
        log.debug("REST request to update Servicio : {}, {}", id, servicio);
        if (servicio.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, servicio.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!servicioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Servicio result = servicioRepository.save(servicio);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, servicio.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /servicios/:id} : Partial updates given fields of an existing servicio, field will ignore if it is null
     *
     * @param id the id of the servicio to save.
     * @param servicio the servicio to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated servicio,
     * or with status {@code 400 (Bad Request)} if the servicio is not valid,
     * or with status {@code 404 (Not Found)} if the servicio is not found,
     * or with status {@code 500 (Internal Server Error)} if the servicio couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Servicio> partialUpdateServicio(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Servicio servicio
    ) throws URISyntaxException {
        log.debug("REST request to partial update Servicio partially : {}, {}", id, servicio);
        if (servicio.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, servicio.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!servicioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Servicio> result = servicioRepository
            .findById(servicio.getId())
            .map(existingServicio -> {
                if (servicio.getNombre() != null) {
                    existingServicio.setNombre(servicio.getNombre());
                }
                if (servicio.getDescripcion() != null) {
                    existingServicio.setDescripcion(servicio.getDescripcion());
                }
                if (servicio.getPropiedad() != null) {
                    existingServicio.setPropiedad(servicio.getPropiedad());
                }
                if (servicio.getEstado() != null) {
                    existingServicio.setEstado(servicio.getEstado());
                }

                return existingServicio;
            })
            .map(servicioRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, servicio.getId().toString())
        );
    }

    /**
     * {@code GET  /servicios} : get all the servicios.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of servicios in body.
     */
    @GetMapping("")
    public List<Servicio> getAllServicios() {
        log.debug("REST request to get all Servicios");
        return servicioRepository.findAll();
    }

    /**
     * {@code GET  /servicios/:id} : get the "id" servicio.
     *
     * @param id the id of the servicio to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the servicio, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Servicio> getServicio(@PathVariable Long id) {
        log.debug("REST request to get Servicio : {}", id);
        Optional<Servicio> servicio = servicioRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(servicio);
    }

    /**
     * {@code DELETE  /servicios/:id} : delete the "id" servicio.
     *
     * @param id the id of the servicio to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteServicio(@PathVariable Long id) {
        log.debug("REST request to delete Servicio : {}", id);
        servicioRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
