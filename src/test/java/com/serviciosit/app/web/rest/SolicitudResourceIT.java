package com.serviciosit.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.serviciosit.app.IntegrationTest;
import com.serviciosit.app.domain.Solicitud;
import com.serviciosit.app.repository.SolicitudRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SolicitudResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SolicitudResourceIT {

    private static final UUID DEFAULT_CODIGO = UUID.randomUUID();
    private static final UUID UPDATED_CODIGO = UUID.randomUUID();

    private static final String DEFAULT_DESCRIPCION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPCION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/solicituds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSolicitudMockMvc;

    private Solicitud solicitud;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Solicitud createEntity(EntityManager em) {
        Solicitud solicitud = new Solicitud().codigo(DEFAULT_CODIGO).descripcion(DEFAULT_DESCRIPCION);
        return solicitud;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Solicitud createUpdatedEntity(EntityManager em) {
        Solicitud solicitud = new Solicitud().codigo(UPDATED_CODIGO).descripcion(UPDATED_DESCRIPCION);
        return solicitud;
    }

    @BeforeEach
    public void initTest() {
        solicitud = createEntity(em);
    }

    @Test
    @Transactional
    void createSolicitud() throws Exception {
        int databaseSizeBeforeCreate = solicitudRepository.findAll().size();
        // Create the Solicitud
        restSolicitudMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(solicitud)))
            .andExpect(status().isCreated());

        // Validate the Solicitud in the database
        List<Solicitud> solicitudList = solicitudRepository.findAll();
        assertThat(solicitudList).hasSize(databaseSizeBeforeCreate + 1);
        Solicitud testSolicitud = solicitudList.get(solicitudList.size() - 1);
        assertThat(testSolicitud.getCodigo()).isEqualTo(DEFAULT_CODIGO);
        assertThat(testSolicitud.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
    }

    @Test
    @Transactional
    void createSolicitudWithExistingId() throws Exception {
        // Create the Solicitud with an existing ID
        solicitud.setId(1L);

        int databaseSizeBeforeCreate = solicitudRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSolicitudMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(solicitud)))
            .andExpect(status().isBadRequest());

        // Validate the Solicitud in the database
        List<Solicitud> solicitudList = solicitudRepository.findAll();
        assertThat(solicitudList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSolicituds() throws Exception {
        // Initialize the database
        solicitudRepository.saveAndFlush(solicitud);

        // Get all the solicitudList
        restSolicitudMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(solicitud.getId().intValue())))
            .andExpect(jsonPath("$.[*].codigo").value(hasItem(DEFAULT_CODIGO.toString())))
            .andExpect(jsonPath("$.[*].descripcion").value(hasItem(DEFAULT_DESCRIPCION)));
    }

    @Test
    @Transactional
    void getSolicitud() throws Exception {
        // Initialize the database
        solicitudRepository.saveAndFlush(solicitud);

        // Get the solicitud
        restSolicitudMockMvc
            .perform(get(ENTITY_API_URL_ID, solicitud.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(solicitud.getId().intValue()))
            .andExpect(jsonPath("$.codigo").value(DEFAULT_CODIGO.toString()))
            .andExpect(jsonPath("$.descripcion").value(DEFAULT_DESCRIPCION));
    }

    @Test
    @Transactional
    void getNonExistingSolicitud() throws Exception {
        // Get the solicitud
        restSolicitudMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSolicitud() throws Exception {
        // Initialize the database
        solicitudRepository.saveAndFlush(solicitud);

        int databaseSizeBeforeUpdate = solicitudRepository.findAll().size();

        // Update the solicitud
        Solicitud updatedSolicitud = solicitudRepository.findById(solicitud.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSolicitud are not directly saved in db
        em.detach(updatedSolicitud);
        updatedSolicitud.codigo(UPDATED_CODIGO).descripcion(UPDATED_DESCRIPCION);

        restSolicitudMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSolicitud.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSolicitud))
            )
            .andExpect(status().isOk());

        // Validate the Solicitud in the database
        List<Solicitud> solicitudList = solicitudRepository.findAll();
        assertThat(solicitudList).hasSize(databaseSizeBeforeUpdate);
        Solicitud testSolicitud = solicitudList.get(solicitudList.size() - 1);
        assertThat(testSolicitud.getCodigo()).isEqualTo(UPDATED_CODIGO);
        assertThat(testSolicitud.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void putNonExistingSolicitud() throws Exception {
        int databaseSizeBeforeUpdate = solicitudRepository.findAll().size();
        solicitud.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSolicitudMockMvc
            .perform(
                put(ENTITY_API_URL_ID, solicitud.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(solicitud))
            )
            .andExpect(status().isBadRequest());

        // Validate the Solicitud in the database
        List<Solicitud> solicitudList = solicitudRepository.findAll();
        assertThat(solicitudList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSolicitud() throws Exception {
        int databaseSizeBeforeUpdate = solicitudRepository.findAll().size();
        solicitud.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSolicitudMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(solicitud))
            )
            .andExpect(status().isBadRequest());

        // Validate the Solicitud in the database
        List<Solicitud> solicitudList = solicitudRepository.findAll();
        assertThat(solicitudList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSolicitud() throws Exception {
        int databaseSizeBeforeUpdate = solicitudRepository.findAll().size();
        solicitud.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSolicitudMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(solicitud)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Solicitud in the database
        List<Solicitud> solicitudList = solicitudRepository.findAll();
        assertThat(solicitudList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSolicitudWithPatch() throws Exception {
        // Initialize the database
        solicitudRepository.saveAndFlush(solicitud);

        int databaseSizeBeforeUpdate = solicitudRepository.findAll().size();

        // Update the solicitud using partial update
        Solicitud partialUpdatedSolicitud = new Solicitud();
        partialUpdatedSolicitud.setId(solicitud.getId());

        restSolicitudMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSolicitud.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSolicitud))
            )
            .andExpect(status().isOk());

        // Validate the Solicitud in the database
        List<Solicitud> solicitudList = solicitudRepository.findAll();
        assertThat(solicitudList).hasSize(databaseSizeBeforeUpdate);
        Solicitud testSolicitud = solicitudList.get(solicitudList.size() - 1);
        assertThat(testSolicitud.getCodigo()).isEqualTo(DEFAULT_CODIGO);
        assertThat(testSolicitud.getDescripcion()).isEqualTo(DEFAULT_DESCRIPCION);
    }

    @Test
    @Transactional
    void fullUpdateSolicitudWithPatch() throws Exception {
        // Initialize the database
        solicitudRepository.saveAndFlush(solicitud);

        int databaseSizeBeforeUpdate = solicitudRepository.findAll().size();

        // Update the solicitud using partial update
        Solicitud partialUpdatedSolicitud = new Solicitud();
        partialUpdatedSolicitud.setId(solicitud.getId());

        partialUpdatedSolicitud.codigo(UPDATED_CODIGO).descripcion(UPDATED_DESCRIPCION);

        restSolicitudMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSolicitud.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSolicitud))
            )
            .andExpect(status().isOk());

        // Validate the Solicitud in the database
        List<Solicitud> solicitudList = solicitudRepository.findAll();
        assertThat(solicitudList).hasSize(databaseSizeBeforeUpdate);
        Solicitud testSolicitud = solicitudList.get(solicitudList.size() - 1);
        assertThat(testSolicitud.getCodigo()).isEqualTo(UPDATED_CODIGO);
        assertThat(testSolicitud.getDescripcion()).isEqualTo(UPDATED_DESCRIPCION);
    }

    @Test
    @Transactional
    void patchNonExistingSolicitud() throws Exception {
        int databaseSizeBeforeUpdate = solicitudRepository.findAll().size();
        solicitud.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSolicitudMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, solicitud.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(solicitud))
            )
            .andExpect(status().isBadRequest());

        // Validate the Solicitud in the database
        List<Solicitud> solicitudList = solicitudRepository.findAll();
        assertThat(solicitudList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSolicitud() throws Exception {
        int databaseSizeBeforeUpdate = solicitudRepository.findAll().size();
        solicitud.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSolicitudMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(solicitud))
            )
            .andExpect(status().isBadRequest());

        // Validate the Solicitud in the database
        List<Solicitud> solicitudList = solicitudRepository.findAll();
        assertThat(solicitudList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSolicitud() throws Exception {
        int databaseSizeBeforeUpdate = solicitudRepository.findAll().size();
        solicitud.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSolicitudMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(solicitud))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Solicitud in the database
        List<Solicitud> solicitudList = solicitudRepository.findAll();
        assertThat(solicitudList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSolicitud() throws Exception {
        // Initialize the database
        solicitudRepository.saveAndFlush(solicitud);

        int databaseSizeBeforeDelete = solicitudRepository.findAll().size();

        // Delete the solicitud
        restSolicitudMockMvc
            .perform(delete(ENTITY_API_URL_ID, solicitud.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Solicitud> solicitudList = solicitudRepository.findAll();
        assertThat(solicitudList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
