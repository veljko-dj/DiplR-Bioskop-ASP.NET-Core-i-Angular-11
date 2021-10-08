using Bioskop_backend.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bioskop_backend.Controllers
{
    [Route("genre")] // Ovo je isto kao da pise api/[controller] jer on pokupi ime
    [ApiController]
    public class GenreController : ControllerBase
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Ne zaboravi da nasledis 
    {
        private readonly DatabaseContext database;
        public GenreController(DatabaseContext database)
        {
            this.database = database;
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<Genre>>> Get()
        {
            //return await repository.getAllGenres(); // Kad baca gresku da si sinhron a treba asinhron, dodaj await  
            _ = Task.Delay(1000);
            return await this.database.Genres.OrderBy(x => x.id).ToListAsync();
        }

        [HttpGet("find/{i:int}")]
        public async Task<ActionResult<Genre>> Get(int i)
        {
            var gen = await database.Genres.FirstOrDefaultAsync(x => x.id == i);
            return (gen != null ? gen : NotFound());
        }

        [HttpPost("new")] //Ako primim id nula sve je okej, napravim nov id lepo, ako je != sranje
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult> PostAsync([FromBody] Genre genre)
        {
            database.Add(genre);
            await database.SaveChangesAsync();   // Zbog ovog async mora da bude async metoda i da vraca Task
            return NoContent();

        }

        [HttpDelete("delete/{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult> Delete(int id)
        {
            var gen = await database.Genres.FirstOrDefaultAsync(x => x.id == id);
            if (gen == null)
                return NotFound();

            database.Remove(gen);
            await database.SaveChangesAsync();

            return NoContent();

        }

        [HttpPut("edit")] // BEZ id
        public async Task<ActionResult> Put([FromBody] Genre genre)
        // Ovo ovde moze da ti bude standardna greska, kliknes ctrl. i async i on ti stavi PutAsync
        { 
            database.Entry(genre).State = EntityState.Modified;
            await database.SaveChangesAsync();
            return NoContent();
        }
    }
}
