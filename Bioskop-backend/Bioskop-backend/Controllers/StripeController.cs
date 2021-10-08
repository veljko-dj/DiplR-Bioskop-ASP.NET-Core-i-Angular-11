using Microsoft.AspNetCore.Mvc;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

namespace Bioskop_backend.Controllers
{
    [Route("")]
    [ApiController]
    public class StripeController : ControllerBase
    {
        private readonly DatabaseContext database;

        public StripeController(DatabaseContext database)
        {
            this.database = database;
        }


        public class inputStripe
        {
            public string token { get; set; }
            public int amount { get; set; }
            public string description { get; set; }
            public int movId { get; set; }
            public int locId { get; set; }
            public int dayy { get; set; }
        }
        [HttpPost("stripe2")]
        public async Task<ActionResult<string>> GetUserRate1([FromForm] inputStripe input1)
        {

            //var mov = await database.Movies.Include(x => x.movieLocations)
            //   .FirstOrDefaultAsync(x => ((x.id == input1.movId)&& 
            //   (x.movieLocations);

            var mov = await database.Movies.Include(x => x.movieLocations.Where(y => y.locationId == input1.locId))
                .FirstOrDefaultAsync(x => x.id == input1.movId);
              
            if (mov == null)
            {
                return NotFound();
            } 
            int[] niz = JsonConvert.DeserializeObject<int[]>(mov.movieLocations[0].numOfTicketsLeft);
            niz[input1.dayy] -= input1.amount / 500;
            if (niz[input1.dayy]<0)
            {
                return NoContent();
            }
            string nizNovi = JsonConvert.SerializeObject(niz);
            mov.movieLocations[0].numOfTicketsLeft = nizNovi;
            database.Entry(mov.movieLocations[0]).State = EntityState.Modified;
            await database.SaveChangesAsync();



            StripeConfiguration.ApiKey = "sk_test_51JZKGnJdrA1wVWRAQyVrtT94s0pYDXvrD6BAAjasIwpmdSsUM9NzyefnadCE7ofxPy9SPRg7DjYhHaHR9dtB0zWE00pPw9gdls";

            // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
            var options = new ChargeCreateOptions
            {
                Amount = input1.amount,
                Currency = "usd",
                Source = input1.token,
                Description = input1.description,
            };
            var service = new ChargeService();
            Charge a = service.Create(options);




            return JsonConvert.SerializeObject(a);


        }

    }

}
