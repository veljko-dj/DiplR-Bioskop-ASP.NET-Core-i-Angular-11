using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bioskop_backend.Entities
{
    public class Rating
    {
        public int id { get; set; }

        public int rate { get; set; }

        public int movieId { get; set; }

        public Movie movie { get; set; }
        public string userId { get; set; }
        public IdentityUser user { get; set; }
    }
}
