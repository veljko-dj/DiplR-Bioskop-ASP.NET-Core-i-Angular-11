using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Bioskop_backend.Entities
{
    public class Movie
    {
        public int id { get; set; }

        public string title { get; set; }
        public string summary { get; set; }
        public string trailer { get; set; }
        //Ovo nece funkcionisati, on je za kreiranje zakomentarisao 
        public DateTime releaseDate { get; set; }
        public string posterString { get; set; }
        [NotMapped]
        public IFormFile posterFile { get; set; }
        public float rating { get; set; }

        
        public List<MoviesGenres> movieGenres { get; set; }// ovako se oznacava mnogo ka mnogo 
         
        public List<MoviesLocations> movieLocations { get; set; }
         
        public List<moviesActors> movieActors { get; set; }
        /// <summary>
        /// ////
        /// </summary>
        [NotMapped]
        [ModelBinder(BinderType = typeof(MyBinder<List<int>>))]
        public List<int> getGenresIds { get; set; }

        [NotMapped]
        [ModelBinder(BinderType = typeof(MyBinder<List<int>>))]
        public List<int> getLocIds { get; set; }

        [NotMapped]
        [ModelBinder(BinderType = typeof(MyBinder<List<ActorSimple>>))]
        public List<ActorSimple> getActorIds { get; set; }

    }
}
