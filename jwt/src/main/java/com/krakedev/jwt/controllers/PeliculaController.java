package com.krakedev.jwt.controllers;

import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.krakedev.jwt.entidades.Pelicula;
import com.krakedev.jwt.repositories.PeliculaRepository;

@RestController
@RequestMapping("/api/auth/peliculas") 
public class PeliculaController {

    private final PeliculaRepository peliculaRepository;

    public PeliculaController(PeliculaRepository peliculaRepository) {
        this.peliculaRepository = peliculaRepository;
    }


    @PostMapping("/registrar")
    public ResponseEntity<?> registrarPelicula(
            @RequestParam("file") MultipartFile file,
            @RequestParam("titulo") String titulo,
            @RequestParam("director") String director) {
    	
        try {
        	
            Pelicula pelicula = new Pelicula();
            pelicula.setTitulo(titulo);
            pelicula.setDirector(director);
            pelicula.setMimeType(file.getContentType());
            pelicula.setFoto(file.getBytes());

            peliculaRepository.save(pelicula);
            return ResponseEntity.status(HttpStatus.CREATED).body("Película registrada con éxito");
            
        } 
        catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al procesar el archivo: " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<List<Pelicula>> listarPeliculas() {
        List<Pelicula> lista = peliculaRepository.findAll();
        for (Pelicula p : lista) {
            p.setFoto(null);
        }
        return ResponseEntity.ok(lista);
    }

    
    @GetMapping("/{id}/foto")
    public ResponseEntity<byte[]> obtenerFoto(@PathVariable Integer id) {
        Pelicula pelicula = peliculaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Película no encontrada"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(pelicula.getMimeType()));

        return new ResponseEntity<>(pelicula.getFoto(), headers, HttpStatus.OK);
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPelicula(@PathVariable Integer id) {
        if (peliculaRepository.existsById(id)) {
            peliculaRepository.deleteById(id);
            return ResponseEntity.ok("Película eliminada correctamente");
            
        } 
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("El registro no existe");
        }
    }

    
    @PutMapping("/{id}")
    public ResponseEntity<?> editarPelicula(
            @PathVariable Integer id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("titulo") String titulo,
            @RequestParam("director") String director) {
    	
        try {
        	
            Pelicula peliculaExistente = peliculaRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Película no encontrada"));

            peliculaExistente.setTitulo(titulo);
            peliculaExistente.setDirector(director);

            if (file != null && !file.isEmpty()) {
                peliculaExistente.setMimeType(file.getContentType());
                peliculaExistente.setFoto(file.getBytes());
            }

            peliculaRepository.save(peliculaExistente);
            return ResponseEntity.ok("Película actualizada con éxito");
            
        } 
        catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar la película: " + e.getMessage());
        }
    }
}