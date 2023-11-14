package com.serviciosit.app.web.rest;

import com.serviciosit.app.domain.Solicitud;
import com.serviciosit.app.repository.SolicitudRepository;
import com.serviciosit.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.serviciosit.app.domain.Solicitud}.
 */
@RestController
@RequestMapping("/api/solicituds")
@Transactional
public class SolicitudResource {

    private final Logger log = LoggerFactory.getLogger(SolicitudResource.class);

    private static final String ENTITY_NAME = "solicitud";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SolicitudRepository solicitudRepository;

    public SolicitudResource(SolicitudRepository solicitudRepository) {
        this.solicitudRepository = solicitudRepository;
    }

    /**
     * {@code POST  /solicituds} : Create a new solicitud.
     *
     * @param solicitud the solicitud to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new solicitud, or with status {@code 400 (Bad Request)} if the solicitud has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Solicitud> createSolicitud(@RequestBody Solicitud solicitud) throws URISyntaxException {
        log.debug("REST request to save Solicitud : {}", solicitud);
        if (solicitud.getId() != null) {
            throw new BadRequestAlertException("A new solicitud cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Solicitud result = solicitudRepository.save(solicitud);
        return ResponseEntity
            .created(new URI("/api/solicituds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /solicituds/:id} : Updates an existing solicitud.
     *
     * @param id the id of the solicitud to save.
     * @param solicitud the solicitud to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated solicitud,
     * or with status {@code 400 (Bad Request)} if the solicitud is not valid,
     * or with status {@code 500 (Internal Server Error)} if the solicitud couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Solicitud> updateSolicitud(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Solicitud solicitud
    ) throws URISyntaxException {
        log.debug("REST request to update Solicitud : {}, {}", id, solicitud);
        if (solicitud.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, solicitud.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!solicitudRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Solicitud result = solicitudRepository.save(solicitud);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, solicitud.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /solicituds/:id} : Partial updates given fields of an existing solicitud, field will ignore if it is null
     *
     * @param id the id of the solicitud to save.
     * @param solicitud the solicitud to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated solicitud,
     * or with status {@code 400 (Bad Request)} if the solicitud is not valid,
     * or with status {@code 404 (Not Found)} if the solicitud is not found,
     * or with status {@code 500 (Internal Server Error)} if the solicitud couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Solicitud> partialUpdateSolicitud(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Solicitud solicitud
    ) throws URISyntaxException {
        log.debug("REST request to partial update Solicitud partially : {}, {}", id, solicitud);
        if (solicitud.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, solicitud.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!solicitudRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Solicitud> result = solicitudRepository
            .findById(solicitud.getId())
            .map(existingSolicitud -> {
                if (solicitud.getCodigo() != null) {
                    existingSolicitud.setCodigo(solicitud.getCodigo());
                }
                if (solicitud.getDescripcion() != null) {
                    existingSolicitud.setDescripcion(solicitud.getDescripcion());
                }

                return existingSolicitud;
            })
            .map(solicitudRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, solicitud.getId().toString())
        );
    }

    /**
     * {@code GET  /solicituds} : get all the solicituds.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of solicituds in body.
     */
    @GetMapping("")
    public List<Solicitud> getAllSolicituds(@RequestParam(required = false) String filter) {
        if ("servicio-is-null".equals(filter)) {
            log.debug("REST request to get all Solicituds where servicio is null");
            return StreamSupport
                .stream(solicitudRepository.findAll().spliterator(), false)
                .filter(solicitud -> solicitud.getServicio() == null)
                .toList();
        }
        log.debug("REST request to get all Solicituds");
        return solicitudRepository.findAll();
    }

    /**
     * {@code GET  /solicituds/:id} : get the "id" solicitud.
     *
     * @param id the id of the solicitud to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the solicitud, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Solicitud> getSolicitud(@PathVariable Long id) {
        log.debug("REST request to get Solicitud : {}", id);
        Optional<Solicitud> solicitud = solicitudRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(solicitud);
    }

    /**
     * {@code DELETE  /solicituds/:id} : delete the "id" solicitud.
     *
     * @param id the id of the solicitud to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSolicitud(@PathVariable Long id) {
        log.debug("REST request to delete Solicitud : {}", id);
        solicitudRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
