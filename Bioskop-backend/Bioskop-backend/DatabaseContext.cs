using Bioskop_backend.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace Bioskop_backend
{
    public class DatabaseContext : IdentityDbContext
    {
        public DatabaseContext([NotNullAttribute] DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.Entity<moviesActors>().HasKey(x => new { x.actorId, x.movieId });
            modelBuilder.Entity<MoviesGenres>().HasKey(x => new { x.genreId, x.movieId }); 
            modelBuilder.Entity<MoviesLocations>().HasKey(x => new { x.locationId, x.movieId });

            base.OnModelCreating(modelBuilder); // Ovo nikako ne smes da obrises
        }

        public DbSet<Genre> Genres { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Actor> Actors { get; set; }
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Movie> MoviesActors { get; set; }
        public DbSet<Movie> MoviesGenres { get; set; }
        public DbSet<Movie> MoviesLocations { get; set; }
        public DbSet<Rating> Ratings { get; set; }


    }
}
