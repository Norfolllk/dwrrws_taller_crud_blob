package com.krakedev.jwt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.krakedev.jwt.entidades.Pelicula;

	public interface PeliculaRepository extends JpaRepository<Pelicula, Integer> {
	
}
