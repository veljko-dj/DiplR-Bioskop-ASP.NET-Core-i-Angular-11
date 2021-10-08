using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Bioskop_backend.Controllers
{
    [Route("guard")] // Ovo je isto kao da pise api/[controller] jer on pokupi ime
    [ApiController]
    public class GuardController : ControllerBase
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Ne zaboravi da nasledis 
    {
        private readonly DatabaseContext database;
        private readonly UserManager<IdentityUser> userMan;
        private readonly SignInManager<IdentityUser> signIn;
        private readonly IConfiguration config;
        public class ResultReturn
        {
            public string token { get; set; }
            public DateTime timeToLive { get; set; }
        };
        public class BodyParamUser
        {
            public string email { get; set; }
            public string password { get; set; }
        };


        public GuardController(DatabaseContext database, UserManager<IdentityUser> user,
            SignInManager<IdentityUser> signIn,
            IConfiguration config)
        {
            this.database = database;
            this.userMan = user;
            this.signIn = signIn;
            this.config = config;
        }

        [HttpPost("new")]
        public async Task<ActionResult<ResultReturn>> Post([FromBody] BodyParamUser input)
        {
            var user = new IdentityUser { UserName = input.email, Email = input.email };
            var result = await userMan.CreateAsync(user, input.password);
            if (result.Succeeded)
            {
                var claims = new List<Claim>()
                {
                    new Claim("email", input.email)
                };

                string securityString = "asdsaouylansdmnzxlkuopiasjdlk;sjalghlfdshlkhloahdsolhdsfalkjhdfsa";
                //identican string kao u startup.cs
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityString));

                var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var ttl = DateTime.UtcNow.AddYears(1);
                var token1 = new JwtSecurityToken(issuer: null, audience: null, claims: claims,
                    expires: ttl, signingCredentials: credentials);

                return new ResultReturn()
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token1),
                    timeToLive = ttl
                };
            }
            else
            {
                return BadRequest("Vec postoji korisnik");
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<ResultReturn>> PostLogin([FromBody] BodyParamUser input)
        {
            var res = await signIn.PasswordSignInAsync(input.email, input.password, isPersistent: false, lockoutOnFailure: false);

            if (res.Succeeded)
            {
                var claims = new List<Claim>()
                {
                    new Claim("email", input.email)
                };

                var user =   await userMan.FindByNameAsync(input.email);
                var claimsDB = await userMan.GetClaimsAsync(user);

                claims.AddRange(claimsDB);

                string securityString = "asdsaouylansdmnzxlkuopiasjdlk;sjalghlfdshlkhloahdsolhdsfalkjhdfsa";
                //identican string kao u startup.cs
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityString));

                var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
                var ttl = DateTime.UtcNow.AddYears(1);
                var token1 = new JwtSecurityToken(issuer: null, audience: null, claims: claims,
                    expires: ttl, signingCredentials: credentials);

                return new ResultReturn()
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token1),
                    timeToLive = ttl
                };
            }
            else
            {
                return BadRequest("Pogresan email ili lozinka");
            }
        }

        //[HttpGet("find/{i:int}")]
        //public async Task<ActionResult<Genre>> Get(int i)
        //{
        //    var gen = await database.Genres.FirstOrDefaultAsync(x => x.id == i);
        //    return (gen != null ? gen : NotFound());
        //}


        //[HttpGet("all")]
        //public async Task<ActionResult<List<Genre>>> Get()
        //{
        //    //return await repository.getAllGenres(); // Kad baca gresku da si sinhron a treba asinhron, dodaj await  
        //    _ = Task.Delay(1000);
        //    return await this.database.Genres.OrderBy(x => x.id).ToListAsync();
        //}

        //[HttpDelete("delete/{id:int}")]
        //public async Task<ActionResult> Delete(int id)
        //{
        //    var gen = await database.Genres.FirstOrDefaultAsync(x => x.id == id);
        //    if (gen == null)
        //        return NotFound();

        //    database.Remove(gen);
        //    await database.SaveChangesAsync();

        //    return NoContent();

        //}

        //[HttpPut("edit")] // BEZ id
        //public async Task<ActionResult> Put([FromBody] Genre genre)
        //// Ovo ovde moze da ti bude standardna greska, kliknes ctrl. i async i on ti stavi PutAsync
        //{
        //    database.Entry(genre).State = EntityState.Modified;
        //    await database.SaveChangesAsync();
        //    return NoContent();
        //}
    }
}
