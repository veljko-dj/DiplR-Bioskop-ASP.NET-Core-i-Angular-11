using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bioskop_backend
{
    public interface ILocalStorage
    {
        Task DeleteFile(string file, string name);
        Task<string> EditFile(string fileR, string name, IFormFile file);
        Task<string> SaveFile(string name, IFormFile file);
    }
}
 