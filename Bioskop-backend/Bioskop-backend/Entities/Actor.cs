using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Bioskop_backend.Entities
{
    public class Actor
    {
        public int id { get; set; }

        [Required]
        public string name { get; set; }
        [Required]
        public DateTime dateOfBirth { get; set; }
        [Required]
        public string bio { get; set; } 
        //Ovo nece funkcionisati, on je za kreiranje zakomentarisao 
        [Required]
        public string pictureString { get; set; } 
        [NotMapped]
        public IFormFile pictureFile { get; set; }
    }
}
