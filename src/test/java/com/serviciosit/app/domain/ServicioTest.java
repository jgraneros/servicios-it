package com.serviciosit.app.domain;

import static com.serviciosit.app.domain.ServicioTestSamples.*;
import static com.serviciosit.app.domain.SolicitudTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.serviciosit.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ServicioTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Servicio.class);
        Servicio servicio1 = getServicioSample1();
        Servicio servicio2 = new Servicio();
        assertThat(servicio1).isNotEqualTo(servicio2);

        servicio2.setId(servicio1.getId());
        assertThat(servicio1).isEqualTo(servicio2);

        servicio2 = getServicioSample2();
        assertThat(servicio1).isNotEqualTo(servicio2);
    }

    @Test
    void solicitudTest() throws Exception {
        Servicio servicio = getServicioRandomSampleGenerator();
        Solicitud solicitudBack = getSolicitudRandomSampleGenerator();

        servicio.setSolicitud(solicitudBack);
        assertThat(servicio.getSolicitud()).isEqualTo(solicitudBack);
        assertThat(solicitudBack.getServicio()).isEqualTo(servicio);

        servicio.solicitud(null);
        assertThat(servicio.getSolicitud()).isNull();
        assertThat(solicitudBack.getServicio()).isNull();
    }
}
