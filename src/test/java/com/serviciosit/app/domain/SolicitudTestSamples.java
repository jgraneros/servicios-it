package com.serviciosit.app.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SolicitudTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Solicitud getSolicitudSample1() {
        return new Solicitud().id(1L).codigo(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).descripcion("descripcion1");
    }

    public static Solicitud getSolicitudSample2() {
        return new Solicitud().id(2L).codigo(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).descripcion("descripcion2");
    }

    public static Solicitud getSolicitudRandomSampleGenerator() {
        return new Solicitud().id(longCount.incrementAndGet()).codigo(UUID.randomUUID()).descripcion(UUID.randomUUID().toString());
    }
}
