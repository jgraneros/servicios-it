package com.serviciosit.app.domain;

import static com.serviciosit.app.domain.ServicioTestSamples.*;
import static com.serviciosit.app.domain.SolicitudTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.serviciosit.app.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SolicitudTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Solicitud.class);
        Solicitud solicitud1 = getSolicitudSample1();
        Solicitud solicitud2 = new Solicitud();
        assertThat(solicitud1).isNotEqualTo(solicitud2);

        solicitud2.setId(solicitud1.getId());
        assertThat(solicitud1).isEqualTo(solicitud2);

        solicitud2 = getSolicitudSample2();
        assertThat(solicitud1).isNotEqualTo(solicitud2);
    }

    @Test
    void servicioTest() throws Exception {
        Solicitud solicitud = getSolicitudRandomSampleGenerator();
        Servicio servicioBack = getServicioRandomSampleGenerator();

        solicitud.setServicio(servicioBack);
        assertThat(solicitud.getServicio()).isEqualTo(servicioBack);
        assertThat(servicioBack.getSolicitud()).isEqualTo(solicitud);

        solicitud.servicio(null);
        assertThat(solicitud.getServicio()).isNull();
        assertThat(servicioBack.getSolicitud()).isNull();
    }
}
