using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bioskop_backend.Entities
{
    public class MoviesGenres
    {
        // Ovo ne mora ali aj
        public int genreId { get; set; }
        public int movieId { get; set; }
        public Genre genre { get; set; }
        public Movie movie { get; set; }
    }
}
