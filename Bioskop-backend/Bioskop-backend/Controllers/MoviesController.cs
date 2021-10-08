using Bioskop_backend.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Bioskop_backend.Controllers
{
    [Route("movie")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class MovieController : ControllerBase
    {
        private readonly DatabaseContext database;
        private readonly ILocalStorage storage;
        private readonly UserManager<IdentityUser> userMan;

        public MovieController(DatabaseContext database, ILocalStorage storage, UserManager<IdentityUser> userMan)
        {
            this.database = database;
            this.storage = storage;
            this.userMan = userMan;
        }

        [HttpGet("all")]
        [AllowAnonymous]
        public async Task<ActionResult<List<Movie>>> Get()
        {
            return await this.database.Movies.OrderBy(x => x.id).ToListAsync();
        }



        [HttpGet("find/{i:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<Movie>> Get(int i)
        {
            //var mov = await database.Movies.FirstOrDefaultAsync(x => x.id == i);
            var mov = await database.Movies.Include(x => x.movieActors).ThenInclude(x => x.actor)
                .Include(x => x.movieGenres).ThenInclude(x => x.genre)
                .Include(x => x.movieLocations).ThenInclude(x => x.location)
                .FirstOrDefaultAsync(x => x.id == i);

            if (mov != null)
            {
                mov.getActorIds = null;
                mov.getLocIds = null;
                mov.getGenresIds = null;
            }

            return (mov != null ? mov : NotFound());
        }


        [HttpGet("getAvgRate/{i:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<float>> GetAvg(int i)
        {
            //var mov = await database.Movies.FirstOrDefaultAsync(x => x.id == i);
            var mov = await database.Movies.
                FirstOrDefaultAsync(x => x.id == i);


            return (mov != null ? mov.rating : NotFound());
        }

        [HttpGet("getUserRate/{idMovie:int}")]
        public async Task<ActionResult<int>> getUserRating(int idMovie)
        {
            if (HttpContext.User.Identity.IsAuthenticated)
            {
                var email = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email").Value;
                var user = await userMan.FindByEmailAsync(email);
                var userRate = await database.Ratings.FirstOrDefaultAsync(x => x.userId == user.Id && x.movieId == idMovie);

                return (userRate != null ? userRate.rate : 0);
            }

            return NotFound();

        }

        [HttpGet("search/{idGen:int}/")]
        [HttpGet("search/{idGen:int}/{title}")]
        [AllowAnonymous]
        public async Task<ActionResult<Movie[]>> Get(int idGen, string title)
        {
            var title1 = "";
            if (title != null) title1 = title;
            //var mov = await database.Movies.FirstOrDefaultAsync(x => x.id == i); 
            var movies = database.Movies.Where(x => x.title.Contains(title1));
            if (idGen != -1)
                movies = movies.Where(x => x.movieGenres.Select(y => y.genreId).Contains(idGen));

            return (movies != null ? movies.ToArray() : NotFound());
        }


        [HttpGet("searchByActor/{idGen:int}/")]
        [AllowAnonymous]
        public async Task<ActionResult<Movie[]>> GetAct(int idGen)
        {
            var movies = database.Movies.Where(x => x.movieActors.Select(y => y.actorId).Contains(idGen));


            return (movies != null ? movies.ToArray() : NotFound());
        }



        [HttpPost("new")]
        public async Task<ActionResult> PostAsync([FromForm] Movie loc)
        {
            loc.posterString = await storage.SaveFile("movies", loc.posterFile);
            loc.posterFile = null;

            loc.movieActors = new List<moviesActors>();
            loc.movieGenres = new List<MoviesGenres>();
            loc.movieLocations = new List<MoviesLocations>();

            string a = JsonConvert.SerializeObject(new int[] { 10, 10, 10, 10, 10 });

            foreach (var id in loc.getGenresIds)
                loc.movieGenres.Add(new MoviesGenres() { genreId = id });
            foreach (var id in loc.getLocIds)
                loc.movieLocations.Add(new MoviesLocations() { locationId = id, numOfTicketsLeft = a });
            foreach (var id in loc.getActorIds)
                loc.movieActors.Add(new moviesActors() { actorId = id.id, character = id.character });


            database.Add(loc);
            await database.SaveChangesAsync();   // Zbog ovog async mora da bude async metoda i da vraca Task
            return NoContent();


        }

        [HttpDelete("delete/{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var gen = await database.Movies.FirstOrDefaultAsync(x => x.id == id);
            if (gen == null)
                return NotFound();

            database.Remove(gen);
            await database.SaveChangesAsync();

            await storage.DeleteFile(gen.posterString, "movies");

            return NoContent();

        }

        [HttpPut("edit")] // BEZ id
        public async Task<ActionResult> Put([FromBody] Movie movie)
        // Ovo ovde moze da ti bude standardna greska, kliknes ctrl. i async i on ti stavi PutAsync
        {
            database.Entry(movie).State = EntityState.Modified;
            await database.SaveChangesAsync();
            return NoContent();
        }


        [HttpPost("mail/{numOfTickets:int}")]
        public async Task<ActionResult> Posta(int numOfTickets, [FromBody] DateTime date)
        {
            string mejl = "";
            if (HttpContext.User.Identity.IsAuthenticated)
                mejl = HttpContext.User.Claims.FirstOrDefault(x => x.Type == "email").Value;
            else return NotFound(); 
            MailMessage message1 = new MailMessage(
            "djorovicveljko@gmail.com",
            mejl,
            "Rezervacija",
            "Broj Vase rezervacije: " + randomString(10));

            var fromAddress = new MailAddress("djorovicveljko@gmail.com", "From Veljko");
            var toAddress = new MailAddress(mejl, "To Name");
            const string fromPassword = "veljo1006998780022";
            const string subject = "Rezervacija";
            string body = "Broj Vase rezervacije za " + numOfTickets + " osoba je: " + randomString(10);

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };

            MailMessage message = new MailMessage(fromAddress, toAddress);
            message.Subject = subject;
            message.Body = body;


            try
            {
                smtp.Send(message);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Exception caught in CreateTestMessage4(): {0}",
                    ex.ToString());
            }

            return NoContent();
        }
        private string randomString(int length)
        {
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

    }
}
