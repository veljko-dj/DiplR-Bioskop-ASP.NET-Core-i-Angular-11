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

    [Route("actor")]
    [ApiController]
    public class ActorController : ControllerBase
    {
        private readonly DatabaseContext database;
        private readonly ILocalStorage storage;

        public ActorController(DatabaseContext database, ILocalStorage storage)
        {
            this.database = database;
            this.storage = storage;
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<Actor>>> Get()
        {
            return await this.database.Actors.OrderBy(x => x.id).ToListAsync();
        }

        [HttpGet("find/{i:int}")]
        public async Task<ActionResult<Actor>> Get(int i)
        {
            var gen = await database.Actors.FirstOrDefaultAsync(x => x.id == i);
            return (gen != null ? gen : NotFound());
        }

        [HttpPost("new")]
        [Authorize(AuthenticationSchemes =JwtBearerDefaults.AuthenticationScheme, Policy ="IsAdmin")]
        public async Task<ActionResult> PostAsync([FromForm] Actor loc)
        {
            loc.pictureString = await storage.SaveFile("actors", loc.pictureFile);
            loc.pictureFile = null;

            database.Add(loc);
            await database.SaveChangesAsync();   // Zbog ovog async mora da bude async metoda i da vraca Task
            return NoContent();

        }

        [HttpDelete("delete/{id:int}")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Policy = "IsAdmin")]
        public async Task<ActionResult> Delete(int id)
        {
            var gen = await database.Actors.FirstOrDefaultAsync(x => x.id == id);
            if (gen == null)
                return NotFound();
            await storage.DeleteFile(gen.pictureString, "actors");
            database.Remove(gen);
            await database.SaveChangesAsync();

            return NoContent();

        }

        [HttpPut("edit")] // BEZ id
        public async Task<ActionResult> Put([FromBody] Actor actor)
        // Ovo ovde moze da ti bude standardna greska, kliknes ctrl. i async i on ti stavi PutAsync
        {
            database.Entry(actor).State = EntityState.Modified;
            await database.SaveChangesAsync();
            return NoContent();
        }
    }
}
