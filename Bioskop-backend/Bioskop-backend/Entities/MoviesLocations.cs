using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bioskop_backend.Entities
{
    public class MoviesLocations
    { 
        public int locationId { get; set; }
        public int movieId { get; set; }
        public string numOfTicketsLeft { get; set; } 
        public Location location { get; set; }
        public Movie movie { get; set; }

    }
}
