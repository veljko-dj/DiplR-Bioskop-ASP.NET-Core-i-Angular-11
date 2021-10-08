using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Bioskop_backend.Entities
{  
    public class Genre //: IValidatableObject
    //  Ovu klasu dodajem samo da bih mogao da imam dole metodu za validaciju, nek ostane kao primre, ali prazna
    { 
        public int id { get; set; }

        
        [Required(ErrorMessage = "Ovo polje mora da ima vrednost {0}")]
        public string name { get; set; }




        //public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        //{
        // i zapamti da se ovo izvrsava tek ako je sve ostalo okej (ovi glavniji validatori), a onaj validator ide paralelno

        //if (!string.IsNullOrEmpty(Name))
        //{
        //    var firstLetter = Name.ToString()[0].ToString();

        //    if (firstLetter != firstLetter.ToUpper())
        //        yield return new ValidationResult("FIRST LETTER ! ! ! !", new string[] { nameof(Name) });

        //}
        //} 
    }
}

