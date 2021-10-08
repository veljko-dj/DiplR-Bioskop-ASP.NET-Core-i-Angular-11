using Bioskop_backend.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bioskop_backend.Controllers
{
    [Route("location")]
    [ApiController]
    public class LocationController : ControllerBase
    { 
        private readonly DatabaseContext database;

        public LocationController(DatabaseContext database)
        {
            this.database = database;
        }

        [HttpGet("all")]
        public async Task<ActionResult<List<Location>>> Get()
        {  
            return await this.database.Locations.OrderBy(x => x.id).ToListAsync();
        }

        [HttpGet("find/{i:int}")]
        public async Task<ActionResult<Location>> Get(int i)
        {
            var gen = await database.Locations.FirstOrDefaultAsync(x => x.id == i);
            return (gen != null ? gen : NotFound());
        }

        [HttpPost("new")] 
        public async Task<ActionResult> PostAsync([FromBody] Location loc)
        {
            database.Add(loc);
            await database.SaveChangesAsync();   // Zbog ovog async mora da bude async metoda i da vraca Task
            return NoContent();

        }

        [HttpDelete("delete/{id:int}")]
        public async Task<ActionResult> Delete(int id)
        {
            var gen = await database.Locations.FirstOrDefaultAsync(x => x.id == id);
            if (gen == null)
                return NotFound();

            database.Remove(gen);
            await database.SaveChangesAsync();

            return NoContent();

        }

        [HttpPut("edit")] // BEZ id
        public async Task<ActionResult> Put([FromBody] Location location)
        // Ovo ovde moze da ti bude standardna greska, kliknes ctrl. i async i on ti stavi PutAsync
        {
            database.Entry(location).State = EntityState.Modified;
            await database.SaveChangesAsync();
            return NoContent();
        }
    }
}
