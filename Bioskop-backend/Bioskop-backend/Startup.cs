using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Stripe;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Bioskop_backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            Configuration = configuration;

        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            // Ako ne radi pogledaj ovo \\\\, 4 backslasha su dva realna u stringu
            string dataSource = "Data Source=(LocalDb)\\MSSQLLocalDB;Initial Catalog=BioskopDB;Integrated Security=True";

            string frontURL = "http://localhost:4200";
            //////////////////
            // sam dodao
            services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve);
            ///



            services.AddDbContext<DatabaseContext>(options =>
            options.UseSqlServer(dataSource));
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    //builder.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader();
                    builder.WithOrigins(frontURL).AllowAnyMethod().AllowAnyHeader();
                });

            });
            services.AddScoped<ILocalStorage, LocalStorage>();
            services.AddHttpContextAccessor();
            ///////////////

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Bioskop_backend", Version = "v1" });
            });

            services.AddIdentity<IdentityUser, IdentityRole>().AddEntityFrameworkStores<DatabaseContext>().AddDefaultTokenProviders();

            //dodao
            services.Configure<IdentityOptions>(options =>
            {
                // Default Password settings.
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredLength = 1;
                options.Password.RequiredUniqueChars = 1;
            }); //do ovde

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opt =>
            {
                string securityString = "asdsaouylansdmnzxlkuopiasjdlk;sjalghlfdshlkhloahdsolhdsfalkjhdfsa";
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityString)),
                    ClockSkew = TimeSpan.Zero,
                    
                }; 
            });
            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("IsAdmin", policy => policy.RequireClaim("role", "admin"));
                //ovo je radnjeno u 13 snimku 
            });


            //stripe 

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            StripeConfiguration.ApiKey = "sk_test_51JZKGnJdrA1wVWRAQyVrtT94s0pYDXvrD6BAAjasIwpmdSsUM9NzyefnadCE7ofxPy9SPRg7DjYhHaHR9dtB0zWE00pPw9gdls";


            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Bioskop_backend v1"));
            }

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseRouting();

            app.UseCors();   //dodao 

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
