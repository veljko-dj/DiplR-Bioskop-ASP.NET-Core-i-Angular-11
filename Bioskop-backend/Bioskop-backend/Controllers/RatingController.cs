using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Web;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Bioskop_backend.Entities;

namespace Bioskop_backend.Controllers
{
    [ApiController]
    [Route("movie/rating")]
    public class RatingController : ControllerBase
    {
        private readonly DatabaseContext database;
        private readonly UserManager<IdentityUser> userMan;

        public RatingController(DatabaseContext database, UserManager<IdentityUser> userMan)
        {
            this.database = database;
            this.userMan = userMan;
        }
        public class RatingInput
        {
            //public string email;
            public int movId;
            public int rate;
        }
        [HttpGet("new/{movId:int}/{rateInput:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult> Post(int movId, int rateInput)
        {
            var email = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email").Value;
            //ovo se radi da bismo bili
            // sigurni da je taj korisnik (preko tokena) poslao 
            var user = await userMan.FindByEmailAsync(email);

            var currRate = await database.Ratings.FirstOrDefaultAsync(x => x.movieId == movId && x.userId == user.Id);

            if (currRate == null)
            {
                var rate = new Rating()
                {
                    movieId = movId,
                    rate = rateInput,
                    userId = user.Id
                };
                database.Add(rate);
            }
            else
            {
                currRate.rate = rateInput;
            }
            await database.SaveChangesAsync();   // Zbog ovog async mora da bude async metoda i da vraca Task
            return NoContent();

        }
        
            [HttpGet("getUserRate/{movId:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<double>> GetUserRate(int movId)
        {
            var email = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email").Value;
            var user = await userMan.FindByEmailAsync(email);

            var currRate = await database.Ratings.FirstOrDefaultAsync(x => x.movieId == movId && x.userId == user.Id);


            return ((currRate!=null) ? currRate.rate : 0);
             

        }
    }
}
