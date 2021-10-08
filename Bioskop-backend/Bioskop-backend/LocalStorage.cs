using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Bioskop_backend
{
    public class LocalStorage : ILocalStorage
    {
        private readonly IWebHostEnvironment env;
        private readonly IHttpContextAccessor http;

        public LocalStorage(IWebHostEnvironment env, IHttpContextAccessor http)
        {
            this.env = env;
            this.http = http;
        }

        public Task DeleteFile(string file, string name)
        {
            if (string.IsNullOrEmpty(file))
                return Task.CompletedTask;

            var fName = Path.GetFileName(file);
            var dir = Path.Combine(env.WebRootPath, name, fName);

            if (File.Exists(dir))
                File.Delete(dir);

            return Task.CompletedTask;
        }
        public async Task<string> EditFile(string fileR, string name, IFormFile file)
        {
            await DeleteFile(fileR, name);
            return await SaveFile(name, file);
        }
        public async Task<string> SaveFile(string name, IFormFile file)
        {
            var ext = Path.GetExtension(file.FileName);
            var nameF = $"{Guid.NewGuid()}{ext}";
            string folder = Path.Combine(env.WebRootPath, name);

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            string route = Path.Combine(folder, nameF);
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                var content = ms.ToArray();
                await File.WriteAllBytesAsync(route, content);
            }
            var url = $"{http.HttpContext.Request.Scheme}://{http.HttpContext.Request.Host}";
            var routeDB = Path.Combine(url, name, nameF).Replace("\\", "/");
            return routeDB;
        }
    }
}
