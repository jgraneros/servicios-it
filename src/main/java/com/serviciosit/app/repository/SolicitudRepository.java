package com.serviciosit.app.repository;

import com.serviciosit.app.domain.Solicitud;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Solicitud entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {}
