using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Bioskop_backend.Entities
{
    public class Location
    {
        public int id { get; set; }

        [Required]
        public string name { get; set; }
        [Required]
        public double x { get; set; }
        [Required]
        public double y { get; set; }
    }
}
