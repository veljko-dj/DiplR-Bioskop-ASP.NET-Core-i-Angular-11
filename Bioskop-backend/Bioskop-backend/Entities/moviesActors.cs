using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bioskop_backend.Entities
{
    public class moviesActors
    {
        public int actorId { get; set; }
        public int movieId { get; set; }
        public string character { get; set; } 
        public Actor actor { get; set; }
        public Movie movie { get; set; }
    }
}
