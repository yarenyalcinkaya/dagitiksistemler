package com.example.dagitik.Repository;

import com.example.dagitik.Model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}